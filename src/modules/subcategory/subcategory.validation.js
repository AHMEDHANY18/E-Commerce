import Joi from 'joi';
import { generalFiled } from '../../../Utility/genarica.js';

export const createsubcategory = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required()
    }).required(),
    file: generalFiled.file.required(),
    headers: generalFiled.headers.required()
};

export const updatesubcategory = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).optional()
    }).optional(),
    file: Joi.any().optional(),
    headers: Joi.object().required()
};
