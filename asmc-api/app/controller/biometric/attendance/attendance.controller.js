'use strict';

import { responseSend } from '../../../helpers/responseSend.js';
import { httpCodes } from '../../../utils/httpcodes.js';
import BiometricAttendanceLog from '../../../models/biometric_attendance_log.js';
import BiometricMachine from '../../../models/biometric_machine.js';
import Staff from '../../../models/staff.js';
import ZKLib from 'node-zklib';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

// Get all attendance logs with filtering
export const getAllAttendanceLogs = async (req, res) => {
    try {
        const {
            machine_id,
            staff_id,
            type,
            start_date,
            end_date,
            page = 1,
            limit = 50,
        } = req.query;

        // Build filter object
        const filter = {};

        if (machine_id) {
            filter.machine_id = machine_id;
        }

        if (staff_id) {
            filter.staff_id = staff_id;
        }

        if (type) {
            filter.type = type;
        }

        if (start_date || end_date) {
            filter.timestamp = {};
            if (start_date) {
                filter.timestamp.$gte = new Date(start_date);
            }
            if (end_date) {
                filter.timestamp.$lte = new Date(end_date);
            }
        }

        const skip = (page - 1) * limit;

        const logs = await BiometricAttendanceLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Manually populate machine and staff data
        const logsWithDetails = await Promise.all(
            logs.map(async (log) => {
                const machine = await BiometricMachine.findOne({
                    machine_id: log.machine_id,
                }).select('name location ip_address');
                const staff = await Staff.findOne({ staff_id: log.staff_id }).select(
                    'name designation department',
                );

                return {
                    ...log.toObject(),
                    machine_id: machine,
                    staff_id: staff,
                };
            }),
        );

        const totalCount = await BiometricAttendanceLog.countDocuments(filter);

        return responseSend(res, httpCodes.OK, 'Attendance logs fetched successfully', {
            data: logsWithDetails,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalCount / limit),
                total_count: totalCount,
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get attendance logs for a specific machine
export const getMachineAttendanceLogs = async (req, res) => {
    try {
        const { machine_id } = req.params;
        const { start_date, end_date, type, page = 1, limit = 50 } = req.query;

        // Build filter object
        const filter = { machine_id };

        if (type) {
            filter.type = type;
        }

        if (start_date || end_date) {
            filter.timestamp = {};
            if (start_date) {
                filter.timestamp.$gte = new Date(start_date);
            }
            if (end_date) {
                filter.timestamp.$lte = new Date(end_date);
            }
        }

        const skip = (page - 1) * limit;

        const logs = await BiometricAttendanceLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Manually populate staff data
        const logsWithDetails = await Promise.all(
            logs.map(async (log) => {
                const staff = await Staff.findOne({ staff_id: log.staff_id }).select(
                    'name designation department',
                );

                return {
                    ...log.toObject(),
                    staff_id: staff,
                };
            }),
        );

        const totalCount = await BiometricAttendanceLog.countDocuments(filter);

        return responseSend(
            res,
            httpCodes.OK,
            'Machine attendance logs fetched successfully',
            {
                data: logsWithDetails,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(totalCount / limit),
                    total_count: totalCount,
                    limit: parseInt(limit),
                },
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get attendance logs for a specific staff member
export const getStaffAttendanceLogs = async (req, res) => {
    try {
        const { staff_id } = req.params;
        const { start_date, end_date, type, page = 1, limit = 50 } = req.query;

        // Build filter object
        const filter = { staff_id };

        if (type) {
            filter.type = type;
        }

        if (start_date || end_date) {
            filter.timestamp = {};
            if (start_date) {
                filter.timestamp.$gte = new Date(start_date);
            }
            if (end_date) {
                filter.timestamp.$lte = new Date(end_date);
            }
        }

        const skip = (page - 1) * limit;

        const logs = await BiometricAttendanceLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Manually populate machine data
        const logsWithDetails = await Promise.all(
            logs.map(async (log) => {
                const machine = await BiometricMachine.findOne({
                    machine_id: log.machine_id,
                }).select('name location ip_address');

                return {
                    ...log.toObject(),
                    machine_id: machine,
                };
            }),
        );

        const totalCount = await BiometricAttendanceLog.countDocuments(filter);

        return responseSend(
            res,
            httpCodes.OK,
            'Staff attendance logs fetched successfully',
            {
                data: logsWithDetails,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(totalCount / limit),
                    total_count: totalCount,
                    limit: parseInt(limit),
                },
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Create new attendance log (for testing or manual entry)
export const createAttendanceLog = async (req, res) => {
    try {
        const {
            staff_id,
            machine_id,
            type,
            timestamp,
            method = 'fingerprint',
            remarks,
        } = req.body;

        // Validate required fields
        if (!staff_id || !machine_id || !type || !timestamp) {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Missing required fields: staff_id, machine_id, type, timestamp',
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

        // Generate unique log ID
        const log_id = `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const attendanceLog = new BiometricAttendanceLog({
            log_id,
            staff_id,
            machine_id,
            staff_name: staff.name,
            timestamp: new Date(timestamp),
            type,
            method,
            location: machine.location,
            ip_address: machine.ip_address,
            remarks,
        });

        await attendanceLog.save();

        return responseSend(
            res,
            httpCodes.CREATED,
            'Attendance log created successfully',
            attendanceLog,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res) => {
    try {
        const { machine_id, start_date, end_date } = req.query;

        // Build filter object
        const filter = {};

        if (machine_id) {
            filter.machine_id = machine_id;
        }

        if (start_date || end_date) {
            filter.timestamp = {};
            if (start_date) {
                filter.timestamp.$gte = new Date(start_date);
            }
            if (end_date) {
                filter.timestamp.$lte = new Date(end_date);
            }
        }

        const totalLogs = await BiometricAttendanceLog.countDocuments(filter);

        const logsByType = await BiometricAttendanceLog.aggregate([
            { $match: filter },
            { $group: { _id: '$type', count: { $sum: 1 } } },
        ]);

        const logsByMethod = await BiometricAttendanceLog.aggregate([
            { $match: filter },
            { $group: { _id: '$method', count: { $sum: 1 } } },
        ]);

        const logsByMachine = await BiometricAttendanceLog.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'biometric_machines',
                    localField: 'machine_id',
                    foreignField: 'machine_id',
                    as: 'machine',
                },
            },
            { $unwind: '$machine' },
            { $group: { _id: '$machine.name', count: { $sum: 1 } } },
        ]);

        return responseSend(
            res,
            httpCodes.OK,
            'Attendance statistics fetched successfully',
            {
                total_logs: totalLogs,
                logs_by_type: logsByType,
                logs_by_method: logsByMethod,
                logs_by_machine: logsByMachine,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Connect to ESSL device
const connectToESSLDevice = async (ipAddress, port = 4370) => {
    return new Promise(async (resolve, reject) => {
        try {
            const zkInstance = new ZKLib(ipAddress, port, 10000, 5200);
            await zkInstance.createSocket();
            resolve(zkInstance);
        } catch (error) {
            reject(new Error(`ESSL connection failed: ${error.message}`));
        }
    });
};

// Sync attendance logs from device to database
export const syncAttendanceLogs = async (req, res) => {
    try {
        const { machine_id } = req.params;

        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Machine not found');
        }

        // Get attendance logs from device
        const zkInstance = await connectToESSLDevice(machine.ip_address, machine.port);
        const deviceLogs = await zkInstance.getAttendances();
        await zkInstance.disconnect();

        if (!deviceLogs || !deviceLogs.data || deviceLogs.data.length === 0) {
            return responseSend(res, httpCodes.OK, 'No attendance logs found on device', {
                machine_id,
                synced_count: 0,
                timestamp: new Date(),
            });
        }

        let syncedCount = 0;
        let skippedCount = 0;
        const syncedLogs = [];
        const skippedLogs = [];
        const staffMapping = new Map(); // Track which deviceUserIds map to which staff

        // Process each log from device
        for (const deviceLog of deviceLogs.data) {
            try {
                // Check if log already exists
                const existingLog = await BiometricAttendanceLog.findOne({
                    machine_id,
                    timestamp: new Date(deviceLog.recordTime),
                    'raw_data.deviceUserId': deviceLog.deviceUserId,
                });

                if (!existingLog) {
                    // Find staff by device user ID - this is the key fix
                    let staff = staffMapping.get(deviceLog.deviceUserId);

                    if (!staff) {
                        staff = await Staff.findOne({
                            'biometric.deviceId': machine_id,
                            'biometric.deviceUserId': deviceLog.deviceUserId,
                            status: true,
                        });

                        // Cache the result to avoid repeated queries
                        staffMapping.set(deviceLog.deviceUserId, staff);

                        console.log(
                            `Device User ID: ${deviceLog.deviceUserId} -> Staff: ${
                                staff ? staff.name : 'NOT FOUND'
                            }`,
                        );
                    }

                    // Only create log if staff exists
                    if (staff) {
                        // Create new attendance log
                        const newLog = new BiometricAttendanceLog({
                            log_id: `${machine_id}_${deviceLog.userSn}_${Date.now()}`,
                            staff_id: staff.staff_id,
                            machine_id,
                            staff_name: staff.name,
                            timestamp: new Date(deviceLog.recordTime),
                            type: 'check-in', // Default to check-in, can be enhanced later
                            method: 'fingerprint',
                            location: machine.location,
                            ip_address: machine.ip_address,
                            status: 'success',
                            remarks: 'Synced from device',
                            raw_data: deviceLog,
                        });

                        await newLog.save();
                        syncedLogs.push(newLog);
                        syncedCount++;
                    } else {
                        console.log(
                            `Skipping log for deviceUserId: ${deviceLog.deviceUserId} - Staff not found`,
                        );
                        skippedLogs.push({
                            deviceUserId: deviceLog.deviceUserId,
                            timestamp: deviceLog.recordTime,
                            reason: 'Staff not found in database',
                        });
                        skippedCount++;
                    }
                }
            } catch (logError) {
                console.error('Error processing log:', logError);
                continue;
            }
        }

        // Convert staff mapping to object for response
        const staffMappingSummary = {};
        for (const [deviceUserId, staff] of staffMapping) {
            staffMappingSummary[deviceUserId] = staff
                ? {
                      staff_id: staff.staff_id,
                      name: staff.name,
                      found: true,
                  }
                : {
                      found: false,
                  };
        }

        return responseSend(res, httpCodes.OK, 'Attendance logs synced successfully', {
            machine_id,
            device_logs_count: deviceLogs.data.length,
            synced_count: syncedCount,
            skipped_count: skippedCount,
            synced_logs: syncedLogs,
            skipped_logs: skippedLogs,
            staff_mapping: staffMappingSummary,
            timestamp: new Date(),
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/temp';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'attendance-import-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.csv', '.txt'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and TXT files are allowed'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// Parse machine-exported data based on format
const parseMachineData = (filePath, fileFormat) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = fs.createReadStream(filePath);

        if (fileFormat === 'csv') {
            stream
                .pipe(
                    csv({
                        headers: [
                            'deviceUserId',
                            'userSn',
                            'recordTime',
                            'recordType',
                            'verifyMode',
                        ],
                        skipEmptyLines: true,
                    }),
                )
                .on('data', (data) => {
                    console.log(`[CSV DEBUG] Raw CSV data:`, data);
                    // Clean and validate data
                    if (data.deviceUserId && data.recordTime) {
                        // Skip header row
                        if (data.deviceUserId === 'deviceUserId') {
                            console.log(`[CSV DEBUG] Skipping header row`);
                            return;
                        }

                        const processedData = {
                            deviceUserId: data.deviceUserId.trim(),
                            userSn: data.userSn?.trim() || '',
                            recordTime: data.recordTime.trim(),
                            recordType: data.recordType?.trim() || '1',
                            verifyMode: data.verifyMode?.trim() || '1',
                        };
                        console.log(`[CSV DEBUG] Processed data:`, processedData);
                        results.push(processedData);
                    } else {
                        console.log(
                            `[CSV DEBUG] Skipping row - missing deviceUserId or recordTime:`,
                            data,
                        );
                    }
                })
                .on('end', () => resolve(results))
                .on('error', reject);
        } else if (fileFormat === 'txt') {
            // Parse tab-separated or space-separated text file
            let lineNumber = 0;
            stream
                .on('data', (chunk) => {
                    const lines = chunk.toString().split('\n');
                    lines.forEach((line) => {
                        lineNumber++;
                        const trimmedLine = line.trim();
                        if (trimmedLine) {
                            console.log(
                                `[TXT DEBUG] Line ${lineNumber}: "${trimmedLine}"`,
                            );
                            const parts = trimmedLine.split(/\s+/); // Split by whitespace
                            console.log(`[TXT DEBUG] Split parts: [${parts.join(', ')}]`);
                            if (parts.length >= 3) {
                                const processedData = {
                                    deviceUserId: parts[0],
                                    userSn: parts[1] || '',
                                    recordTime: parts[2],
                                    recordType: parts[3] || '1',
                                    verifyMode: parts[4] || '1',
                                };
                                console.log(`[TXT DEBUG] Processed data:`, processedData);
                                results.push(processedData);
                            } else {
                                console.log(
                                    `[TXT DEBUG] Skipping line - insufficient parts: ${parts.length}`,
                                );
                            }
                        }
                    });
                })
                .on('end', () => resolve(results))
                .on('error', reject);
        } else {
            reject(new Error('Unsupported file format'));
        }
    });
};

// Parse timestamp from machine data
const parseMachineTimestamp = (timestampString) => {
    console.log(`[TIMESTAMP DEBUG] Original timestamp string: "${timestampString}"`);
    console.log(`[TIMESTAMP DEBUG] Type: ${typeof timestampString}`);
    console.log(`[TIMESTAMP DEBUG] Length: ${timestampString?.length}`);

    if (!timestampString) {
        console.log(`[TIMESTAMP DEBUG] Empty timestamp string, returning null`);
        return null;
    }

    // First try direct parsing
    let date = new Date(timestampString);
    console.log(`[TIMESTAMP DEBUG] Direct parsing result: ${date}`);
    console.log(`[TIMESTAMP DEBUG] Is valid date: ${!isNaN(date.getTime())}`);
    console.log(`[TIMESTAMP DEBUG] Date toString: ${date.toString()}`);

    if (!isNaN(date.getTime()) && date.toString() !== 'Invalid Date') {
        console.log(
            `[TIMESTAMP DEBUG] Direct parsing successful, returning: ${date.toISOString()}`,
        );
        return date;
    }

    // Try parsing with common separators
    const cleanTimestamp = timestampString.trim().replace(/[^\d\s:\-\.\/T]/g, '');
    console.log(`[TIMESTAMP DEBUG] Cleaned timestamp: "${cleanTimestamp}"`);

    // Try different separators
    const separators = ['-', '/', ' '];
    for (const sep of separators) {
        console.log(`[TIMESTAMP DEBUG] Trying separator: "${sep}"`);
        const parts = cleanTimestamp.split(sep);
        console.log(`[TIMESTAMP DEBUG] Split parts: [${parts.join(', ')}]`);

        if (parts.length >= 3) {
            // Try different arrangements
            const arrangements = [
                `${parts[0]}-${parts[1]}-${parts[2]}`, // YYYY-MM-DD
                `${parts[2]}-${parts[1]}-${parts[0]}`, // DD-MM-YYYY
                `${parts[2]}-${parts[0]}-${parts[1]}`, // DD-YYYY-MM
            ];

            for (const arrangement of arrangements) {
                const timePart = parts.slice(3).join(':');
                const fullTimestamp = `${arrangement} ${timePart}`;
                console.log(`[TIMESTAMP DEBUG] Trying arrangement: "${fullTimestamp}"`);

                date = new Date(fullTimestamp);
                console.log(`[TIMESTAMP DEBUG] Parsing result: ${date}`);
                console.log(`[TIMESTAMP DEBUG] Is valid: ${!isNaN(date.getTime())}`);
                console.log(`[TIMESTAMP DEBUG] Date toString: ${date.toString()}`);

                if (!isNaN(date.getTime()) && date.toString() !== 'Invalid Date') {
                    console.log(
                        `[TIMESTAMP DEBUG] Successful parsing, returning: ${date.toISOString()}`,
                    );
                    return date;
                }
            }
        }
    }

    // If all else fails, return null
    console.log(`[TIMESTAMP DEBUG] All parsing attempts failed, returning null`);
    return null;
};

// Map machine data to system format
const mapMachineDataToSystem = (machineData, machineId, staffMapping) => {
    console.log(`[MAPPING DEBUG] Input machineData:`, machineData);
    console.log(`[MAPPING DEBUG] Machine ID: ${machineId}`);
    console.log(
        `[MAPPING DEBUG] Staff mapping for ${machineData.deviceUserId}:`,
        staffMapping[machineData.deviceUserId],
    );

    const staff = staffMapping[machineData.deviceUserId];
    const attendanceType = determineAttendanceType(machineData);
    const parsedTimestamp = parseMachineTimestamp(machineData.recordTime);

    console.log(`[MAPPING DEBUG] Parsed timestamp:`, parsedTimestamp);
    console.log(`[MAPPING DEBUG] Timestamp type:`, typeof parsedTimestamp);
    console.log(
        `[MAPPING DEBUG] Is timestamp valid Date:`,
        parsedTimestamp instanceof Date,
    );

    const systemLog = {
        log_id: `${machineId}_${machineData.userSn}_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 5)}`,
        staff_id: staff ? staff.staff_id : 'UNKNOWN',
        machine_id: machineId,
        staff_name: staff ? staff.name : `Device User ${machineData.deviceUserId}`,
        timestamp: parsedTimestamp,
        type: attendanceType,
        method: 'fingerprint',
        status: 'success',
        remarks: 'Imported from machine export',
        raw_data: machineData,
    };

    console.log(`[MAPPING DEBUG] Final system log:`, systemLog);
    return systemLog;
};

// Determine attendance type based on machine data
const determineAttendanceType = (machineData) => {
    // This logic can be enhanced based on machine-specific patterns
    // For now, default to check-in, but can be improved with time-based logic
    const recordType = parseInt(machineData.recordType);

    switch (recordType) {
        case 1:
            return 'check-in';
        case 2:
            return 'check-out';
        case 3:
            return 'break-start';
        case 4:
            return 'break-end';
        default:
            return 'check-in';
    }
};

// Check for duplicates using machine-specific criteria
const checkMachineDuplicate = async (logData, machineId) => {
    return await BiometricAttendanceLog.findOne({
        machine_id: machineId,
        timestamp: new Date(logData.recordTime),
        'raw_data.deviceUserId': logData.deviceUserId,
        'raw_data.userSn': logData.userSn,
    });
};

// Get staff mapping for device users
const getStaffMapping = async (deviceUserIds, machineId) => {
    const staffMapping = {};

    for (const deviceUserId of deviceUserIds) {
        const staff = await Staff.findOne({
            'biometric.deviceId': machineId,
            status: true,
        });

        if (staff) {
            staffMapping[deviceUserId] = {
                staff_id: staff.staff_id,
                name: staff.name,
                designation: staff.designation,
            };
        }
    }

    return staffMapping;
};

// Import machine-exported attendance data
export const importMachineAttendanceData = async (req, res) => {
    try {
        const { machine_id } = req.body;

        if (!machine_id) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'Machine ID is required');
        }

        // Check if machine exists
        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(
                res,
                httpCodes.NOT_FOUND,
                'Machine not found or inactive',
            );
        }

        if (!req.file) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'No file uploaded');
        }

        const filePath = req.file.path;
        const fileFormat =
            path.extname(req.file.originalname).toLowerCase() === '.csv' ? 'csv' : 'txt';

        // Parse machine data
        const machineData = await parseMachineData(filePath, fileFormat);

        if (machineData.length === 0) {
            // Clean up uploaded file
            fs.unlinkSync(filePath);
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'No valid data found in file',
            );
        }

        // Get unique device user IDs
        const deviceUserIds = [...new Set(machineData.map((data) => data.deviceUserId))];

        // Get staff mapping
        const staffMapping = await getStaffMapping(deviceUserIds, machine_id);

        // Process import
        let importedCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;
        const importDetails = [];
        const errors = [];

        for (let i = 0; i < machineData.length; i++) {
            const data = machineData[i];
            const rowNumber = i + 1;

            try {
                // Check for duplicates
                const existingLog = await checkMachineDuplicate(data, machine_id);

                if (existingLog) {
                    duplicateCount++;
                    importDetails.push({
                        row: rowNumber,
                        device_user_id: data.deviceUserId,
                        staff_id: staffMapping[data.deviceUserId]?.staff_id || null,
                        staff_name: staffMapping[data.deviceUserId]?.name || 'Unknown',
                        timestamp: data.recordTime,
                        status: 'duplicate',
                        message: 'Duplicate log found',
                    });
                    continue;
                }

                // Map data to system format
                const systemLog = mapMachineDataToSystem(data, machine_id, staffMapping);

                // Validate timestamp
                if (!systemLog.timestamp) {
                    importDetails.push({
                        row: rowNumber,
                        device_user_id: data.deviceUserId,
                        staff_id: staffMapping[data.deviceUserId]?.staff_id || null,
                        staff_name: staffMapping[data.deviceUserId]?.name || 'Unknown',
                        timestamp: data.recordTime,
                        status: 'error',
                        message: 'Invalid timestamp format',
                    });
                    continue;
                }

                // Final validation before saving
                if (
                    !systemLog.timestamp ||
                    !(systemLog.timestamp instanceof Date) ||
                    isNaN(systemLog.timestamp.getTime())
                ) {
                    console.log(
                        `[SAVE DEBUG] Invalid timestamp detected, skipping save:`,
                        systemLog.timestamp,
                    );
                    importDetails.push({
                        row: rowNumber,
                        device_user_id: data.deviceUserId,
                        staff_id: staffMapping[data.deviceUserId]?.staff_id || null,
                        staff_name: staffMapping[data.deviceUserId]?.name || 'Unknown',
                        timestamp: data.recordTime,
                        status: 'error',
                        message: 'Invalid timestamp - cannot save to database',
                    });
                    continue;
                }

                console.log(
                    `[SAVE DEBUG] About to save attendance log with timestamp:`,
                    systemLog.timestamp,
                );
                console.log(`[SAVE DEBUG] Timestamp type:`, typeof systemLog.timestamp);
                console.log(
                    `[SAVE DEBUG] Timestamp instanceof Date:`,
                    systemLog.timestamp instanceof Date,
                );
                console.log(
                    `[SAVE DEBUG] Timestamp isValid:`,
                    !isNaN(systemLog.timestamp.getTime()),
                );

                // Create attendance log
                const attendanceLog = new BiometricAttendanceLog({
                    ...systemLog,
                    location: machine.location,
                    ip_address: machine.ip_address,
                });

                await attendanceLog.save();
                importedCount++;

                importDetails.push({
                    row: rowNumber,
                    device_user_id: data.deviceUserId,
                    staff_id: systemLog.staff_id,
                    staff_name: systemLog.staff_name,
                    timestamp: data.recordTime,
                    status: 'success',
                    message: 'Successfully imported',
                    log_id: systemLog.log_id,
                });
            } catch (error) {
                errorCount++;
                errors.push(`Row ${rowNumber}: ${error.message}`);
                importDetails.push({
                    row: rowNumber,
                    device_user_id: data.deviceUserId,
                    staff_id: staffMapping[data.deviceUserId]?.staff_id || null,
                    staff_name: staffMapping[data.deviceUserId]?.name || 'Unknown',
                    timestamp: data.recordTime,
                    status: 'error',
                    message: error.message,
                });
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Calculate staff mapping statistics
        const mappedStaff = Object.keys(staffMapping).length;
        const unmappedStaff = deviceUserIds.length - mappedStaff;
        const unmappedUsers = deviceUserIds.filter((id) => !staffMapping[id]);

        return responseSend(res, httpCodes.OK, 'Machine data import completed', {
            machine_id,
            file_format: fileFormat.toUpperCase(),
            total_records: machineData.length,
            imported_count: importedCount,
            duplicate_count: duplicateCount,
            error_count: errorCount,
            staff_mapping: {
                mapped: mappedStaff,
                unmapped: unmappedStaff,
                unmapped_users: unmappedUsers,
            },
            import_details: importDetails,
            errors: errors.slice(0, 10), // Limit errors to first 10
            timestamp: new Date(),
        });
    } catch (error) {
        // Clean up uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Validate machine import data before actual import
export const validateMachineImportData = async (req, res) => {
    try {
        const { machine_id } = req.body;

        if (!machine_id) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'Machine ID is required');
        }

        // Check if machine exists
        const machine = await BiometricMachine.findOne({
            machine_id,
            is_active: true,
        });

        if (!machine) {
            return responseSend(
                res,
                httpCodes.NOT_FOUND,
                'Machine not found or inactive',
            );
        }

        if (!req.file) {
            return responseSend(res, httpCodes.BAD_REQUEST, 'No file uploaded');
        }

        const filePath = req.file.path;
        const fileFormat =
            path.extname(req.file.originalname).toLowerCase() === '.csv' ? 'csv' : 'txt';

        // Parse machine data
        const machineData = await parseMachineData(filePath, fileFormat);

        if (machineData.length === 0) {
            fs.unlinkSync(filePath);
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'No valid data found in file',
            );
        }

        // Get unique device user IDs
        const deviceUserIds = [...new Set(machineData.map((data) => data.deviceUserId))];

        // Get staff mapping
        const staffMapping = await getStaffMapping(deviceUserIds, machine_id);

        // Validate data
        const validationResults = [];
        let validCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;

        for (let i = 0; i < machineData.length; i++) {
            const data = machineData[i];
            const rowNumber = i + 1;
            const validation = {
                row: rowNumber,
                device_user_id: data.deviceUserId,
                staff_id: staffMapping[data.deviceUserId]?.staff_id || null,
                staff_name: staffMapping[data.deviceUserId]?.name || 'Unknown',
                timestamp: data.recordTime,
                issues: [],
            };

            // Check for duplicates
            const existingLog = await checkMachineDuplicate(data, machine_id);
            if (existingLog) {
                validation.issues.push('Duplicate log found');
                duplicateCount++;
            }

            // Validate timestamp
            const parsedTimestamp = parseMachineTimestamp(data.recordTime);
            if (!parsedTimestamp) {
                validation.issues.push('Invalid timestamp format');
                errorCount++;
            }

            // Check staff mapping
            if (!staffMapping[data.deviceUserId]) {
                validation.issues.push('Staff mapping not found');
            }

            if (validation.issues.length === 0) {
                validCount++;
            }

            validationResults.push(validation);
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        return responseSend(res, httpCodes.OK, 'Validation completed', {
            machine_id,
            file_format: fileFormat.toUpperCase(),
            total_records: machineData.length,
            valid_count: validCount,
            duplicate_count: duplicateCount,
            error_count: errorCount,
            staff_mapping: {
                mapped: Object.keys(staffMapping).length,
                unmapped: deviceUserIds.length - Object.keys(staffMapping).length,
                unmapped_users: deviceUserIds.filter((id) => !staffMapping[id]),
            },
            validation_results: validationResults,
            timestamp: new Date(),
        });
    } catch (error) {
        // Clean up uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Download sample machine export format
export const downloadMachineSampleFormat = async (req, res) => {
    try {
        const { format = 'csv' } = req.query;

        let sampleData = '';
        let filename = '';
        let contentType = '';

        if (format === 'csv') {
            sampleData = `deviceUserId,userSn,recordTime,recordType,verifyMode
S-1,1,2024-01-15 09:00:00,1,1
00002,2,2024-01-15 09:15:00,1,1
S-1,3,2024-01-15 17:30:00,2,1
00002,4,2024-01-16 09:00:00,1,1`;
            filename = 'machine_attendance_sample.csv';
            contentType = 'text/csv';
        } else {
            sampleData = `S-1	1	2024-01-15 09:00:00	1	1
00002	2	2024-01-15 09:15:00	1	1
S-1	3	2024-01-15 17:30:00	2	1
00002	4	2024-01-16 09:00:00	1	1`;
            filename = 'machine_attendance_sample.txt';
            contentType = 'text/plain';
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(sampleData);
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Export multer configuration for use in routes
export { upload };
