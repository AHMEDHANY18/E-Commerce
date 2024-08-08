import express from "express";
import * as bc from "./brand.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./brand.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";
import { systemRole } from "../../../Utility/sysrole.js";

const brandRouter = express.Router();

brandRouter.post("/addbrand",
    multerhost(validExtension.image).single("image"),
    validate(CV.createbrand),
    auth(Object.values(systemRole)),
    bc.addbrand
);

brandRouter.put("/updatebrand/:id",
    multerhost(validExtension.image).single("image"),
    validate(CV.updatebrand),
    auth(Object.values(systemRole)),
    bc.updatebrand
);

brandRouter.delete("/deletebrand/:id",
    auth(Object.values(systemRole)),
    bc.deletebrand
);

export default brandRouter;
