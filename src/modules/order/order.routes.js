import express from "express";
import * as CC from "./order.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./order.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";
import { systemRole } from "../../../Utility/sysrole.js";

const orderRouter = express.Router();


orderRouter.post("/createorder",
    validate(CV.createOrder),
    auth('user'),
    CC.createOrder
);
orderRouter.put("/cancelOrder/:id",
    validate(CV.cancelOrder),
    auth(Object.values(systemRole)),
    CC.cancelOrder
);

orderRouter.get("/", CC.getorder);



export default orderRouter;
