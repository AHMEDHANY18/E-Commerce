import express from "express";
import * as SCC from "./subcategory.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./subcategory.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";
import { systemRole } from "../../../Utility/sysrole.js";

const subcategoryRouter = express.Router({ mergeParams: true });

subcategoryRouter.post("/addsubCategory",
    multerhost(validExtension.image).single("image"),
    validate(CV.createsubcategory),
    auth(Object.values(systemRole)),
    SCC.addsubCategory
);

subcategoryRouter.put("/updatesubCategory/:id",
    multerhost(validExtension.image).single("image"),
    validate(CV.updatesubcategory),
    auth(Object.values(systemRole)),
    SCC.updatesubCategory
);

subcategoryRouter.get("/getSubcategory",
    auth(Object.values(systemRole)),
    SCC.getSubCategory
);

export default subcategoryRouter;
