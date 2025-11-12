'use strict';

import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';

import {
    insertActivity,
    getActivityList,
    getActiveActivityList,
    getActiveActivityListDropdown,
    getSingleActivity,
    editActivity,
    removeActivity,
    getTopActivityList,
} from './activity.controller.js';

import {
    insertActivityVal,
    getActivityListVal,
    singleActivityVal,
    editActivityVal,
} from './activity.validator.js';
import { authenticateUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { ACTIVITY_PERMISSIONS } from '../../utils/permissions.utils.js';

const router = express.Router();

router.post('/', authenticateUser, checkPermission(ACTIVITY_PERMISSIONS.CREATE), reqValidator(insertActivityVal), insertActivity);
router.get('/list', authenticateUser, checkPermission(ACTIVITY_PERMISSIONS.READ), reqValidator(getActivityListVal), getActivityList);
router.get('/active-list', reqValidator(getActivityListVal), getActiveActivityList);
router.get('/top-activity', getTopActivityList);
router.get('/dropdown', getActiveActivityListDropdown);
router.get('/', reqValidator(singleActivityVal), getSingleActivity);
router.put('/', authenticateUser, checkPermission(ACTIVITY_PERMISSIONS.UPDATE), reqValidator(editActivityVal), editActivity);
router.delete('/', authenticateUser, checkPermission(ACTIVITY_PERMISSIONS.DELETE), reqValidator(singleActivityVal), removeActivity);

export default router;
