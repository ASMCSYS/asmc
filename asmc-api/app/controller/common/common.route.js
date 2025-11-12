'use strict';
import express from 'express';
import { authenticateUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { COMMON_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    getDashboardCount,
    getAppStats,
    uploadSingleImage,
    uploadMultipleImage,
    contactUsData,
    getContactUsData,
    sendTestMail,
    updatePaymentHistory,
    backupDB,
    restoreDB,
    getHomePageCms,
    updateHomePageCms,
    getAboutPageCms,
    updateAboutPageCms,
    getSettingsDefault,
    updateSettingsDefault,
    getAllBackups,
} from './common.controller.js';
import { contactUsVal, getContactUsVal, testMailVal } from './common.validator.js';
import {
    imageProcessingMultiple,
    imageProcessingSingle,
} from '../../middlewares/image.processing.js';
import reqValidator from '../../middlewares/req.validator.js';
import { imageKitMultiple, imageKitSingle } from '../../middlewares/imagekit.js';

const router = express.Router();

router.get('/dashboard-count', authenticateUser, getDashboardCount);
router.get('/app-stats', authenticateUser, getAppStats);

router.post(
    '/upload-single-image',
    imageProcessingSingle,
    imageKitSingle,
    uploadSingleImage,
);

router.post(
    '/upload-multiple-image',
    imageProcessingMultiple,
    imageKitMultiple,
    uploadMultipleImage,
);

router.post('/contact-us', reqValidator(contactUsVal), contactUsData);

router.get('/contact-us', reqValidator(getContactUsVal), getContactUsData);

router.get('/test-mail', reqValidator(testMailVal), sendTestMail);

router.get('/update-payment-history', updatePaymentHistory);

// database backup
router.get('/export_db', authenticateUser, backupDB);
router.get('/list_db', authenticateUser, getAllBackups);
router.get('/restore_db', authenticateUser, restoreDB);

// home page cms
router.get('/home-page-cms', getHomePageCms);
router.put('/home-page-cms', authenticateUser, checkPermission('home_page:update'), updateHomePageCms);
router.get('/about-page-cms', getAboutPageCms);
router.put('/about-page-cms', authenticateUser, checkPermission('about_us:update'), updateAboutPageCms);
router.get('/settings-default', getSettingsDefault);
router.put('/settings-default', authenticateUser, checkPermission('settings:update'), updateSettingsDefault);

export default router;
