import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const gePaymentHistoryListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    payment_status: Joi.string().allow(''),
    filter_by: Joi.string().allow(''),
});

export const updatePaymentStatusVal = Joi.object({
    _id: Joi.string().required(''),
    status: Joi.any().required(),
});

export const updateRemarkVal = Joi.object({
    _id: Joi.string().required(''),
    remarks: Joi.any().required(),
    difference_amount_paid: Joi.any().required(),
});
