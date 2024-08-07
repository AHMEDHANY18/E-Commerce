import express from "express";
import * as bc from "./brand.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./brand.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";

const brandRouter = express.Router();

brandRouter.post("/addbrand",
    multerhost(validExtension.image).single("image"),
    validate(CV.createbrand),
    auth('user'),
    bc.addbrand
);

brandRouter.put("/updatebrand/:id",
    multerhost(validExtension.image).single("image"),
    validate(CV.updatebrand),
    auth(),
    bc.updatebrand
);

brandRouter.delete("/deletebrand/:id",
    auth(),
    bc.deletebrand
);

brandRouter.get("/getCategories",
    auth(),
    bc.getCategories
);

brandRouter.get("/getbrandById/:id",
    auth(),
    bc.getbrandById
);

brandRouter.get("/filterwithname",
    auth(),
    bc.filterwithname
);

export default brandRouter;
