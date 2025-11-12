import express from 'express';
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getNotificationCount,
    deleteNotification,
} from './notifications.controller.js';
import { authenticateUser } from '../../../middlewares/authentication.js';
import { checkPermission } from '../../../middlewares/permission.js';
import { BIOMETRIC_NOTIFICATION_PERMISSIONS } from '../../../utils/permissions.utils.js';

const router = express.Router();

// Get notifications for user
router.get(
    '/',
    authenticateUser,
    checkPermission(BIOMETRIC_NOTIFICATION_PERMISSIONS.READ),
    getNotifications,
);

// Get notification count
router.get(
    '/count',
    authenticateUser,
    checkPermission(BIOMETRIC_NOTIFICATION_PERMISSIONS.READ),
    getNotificationCount,
);

// Mark notification as read
router.put(
    '/:id/read',
    authenticateUser,
    checkPermission(BIOMETRIC_NOTIFICATION_PERMISSIONS.UPDATE),
    markNotificationAsRead,
);

// Mark all notifications as read
router.put(
    '/read-all',
    authenticateUser,
    checkPermission(BIOMETRIC_NOTIFICATION_PERMISSIONS.UPDATE),
    markAllNotificationsAsRead,
);

// Delete notification
router.delete(
    '/:id',
    authenticateUser,
    checkPermission(BIOMETRIC_NOTIFICATION_PERMISSIONS.DELETE),
    deleteNotification,
);

export default router;
