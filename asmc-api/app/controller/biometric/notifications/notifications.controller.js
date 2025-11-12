import BiometricNotification from '../../../models/biometric_notification.js';
import { responseSend } from '../../../helpers/responseSend.js';
import { httpCodes } from '../../../utils/httpcodes.js';

// Get notifications for user
export const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 25, is_read } = req.query;
        const skip = (page - 1) * limit;
        const userId = req.session._id;

        const filter = {
            target_user: userId,
            action_taken: { $ne: true }, // Exclude notifications where action has been taken
        };
        if (is_read !== undefined) {
            filter.is_read = is_read === 'true';
        }

        const notifications = await BiometricNotification.find(filter)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('regularization_id')
            .populate('requested_by', 'name email');

        const totalCount = await BiometricNotification.countDocuments(filter);
        const unreadCount = await BiometricNotification.countDocuments({
            target_user: userId,
            is_read: false,
            action_taken: { $ne: true }, // Exclude notifications where action has been taken
        });

        return responseSend(res, httpCodes.OK, 'Notifications fetched successfully', {
            data: notifications,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalCount / limit),
                total_count: totalCount,
                limit: parseInt(limit),
            },
            unread_count: unreadCount,
        });
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session._id;

        const notification = await BiometricNotification.findOne({
            _id: id,
            target_user: userId,
        });

        if (!notification) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Notification not found');
        }

        notification.is_read = true;
        notification.read_at = new Date();
        notification.action_taken = true;
        notification.action_taken_at = new Date();
        await notification.save();

        return responseSend(
            res,
            httpCodes.OK,
            'Notification marked as read',
            notification,
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.session._id;

        await BiometricNotification.updateMany(
            { target_user: userId, is_read: false },
            { is_read: true, read_at: new Date() },
        );

        return responseSend(res, httpCodes.OK, 'All notifications marked as read');
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Get notification count
export const getNotificationCount = async (req, res) => {
    try {
        const userId = req.session._id;

        const unreadCount = await BiometricNotification.countDocuments({
            target_user: userId,
            is_read: false,
        });

        return responseSend(
            res,
            httpCodes.OK,
            'Notification count fetched successfully',
            {
                unread_count: unreadCount,
            },
        );
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session._id;

        const notification = await BiometricNotification.findOneAndDelete({
            _id: id,
            target_user: userId,
        });

        if (!notification) {
            return responseSend(res, httpCodes.NOT_FOUND, 'Notification not found');
        }

        return responseSend(res, httpCodes.OK, 'Notification deleted successfully');
    } catch (error) {
        return responseSend(res, httpCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};
