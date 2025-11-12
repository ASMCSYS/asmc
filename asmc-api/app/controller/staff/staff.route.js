import express from 'express';
import { authenticateUser } from '../../middlewares/authentication.js';
import reqValidator from '../../middlewares/req.validator.js';
import { checkPermission } from '../../middlewares/permission.js';
import { STAFF_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    insertStaff,
    getStaffList,
    getSingleStaff,
    editStaff,
    removeStaff,
    convertToUser,
    updateProfile,
} from './staff.controller.js';
import { insertStaffVal, editStaffVal, updateProfileVal } from './staff.validator.js';

const router = express.Router();

// Basic CRUD operations
router.post(
    '/',
    authenticateUser,
    checkPermission(STAFF_PERMISSIONS.CREATE),
    reqValidator(insertStaffVal),
    insertStaff,
);
router.get('/list', authenticateUser, checkPermission(STAFF_PERMISSIONS.READ), getStaffList);
router.get('/:id', authenticateUser, checkPermission(STAFF_PERMISSIONS.READ), getSingleStaff);
router.put(
    '/',
    authenticateUser,
    checkPermission(STAFF_PERMISSIONS.UPDATE),
    reqValidator(editStaffVal),
    editStaff,
);
router.delete('/', authenticateUser, checkPermission(STAFF_PERMISSIONS.DELETE), removeStaff);

router.post(
    '/convert-to-user',
    authenticateUser,
    checkPermission(STAFF_PERMISSIONS.UPDATE),
    convertToUser,
);

// Profile update route (no permission check needed as user can update their own profile)
router.put(
    '/profile',
    authenticateUser,
    reqValidator(updateProfileVal),
    updateProfile,
);

export default router;
