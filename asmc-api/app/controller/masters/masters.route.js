'use strict';
import express from 'express';
import reqValidator from '../../middlewares/req.validator.js';
import { authenticateUser, getAuthUser } from '../../middlewares/authentication.js';
import { checkPermission } from '../../middlewares/permission.js';
import { MASTERS_PERMISSIONS, COMMON_PERMISSIONS, CMS_PERMISSIONS } from '../../utils/permissions.utils.js';
import {
    insertFacility,
    getFacilityList,
    getSingleFacility,
    editFacility,
    removeFacility,
    insertBatch,
    getBatchList,
    getBatchDropdown,
    getSingleBatch,
    editBatch,
    removeBatch,
    insertLocation,
    getLocationList,
    getSingleLocation,
    editLocation,
    removeLocation,
    insertCategory,
    getCategoryList,
    getSingleCategory,
    editCategory,
    removeCategory,
    insertTeams,
    getTeamsList,
    getSingleTeams,
    editTeams,
    removeTeams,
    insertGallery,
    getGalleryList,
    removeGallery,
    insertBanner,
    getBannerList,
    getSingleBanner,
    editBanner,
    removeBanner,
    getActionParentLocation,
    getActionParentCategory,
    insertFaqs,
    getFaqsList,
    getFaqsCategories,
    getSingleFaqs,
    editFaqs,
    removeFaqs,
    insertTestimonials,
    getTestimonialsList,
    getSingleTestimonials,
    editTestimonials,
    removeTestimonials,
    insertNotice,
    getNoticeList,
    getSingleNotice,
    editNotice,
    removeNotice,
    insertFeesCategory,
    getFeesCategoryList,
    getSingleFeesCategory,
    editFeesCategory,
    removeFeesCategory,
} from './masters.controller.js';
import {
    insertFacilityVal,
    getFacilityListVal,
    singleFacilityVal,
    editFacilityVal,
    insertBatchVal,
    getBatchListVal,
    singleBatchVal,
    editBatchVal,
    insertLocationVal,
    getLocationListVal,
    singleLocationVal,
    editLocationVal,
    insertCategoryVal,
    getCategoryListVal,
    singleCategoryVal,
    editCategoryVal,
    insertTeamsVal,
    getTeamsListVal,
    singleTeamsVal,
    editTeamsVal,
    insertGalleryVal,
    getGalleryListVal,
    singleGalleryVal,
    insertBannerVal,
    getBannerListVal,
    singleBannerVal,
    editBannerVal,
    insertFaqsVal,
    getFaqsListVal,
    singleFaqsVal,
    editFaqsVal,
    insertTestimonialsVal,
    getTestimonialsListVal,
    singleTestimonialsVal,
    editTestimonialsVal,
    insertNoticeVal,
    getNoticeListVal,
    singleNoticeVal,
    editNoticeVal,
    insertFeesCategoryVal,
    getFeesCategoryListVal,
    singleFeesCategoryVal,
    editFeesCategoryVal,
} from './masters.validator.js';
import {
    imageProcessingMultiple,
    imageProcessingSingle,
} from '../../middlewares/image.processing.js';
import { imageKitMultiple, imageKitSingle } from '../../middlewares/imagekit.js';

const router = express.Router();

// facility apis

router.post(
    '/facility',
    authenticateUser,
    checkPermission(MASTERS_PERMISSIONS.ACTIVITY.CREATE),
    reqValidator(insertFacilityVal),
    insertFacility,
);
router.get('/facility/list', reqValidator(getFacilityListVal), getFacilityList);
router.get(
    '/facility',
    authenticateUser,
    reqValidator(singleFacilityVal),
    getSingleFacility,
);
router.put('/facility', authenticateUser, checkPermission(MASTERS_PERMISSIONS.ACTIVITY.UPDATE), reqValidator(editFacilityVal), editFacility);
router.delete(
    '/facility',
    authenticateUser,
    checkPermission(MASTERS_PERMISSIONS.ACTIVITY.DELETE),
    reqValidator(singleFacilityVal),
    removeFacility,
);

// location apis

router.post(
    '/location',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.LOCATION.CREATE),
    reqValidator(insertLocationVal),
    insertLocation,
);
router.get('/location/parent', getActionParentLocation);
router.get(
    '/location/list',
    authenticateUser,
    reqValidator(getLocationListVal),
    getLocationList,
);
router.get(
    '/location',
    authenticateUser,
    reqValidator(singleLocationVal),
    getSingleLocation,
);
router.put('/location', authenticateUser, checkPermission(COMMON_PERMISSIONS.LOCATION.UPDATE), reqValidator(editLocationVal), editLocation);
router.delete(
    '/location',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.LOCATION.DELETE),
    reqValidator(singleLocationVal),
    removeLocation,
);

// category apis

router.post(
    '/category',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.CATEGORY.CREATE),
    reqValidator(insertCategoryVal),
    insertCategory,
);
router.get('/category/parent', getActionParentCategory);
router.get(
    '/category/list',
    authenticateUser,
    reqValidator(getCategoryListVal),
    getCategoryList,
);
router.get(
    '/category',
    authenticateUser,
    reqValidator(singleCategoryVal),
    getSingleCategory,
);
router.put('/category', authenticateUser, checkPermission(COMMON_PERMISSIONS.CATEGORY.UPDATE), reqValidator(editCategoryVal), editCategory);
router.delete(
    '/category',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.CATEGORY.DELETE),
    reqValidator(singleCategoryVal),
    removeCategory,
);

// banner master apis

router.post(
    '/banner',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.BANNER.CREATE),
    imageProcessingSingle,
    imageKitSingle,
    reqValidator(insertBannerVal),
    insertBanner,
);
router.get('/banner/list', reqValidator(getBannerListVal), getBannerList);
router.get('/banner', authenticateUser, reqValidator(singleBannerVal), getSingleBanner);
router.put(
    '/banner',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.BANNER.UPDATE),
    imageProcessingSingle,
    (req, res, next) => imageKitSingle(req, res, next, 'banner'),
    reqValidator(editBannerVal),
    editBanner,
);
router.delete('/banner', authenticateUser, checkPermission(COMMON_PERMISSIONS.BANNER.DELETE), reqValidator(singleBannerVal), removeBanner);

// gallery apis

router.post(
    '/gallery',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.PHOTO_GALLERY.CREATE),
    imageProcessingMultiple,
    (req, res, next) => imageKitMultiple(req, res, next, 'gallery'),
    reqValidator(insertGalleryVal),
    insertGallery,
);
router.post(
    '/gallery-drive',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.PHOTO_GALLERY.CREATE),
    reqValidator(insertGalleryVal),
    insertGallery,
);
router.get('/gallery', reqValidator(getGalleryListVal), getGalleryList);
router.delete(
    '/gallery',
    authenticateUser,
    checkPermission(COMMON_PERMISSIONS.PHOTO_GALLERY.DELETE),
    reqValidator(singleGalleryVal),
    removeGallery,
);

// batch apis

router.post('/batch', authenticateUser, checkPermission(MASTERS_PERMISSIONS.BATCH.CREATE), reqValidator(insertBatchVal), insertBatch);
router.get('/batch/list', authenticateUser, checkPermission(MASTERS_PERMISSIONS.BATCH.READ), reqValidator(getBatchListVal), getBatchList);
router.get('/batch/dropdown', authenticateUser, getBatchDropdown);
router.get('/batch', authenticateUser, reqValidator(singleBatchVal), getSingleBatch);
router.put('/batch', authenticateUser, checkPermission(MASTERS_PERMISSIONS.BATCH.UPDATE), reqValidator(editBatchVal), editBatch);
router.delete('/batch', authenticateUser, checkPermission(MASTERS_PERMISSIONS.BATCH.DELETE), reqValidator(singleBatchVal), removeBatch);

// teams apis

router.post('/teams', authenticateUser, checkPermission(CMS_PERMISSIONS.TEAM.CREATE), reqValidator(insertTeamsVal), insertTeams);
router.get('/teams/list', reqValidator(getTeamsListVal), getTeamsList);
router.get('/teams', authenticateUser, checkPermission(CMS_PERMISSIONS.TEAM.READ), reqValidator(singleTeamsVal), getSingleTeams);
router.put('/teams', authenticateUser, checkPermission(CMS_PERMISSIONS.TEAM.UPDATE), reqValidator(editTeamsVal), editTeams);
router.delete('/teams', authenticateUser, checkPermission(CMS_PERMISSIONS.TEAM.DELETE), reqValidator(singleTeamsVal), removeTeams);

// faq apis
router.post('/faqs', authenticateUser, checkPermission(CMS_PERMISSIONS.FAQ.CREATE), reqValidator(insertFaqsVal), insertFaqs);
router.get('/faqs/list', reqValidator(getFaqsListVal), getFaqsList);
router.get('/faqs/categories', getFaqsCategories);
router.get('/faqs', authenticateUser, checkPermission(CMS_PERMISSIONS.FAQ.READ), reqValidator(singleFaqsVal), getSingleFaqs);
router.put('/faqs', authenticateUser, checkPermission(CMS_PERMISSIONS.FAQ.UPDATE), reqValidator(editFaqsVal), editFaqs);
router.delete('/faqs', authenticateUser, checkPermission(CMS_PERMISSIONS.FAQ.DELETE), reqValidator(singleFaqsVal), removeFaqs);

// testimonials apis
router.post(
    '/testimonials',
    authenticateUser,
    checkPermission(CMS_PERMISSIONS.TESTIMONIAL.CREATE),
    reqValidator(insertTestimonialsVal),
    insertTestimonials,
);
router.get(
    '/testimonials/list',
    reqValidator(getTestimonialsListVal),
    getTestimonialsList,
);
router.get(
    '/testimonials',
    authenticateUser,
    checkPermission(CMS_PERMISSIONS.TESTIMONIAL.READ),
    reqValidator(singleTestimonialsVal),
    getSingleTestimonials,
);
router.put(
    '/testimonials',
    authenticateUser,
    checkPermission(CMS_PERMISSIONS.TESTIMONIAL.UPDATE),
    reqValidator(editTestimonialsVal),
    editTestimonials,
);
router.delete(
    '/testimonials',
    authenticateUser,
    checkPermission(CMS_PERMISSIONS.TESTIMONIAL.DELETE),
    reqValidator(singleTestimonialsVal),
    removeTestimonials,
);

// notices apis
router.post('/notice', authenticateUser, checkPermission(CMS_PERMISSIONS.NOTICE.CREATE), reqValidator(insertNoticeVal), insertNotice);
router.get('/notice/list', getAuthUser, reqValidator(getNoticeListVal), getNoticeList);
router.get('/notice', authenticateUser, checkPermission(CMS_PERMISSIONS.NOTICE.READ), reqValidator(singleNoticeVal), getSingleNotice);
router.put('/notice', authenticateUser, checkPermission(CMS_PERMISSIONS.NOTICE.UPDATE), reqValidator(editNoticeVal), editNotice);
router.delete('/notice', authenticateUser, checkPermission(CMS_PERMISSIONS.NOTICE.DELETE), reqValidator(singleNoticeVal), removeNotice);

// fees category
router.post(
    '/fees-category',
    authenticateUser,
    reqValidator(insertFeesCategoryVal),
    insertFeesCategory,
);
router.get(
    '/fees-category/list',
    reqValidator(getFeesCategoryListVal),
    getFeesCategoryList,
);
router.get(
    '/fees-category',
    authenticateUser,
    reqValidator(singleFeesCategoryVal),
    getSingleFeesCategory,
);
router.put(
    '/fees-category',
    authenticateUser,
    reqValidator(editFeesCategoryVal),
    editFeesCategory,
);
router.delete(
    '/fees-category',
    authenticateUser,
    reqValidator(singleFeesCategoryVal),
    removeFeesCategory,
);

export default router;
