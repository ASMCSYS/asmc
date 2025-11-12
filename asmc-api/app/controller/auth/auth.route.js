'use strict';

import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';

import {
    createAuthAccess,
    memberLogin,
    getAuthMember,
    changePassword,
    resetPassword,
    sendResetPasswordOtp,
    staffLogin,
    getUserList,
    getAuthAdmin,
    updateUserProfile,
} from './auth.controller.js';

import {
    loginVal,
    changePasswordVal,
    resetPasswordVal,
    memberLoginVal,
    sendResetPasswordVal,
    getUserListVal,
    updateUserProfileVal,
} from './auth.validator.js';
import { authenticateUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { AUTH_PERMISSIONS } from '../../utils/permissions.utils.js';

const router = express.Router();

router.post('/admin-login', reqValidator(loginVal), createAuthAccess);

router.post('/member-login', reqValidator(memberLoginVal), memberLogin);

router.get('/admin-me', authenticateUser, getAuthAdmin);

router.get('/me', authenticateUser, getAuthMember);

router.put(
    '/change-password',
    authenticateUser,
    reqValidator(changePasswordVal),
    changePassword,
);

router.put(
    '/update-profile',
    authenticateUser,
    reqValidator(updateUserProfileVal),
    updateUserProfile,
);

router.post(
    '/send-reset-password-otp',
    reqValidator(sendResetPasswordVal),
    sendResetPasswordOtp,
);
router.put('/reset-password', reqValidator(resetPasswordVal), resetPassword);

// user routes
router.post(
    '/user-list',
    authenticateUser,
    checkPermission(AUTH_PERMISSIONS.USER_LIST),
    reqValidator(getUserListVal),
    getUserList,
);

export default router;
