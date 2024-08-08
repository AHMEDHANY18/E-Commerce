import Category from "../../../db/models/category.model.js";
import SubCategory from "../../../db/models/subcategory.model.js";
import User from "../../../db/models/user.model.js";
import slugify from "slugify";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import { asyncHandler } from "../../middelware/asyncHandler.js";
import { AppError } from "../../../Utility/classErrors.js";

//////////////////////////////////////////////////////////////
// Add category
export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
        return next(new AppError('Category name is required'));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User does not exist'));
    }

    if (!req.file) {
        return next(new AppError('Image does not exist'));
    }

    // Generate initial slug for category name
    let slug = slugify(name, {
        replacement: "_",
        lower: true
    });

    // Check for slug uniqueness and regenerate if necessary
    let slugExists = await Category.findOne({ slug });
    while (slugExists) {
        slug = slugify(`${name}-${nanoid(5)}`, { replacement: "_", lower: true });
        slugExists = await Category.findOne({ slug });
    }

    // Upload image to Cloudinary using the slug as folder name
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `E-Commerce/category/${slug}`
    });
        req.data = {
        model: Category,
        id: Category._id
    }

    const newCategory = new Category({
        name: name,
        slug: slug,
        image: { secure_url, public_id },
        userId: userId,
        customid: name
    });

    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory });
});

/////////////////////////////////////////////////////////////////////////
// Update category
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const id = req.params.id;

    const category = await Category.findOne({ _id: id, userId: req.user._id });

    if (!category) {
        return next(new AppError('Category not found or you do not have permission'));
    }

    if (name && name.toLowerCase() === category.name.toLowerCase()) {
        return next(new AppError('Name should be different'));
    }

    if (name) {
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return next(new AppError('Name already exists'));
        }

        // Generate a new slug and ensure its uniqueness
        let newSlug = slugify(name, { replacement: "_", lower: true });
        let slugExists = await Category.findOne({ slug: newSlug });
        while (slugExists && slugExists._id.toString() !== id) {
            newSlug = slugify(`${name}-${nanoid(5)}`, { replacement: "_", lower: true });
            slugExists = await Category.findOne({ slug: newSlug });
        }

        category.name = name;
        category.slug = newSlug;
    }

    if (req.file) {
        // Check if the old image exists and has a public_id
        if (category.image && category.image.public_id) {
            // Destroy the old image
            await cloudinary.uploader.destroy(category.image.public_id);
        }

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `E-Commerce/category/${name}`
        });

        category.image = { secure_url, public_id };
    }

    await category.save();
    res.status(200).json({ message: 'Category updated successfully', category });
});
//////////////////////////////////////////////////////////////////////////////////////
//delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;


    // Check if category exists
    const category = await Category.findById(id);

    if (!category) {
        return next(new AppError("Category does not exist", 404));
    }

    if (!category.userId) {
        return next(new AppError("Category does not have a userId field", 400));
    }

    // Check if the user has permission to delete this category
    if (category.userId.toString() !== req.user._id.toString()) {
        return next(new AppError("You don't have permission to delete this category", 403));
    }

    // Find and delete the category
    const categoryToDelete = await Category.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    // If category not found or user doesn't have permission
    if (!categoryToDelete) {
        return next(new AppError("Category does not exist or you don't have permission", 401));
    }


    // Delete subcategories related to this category
    await SubCategory.deleteMany({ parentCategory: categoryToDelete._id });

    // Delete from cloudinary
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/categories/${categoryToDelete.customId}`);
    await cloudinary.api.delete_folder(`EcommerceC42/categories/${categoryToDelete.customId}`);

    res.status(200).json({ msg: "done" });
});

