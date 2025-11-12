import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const insertEnrollmentVal = Joi.object({
    activity_id: Joi.string().required(),
    member_id: Joi.string().required(),
    batch: Joi.string().required(),
    primary_eligible: Joi.any().required(),
    family_member: Joi.array().required(),
    fees_breakup: Joi.object().required(),
    total_amount: Joi.number().required(),
    type: Joi.string().optional(),
});

export const insertBookingsVal = Joi.object({
    activity_id: Joi.string().required(),
    member_id: Joi.string().required(),
    batch: Joi.string().required(),
    primary_eligible: Joi.any().required(),
    family_member: Joi.array().required(),
    fees_breakup: Joi.object().required(),
    total_amount: Joi.number().required(),
    type: Joi.string().optional(),
});

export const getBookingsListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.boolean().optional(),
    type: Joi.string().optional(),
    booking_id: Joi.string().optional(),
});

export const singleBookingsVal = Joi.object({
    _id: Joi.string().required(),
});

export const statusBookingsVal = Joi.object({
    _id: Joi.string().required(),
    status: Joi.any().required(),
});

export const editBookingsVal = Joi.object({
    _id: Joi.string().required(),
    activity_id: Joi.string().required(),
    member_id: Joi.string().required(),
    batch: Joi.string().required(),
    type: Joi.string().optional(),
    primary_eligible: Joi.any().required(),
    family_member: Joi.array().required(),
    fees_breakup: Joi.object().required(),
    total_amount: Joi.number().required(),
});

export const paymentBookingsVal = Joi.object({
    booking_id: Joi.string().required(),
    reference_no: Joi.string().required(),
});
