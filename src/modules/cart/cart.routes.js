import express from "express";
import * as CC from "./cart.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./cart.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";
import { systemRole } from "../../../Utility/sysrole.js";

const cartRouter = express.Router();


cartRouter.post("/createCart",
    // validate(CV.createcart),
    auth(Object.values(systemRole)),
    CC.createCart
);



export default cartRouter;
