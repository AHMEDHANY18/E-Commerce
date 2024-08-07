import UserRouter from "./user/user.routes.js";
import categoryRouter from "./category/category.routes.js";
import subcategory from "./subcategory/subcategory.routes.js";
import brandRouter from "./brand/brand.routes.js";
import productRouter from "./product/product.routes.js";  // Corrected typo here
import couponRouter from "./coupon/coupon.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import reviewRouter from "./review/review.routes.js";
import wishListRouter from "./wishList/wishList.routes.js";

export {
    UserRouter,
    categoryRouter,
    brandRouter,
    subcategory,
    productRouter,
    couponRouter,
    cartRouter,
    orderRouter,
    reviewRouter,
    wishListRouter,
};
