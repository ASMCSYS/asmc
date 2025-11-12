import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const insertStaffVal = Joi.object({
    name: Joi.string().required(),
    designation: Joi.string().required(),
    department: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().allow(''),
    joiningDate: Joi.date().allow(''),
    reportingTo: Joi.string().allow(''),
    team: Joi.string().allow(''),
    biometric: Joi.object({
        thumbprint: Joi.string().allow(''),
        deviceId: Joi.string().allow(''),
        registeredAt: Joi.date().allow(''),
    }).allow(null),
    status: Joi.boolean().allow(null),
    smartOfficeId: Joi.string().allow(''),
    permissions: Joi.array().items(Joi.string()).required(),
});

export const editStaffVal = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().allow(''),
    designation: Joi.string().allow(''),
    department: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    phone: Joi.string().allow(''),
    address: Joi.string().allow(''),
    joiningDate: Joi.date().allow(''),
    reportingTo: Joi.string().allow(''), // Manager ID
    team: Joi.string().allow(''),
    biometric: Joi.object({
        thumbprint: Joi.string().allow(''),
        deviceId: Joi.string().allow(''),
        registeredAt: Joi.date().allow(null),
    }).optional(),
    status: Joi.boolean().allow(null),
    smartOfficeId: Joi.string().allow(''),
    permissions: Joi.array().items(Joi.string()),

    // default allowed
    converted: Joi.boolean().allow(null),
    convertedAt: Joi.date().allow(null),
});

export const updateProfileVal = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
});
