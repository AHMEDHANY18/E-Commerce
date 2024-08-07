import coupon from "../../../db/models/coupon.model.js"; // Correct import statement
import User from "../../../db/models/user.model.js"; // Add this import
import slugify from "slugify";
import {asyncHandler} from "../../middelware/asyncHandler.js";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import Coupon from "../../../db/models/coupon.model.js";

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
    const coupon = await coupon.findOne({ _id: id, userId: req.user._id });
    if (!coupon) {
        return next(new Error('coupon not found or you do not have permission'));
    }
    await coupon.deleteOne({ _id: id });
    res.status(200).json({ message: 'coupon deleted successfully' });
});
/////////////////////////////////////////////////////////////////////////////////
// Get Categories (pagination and sort with name)
export const getCategories = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    let { page, limit, sort } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sort = sort || 'name';
    const skip = (page - 1) * limit;
    const categories = await coupon.find({ userId: userId })
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const totalCount = await coupon.countDocuments({ userId: userId });
    if (!categories || categories.length === 0) {
        return next(new Error('No categories found'));
    }
    res.status(200).json({
        message: 'Categories retrieved successfully',
        categories,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////
// Get coupon by ID
export const getcouponById = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;
    const coupon = await coupon.findOne({ _id: id, userId: userId });
    if (!coupon) {
        return next(new Error('coupon not found'));
    }
    res.status(200).json({ message: 'coupon retrieved successfully', coupon: coupon });
});
///////////////////////////////////////////////////////////////////////////////////////////
// Filter with name
export const filterwithname = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    let { name } = req.query;
    if (!name) {
        return next(new Error('Name parameter is required for filtering'));
    }
    name = name.trim();
    const filter = {
        userId: userId,
        name: { $regex: name, $options: 'i' }
    };
    const categories = await coupon.find(filter);
    if (!categories || categories.length === 0) {
        return next(new Error(`No categories found matching name '${name}'`));
    }
    res.status(200).json({ message: `Categories filtered by name '${name}' retrieved successfully`, categories: categories });
});
