import express from "express";
import * as RC from "./review.controller.js";
import * as RV from "./review.validation.js";
import { validate } from "../../middelware/validation.js";
import { auth } from "../../middelware/auth.js";
import { systemRole } from "../../../Utility/sysrole.js";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.post("/",
    validate(RV.createReview),
    auth(Object.values(systemRole)),
    RC.createReview
);

reviewRouter.delete("/deleteReview/:id",
    validate(RV.deleteReview),
    auth(Object.values(systemRole)),
    RC.deleteReview);









export default reviewRouter;
