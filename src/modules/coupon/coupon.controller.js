import coupon from "../../../db/models/coupon.model.js"; // Correct import statement
import User from "../../../db/models/user.model.js"; // Add this import
import slugify from "slugify";
import {asyncHandler} from "../../middelware/asyncHandler.js";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import Coupon from "../../../db/models/coupon.model.js";
import { AppError } from "../../../Utility/classErrors.js";

//////////////////////////////////////////////////////////////
// Add coupon
export const addCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body;
    const userId = req.user._id;

    if (!code) {
        return next(new Error('Coupon code is missing'));
    }

    // Check if the coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
        return next(new Error('Coupon already exists'));
    }

    // Create a new coupon
    const newCoupon = new Coupon({
        code,
        amount,
        fromDate,
        toDate,
        userId
    });

    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
});
/////////////////////////////////////////////////////////////////////////
// Update coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { code, amount, fromDate, toDate } = req.body;

    const updateFields = {
        code,
        amount,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate)
    };

    const coupon = await Coupon.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateFields,
        { new: true, runValidators: true }
    );

    if (!coupon) {
        return next(new AppError("Coupon does not exist or you don't have permission", 409));
    }

    res.status(200).json({ msg: "done", coupon });
});
//////////////////////////////////////////////////////////////////////////////////////
// Delete coupon
export const deletecoupon = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const coupon = await Coupon.findOne({ _id: id, userId: req.user._id });
    if (!coupon) {
        return next(new AppError('coupon not found or you do not have permission'));
    }
    await coupon.deleteOne({ _id: id });
    res.status(200).json({ message: 'coupon deleted successfully' });
});
