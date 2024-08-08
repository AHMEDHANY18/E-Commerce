import express from "express";
import * as CC from "./category.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./category.validation.js";
import subcategoryRouter from "./../subcategory/subcategory.routes.js"; // Correct import
import { multerhost, validExtension } from "../../middelware/multer.js";
import { systemRole } from "../../../Utility/sysrole.js";

const categoryRouter = express.Router({caseSensitive: true});

// Merge the params to subcategoryRouter
categoryRouter.use('/:categoryID/subcategory', subcategoryRouter);

categoryRouter.post("/",
    multerhost(validExtension.image).single("image"),
    auth(Object.values(systemRole)),
    CC.addCategory
);

categoryRouter.put("/updateCategory/:id",
    multerhost(validExtension.image).single("image"),
    validate(CV.updateCategory),
    auth(Object.values(systemRole)),
    CC.updateCategory
);

categoryRouter.delete("/deleteCategory/:id",
    auth(Object.values(systemRole)),
    CC.deleteCategory
);

categoryRouter.get("/",
    CC.getCategories
);
export default categoryRouter;
