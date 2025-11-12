import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

// facility validator

export const insertFacilityVal = Joi.object({
    title: Joi.string().required(),
    permalink: Joi.string().required(),
    banner_url: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getFacilityListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
});

export const singleFacilityVal = Joi.object({
    _id: Joi.string().required(),
});

export const editFacilityVal = Joi.object({
    _id: Joi.string().required(),
    banner_url: Joi.string().required(),
    title: Joi.string().required(),
    permalink: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});

// facility validator

export const insertBatchVal = Joi.object({
    activity_id: Joi.string().required(),
    category_id: Joi.string().required(),
    subcategory_name: Joi.string().allow(''),
    location_id: Joi.string().required(),
    sublocation_id: Joi.any().required(),
    court: Joi.any().allow(''),
    batch_type: Joi.string().required(),
    batch_code: Joi.string().required(),
    batch_name: Joi.string().required(),
    batch_limit: Joi.any().allow(''),
    no_of_player: Joi.any().allow(''),
    type: Joi.any().allow(''),
    days: Joi.array().required(),
    days_prices: Joi.any().optional(),
    member_days_prices: Joi.any().optional(),
    start_time: Joi.any().optional(),
    end_time: Joi.any().optional(),
    advance_booking_period: Joi.any().optional(),
    status: Joi.boolean().optional(),
    slots: Joi.any().optional(),
    fees: Joi.any().optional(),
});

export const getBatchListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
    batch_type: Joi.string().optional(),
});

export const singleBatchVal = Joi.object({
    _id: Joi.string().required(),
});

export const editBatchVal = Joi.object({
    _id: Joi.string().required(),
    activity_id: Joi.string().required(),
    category_id: Joi.string().required(),
    subcategory_name: Joi.string().allow(''),
    location_id: Joi.string().required(),
    sublocation_id: Joi.any().required(),
    court: Joi.any().allow(''),
    batch_type: Joi.string().required(),
    batch_code: Joi.string().required(),
    batch_name: Joi.string().required(),
    batch_limit: Joi.any().allow(''),
    no_of_player: Joi.any().allow(''),
    type: Joi.any().allow(''),
    days: Joi.array().required(),
    days_prices: Joi.any().optional(),
    member_days_prices: Joi.any().optional(),
    start_time: Joi.any().optional(),
    end_time: Joi.any().optional(),
    advance_booking_period: Joi.any().optional(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
    slots: Joi.any().optional(),
    fees: Joi.any().optional(),
});

// location validator

export const insertLocationVal = Joi.object({
    parent_id: Joi.any().allow(''),
    title: Joi.string().required(),
    address: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getLocationListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
    parent_id: Joi.string().optional(),
});

export const singleLocationVal = Joi.object({
    _id: Joi.string().required(),
});

export const editLocationVal = Joi.object({
    _id: Joi.string().required(),
    parent_id: Joi.any().allow(''),
    address: Joi.string().required(),
    title: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});

// category validator

export const insertCategoryVal = Joi.object({
    parent_id: Joi.any().allow(''),
    title: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getCategoryListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
});

export const singleCategoryVal = Joi.object({
    _id: Joi.string().required(),
});

export const editCategoryVal = Joi.object({
    _id: Joi.string().required(),
    parent_id: Joi.any().allow(''),
    title: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});

// photo gallery validator

export const insertGalleryVal = Joi.object({
    type: Joi.string().allow(''),
    url: Joi.string().allow(''),
    title: Joi.string().allow(''),
    video_thumbnail: Joi.string().allow(''),
});

export const getGalleryListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    type: Joi.string().allow(''),
});

export const singleGalleryVal = Joi.object({
    _id: Joi.string().required(),
});

// banner validator

export const insertBannerVal = Joi.object({
    type: Joi.string().required(),
    status: Joi.any().optional(),
    url: Joi.any().optional(),
});

export const getBannerListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
    type: Joi.string().optional(),
});

export const singleBannerVal = Joi.object({
    _id: Joi.string().required(),
});

export const editBannerVal = Joi.object({
    _id: Joi.string().required(),
    type: Joi.string().required(),
    status: Joi.any().optional(),
    url: Joi.any().optional(),
});

// teams validator

export const insertTeamsVal = Joi.object({
    name: Joi.string().required(),
    profile: Joi.string().allow(''),
    activity_name: Joi.string().required(),
    role: Joi.string().required(),
    display_order: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getTeamsListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
});

export const singleTeamsVal = Joi.object({
    _id: Joi.string().required(),
});

export const editTeamsVal = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    profile: Joi.string().allow(''),
    activity_name: Joi.string().required(),
    role: Joi.string().required(),
    display_order: Joi.string().required(),
    createdAt: Joi.any().optional(),
    status: Joi.boolean().optional(),
});

// faqs validator
export const insertFaqsVal = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    category: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getFaqsListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
});

export const singleFaqsVal = Joi.object({
    _id: Joi.string().required(),
});

export const editFaqsVal = Joi.object({
    _id: Joi.string().required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    category: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});

// testimonials validator
export const insertTestimonialsVal = Joi.object({
    profile: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().required(),
    message: Joi.string().required(),
    star: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getTestimonialsListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
});

export const singleTestimonialsVal = Joi.object({
    _id: Joi.string().required(),
});

export const editTestimonialsVal = Joi.object({
    _id: Joi.string().required(),
    profile: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().required(),
    message: Joi.string().required(),
    star: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});

// notice validator

export const insertNoticeVal = Joi.object({
    type: Joi.string().required(),
    members: Joi.array().optional(),
    activities: Joi.array().optional(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    pdf_url: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getNoticeListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().allow(),
    type: Joi.any().allow(),
});

export const singleNoticeVal = Joi.object({
    _id: Joi.string().required(),
});

export const editNoticeVal = Joi.object({
    _id: Joi.string().required(),
    type: Joi.string().required(),
    members: Joi.array().optional(),
    activities: Joi.array().optional(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    pdf_url: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});

// fees category validator

export const insertFeesCategoryVal = Joi.object({
    event_id: Joi.string().required(),
    category_type: Joi.string().required(),
    members_type: Joi.string().required(),
    event_type: Joi.string().required(),
    category_name: Joi.string().required(),
    variations: Joi.array().required(),
    members_fees: Joi.string().required(),
    non_members_fees: Joi.string().required(),
    status: Joi.boolean().optional(),
});

export const getFeesCategoryListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
    category_type: Joi.string().required(),
});

export const singleFeesCategoryVal = Joi.object({
    _id: Joi.string().required(),
});

export const editFeesCategoryVal = Joi.object({
    _id: Joi.string().required(),
    event_id: Joi.string().required(),
    members_type: Joi.string().required(),
    category_type: Joi.string().required(),
    event_type: Joi.string().required(),
    category_name: Joi.string().required(),
    variations: Joi.array().required(),
    members_fees: Joi.string().required(),
    non_members_fees: Joi.string().required(),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
});
