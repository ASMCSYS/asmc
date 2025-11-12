import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const insertPlansVal = Joi.object({
    plan_name: Joi.string().required(),
    plan_type: Joi.string().required(),
    description: Joi.string().allow(),
    amount: Joi.any().required(),
    dependent_member_price: Joi.any().allow(),
    non_dependent_member_price: Joi.any().allow(),
    kids_price: Joi.any().allow(),
    guest_price: Joi.any().allow(),
    plan_timeline: Joi.any().allow(),
    start_month: Joi.any().allow(),
    end_month: Joi.any().allow(),
    batch_hours: Joi.any().allow(),
    status: Joi.any().allow(),
});

export const getPlansListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.any().allow(''),
    plan_type: Joi.any().allow(''),
});

export const singlePlansVal = Joi.object({
    _id: Joi.string().required(),
});

export const editPlansVal = Joi.object({
    _id: Joi.string().required(),
    plan_name: Joi.string().required(),
    plan_type: Joi.string().required(),
    description: Joi.string().allow(),
    amount: Joi.any().required(),
    dependent_member_price: Joi.any().allow(),
    non_dependent_member_price: Joi.any().allow(),
    kids_price: Joi.any().allow(),
    guest_price: Joi.any().allow(),
    plan_timeline: Joi.any().allow(),
    start_month: Joi.any().allow(),
    end_month: Joi.any().allow(),
    batch_hours: Joi.any().allow(),
    status: Joi.any().allow(),

    // other non updating
    plan_id: Joi.any().allow(''),
    convertedAt: Joi.any().allow(''),
    updatedAt: Joi.any().allow(''),
});
