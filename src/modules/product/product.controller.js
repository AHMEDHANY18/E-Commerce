import Category from "../../../db/models/category.model.js";
import Product from "../../../db/models/product.model.js";
import User from "../../../db/models/user.model.js";
import Brand from "../../../db/models/brand.model.js"; // Assuming you have a Brand model
import slugify from "slugify";
import {asyncHandler} from "../../middelware/asyncHandler.js";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import SubCategory from "../../../db/models/subcategory.model.js";
import { ApiFeatures } from "../../../Utility/apiFeatures.js";
import { AppError } from "../../../Utility/classErrors.js";

export const createProduct = asyncHandler(async (req, res, next) => {
    const { stock, discount, price, category, description, title, brand, subCategory } = req.body;
    const userId = req.user._id;
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
        return next(new AppError('Cannot find category', 400));
    }
    const subcategoryExist = await SubCategory.findOne({ _id: subCategory });
    if (!subcategoryExist) {
        return next(new AppError('Cannot find subcategory within the category', 400));
    }

    // Check if brand exists
    const brandExist = await Brand.findById(brand);
    if (!brandExist) {
        return next(new AppError('Cannot find brand', 400));
    }

    // Check if product with the same title exists
    const productExist = await Product.findOne({ title: title.toLowerCase() });
    if (productExist) {
        return next(new AppError('Product with the same title already exists', 400));
    }

    // Calculate the subprice
    const subprice = price - (price * (discount || 0) / 100);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User does not exist', 400));
    }

    // Check if images are provided
    if (!req.files || !req.files.coverImage || !req.files.image) {
        return next(new AppError('Images are required', 400));
    }

    const customId = nanoid(5);
    let coverImages = [];

    // Upload cover images
    for (const file of req.files.coverImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `E-Commerce/category/${category}/subcategory/${subcategoryExist.customId}/products`
        });
        coverImages.push({ secure_url, public_id });
    }

    // Upload main image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `E-Commerce/products/${customId}`
    });

    // Generate a unique slug
    let slug = slugify(title, {
        replacement: "_",
        lower: true
    });

    let slugExists = await Product.findOne({ slug });
    while (slugExists) {
        slug = slugify(`${title}-${nanoid(5)}`, { replacement: "_", lower: true });
        slugExists = await Product.findOne({ slug });
    }

    // Create the new product
    const newProduct = new Product({
        title: title.toLowerCase(),
        slug: slug,
        image: { secure_url, public_id },
        stock,
        discount,
        price,
        subprice,
        category,
        description,
        brand,
        subCategory,
        coverImages: coverImages,
        customId,
        userId: req.user._id
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
});

// updateProduct

export const updateProduct = asyncHandler(async (req, res, next) => {
    const { stock, discount, price, category, description, title, brand, subCategory } = req.body;
    const productId = req.params.id;

    // Retrieve the product to be updated
    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Check if category exists
    if (category) {
        const categoryExist = await Category.findById(category);
        if (!categoryExist) {
            return next(new AppError('Cannot find category', 404));
        }
    }

    // Check if subcategory exists within the category
    if (subCategory) {
        const subcategoryExist = await SubCategory.findById(subCategory);
        if (!subcategoryExist) {
            return next(new AppError('Cannot find subcategory within the category', 404));
        }
    }

    // Check if brand exists
    if (brand) {
        const brandExist = await Brand.findById(brand);
        if (!brandExist) {
            return next(new AppError('Cannot find brand', 404));
        }
    }

    // Check if product with the same title exists
    if (title && title.toLowerCase() !== product.title.toLowerCase()) {
        const productExist = await Product.findOne({ title: title.toLowerCase() });
        if (productExist) {
            return next(new AppError('Product with the same title already exists', 409));
        }
    }

    // Update product fields
    if (title) {
        product.title = title.toLowerCase();
        product.slug = slugify(title, { lower: true, replacement: "_" });
    }
    if (description) {
        product.description = description;
    }
    if (stock) {
        product.stock = stock;
    }
    if (price !== undefined && discount !== undefined) {
        product.subprice = price - (price * discount / 100);
        product.price = price;
        product.discount = discount;
    } else if (price !== undefined) {
        product.subprice = price - (price * product.discount / 100);
        product.price = price;
    } else if (discount !== undefined) {
        product.subprice = product.price - (product.price * discount / 100);
        product.discount = discount;
    }

    // Handle file uploads
    if (req.files) {
        if (req.files.image?.length) {
            // Remove old image
            if (product.image.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }
            // Upload new image
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `E-Commerce/products/${product.customId}/mainImage`
            });
            product.image = { secure_url, public_id };
        }

        if (req.files.coverImages?.length) {
            // Remove old cover images
            await cloudinary.api.delete_resources_by_prefix(`E-Commerce/products/${product.customId}/coverImages`);
            const coverImagesList = await Promise.all(
                req.files.coverImages.map(async (file) => {
                    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                        folder: `E-Commerce/products/${product.customId}/coverImages`
                    });
                    return { secure_url, public_id };
                })
            );
            product.coverImages = coverImagesList;
        }
    }

    await product.save();

    res.status(200).json({ msg: "Product updated successfully", product });
});
// ===================================  getProducts ================================================
export const getProducts = asyncHandler(async (req, res, next) => {


    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .pagination()
        .filter()
        .sort()
        .select()
        .search()

    const products = await apiFeature.mongooseQuery


    res.status(200).json({ msg: "done", page: apiFeature.page, products })

})


