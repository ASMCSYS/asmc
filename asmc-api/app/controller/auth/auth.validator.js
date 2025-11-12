import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const loginVal = Joi.object({
    email: Joi.string().email().allow('').required(),
    password: Joi.string().allow('').required(),
});

export const changePasswordVal = Joi.object({
    old_password: Joi.string().allow('').required(),
    new_password: Joi.string().allow('').required(),
    confirm_password: Joi.string().allow('').required(),
});

export const resetPasswordVal = Joi.object({
    email: Joi.string().allow('').required(),
    otp: Joi.string().allow('').required(),
    new_password: Joi.string().allow('').required(),
    confirm_password: Joi.string().allow('').required(),
});

export const memberLoginVal = Joi.object({
    email: Joi.string().email().allow('').required(),
    password: Joi.string().allow('').required(),
});

export const sendResetPasswordVal = Joi.object({
    email: Joi.string().email().allow('').required(),
});

export const getUserListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.any().optional(),
    member_id: Joi.any().optional(),
    staff_id: Joi.any().optional(),
    roles: Joi.any().optional(),
});

export const updateUserProfileVal = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
});
