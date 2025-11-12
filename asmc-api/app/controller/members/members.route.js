'use strict';
import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';
import { authenticateUser, getAuthUser } from '../../middlewares/authentication.js';
import {
    insertMembers,
    insertMembersFromExcel,
    getMembersList,
    getSingleMembers,
    editMembers,
    removeMembers,
    convertToUser,
    tempConvertToUser,
    memberPayment,
    tempPlanUpdateOfAllMember,
    exportMembers,
    updateSecondaryMemberId,
    updateMembershipPlan,
    getTeamMembers,
    verifyMembersByMemberId,
    updateFamilyDetailsActiveStatus,
} from './members.controller.js';
import {
    insertMembersVal,
    getMembersListVal,
    singleMembersVal,
    editMembersVal,
    validatePayment,
    verifyMembersVal,
} from './members.validator.js';
import Joi from 'joi';
import { imageProcessingSingle } from '../../middlewares/image.processing.js';
import { checkPermission } from '../../middlewares/permission.js';
import { MEMBERS_PERMISSIONS } from '../../utils/permissions.utils.js';

const router = express.Router();

router.post(
    '/',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.CREATE),
    reqValidator(insertMembersVal),
    insertMembers,
);

router.post(
    '/multiple',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.CREATE),
    reqValidator(Joi.array().items(insertMembersVal)),
    insertMembersFromExcel,
);

router.get(
    '/list',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.READ),
    reqValidator(getMembersListVal),
    getMembersList,
);

// Get single member details - accessible by admins and the member themselves
router.get(
    '/',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.READ), // Permission middleware now handles member self-access
    reqValidator(singleMembersVal),
    getSingleMembers,
);

// Update member details - accessible by admins and the member themselves
router.put(
    '/',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.UPDATE), // Permission middleware now handles member self-access
    reqValidator(editMembersVal),
    editMembers,
);

router.delete(
    '/',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.DELETE),
    reqValidator(singleMembersVal),
    removeMembers,
);

router.post(
    '/convert-to-user',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.UPDATE),
    reqValidator(singleMembersVal),
    convertToUser,
);

router.post(
    '/payment',
    authenticateUser,
    checkPermission(MEMBERS_PERMISSIONS.UPDATE),
    imageProcessingSingle,
    reqValidator(validatePayment),
    memberPayment,
);

// router.get(
//     "/temp-convert-to-user",
//     tempConvertToUser
// )

// router.get(
//     "/temp-plan-update",
//     tempPlanUpdateOfAllMember
// )

// router.get(
//     "/export-member",
//     exportMembers
// )

// router.get('/update-secondary-member-id', updateSecondaryMemberId);
// router.get('/update-membership-plan', updateMembershipPlan);

// Temporary API to update active field in family_details based on member status
router.get('/temp-update-family-active-status', updateFamilyDetailsActiveStatus);

// open routes
router.get('/verify', reqValidator(verifyMembersVal), verifyMembersByMemberId);
router.get('/team', getTeamMembers);

export default router;
