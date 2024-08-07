import Category from "../../../db/models/category.model.js";
import SubCategory from "../../../db/models/subcategory.model.js";
import User from "../../../db/models/user.model.js";
import slugify from "slugify";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import { asyncHandler } from "../../middelware/asyncHandler.js";

// Add Subcategory Controller
export const addsubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;
    const { categoryID } = req.params; // Get categoryID from params

    if (!name) {
        return next(new Error('Subcategory name is required'));
    }

    const categoryExist = await Category.findById(categoryID); // Use categoryID from params
    if (!categoryExist) {
        return next(new Error('Cannot find category'));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error('User does not exist'));
    }

    if (!req.file) {
        return next(new Error('Image does not exist'));
    }

    // Generate a folder-friendly category name
    const categoryFolderName = slugify(categoryExist.name, { replacement: "_", lower: true });
    const customid = nanoid(5);

    // Upload the image to Cloudinary using the category name as part of the folder path
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `E-Commerce/category/${categoryFolderName}/subcategory/${customid}`
    });

    let slug = slugify(name, {
        replacement: "_",
        lower: true
    });

    let slugExists = await SubCategory.findOne({ slug });
    while (slugExists) {
        slug = slugify(`${name}-${nanoid(5)}`, { replacement: "_", lower: true });
        slugExists = await SubCategory.findOne({ slug });
    }

    const newSubCategory = new SubCategory({
        name: name,
        slug: slug,
        image: { secure_url, public_id },
        userId: userId,
        parentCategory: categoryID // Correctly reference parentCategory
    });

    await newSubCategory.save();
    res.status(201).json({ message: 'Subcategory created successfully', subcategory: newSubCategory });
});

// Update Subcategory Controller (Ensure this is defined)
export const updatesubCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    const subCategory = await SubCategory.findOne({ _id: id, userId });
    if (!subCategory) {
        return next(new Error('Subcategory not found or you do not have permission'));
    }

    if (name && name.toLowerCase() === subCategory.name.toLowerCase()) {
        return next(new Error('Name should be different'));
    }

    if (name && await SubCategory.findOne({ name: name.toLowerCase() })) {
        return next(new Error('Name already exists'));
    }

    if (name) {
        subCategory.name = name;
        subCategory.slug = slugify(name, { replacement: "_", lower: true });
    }

    if (req.file) {
        // Check if the old image exists and has a public_id
        if (subCategory.image && subCategory.image.public_id) {
            // Destroy the old image
            await cloudinary.uploader.destroy(subCategory.image.public_id);
        }

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `E-Commerce/category/${subCategory.parentCategory}/subcategory/${subCategory._id}`
        });

        subCategory.image = { secure_url, public_id };
    }

    await subCategory.save();
    res.status(200).json({ message: 'Subcategory updated successfully', subCategory });
});
////////////////////////////////////////////////////////////////


export const getSubCategory = asyncHandler(async (req, res, next) => {

        const subCategory = await SubCategory.find({}).populate([
            {
                path: 'parentCategory'
            },
            {
                path: 'userId'
            }
        ]);
        res.status(200).json(subCategory);

});
