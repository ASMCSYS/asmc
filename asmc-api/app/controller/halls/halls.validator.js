import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const insertHallsVal = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    text_content: Joi.string().allow(),
    terms: Joi.string().allow(),
    images: Joi.array().optional(),

    additional_charges: Joi.string().required(),
    advance_booking_period: Joi.string().required(),
    advance_payment_amount: Joi.string().required(),
    booking_amount: Joi.string().required(),
    cleaning_charges: Joi.string().required(),
    other_charges: Joi.string().allow(''),
    refundable_deposit: Joi.string().required(),

    time_slots: Joi.any().required(),

    location_id: Joi.any().allow(),
    sublocation_id: Joi.any().allow(),
    court: Joi.any().allow(),
    status: Joi.any().allow(),
});

export const getHallsListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.any().allow(''),
    facility_id: Joi.any().optional(),
    hall_id: Joi.any().optional(),
});

export const singleHallsVal = Joi.object({
    _id: Joi.string().optional(),
    hall_id: Joi.string().optional(),
});

export const editHallsVal = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    text_content: Joi.string().allow(),
    terms: Joi.string().allow(),
    images: Joi.array().optional(),

    additional_charges: Joi.string().required(),
    advance_booking_period: Joi.string().required(),
    advance_payment_amount: Joi.string().required(),
    booking_amount: Joi.string().required(),
    cleaning_charges: Joi.string().required(),
    other_charges: Joi.string().allow(''),
    refundable_deposit: Joi.string().required(),

    time_slots: Joi.any().required(),

    location_id: Joi.any().allow(),
    sublocation_id: Joi.any().allow(),
    court: Joi.any().allow(),

    // other non updating
    hall_id: Joi.any().allow(''),
    status: Joi.any().allow(''),
    updatedAt: Joi.any().allow(''),
    createdAt: Joi.any().allow(''),
});

export const insertHallBookingVal = Joi.object({
    hall_id: Joi.string().required(),
    member_id: Joi.string().allow(''),
    slot_from: Joi.string().required(),
    slot_to: Joi.string().required(),
    booking_date: Joi.string().required(),
    is_full_payment: Joi.any().required(),
    purpose: Joi.string().required().min(1).max(1000),
});

export const updateHallBookingVal = Joi.object({
    _id: Joi.string().required(),
    hall_id: Joi.string().required(),
    member_id: Joi.string().allow(''),
    slot: Joi.string().allow(),
    booking_date: Joi.string().allow(),
    is_full_payment: Joi.any().allow(),
    purpose: Joi.string().allow('').min(1).max(1000),

    // refund status non updating
    refund_remarks: Joi.any().allow(''),
    refund_amount: Joi.any().allow(''),
    refunded_at: Joi.any().allow(''),
    is_refunded: Joi.any().allow(''),

    // cancel status update
    cancellation_charges: Joi.any().allow(''),
    cancellation_date: Joi.any().allow(''),
    cancellation_reason: Joi.any().allow(''),
    is_cancelled: Joi.any().allow(''),
    status: Joi.any().allow(''),
});

export const getHallsBookingListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.any().allow(''),
    hall_id: Joi.string().allow(),
});
