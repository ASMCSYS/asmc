import express from 'express';
import { authenticateUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { LOGS_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    getLogsList,
    searchLogsByFilter,
    exportLogsData,
    getLogsStats,
} from './logs.controller.js';

const router = express.Router();

router.get('/', authenticateUser, checkPermission(LOGS_PERMISSIONS.READ), getLogsList);
router.get('/search', authenticateUser, checkPermission(LOGS_PERMISSIONS.READ), searchLogsByFilter);
router.get('/export', authenticateUser, checkPermission(LOGS_PERMISSIONS.EXPORT), exportLogsData);
router.get('/stats', authenticateUser, checkPermission(LOGS_PERMISSIONS.READ), getLogsStats);

export default router;
