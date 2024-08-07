import Category from "../../../db/models/category.model.js";
import SubCategory from "../../../db/models/subcategory.model.js";
import User from "../../../db/models/user.model.js";
import slugify from "slugify";
import Joi from "joi";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import { asyncHandler } from "../../middelware/asyncHandler.js";

//////////////////////////////////////////////////////////////
// Add category
export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name) {
        return next(new Error('Category name is required'));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error('User does not exist'));
    }

    if (!req.file) {
        return next(new Error('Image does not exist'));
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
        return next(new Error('Category not found or you do not have permission'));
    }

    if (name && name.toLowerCase() === category.name.toLowerCase()) {
        return next(new Error('Name should be different'));
    }

    if (name) {
        const existingCategory = await Category.findOne({ name: name.toLowerCase() });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return next(new Error('Name already exists'));
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

    // Find and delete the category
    const categoryToDelete = await Category.findOneAndDelete({
        _id: id,
        createdBy: req.user._id
    });

    // If category not found or user doesn't have permission
    if (!categoryToDelete) {
        return next(new Error ("Category does not exist or you don't have permission", 401));
    }

    // Delete subcategories related to this category
    await SubCategory.deleteMany({ parentCategory: categoryToDelete._id });

    // Delete from cloudinary
    await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/categories/${categoryToDelete.customId}`);
    await cloudinary.api.delete_folder(`EcommerceC42/categories/${categoryToDelete.customId}`);

    res.status(200).json({ msg: "done" });
});
/////////////////////////////////////////////////////////////////////////////////
//get Categories(pagination and sort with name )
// export const getCategories = asyncHandler(async (req, res, next) => {
//     const userId = req.user._id;
//     let { page, limit, sort } = req.query;
//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;
//     sort = sort || 'name';
//     const skip = (page - 1) * limit;
//     const categories = await Category.find({ userId: userId })
//         .sort(sort)
//         .skip(skip)
//         .limit(limit);
//     const totalCount = await Category.countDocuments({ userId: userId });
//     if (!categories || categories.length === 0) {
//     return next (new Error({ message: 'No categories found' }))
//    }
//     res.status(200).json({
//         message: 'Categories retrieved successfully',
//         categories,
//         totalPages: Math.ceil(totalCount / limit),
//         currentPage: page,
//     });
// });
/////////////////////////////////////////////////////////////////////////////////////////////
// Get category by ID
// export const getCategoryById = asyncHandler(async (req, res, next) => {
//     const userId = req.user._id;
//     const { id } = req.params;
//     const category = await Category.findById({ _id: id, userId: userId });
//     if (!category) {
//         return next (new Error({ message: 'Category not found' }))
//     }
//     res.status(200).json({ message: 'Category retrieved successfully', category: category });
// });
// ///////////////////////////////////////////////////////////////////////////////////////////
// // filter with name
// export const filterwithname = asyncHandler(async (req, res, next) => {
//     const userId = req.user._id;
//     let { name } = req.query;
//     if (!name) {
//         return next(new Error({ message: 'Name parameter is required for filtering' }))
//     }
//     name = name.trim();
//     const filter = {
//         userId: userId,
//         name: { $regex: name, $options: 'i' }
//     };
//     const categories = await Category.find(filter);
//     if (!categories || categories.length === 0) {
//         return next(new Error({ message: `No categories found matching name '${name}'` }))
//     }
//     res.status(200).json({ message: `Categories filtered by name '${name}' retrieved successfully`, categories: categories });
// });
// ///////////////////////////////////////
// export const getCategories = asyncHandler(async (req, res, next) => {
//     try {
//         // Fetch all categories
//         const categories = await Category.find({});
//         let list = [];

//         // Fetch subcategories for each category
//         for (const category of categories) {
//             const subCategories = await SubCategory.find({ parentCategory: category._id });
//             const newCategory = category.toObject();
//             newCategory.subCategories = subCategories;
//             list.push(newCategory);
//         }

//         // Pagination and sorting
//         let { page, limit, sort, userId } = req.query;
//         page = parseInt(page) || 1;
//         limit = parseInt(limit) || 10;
//         sort = sort || 'name';
//         const skip = (page - 1) * limit;

//         // If userId is not provided, don't use it in the query
//         const query = userId ? { userId } : {};

//         // Fetch paginated categories
//         const paginatedCategories = await Category.find(query)
//             .sort(sort)
//             .skip(skip)
//             .limit(limit);
//         const totalCount = await Category.countDocuments(query);

//         // Check if paginated categories are found
//         if (!paginatedCategories || paginatedCategories.length === 0) {
//             return res.status(404).json({ msg: "Error", err: "No categories found" });
//         }

//         res.status(200).json({
//             message: 'Categories retrieved successfully',
//             categories: paginatedCategories,
//             totalPages: Math.ceil(totalCount / limit),
//             currentPage: page,
//             allCategories: list
//         });
//     } catch (error) {
//         next(error);
//     }
// });