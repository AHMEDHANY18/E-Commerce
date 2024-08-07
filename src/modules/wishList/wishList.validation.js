import joi from "joi";
import { generalFiled } from "../../../Utility/genarica.js";


export const createWishList = {
    params: joi.object({
        productId: generalFiled.id.required(),
    }).required(),
    headers: generalFiled.headers.required()
}
