import Joi from 'joi';

export const createbrand = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required()
    }).required()
};

export const updatebrand = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).optional()
    }).optional()
};
