import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const insertEventsVal = Joi.object({
    event_name: Joi.string().required(),
    event_type: Joi.string().valid('Single', 'Double', 'Team').required(),
    members_type: Joi.string().required(),
    description: Joi.string().required(),
    text_content: Joi.string().allow(),
    images: Joi.array().optional(),

    event_start_date: Joi.any().allow(),
    event_end_date: Joi.any().allow(),
    event_start_time: Joi.any().allow(),
    event_end_time: Joi.any().allow(),

    broadcast_start_date: Joi.any().allow(),
    broadcast_end_date: Joi.any().allow(),
    broadcast_start_time: Joi.any().allow(),
    broadcast_end_time: Joi.any().allow(),

    registration_start_date: Joi.any().allow(),
    registration_end_date: Joi.any().allow(),
    registration_start_time: Joi.any().allow(),
    registration_end_time: Joi.any().allow(),

    location_id: Joi.any().allow(),
    sublocation_id: Joi.any().allow(),
    court: Joi.any().allow(),

    players_limit: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(1),
        otherwise: Joi.any().optional(),
    }),

    min_players_limit: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(1),
        otherwise: Joi.any().optional(),
    }),

    member_team_event_price: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(0),
        otherwise: Joi.any().optional(),
    }),

    non_member_team_event_price: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(0),
        otherwise: Joi.any().optional(),
    }),

    category_data: Joi.array().required(),
    status: Joi.any().allow(),
});

export const getEventsListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.any().allow(''),
    event_id: Joi.any().allow(''),
});

export const singleEventsVal = Joi.object({
    _id: Joi.string().optional(),
    event_id: Joi.string().optional(),
});

export const editEventsVal = Joi.object({
    _id: Joi.string().required(),
    event_name: Joi.string().required(),
    event_type: Joi.string().valid('Single', 'Double', 'Team').optional(),
    members_type: Joi.string().allow(),
    description: Joi.string().allow(),
    text_content: Joi.string().allow(),
    images: Joi.array().optional(),
    member_fees: Joi.any().allow(),
    non_member_fees: Joi.any().allow(),

    event_start_date: Joi.any().allow(),
    event_end_date: Joi.any().allow(),
    event_start_time: Joi.any().allow(),
    event_end_time: Joi.any().allow(),

    broadcast_start_date: Joi.any().allow(),
    broadcast_end_date: Joi.any().allow(),
    broadcast_start_time: Joi.any().allow(),
    broadcast_end_time: Joi.any().allow(),

    registration_start_date: Joi.any().allow(),
    registration_end_date: Joi.any().allow(),
    registration_start_time: Joi.any().allow(),
    registration_end_time: Joi.any().allow(),

    location_id: Joi.any().allow(),
    sublocation_id: Joi.any().allow(),
    court: Joi.any().allow(),

    players_limit: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(1),
        otherwise: Joi.any().optional(),
    }),

    min_players_limit: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(1),
        otherwise: Joi.any().optional(),
    }),

    member_team_event_price: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(0),
        otherwise: Joi.any().optional(),
    }),

    non_member_team_event_price: Joi.when('event_type', {
        is: 'Team',
        then: Joi.number().required().min(0),
        otherwise: Joi.any().optional(),
    }),

    category_data: Joi.array().allow(),

    // other non updating
    event_id: Joi.any().allow(''),
    status: Joi.any().allow(''),
    updatedAt: Joi.any().allow(''),
    createdAt: Joi.any().allow(''),
});

export const insertEventBookingVal = Joi.object({
    event_id: Joi.string().required(),
    member_id: Joi.string().allow(''),
    category_id: Joi.string().required(),
    booking_form_data: Joi.object().required(),
    category_data: Joi.object().required(),
    member_data: Joi.array().optional(),
    non_member_data: Joi.array().optional(),
    amount_paid: Joi.any().required(),
});

export const updateEventBookingVal = Joi.object({
    _id: Joi.string().required(),
    event_id: Joi.string().optional(),
    member_id: Joi.string().optional(),
    category_id: Joi.string().optional(),
    booking_form_data: Joi.object().optional(),
    category_data: Joi.object().optional(),
    member_data: Joi.array().optional(),
    non_member_data: Joi.array().optional(),
    amount_paid: Joi.any().optional(),
});

export const getEventsBookingListVal = Joi.object({
    pageNo: Joi.string().allow(''),
    limit: Joi.string().allow(''),
    sortBy: Joi.string().allow(''),
    sortField: Joi.string().allow(''),
    keywords: Joi.string().allow(''),
    active: Joi.any().allow(''),
    event_id: Joi.string().allow(),
});

export const guestEventsVal = Joi.object({
    order_id: Joi.string().allow(),
});
