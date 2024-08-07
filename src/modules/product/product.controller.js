import Category from "../../../db/models/category.model.js";
import Product from "../../../db/models/product.model.js";
import User from "../../../db/models/user.model.js";
import Brand from "../../../db/models/brand.model.js"; // Assuming you have a Brand model
import slugify from "slugify";
import {asyncHandler} from "../../middelware/asyncHandler.js";
import cloudinary from "../../../Utility/cloudniary.js";
import { nanoid } from "nanoid";
import SubCategory from "../../../db/models/subcategory.model.js";
import {ApiFeatures} from "../../../Utility/apiFeatures.js";

export const createProduct = asyncHandler(async (req, res, next) => {
    const { stock, discount, price, category, description, title, brand, subCategory } = req.body;
    const userId = req.user._id;

    // Debugging Information
    console.log("req.body:", req.body);

    // Check if category exists
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
        return next(new Error('Cannot find category'));
    }

    // Check if subcategory exists within the category
    const subcategoryExist = await SubCategory.findOne({ _id: subCategory});
    console.log("subcategoryExist:", subcategoryExist);
    if (!subcategoryExist) {
        return next(new Error('Cannot find subcategory within the category'));
    }

    // Check if brand exists
    const brandExist = await Brand.findById(brand);
    if (!brandExist) {
        return next(new Error('Cannot find brand'));
    }

    // Check if product with the same title exists
    const productExist = await Product.findOne({ title: title.toLowerCase() });
    if (productExist) {
        return next(new Error('Product with the same title already exists'));
    }

    const subprice = price - (price * (discount || 0) / 100);

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error('User does not exist'));
    }

    if (!req.files) {
        return next(new Error('Image does not exist'));
    }

    const customId = nanoid(5);
    let list = [];
    for (const file of req.files.coverImage) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `E-Commerce/category/${category}/subcategory/${subcategoryExist.customId}/products`
        });
        list.push({ secure_url, public_id });
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path);

    let slug = slugify(title, {
        replacement: "_",
        lower: true
    });

    let slugExists = await Product.findOne({ slug });
    while (slugExists) {
        slug = slugify(`${title}-${nanoid(5)}`, { replacement: "_", lower: true });
        slugExists = await Product.findOne({ slug });
    }

    const newProduct = new Product({
        title: title.toLowerCase(),
        slug: slug,
        image: { secure_url, public_id },
        stock, discount, price, subprice,category, description, brand, subCategory, coverImage: list, customId, userId: req.user._id
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
});




// // ===================================  updateProduct ================================================
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { stock, discount, price, brand, subCategory, category, description, title } = req.body
    const { id } = req.params

    // check if category  exist
    const categoryExist = await categoryModel.findOne({ _id: category })
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    // check if suCategory  exist
    const suCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category })
    if (!suCategoryExist) {
        return next(new AppError("suCategory not exist", 404))
    }
    // check if brand  exist
    const brandExist = await brandModel.findOne({ _id: brand })
    if (!brandExist) {
        return next(new AppError("brand already exist", 404))
    }
    // check if product  exist
    const product = await productModel.findOne({ _id: id, createdBy: req.user._id }) //owner
    if (!product) {
        return next(new AppError("product not exist", 404))
    }

    if (title) {
        if (title.toLowerCase() == product.title) {
            return next(new AppError("title match old tile", 409))
        }
        if (await productModel.findOne({ title: title.toLowerCase() })) {
            return next(new AppError("title already exist", 409))
        }
        product.title = title.toLowerCase()
        product.slug = slugify(title, {
            lower: true,
            replacement: "_"
        })
    }

    if (description) {
        product.description = description
    }
    if (stock) {
        product.stock = stock
    }


    if (price & discount) {
        product.subPrice = price - (price * (discount) / 100)
        product.price = price
        product.discount = discount
    } else if (price) {
        product.subPrice = price - (price * (product.discount) / 100)
        product.price = price
    } else if (discount) {
        product.subPrice = product.price - (product.price * (discount / 100))
        product.discount = discount
    }

    if (req.files) {
        if (req.files?.image?.length) {
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `EcommerceC42/categories/${categoryExist.customId}/subCategories/${suCategoryExist.customId}/products/${product.customId}/mainImage`
            })
            product.image = { secure_url, public_id }
        }

        if (req.files?.coverImages?.length) {
            await cloudinary.api.delete_resources_by_prefix(`EcommerceC42/categories/${categoryExist.customId}/subCategories/${suCategoryExist.customId}/products/${product.customId}/coverImages`)
            let list = []
            for (const file of req.files.coverImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `EcommerceC42/categories/${categoryExist.customId}/subCategories/${suCategoryExist.customId}/products/${product.customId}/coverImages`
                })
                list.push({ secure_url, public_id })
            }
            product.coverImages = list
        }
    }

    await product.save()


    res.status(200).json({ msg: "done", product })

})


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