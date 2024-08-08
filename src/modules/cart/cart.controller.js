import cartModel from "../../../db/models/cart.model.js"; // Ensure this matches the export in the model file
import productModel from "../../../db/models/product.model.js"; // Ensure this is correct
import {asyncHandler} from "../../middelware/asyncHandler.js";
import { AppError } from "../../../Utility/classErrors.js";
//////////////////////////////////////////////////////////////
// Add cart
export const createCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
 const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } })
    if (!product) {
        return next(new AppError("product not found or out of stock", 404))
    }

    const cartExist = await cartModel.findOne({ user: req.user._id })
    if (!cartExist) {
        const cart = await cartModel.create({
            user: req.user._id,
            products: [{ productId, quantity }]
        })
        return res.status(201).json({ msg: "done", cart })
    }

    let flag = false
    for (const product of cartExist.products) {
        if (productId == product.productID) {
            product.quantity = quantity
            flag = true
            break;
        }
    }

    if (!flag) {
        cartExist.products.push({ productId, quantity })
    }

    await cartExist.save()
    res.status(201).json({ msg: "done", cart: cartExist })

})

/////////////////////////////////////////////////////////////////////////
// Update cart
export const removecart = asyncHandler(async (req, res, next) => {
    const { productID } = req.body;

    // Find the user's cart and update it by removing the specified product
    const updatedCart = await Cart.findOneAndUpdate(
        {
            userId: req.user._id,
            "products.productID": productID
        },
        {
            $pull: { products: { productID } }
        },
        {
            new: true
        }
    );

    if (!updatedCart) {
        return next(new AppError('Cart not found or product not in cart'));
    }

    return res.status(200).json({ message: 'Product removed successfully', cart: updatedCart });
});



export const clearcart = asyncHandler(async (req, res, next) => {
    const cartExist = await Cart.findOneAndUpdate(req.user._id,
        {
            products: []
        },
        {
            new: true
        }
    );

    if (!cartExist) {
        return next(new AppError('Cart not found'));
    }

    return res.status(200).json({ message: 'Cart cleared successfully', cart: cartExist });
});


//////////////////////////////////////////////////////////////////////////////////////
// Delete cart
export const deletecart = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const cart = await cart.findOne({ _id: id, userId: req.user._id });
    if (!cart) {
        return next(new AppError('cart not found or you do not have permission'));
    }
    await cart.deleteOne({ _id: id });
    res.status(200).json({ message: 'cart deleted successfully' });
});
/////////////////////////////////////////////////////////////////////////////////
