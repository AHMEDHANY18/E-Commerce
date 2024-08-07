import express from "express";
import * as SCC from "./subcategory.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as CV from "./subcategory.validation.js";
import { multerhost, validExtension } from "../../middelware/multer.js";

const subcategoryRouter = express.Router({ mergeParams: true });

subcategoryRouter.post("/addsubCategory",
    multerhost(validExtension.image).single("image"),
    validate(CV.createsubcategory),
    auth('user'),
    SCC.addsubCategory
);

subcategoryRouter.put("/updatesubCategory/:id",
    multerhost(validExtension.image).single("image"),
    validate(CV.updatesubcategory),
    auth(),
    SCC.updatesubCategory
);

subcategoryRouter.get("/getSubcategory",
    auth(),
    SCC.getSubCategory
);

export default subcategoryRouter;
