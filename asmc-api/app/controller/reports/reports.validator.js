import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

export const exportValidator = Joi.object({
    start_date: Joi.string().optional(),
    end_date: Joi.string().optional(),
    batch_id: Joi.any().optional(),
    activity_id: Joi.any().optional(),
    event_id: Joi.any().optional(),
    hall_id: Joi.any().optional(),
    payment_status: Joi.any().optional(),
    download: Joi.any().optional(),
    payment_type: Joi.any().optional(),
    payment_mode: Joi.any().optional(),
});
