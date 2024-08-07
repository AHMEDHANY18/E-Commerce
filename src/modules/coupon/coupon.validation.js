import Joi from 'joi';
import { generalFiled } from '../../../Utility/genarica.js'; // Ensure correct import path

export const createCoupon = {
    body: Joi.object({
        code: Joi.string()
            .min(3)
            .max(30)
            .required(),
        amount: Joi.number()
            .min(1)
            .max(100)
            .integer()
            .required(),
        fromDate: Joi.date()
            .greater('now') // Ensure the date is in the future
            .required(),
        toDate: Joi.date()
            .greater(Joi.ref('fromDate')) // Ensure toDate is after fromDate
            .required()
    }).required(),
    headers: generalFiled.headers.required()
};

export const updateCoupon = {
    body: Joi.object({
        code: Joi.string()
            .min(3)
            .max(30),
        amount: Joi.number()
            .min(1)
            .max(100)
            .integer(),
        fromDate: Joi.date()
            .greater('now'),
        toDate: Joi.date()
            .greater(Joi.ref('fromDate'))
    }).required(),
    headers: generalFiled.headers.required()
};
