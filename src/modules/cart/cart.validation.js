import Joi from 'joi';
import { generalFiled } from '../../../Utility/genarica.js'; // Ensure correct import path
import Product from '../../../db/models/product.model.js';

export const createcart = {
    body: Joi.object({
        productID: generalFiled.id.required(),
        quantity: Joi.number().required(),
    })
};
export const removecart = {
    body: Joi.object({
        productID: generalFiled.id.required(),
    })
};
// export const updatecart = {
//     body: Joi.object({
//         code: Joi.string()
//             .min(3)
//             .max(30),
//         amount: Joi.number()
//             .min(1)
//             .max(100)
//             .integer(),
//         fromDate: Joi.date()
//             .greater('now'),
//         toDate: Joi.date()
//             .greater(Joi.ref('fromDate'))
//     }).required(),
//     headers: generalFiled.headers.required()
// };
