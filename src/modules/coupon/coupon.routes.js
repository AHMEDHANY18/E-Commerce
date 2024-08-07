import express from "express";
import * as CC from "./coupon.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./coupon.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";

const couponRouter = express.Router();


couponRouter.post("/addcoupon",
    validate(CV.createCoupon),  // Ensure validation middleware is active
    auth('user'),
    CC.addCoupon
);


couponRouter.put('/updatecoupon/:id', auth(), validate(CV.updateCoupon), CC.updateCoupon);

couponRouter.delete("/deletecoupon/:id",
    auth(),
    CC.deletecoupon
);

couponRouter.get("/getCategories",
    auth(),
    CC.getCategories
);

couponRouter.get("/getcouponById/:id",
    auth(),
    CC.getcouponById
);

couponRouter.get("/filterwithname",
    auth(),
    CC.filterwithname
);

export default couponRouter;
