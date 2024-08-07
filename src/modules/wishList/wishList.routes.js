import express from "express";
import * as CC from "./wishList.controller.js";
import * as CV from "./wishList.validation.js";
import { validate } from "../../middelware/validation.js";
import { systemRole } from "../../../Utility/sysrole.js";
import { auth } from "../../middelware/auth.js";

const wishListRouter = express.Router({ mergeParams: true });


wishListRouter.post("/",
    validate(CV.createWishList),
    auth(Object.values(systemRole)),
    CC.createWishList);



export default wishListRouter;
