import express from "express";
import * as CC from "./category.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./category.validation.js";
import subcategoryRouter from "./../subcategory/subcategory.routes.js"; // Correct import
import { multerhost, validExtension } from "../../middelware/multer.js";

const categoryRouter = express.Router({caseSensitive: true});

// Merge the params to subcategoryRouter
categoryRouter.use('/:categoryID/subcategory', subcategoryRouter);

categoryRouter.post("/addCategory",
    multerhost(validExtension.image).single("image"),
    auth('user'),
    CC.addCategory
);

categoryRouter.put("/updateCategory/:id",
    multerhost(validExtension.image).single("image"),
    validate(CV.updateCategory),
    auth('user'),
    CC.updateCategory
);
// categoryRouter.get("/getCategories",
//     auth(),
//     CC.getCategories
// );
categoryRouter.delete("/deleteCategory/:id",
    auth(),
    CC.deleteCategory
);
export default categoryRouter;
