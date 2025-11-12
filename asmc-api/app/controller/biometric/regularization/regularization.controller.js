import BiometricRegularization from '../../../models/biometric_regularization.js';
import BiometricNotification from '../../../models/biometric_notification.js';
import BiometricAttendanceLog from '../../../models/biometric_attendance_log.js';
import User from '../../../models/users.js';
import { responseSend } from '../../../helpers/responseSend.js';
import { httpCodes } from '../../../utils/httpcodes.js';

// Create regularization request
export const createRegularizationRequest = async (req, res) => {
    try {
        const { attendance_log_id, request_type, original_data, requested_data, reason } =
            req.body;

        const requested_by = req.session._id;
        const requested_by_name = req.session.name;

        // Check if attendance log exists
        const attendanceLog = await BiometricAttendanceLog.findOne({
            log_id: attendance_log_id,
        });
        if (!attendanceLog) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Attendance log not found');
        }

        // Check if user is superadmin from session
        const isSuperAdmin = req.session.roles === 'super';

        // Create regularization request
        const regularizationRequest = new BiometricRegularization({
            attendance_log_id,
            requested_by,
            requested_by_name,
            request_type,
            original_data,
            requested_data,
            reason,
            status: isSuperAdmin ? 'approved' : 'pending',
            approved_by: isSuperAdmin ? requested_by : null,
            approved_by_name: isSuperAdmin ? requested_by_name : null,
            approval_reason: isSuperAdmin ? 'Auto-approved by superadmin' : null,
            approved_at: isSuperAdmin ? new Date() : null,
            notification_sent: !isSuperAdmin,
        });

        await regularizationRequest.save();

        // If superadmin, apply changes immediately
        if (isSuperAdmin) {
            await applyRegularizationChanges(attendanceLog, requested_data, request_type);
        } else {
            // Create notification for superadmin
            await createNotificationForSuperAdmin(regularizationRequest);
        }

        return responseSend(
            res,
            httpCodes.CREATED,
            isSuperAdmin
                ? 'Regularization applied successfully'
                : 'Regularization request created successfully',
            regularizationRequest,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get regularization requests
export const getRegularizationRequests = async (req, res) => {
    try {
        const { page = 1, limit = 25, status, requested_by } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (status) filter.status = status;
        if (requested_by) filter.requested_by = requested_by;

        const requests = await BiometricRegularization.find(filter)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('requested_by', 'name email')
            .populate('approved_by', 'name email');

        const totalCount = await BiometricRegularization.countDocuments(filter);

        return responseSend(
            res,
            httpCodes.OK,
            'Regularization requests fetched successfully',
            {
                data: requests,
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

// Approve regularization request
export const approveRegularizationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approval_reason } = req.body;
        const approved_by = req.session._id;
        const approved_by_name = req.session.name;

        const regularizationRequest = await BiometricRegularization.findById(id);
        if (!regularizationRequest) {
            return responseSend(
                res,
                httpCodes.NOT_FOUND,
                'Regularization request not found',
            );
        }

        if (regularizationRequest.status !== 'pending') {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Request has already been processed',
            );
        }

        // Update regularization request
        regularizationRequest.status = 'approved';
        regularizationRequest.approved_by = approved_by;
        regularizationRequest.approved_by_name = approved_by_name;
        regularizationRequest.approval_reason = approval_reason;
        regularizationRequest.approved_at = new Date();

        await regularizationRequest.save();

        // Apply changes to attendance log
        const attendanceLog = await BiometricAttendanceLog.findOne({
            log_id: regularizationRequest.attendance_log_id,
        });
        if (attendanceLog) {
            await applyRegularizationChanges(
                attendanceLog,
                regularizationRequest.requested_data,
                regularizationRequest.request_type,
            );
        }

        // Mark original notification as action taken
        await markOriginalNotificationAsActionTaken(regularizationRequest._id);

        // Create notification for requester
        await createNotificationForRequester(regularizationRequest, 'approved');

        return responseSend(
            res,
            httpCodes.OK,
            'Regularization request approved successfully',
            regularizationRequest,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Reject regularization request
export const rejectRegularizationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approval_reason } = req.body;
        const approved_by = req.session._id;
        const approved_by_name = req.session.name;

        const regularizationRequest = await BiometricRegularization.findById(id);
        if (!regularizationRequest) {
            return responseSend(
                res,
                httpCodes.NOT_FOUND,
                'Regularization request not found',
            );
        }

        if (regularizationRequest.status !== 'pending') {
            return responseSend(
                res,
                httpCodes.BAD_REQUEST,
                'Request has already been processed',
            );
        }

        // Update regularization request
        regularizationRequest.status = 'rejected';
        regularizationRequest.approved_by = approved_by;
        regularizationRequest.approved_by_name = approved_by_name;
        regularizationRequest.approval_reason = approval_reason;
        regularizationRequest.approved_at = new Date();

        await regularizationRequest.save();

        // Mark original notification as action taken
        await markOriginalNotificationAsActionTaken(regularizationRequest._id);

        // Create notification for requester
        await createNotificationForRequester(regularizationRequest, 'rejected');

        return responseSend(
            res,
            httpCodes.OK,
            'Regularization request rejected successfully',
            regularizationRequest,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get regularization history for attendance log
export const getRegularizationHistory = async (req, res) => {
    try {
        const { attendance_log_id } = req.params;

        const history = await BiometricRegularization.find({ attendance_log_id })
            .sort({ created_at: -1 })
            .populate('requested_by', 'name email')
            .populate('approved_by', 'name email');

        return responseSend(
            res,
            httpCodes.OK,
            'Regularization history fetched successfully',
            history,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Helper function to apply regularization changes
const applyRegularizationChanges = async (attendanceLog, requestedData, requestType) => {
    try {
        switch (requestType) {
            case 'time_change':
                attendanceLog.timestamp = new Date(requestedData.timestamp);
                break;
            case 'status_change':
                attendanceLog.status = requestedData.status;
                break;
            case 'add_log':
                // Create new attendance log entry
                const newLog = new BiometricAttendanceLog({
                    ...requestedData,
                    log_id: `MANUAL-${Date.now()}`,
                    created_at: new Date(),
                });
                await newLog.save();
                break;
            case 'delete_log':
                attendanceLog.is_deleted = true;
                attendanceLog.deleted_at = new Date();
                break;
        }

        await attendanceLog.save();
    } catch (error) {
        console.error('Error applying regularization changes:', error);
        throw error;
    }
};

// Helper function to create notification for superadmin
const createNotificationForSuperAdmin = async (regularizationRequest) => {
    try {
        // Get attendance log details to get staff name
        const attendanceLog = await BiometricAttendanceLog.findOne({
            log_id: regularizationRequest.attendance_log_id,
        });

        const staffName = attendanceLog?.staff_name || 'Unknown Staff';

        // Get all superadmin users from User table
        const superAdmins = await User.find({ roles: 'super' });

        for (const admin of superAdmins) {
            const notification = new BiometricNotification({
                type: 'regularization_request',
                title: 'New Regularization Request',
                message: `${regularizationRequest.requested_by_name} has requested regularization for ${staffName}`,
                regularization_id: regularizationRequest._id,
                attendance_log_id: regularizationRequest.attendance_log_id,
                requested_by: regularizationRequest.requested_by,
                requested_by_name: regularizationRequest.requested_by_name,
                target_user: admin._id,
                priority: 'high',
                metadata: {
                    request_type: regularizationRequest.request_type,
                    reason: regularizationRequest.reason,
                    staff_name: staffName,
                },
            });

            await notification.save();
        }
    } catch (error) {
        console.error('Error creating notification for superadmin:', error);
    }
};

// Helper function to create notification for requester
const createNotificationForRequester = async (regularizationRequest, action) => {
    try {
        // Get attendance log details to get staff name
        const attendanceLog = await BiometricAttendanceLog.findOne({
            log_id: regularizationRequest.attendance_log_id,
        });

        const staffName = attendanceLog?.staff_name || 'Unknown Staff';

        const notification = new BiometricNotification({
            type: `regularization_${action}`,
            title: `Regularization Request ${
                action.charAt(0).toUpperCase() + action.slice(1)
            }`,
            message: `Your regularization request for ${staffName} has been ${action}`,
            regularization_id: regularizationRequest._id,
            attendance_log_id: regularizationRequest.attendance_log_id,
            requested_by: regularizationRequest.requested_by,
            requested_by_name: regularizationRequest.requested_by_name,
            target_user: regularizationRequest.requested_by,
            priority: 'medium',
            metadata: {
                approval_reason: regularizationRequest.approval_reason,
                approved_by: regularizationRequest.approved_by_name,
                staff_name: staffName,
            },
        });

        await notification.save();
    } catch (error) {
        console.error('Error creating notification for requester:', error);
    }
};

// Helper function to mark original notification as action taken
const markOriginalNotificationAsActionTaken = async (regularizationId) => {
    try {
        // Mark all notifications related to this regularization request as action taken
        await BiometricNotification.updateMany(
            {
                regularization_id: regularizationId,
                type: 'regularization_request',
            },
            {
                is_read: true,
                read_at: new Date(),
                action_taken: true,
                action_taken_at: new Date(),
            },
        );
    } catch (error) {
        console.error('Error marking original notification as action taken:', error);
    }
};
