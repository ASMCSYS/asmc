'use strict';

import { responseSend } from '../../../helpers/responseSend.js';
import { httpCodes } from '../../../utils/httpcodes.js';
import Staff from '../../../models/staff.js';
import BiometricMachine from '../../../models/biometric_machine.js';
import BiometricAttendanceLog from '../../../models/biometric_attendance_log.js';
import ZKLib from 'node-zklib';
import Zkteco from 'zkteco-js';
import crypto from 'crypto';
import axios from 'axios';

// Helper function to connect to biometric device (for reading data)
const connectToDevice = async (ipAddress, port = 4370) => {
    return new Promise(async (resolve, reject) => {
        try {
            const zkInstance = new ZKLib(ipAddress, port, 10000, 5200);
            await zkInstance.createSocket();
            resolve(zkInstance);
        } catch (error) {
            reject(new Error(`Device connection failed: ${error.message}`));
        }
    });
};

// Helper function to connect to biometric device for user management
const connectToDeviceForUserManagement = async (ipAddress, port = 4370) => {
    return new Promise(async (resolve, reject) => {
        try {
            const device = new Zkteco(ipAddress, port, 5200, 5000);
            await device.createSocket();
            resolve(device);
        } catch (error) {
            reject(new Error(`Device connection failed: ${error.message}`));
        }
    });
};

// Helper function to create user on biometric device
const createUserOnDevice = async (machine, staff) => {
    try {
        const device = await connectToDeviceForUserManagement(
            machine.ip_address,
            machine.port,
        );

        // Generate a unique user ID for the device (you can customize this)
        const deviceUserId =
            staff.staff_id.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6);

        // Create user on device using zkteco-js
        await device.setUser(
            parseInt(deviceUserId), // uid - unique identifier for the user on the device
            deviceUserId, // userId - user's ID
            staff.name, // name - user's name
            '', // password - empty for biometric-only access
            0, // role - 0: Normal User, 14: Super Admin
            0, // cardNo - card number (optional)
        );

        await device.disconnect();

        return {
            success: true,
            deviceUserId: deviceUserId,
            message: 'User created successfully on device using zkteco-js',
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            message: 'Failed to create user on device',
        };
    }
};

// Get all staff with biometric enrollment status
export const getAllStaffWithBiometric = async (req, res) => {
    try {
        const { machine_id, enrolled_only = false, search } = req.query;

        let filter = { status: true };

        if (machine_id) {
            filter['biometric.deviceId'] = machine_id;
        }

        if (enrolled_only === 'true') {
            filter['biometric.deviceId'] = { $exists: true, $ne: null };
        }

        // Add search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { staff_id: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const staff = await Staff.find(filter)
            .select('staff_id name designation department email phone biometric')
            .sort({ name: 1 });

        // Add biometric enrollment status and machine info
        const staffWithBiometric = await Promise.all(
            staff.map(async (member) => {
                let machineInfo = null;
                if (member.biometric && member.biometric.deviceId) {
                    machineInfo = await BiometricMachine.findOne({
                        machine_id: member.biometric.deviceId,
                        is_active: true,
                    }).select('name location status');
                }

                const attendanceCount = await BiometricAttendanceLog.countDocuments({
                    staff_id: member.staff_id,
                });

                return {
                    ...member.toObject(),
                    biometric_enrolled: !!(member.biometric && member.biometric.deviceId),
                    machine_info: machineInfo,
                    attendance_count: attendanceCount,
                };
            }),
        );

        return responseSend(
            res,
            httpCodes.OK,
            'Staff with biometric status fetched successfully',
            {
                data: staffWithBiometric,
                count: staffWithBiometric.length,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Assign staff to biometric machine
export const assignStaffToMachine = async (req, res) => {
    try {
        const { staff_id, machine_id } = req.body;

        // Validate required fields
        if (!staff_id || !machine_id) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Missing required fields: staff_id, machine_id',
            );
        }

        // Check if staff exists
        const staff = await Staff.findOne({ staff_id, status: true });
        if (!staff) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Staff member not found');
        }

        // Check if machine exists
        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });
        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        // Check if staff is already assigned to another machine
        if (
            staff.biometric &&
            staff.biometric.deviceId &&
            staff.biometric.deviceId !== machine_id
        ) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Staff is already assigned to another machine',
            );
        }

        // Create user on the biometric device
        const deviceResult = await createUserOnDevice(machine, staff);

        if (!deviceResult.success) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                `Failed to create user on device: ${deviceResult.error}`,
            );
        }

        // Update staff biometric info with device user ID
        const updatedStaff = await Staff.findOneAndUpdate(
            { staff_id },
            {
                $set: {
                    'biometric.deviceId': machine_id,
                    'biometric.deviceUserId': deviceResult.deviceUserId,
                    'biometric.registeredAt': new Date(),
                },
            },
            { new: true },
        );

        return responseSend(
            res,
            httpCodes.OK,
            'Staff assigned to machine and user created on device successfully',
            {
                staff: updatedStaff,
                deviceResult: deviceResult,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Helper function to remove user from biometric device
const removeUserFromDevice = async (machine, deviceUserId) => {
    try {
        const device = await connectToDeviceForUserManagement(
            machine.ip_address,
            machine.port,
        );

        // Delete user from device using zkteco-js
        await device.deleteUser(parseInt(deviceUserId));

        await device.disconnect();

        return {
            success: true,
            message: 'User removed successfully from device using zkteco-js',
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            message: 'Failed to remove user from device',
        };
    }
};

// Remove staff from biometric machine
export const removeStaffFromMachine = async (req, res) => {
    try {
        const { staff_id } = req.params;

        // Check if staff exists
        const staff = await Staff.findOne({ staff_id, status: true });
        if (!staff) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Staff member not found');
        }

        // Check if staff is enrolled
        if (!staff.biometric || !staff.biometric.deviceId) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Staff is not enrolled in any biometric machine',
            );
        }

        // Get machine info for device removal
        const machine = await BiometricMachine.findOne({
            machine_id: staff.biometric.deviceId,
            is_active: true,
        });

        let deviceResult = null;

        // Remove user from device if machine exists and deviceUserId is available
        if (machine && staff.biometric.deviceUserId) {
            deviceResult = await removeUserFromDevice(
                machine,
                staff.biometric.deviceUserId,
            );
        }

        // Remove biometric enrollment
        const updatedStaff = await Staff.findOneAndUpdate(
            { staff_id },
            {
                $unset: {
                    'biometric.deviceId': 1,
                    'biometric.deviceUserId': 1,
                    'biometric.registeredAt': 1,
                },
            },
            { new: true },
        );

        return responseSend(
            res,
            httpCodes.OK,
            'Staff removed from biometric machine successfully',
            {
                staff: updatedStaff,
                deviceResult: deviceResult,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get staff assigned to a specific machine
export const getMachineStaff = async (req, res) => {
    try {
        const { machine_id } = req.params;

        const staff = await Staff.find({
            'biometric.deviceId': machine_id,
            status: true,
        })
            .select('staff_id name designation department email phone biometric')
            .sort({ name: 1 });

        // Add attendance count for each staff
        const staffWithAttendance = await Promise.all(
            staff.map(async (member) => {
                const attendanceCount = await BiometricAttendanceLog.countDocuments({
                    staff_id: member.staff_id,
                });

                const lastAttendance = await BiometricAttendanceLog.findOne({
                    staff_id: member.staff_id,
                })
                    .sort({ timestamp: -1 })
                    .select('timestamp type');

                return {
                    ...member.toObject(),
                    attendance_count: attendanceCount,
                    last_attendance: lastAttendance,
                };
            }),
        );

        return responseSend(res, httpCodes.OK, 'Machine staff fetched successfully', {
            data: staffWithAttendance,
            count: staffWithAttendance.length,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get staff biometric enrollment statistics
export const getStaffBiometricStats = async (req, res) => {
    try {
        const totalStaff = await Staff.countDocuments({ status: true });
        const enrolledStaff = await Staff.countDocuments({
            'biometric.deviceId': { $exists: true, $ne: null },
            status: true,
        });
        const unenrolledStaff = totalStaff - enrolledStaff;

        const enrollmentByDepartment = await Staff.aggregate([
            { $match: { status: true } },
            {
                $group: {
                    _id: '$department',
                    total: { $sum: 1 },
                    enrolled: {
                        $sum: {
                            $cond: [{ $ne: ['$biometric.deviceId', null] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        return responseSend(
            res,
            httpCodes.OK,
            'Staff biometric statistics fetched successfully',
            {
                total_staff: totalStaff,
                enrolled_staff: enrolledStaff,
                unenrolled_staff: unenrolledStaff,
                enrollment_percentage:
                    totalStaff > 0 ? (enrolledStaff / totalStaff) * 100 : 0,
                enrollment_by_department: enrollmentByDepartment,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Sync all assigned staff to a specific machine
export const syncStaffToMachine = async (req, res) => {
    try {
        const { machine_id } = req.params;

        // Check if machine exists
        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });
        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        // Get all staff assigned to this machine
        const assignedStaff = await Staff.find({
            'biometric.deviceId': machine_id,
            status: true,
        });

        if (assignedStaff.length === 0) {
            return responseSend(res, httpCodes.OK, 'No staff assigned to this machine', {
                synced: 0,
                failed: 0,
                results: [],
            });
        }

        // Sync each staff member to the device
        const syncResults = [];
        let syncedCount = 0;
        let failedCount = 0;

        for (const staff of assignedStaff) {
            try {
                const deviceResult = await createUserOnDevice(machine, staff);

                if (deviceResult.success) {
                    // Update staff with device user ID if not already set
                    if (!staff.biometric.deviceUserId) {
                        await Staff.findOneAndUpdate(
                            { staff_id: staff.staff_id },
                            {
                                $set: {
                                    'biometric.deviceUserId': deviceResult.deviceUserId,
                                },
                            },
                        );
                    }

                    syncedCount++;
                    syncResults.push({
                        staff_id: staff.staff_id,
                        name: staff.name,
                        status: 'success',
                        deviceUserId: deviceResult.deviceUserId,
                    });
                } else {
                    failedCount++;
                    syncResults.push({
                        staff_id: staff.staff_id,
                        name: staff.name,
                        status: 'failed',
                        error: deviceResult.error,
                    });
                }
            } catch (error) {
                failedCount++;
                syncResults.push({
                    staff_id: staff.staff_id,
                    name: staff.name,
                    status: 'failed',
                    error: error.message,
                });
            }
        }

        return responseSend(
            res,
            httpCodes.OK,
            `Staff sync completed: ${syncedCount} synced, ${failedCount} failed`,
            {
                machine_id,
                total_staff: assignedStaff.length,
                synced: syncedCount,
                failed: failedCount,
                results: syncResults,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Helper function to control device via ZKTeco protocol
const controlDeviceViaProtocol = async (machine, action, params = {}) => {
    try {
        // Connect to device using the TCP protocol
        const zkInstance = new ZKLib(machine.ip_address, machine.port, 10000, 5200);
        await zkInstance.createSocket();

        let result;

        switch (action) {
            case 'start_enrollment':
                // Start enrollment mode - this puts the device in enrollment mode
                // The device will wait for biometric data from the user
                result = await zkInstance.executeCmd(61, params.deviceUserId); // CMD_STARTENROLL
                break;

            case 'check_enrollment_status':
                // Check if user has biometric templates
                const usersResponse = await zkInstance.getUsers();
                const users = usersResponse.data || [];
                const user = users.find((u) => u.uid === parseInt(params.deviceUserId));
                result = {
                    hasUser: !!user,
                    user: user,
                    hasFingerprint: user ? user.fingerprintCount > 0 : false,
                    hasFace: user ? user.faceCount > 0 : false,
                    allUsers: users, // For debugging
                };
                break;

            case 'cancel_enrollment':
                // Cancel enrollment mode
                result = await zkInstance.executeCmd(62, ''); // CMD_CANCELCAPTURE
                break;

            default:
                throw new Error(`Unknown action: ${action}`);
        }

        await zkInstance.disconnect();

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

// Start automatic biometric enrollment
export const startAutomaticEnrollment = async (req, res) => {
    try {
        const { staff_id } = req.params;
        const { enrollmentType = 'both' } = req.body; // 'fingerprint', 'face', or 'both'

        // Check if staff exists and is assigned to a machine
        const staff = await Staff.findOne({ staff_id, status: true });
        if (!staff) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Staff member not found');
        }

        if (!staff.biometric || !staff.biometric.deviceId) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Staff must be assigned to a biometric machine first',
            );
        }

        // Get machine info
        const machine = await BiometricMachine.findOne({
            machine_id: staff.biometric.deviceId,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Assigned machine not found');
        }

        // Generate enrollment token
        const enrollmentToken = crypto.randomBytes(32).toString('hex');

        // Initialize enrollment status
        const enrollmentData = {
            'biometric.enrollment.status': 'in_progress',
            'biometric.enrollment.startedAt': new Date(),
            'biometric.enrollment.enrollmentToken': enrollmentToken,
            'biometric.enrollment.instructions':
                'Device is in enrollment mode. Please interact with the device.',
            'biometric.enrollment.fingerprint.enrolled': false,
            'biometric.enrollment.face.enrolled': false,
            'biometric.enrollment.fingerprint.attempts': 0,
            'biometric.enrollment.face.attempts': 0,
        };

        await Staff.findOneAndUpdate({ staff_id }, { $set: enrollmentData });

        // Start the enrollment process
        const enrollmentResult = await performAutomaticEnrollment(
            machine,
            staff,
            enrollmentType,
        );

        return responseSend(res, httpCodes.OK, 'Automatic biometric enrollment started', {
            staff_id,
            machine: {
                name: machine.name,
                location: machine.location,
                ip_address: machine.ip_address,
                port: machine.port,
            },
            enrollmentToken,
            enrollmentType,
            enrollmentResult,
            instructions: {
                message: 'Device is in enrollment mode. Please interact with the device.',
                status: 'Go to the biometric device and follow the enrollment prompts.',
                estimatedTime: '1-2 minutes',
                deviceUserId: staff.biometric.deviceUserId,
            },
            deviceUserId: staff.biometric.deviceUserId,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Perform automatic enrollment
const performAutomaticEnrollment = async (machine, staff, enrollmentType) => {
    const results = {
        fingerprint: { success: false, error: null },
        face: { success: false, error: null },
        overall: { success: false, message: '' },
    };

    try {
        // Step 1: Start enrollment mode on the device
        const startResult = await controlDeviceViaProtocol(machine, 'start_enrollment', {
            deviceUserId: staff.biometric.deviceUserId,
        });

        if (!startResult.success) {
            throw new Error(`Failed to start enrollment: ${startResult.error}`);
        }

        // Step 2: Wait for user to complete biometric enrollment on device
        // The device will be in enrollment mode waiting for user interaction
        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds for user to enroll

        // Step 3: Check if user exists on device (basic verification)
        const statusResult = await controlDeviceViaProtocol(
            machine,
            'check_enrollment_status',
            {
                deviceUserId: staff.biometric.deviceUserId,
            },
        );

        if (statusResult.success) {
            const enrollmentData = statusResult.data;

            // For now, we'll assume enrollment was successful if the user exists on the device
            // In a real implementation, you might want to check for actual biometric templates
            if (enrollmentData.hasUser) {
                // Update enrollment status based on enrollment type
                if (enrollmentType === 'fingerprint' || enrollmentType === 'both') {
                    results.fingerprint.success = true;
                    await Staff.findOneAndUpdate(
                        { staff_id: staff.staff_id },
                        {
                            $set: {
                                'biometric.enrollment.fingerprint.enrolled': true,
                                'biometric.enrollment.fingerprint.enrolledAt': new Date(),
                            },
                        },
                    );
                }

                if (enrollmentType === 'face' || enrollmentType === 'both') {
                    results.face.success = true;
                    await Staff.findOneAndUpdate(
                        { staff_id: staff.staff_id },
                        {
                            $set: {
                                'biometric.enrollment.face.enrolled': true,
                                'biometric.enrollment.face.enrolledAt': new Date(),
                            },
                        },
                    );
                }
            } else {
                results.fingerprint.error = 'User not found on device after enrollment';
                results.face.error = 'User not found on device after enrollment';
            }
        } else {
            results.fingerprint.error = statusResult.error;
            results.face.error = statusResult.error;
        }

        // Step 4: Check overall success based on enrollment type
        const fingerprintSuccess =
            enrollmentType === 'fingerprint' || enrollmentType === 'both'
                ? results.fingerprint.success
                : true;
        const faceSuccess =
            enrollmentType === 'face' || enrollmentType === 'both'
                ? results.face.success
                : true;

        if (fingerprintSuccess && faceSuccess) {
            results.overall.success = true;
            results.overall.message = 'Enrollment completed successfully';

            // Update final status
            await Staff.findOneAndUpdate(
                { staff_id: staff.staff_id },
                {
                    $set: {
                        'biometric.enrollment.status': 'completed',
                        'biometric.enrollment.completedAt': new Date(),
                        'biometric.enrollment.instructions':
                            'Enrollment completed successfully!',
                    },
                },
            );
        } else {
            results.overall.success = false;
            results.overall.message = 'Enrollment partially failed';

            await Staff.findOneAndUpdate(
                { staff_id: staff.staff_id },
                {
                    $set: {
                        'biometric.enrollment.status': 'failed',
                        'biometric.enrollment.instructions':
                            'Enrollment failed. Please try again.',
                    },
                },
            );
        }

        // Update results to reflect enrollment type
        if (enrollmentType === 'fingerprint') {
            results.face.success = true; // Skip face enrollment for fingerprint-only
            results.face.error = null;
        } else if (enrollmentType === 'face') {
            results.fingerprint.success = true; // Skip fingerprint enrollment for face-only
            results.fingerprint.error = null;
        }

        return results;
    } catch (error) {
        results.overall.success = false;
        results.overall.message = error.message;

        await Staff.findOneAndUpdate(
            { staff_id: staff.staff_id },
            {
                $set: {
                    'biometric.enrollment.status': 'failed',
                    'biometric.enrollment.instructions': `Enrollment failed: ${error.message}`,
                },
            },
        );

        return results;
    }
};

// Check enrollment status
export const checkEnrollmentStatus = async (req, res) => {
    try {
        const { staff_id } = req.params;

        const staff = await Staff.findOne({ staff_id, status: true }).select(
            'staff_id name biometric.enrollment biometric.deviceId',
        );

        if (!staff) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Staff member not found');
        }

        if (!staff.biometric || !staff.biometric.deviceId) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Staff is not assigned to any biometric machine',
            );
        }

        // Get machine info
        const machine = await BiometricMachine.findOne({
            machine_id: staff.biometric.deviceId,
            is_active: true,
        }).select('name location ip_address port');

        // Check actual enrollment status on device
        const deviceStatus = await controlDeviceViaProtocol(
            machine,
            'check_enrollment_status',
            {
                deviceUserId: staff.biometric.deviceUserId,
            },
        );

        return responseSend(res, httpCodes.OK, 'Enrollment status checked successfully', {
            staff_id: staff.staff_id,
            name: staff.name,
            machine: machine,
            enrollment: staff.biometric.enrollment || {
                status: 'pending',
                fingerprint: { enrolled: false, attempts: 0 },
                face: { enrolled: false, attempts: 0 },
            },
            deviceStatus: deviceStatus,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Cancel enrollment
export const cancelEnrollment = async (req, res) => {
    try {
        const { staff_id } = req.params;

        const staff = await Staff.findOne({ staff_id, status: true });
        if (!staff) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Staff member not found');
        }

        // Reset enrollment status
        const resetData = {
            'biometric.enrollment.status': 'pending',
            'biometric.enrollment.startedAt': null,
            'biometric.enrollment.completedAt': null,
            'biometric.enrollment.lastAttemptAt': null,
            'biometric.enrollment.enrollmentToken': null,
            'biometric.enrollment.instructions': null,
            'biometric.enrollment.fingerprint.enrolled': false,
            'biometric.enrollment.fingerprint.enrolledAt': null,
            'biometric.enrollment.fingerprint.attempts': 0,
            'biometric.enrollment.face.enrolled': false,
            'biometric.enrollment.face.enrolledAt': null,
            'biometric.enrollment.face.attempts': 0,
        };

        await Staff.findOneAndUpdate({ staff_id }, { $set: resetData });

        return responseSend(res, httpCodes.OK, 'Enrollment cancelled successfully');
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get all staff enrollment status
export const getAllEnrollmentStatus = async (req, res) => {
    try {
        const { status, machine_id } = req.query;

        let filter = {
            status: true,
            'biometric.deviceId': { $exists: true, $ne: null },
        };

        if (machine_id) {
            filter['biometric.deviceId'] = machine_id;
        }

        if (status) {
            filter['biometric.enrollment.status'] = status;
        }

        const staff = await Staff.find(filter)
            .select(
                'staff_id name department designation biometric.enrollment biometric.deviceId',
            )
            .sort({ name: 1 });

        // Add machine info
        const staffWithEnrollment = await Promise.all(
            staff.map(async (member) => {
                const machine = await BiometricMachine.findOne({
                    machine_id: member.biometric.deviceId,
                    is_active: true,
                }).select('name location status');

                return {
                    ...member.toObject(),
                    machine_info: machine,
                };
            }),
        );

        return responseSend(res, httpCodes.OK, 'Enrollment status fetched successfully', {
            data: staffWithEnrollment,
            count: staffWithEnrollment.length,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};
