import Joi from 'joi';
import { generalFiled } from '../../../Utility/genarica.js';


export const createCategory = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required()
    }).required(),
    file: Joi.object({
        path: Joi.string().required(),
        originalname: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().required()
    }).required(), // Adjust this based on how you define file in multer
    headers: Joi.object().required()
};
export const updateCategory = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).optional()
    }).optional(), // Body is optional since we might only upload an image
    file: Joi.any().optional(), // Ensure the file field is optional
    headers: Joi.object().required()
};
