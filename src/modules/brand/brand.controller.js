import Brand from "../../../db/models/brand.model.js"; // Correct import statement
import User from "../../../db/models/user.model.js"; // Add this import
import slugify from "slugify";
import {asyncHandler} from "../../middelware/asyncHandler.js";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";

//////////////////////////////////////////////////////////////
// Add brand
export const addbrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
        return next(new Error('Brand name is required'));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error('User does not exist'));
    }

    if (!req.file) {
        return next(new Error('Image does not exist'));
    }

    const customid = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `E-Commerce/brand/${customid}`
    });

    let slug = slugify(name, {
        replacement: "_",
        lower: true
    });

    // Check for duplicate slug and make it unique if needed
    let slugExists = await Brand.findOne({ slug });
    while (slugExists) {
        slug = slugify(`${name}-${nanoid(5)}`, { replacement: "_", lower: true });
        slugExists = await Brand.findOne({ slug });
    }

    const newBrand = new Brand({
        name: name,
        slug: slug,
        image: { secure_url, public_id },
        userId: userId
    });

    await newBrand.save();
    res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
});

/////////////////////////////////////////////////////////////////////////
// Update brand
export const updatebrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const id = req.params.id;

    const brand = await brand.findOne({ _id: id, userId: req.user._id });

    if (!brand) {
        return next(new Error('brand not found or you do not have permission'));
    }

    if (name && name.toLowerCase() === brand.name.toLowerCase()) {
        return next(new Error('Name should be different'));
    }

    if (name && await brand.findOne({ name: name.toLowerCase() })) {
        return next(new Error('Name already exists'));
    }

    if (name) {
        brand.name = name;
        brand.slug = slugify(name, { replacement: "_", lower: true });
    }

    if (req.file) {
        // Check if the old image exists and has a public_id
        if (brand.image && brand.image.public_id) {
            // Destroy the old image
            await cloudinary.uploader.destroy(brand.image.public_id);
        }

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `E-Commerce/brand/${brand._id}` // Changed to brand._id
        });

        brand.image = { secure_url, public_id };
    }

    await brand.save();
    res.status(200).json({ message: 'brand updated successfully', brand });
});
//////////////////////////////////////////////////////////////////////////////////////
// Delete brand
export const deletebrand = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const brand = await brand.findOne({ _id: id, userId: req.user._id });
    if (!brand) {
        return next(new Error('brand not found or you do not have permission'));
    }
    await brand.deleteOne({ _id: id });
    res.status(200).json({ message: 'brand deleted successfully' });
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
    const categories = await brand.find({ userId: userId })
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const totalCount = await brand.countDocuments({ userId: userId });
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
// Get brand by ID
export const getbrandById = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;
    const brand = await brand.findOne({ _id: id, userId: userId });
    if (!brand) {
        return next(new Error('brand not found'));
    }
    res.status(200).json({ message: 'brand retrieved successfully', brand: brand });
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
    const categories = await brand.find(filter);
    if (!categories || categories.length === 0) {
        return next(new Error(`No categories found matching name '${name}'`));
    }
    res.status(200).json({ message: `Categories filtered by name '${name}' retrieved successfully`, categories: categories });
});
