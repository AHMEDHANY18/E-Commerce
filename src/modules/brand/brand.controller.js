import Brand from "../../../db/models/brand.model.js"; // Correct import statement
import User from "../../../db/models/user.model.js"; // Add this import
import slugify from "slugify";
import {asyncHandler} from "../../middelware/asyncHandler.js";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import { AppError } from "../../../Utility/classErrors.js";

//////////////////////////////////////////////////////////////
// Add brand
export const addbrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
        return next(new AppError('Brand name is required'));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User does not exist'));
    }

    if (!req.file) {
        return next(new AppError('Image does not exist'));
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

    const brand = await Brand.findOne({ _id: id, userId: req.user._id });

    if (!brand) {
        return next(new AppError('Brand not found or you do not have permission', 403));
    }

    if (name && name.toLowerCase() === brand.name.toLowerCase()) {
        return next(new AppError('Name should be different', 400));
    }

    if (name && await Brand.findOne({ name: name.toLowerCase() })) {
        return next(new AppError('Name already exists', 400));
    }

    if (name) {
        brand.name = name;
        brand.slug = slugify(name, { replacement: "_", lower: true });

        // Check for duplicate slug and make it unique if needed
        let slugExists = await Brand.findOne({ slug: brand.slug });
        while (slugExists && slugExists._id.toString() !== id) {
            brand.slug = slugify(`${name}-${nanoid(5)}`, { replacement: "_", lower: true });
            slugExists = await Brand.findOne({ slug: brand.slug });
        }
    }

    if (req.file) {
        // Check if the old image exists and has a public_id
        if (brand.image && brand.image.public_id) {
            // Destroy the old image
            await cloudinary.uploader.destroy(brand.image.public_id);
        }

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `E-Commerce/brand/${brand._id}`
        });

        brand.image = { secure_url, public_id };
    }

    await brand.save();
    res.status(200).json({ message: 'Brand updated successfully', brand });
});
//////////////////////////////////////////////////////////////////////////////////////
// Delete brand
export const deletebrand = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const brand = await Brand.findOne({ _id: id, userId: req.user._id });
    if (!brand) {
        return next(new AppError('brand not found or you do not have permission'));
    }
    await Brand.deleteOne({ _id: id });
    res.status(200).json({ message: 'brand deleted successfully' });
});
////////////////////////////////////////////////////////////////////////////////