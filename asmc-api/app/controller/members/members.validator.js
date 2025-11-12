import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const insertMembersVal = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().allow(''),
    gender: Joi.string().allow(''),
    mobile: Joi.string().allow(''),
    alternate_mobile: Joi.string().allow(''),
    dob: Joi.string().allow(''),
    chss_number: Joi.string().allow(''),
    non_chss_number: Joi.string().allow(''),
    chss_card_link: Joi.string().allow(''),
    fees_paid: Joi.string().allow(''),
    fees_verified: Joi.string().allow(''),
    family_details: Joi.array().optional(),
    is_family_user: Joi.any().optional(),
    current_plan: Joi.object().optional(),
    profile: Joi.string().allow(''),
    address: Joi.string().allow(''),
    member_status: Joi.string().allow(''),
    member_post: Joi.string().allow(''),
    role_activity_name: Joi.any().allow(''),
    tshirt_size: Joi.string().allow(''),
    clothing_type: Joi.string().allow(''),
    clothing_size: Joi.string().allow(''),
    tshirt_name: Joi.string().allow(''),
    instruction: Joi.string().allow(''),
    no_of_card_issued: Joi.string().allow(''),
});

export const getMembersListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    member_status: Joi.string().allow(''),
    member_post: Joi.string().allow(''),
    converted: Joi.string().allow(''),
    active: Joi.any().optional(),
    fees_paid: Joi.any().optional(),
    member_id: Joi.any().optional(),
});

export const singleMembersVal = Joi.object({
    _id: Joi.string().required(),
});

export const verifyMembersVal = Joi.object({
    member_id: Joi.string().required(),
});

export const validatePayment = Joi.object({
    member_id: Joi.string().required(),
    reference_no: Joi.string().required(),
    amount_paid: Joi.string().required(),
});

export const editMembersVal = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().allow('').required(),
    gender: Joi.string().required(),
    mobile: Joi.string().allow(''),
    alternate_mobile: Joi.string().allow(''),
    dob: Joi.string().allow(''),
    chss_number: Joi.string().allow(''),
    non_chss_number: Joi.string().allow(''),
    chss_card_link: Joi.string().allow(''),
    fees_paid: Joi.any().allow(''),
    fees_verified: Joi.any().allow(''),
    family_details: Joi.array().optional(),
    is_family_user: Joi.any().optional(),
    current_plan: Joi.object().optional(),
    profile: Joi.string().allow(''),
    address: Joi.string().allow(''),
    member_status: Joi.string().allow(''),
    member_post: Joi.any().allow(''),
    role_activity_name: Joi.any().allow(''),
    tshirt_size: Joi.string().allow(''),
    clothing_type: Joi.string().allow(''),
    clothing_size: Joi.string().allow(''),
    tshirt_name: Joi.string().allow(''),
    instruction: Joi.string().allow(''),
    no_of_card_issued: Joi.string().allow(''),

    // other non updating
    member_id: Joi.any().allow(''),
    status: Joi.any().allow(''),
    converted: Joi.any().allow(''),
    convertedAt: Joi.any().allow(''),
});
