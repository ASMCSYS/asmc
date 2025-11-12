import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const contactUsVal = Joi.object({
    name: Joi.string().required("Required"),
    email: Joi.string().allow(""),
    phone_number: Joi.string().required("Required"),
    subject: Joi.string().allow(""),
    message: Joi.string().allow(""),
});
export const getContactUsVal = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    keywords: Joi.string().allow(""),
});
export const testMailVal = Joi.object({
    email: Joi.string().required(),
});