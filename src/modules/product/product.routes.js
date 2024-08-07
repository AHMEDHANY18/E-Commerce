import express from "express";
import * as PC from "./product.controller.js";
import { auth } from "../../middelware/auth.js";
import reviewRouter from "../review/review.routes.js"
import wishListRouter from "../wishList/wishList.routes.js"
import { validate } from "../../middelware/validation.js";
import * as PV from "./product.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";

const productRouter = express.Router();

productRouter.use("/:productId/reviews", reviewRouter);
productRouter.use("/:productId/wishList", wishListRouter)

////////////////////////////////////////////////////////////////////////////////////
productRouter.post("/addProduct",
    multerhost(validExtension.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverImage", maxCount: 3 }
    ]),
    validate(PV.createProduct),
    auth('user'),
    PC.createProduct
);
// ///////////////////////////////////////////////////////////////
// productRouter.put("/:id",
//     multerhost(validExtension.image).fields([
//         { name: "image", maxCount: 1 },
//         { name: "coverImages", maxCount: 3 },
//     ]),
//     validate(PV.updateProduct),
//     auth('user'),
//     PC.updateProduct);
// ////////////////////////////////////////////////////////////////

productRouter.get("/", PC.getProducts);






export default productRouter;
