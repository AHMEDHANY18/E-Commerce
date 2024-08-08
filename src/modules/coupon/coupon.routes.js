import express from "express";
import * as CC from "./coupon.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./coupon.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";
import { systemRole } from "../../../Utility/sysrole.js";

const couponRouter = express.Router();


couponRouter.post("/addcoupon",
    validate(CV.createCoupon),
    auth(Object.values(systemRole)),
    CC.addCoupon
);
couponRouter.put('/updatecoupon/:id',auth(Object.values(systemRole)),validate(CV.updateCoupon), CC.updateCoupon);
couponRouter.delete("/deletecoupon/:id",
    auth(Object.values(systemRole)),
    CC.deletecoupon
);


export default couponRouter;
