import BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const insertActivityVal = Joi.object({
    name: Joi.string().required("Please enter the name of the game."),
    facility_id: Joi.string().allow(""),
    thumbnail: Joi.string().allow(""),
    images: Joi.array().optional(),
    short_description: Joi.string().allow(""),
    description: Joi.string().allow(""),
    location: Joi.array().required("Please enter location of the game"),
    // fees_structure: Joi.array().min(1).items(
    //     Joi.object({
    //         amount: Joi.number().required(),
    //         dependent_member_price: Joi.number().required(),
    //         guest_price: Joi.number().required(),
    //         kids_price: Joi.number().required(),
    //         non_dependent_member_price: Joi.number().required(),
    //         plan_id: Joi.string().required(),
    //         plan_name: Joi.string().required(),
    //         starting_month: Joi.number().required(),
    //         validity_months: Joi.number().required()
    //     })
    // ).messages({
    //     'array.min': 'Please select atleast one plan.'
    // }),
    batch_booking_plan: Joi.any().allow(""),
    status: Joi.boolean().required(),
    category: Joi.any().optional(),
    show_hide: Joi.any().optional(),
});

export const getActivityListVal = Joi.object({
    pageNo: Joi.string().allow(""),
    limit: Joi.string().allow(""),
    sortBy: Joi.string().allow(""),
    sortField: Joi.string().allow(""),
    keywords: Joi.string().allow(""),
    active: Joi.any().optional(),
    facility_id: Joi.any().optional(),
    batch_status: Joi.any().optional(),
    type: Joi.any().optional(),
    activity_id: Joi.any().optional(),
    show_hide: Joi.any().optional(),
});

export const singleActivityVal = Joi.object({
    _id: Joi.string().optional(),
    activity_id: Joi.string().optional(),
});

export const editActivityVal = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required("Please enter the name of the game."),
    facility_id: Joi.string().allow(""),
    thumbnail: Joi.string().allow(""),
    images: Joi.array().optional(),
    short_description: Joi.string().allow(""),
    description: Joi.string().allow(""),
    location: Joi.any().optional(),
    batch_booking_plan: Joi.any().allow(""),
    status: Joi.boolean().optional(),
    createdAt: Joi.any().optional(),
    category: Joi.any().optional(),
    show_hide: Joi.any().optional()
});