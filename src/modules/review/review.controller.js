import reviewModel from "../../../db/models/review.model.js";
import productModel from './../../../db/models/product.model.js';
import orderModel from './../../../db/models/order.model.js';
import { asyncHandler } from "../../middelware/asyncHandler.js";

// ===================================  createReview ================================================
export const createReview = asyncHandler(async (req, res, next) => {
    const { comment, rate } = req.body;
    const { productId } = req.params;

    // Check if the product exists
    const productExist = await productModel.findById(productId);
    if (!productExist) {
        return next(new Error("Product not found", 404));
    }

    // Check if the user has already reviewed this product
    const review = await reviewModel.findOne({
        createdBy: req.user._id,
        productId
    });
    // if (review) {
    //     return next(new Error("Review already exists", 404));
    // }

    // Check if there is a delivered order for this product by the user
    const order = await orderModel.findOne({
        user: req.user._id,
        "products.productId": productId,
        status: "delivered"
    });
    if (!order) {
        return next(new Error("You must have a delivered order to review this product", 404));
    }

    // Create a new review
    const newReview = await reviewModel.create({
        comment,
        rate,
        createdBy: req.user._id,
        productId
    });

    // Update the product's average rating
    const reviews = await reviewModel.find({ productId });
    let sum = reviews.reduce((acc, review) => acc + review.rate, 0);

    productExist.rateAvg = sum / reviews.length;
    await productExist.save();

    // Recalculate average rating
    sum = productExist.rateAvg * productExist.rateNum;
    sum += rate;

    productExist.rateAvg = sum / (productExist.rateNum + 1);
    productExist.rateNum += 1;
    await productExist.save();

    return res.status(201).json({ msg: "Review created successfully", review: newReview });
});
//
// ===================================  deleteReview ================================================
export const deleteReview = asyncHandler(async (req, res, next) => {

    const { id } = req.params;

    const review = await reviewModel.findOneAndDelete({
        createdBy: req.user._id,
        _id: id
    })
    if (!review) {
        return next(new Error("review not exist", 404))
    }

    const product = await productModel.findById(review.productId)

    let sum = product.rateAvg * product.rateNum
    sum = sum - review.rate

    product.rateAvg = sum / (product.rateNum - 1)
    product.rateNum -= 1
    await product.save()
    return res.status(200).json({ msg: "done", review })
})

