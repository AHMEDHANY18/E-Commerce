import productModel from "../../../db/models/product.model.js";
import { AppError } from "../../../Utility/classErrors.js";
import { asyncHandler } from "../../middelware/asyncHandler.js";
import wishListModel from './../../../db/models/wishList.model.js';



// createWishList
export const createWishList = asyncHandler(async (req, res, next) => {


    const { productId } = req.params
    const product = await productModel.findById({ _id: productId })
    if (!product) {
        return next(new AppError("product not found", 404))
    }

    const wishList = await wishListModel.findOne({ user: req.user._id })
    if (!wishList) {
        const newWishList = await wishListModel.create({
            user: req.user._id,
            products: [productId]
        })
        return res.status(201).json({ msg: "done", wishList: newWishList })
    }
    const newWishList = await wishListModel.findOneAndUpdate({ user: req.user._id }, {
        $addToSet: { products: productId }
    }, {
        new: true
    })

    res.status(201).json({ msg: "done", newWishList })


})



