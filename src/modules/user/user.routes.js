import { Router } from "express";
const router = Router();
import * as UC from "./user.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as UV from "./userValidation.js";
import { systemRole } from "../../../Utility/sysrole.js";

// User authentication routes
router.post("/signup", validate(UV.signupValidation), UC.signup);
router.post("/signin", validate(UV.signinValidation), UC.signin);

// User management routes
router.get("/", auth(Object.values(systemRole)), UC.getAllUsers);
router.post("/confirm", UC.confirmEmail);

// Password management routes
router.post("/requestPasswordReset", validate(UV.requestPasswordResetValidation), UC.requestPasswordReset);
router.patch('/updatePassword', auth(Object.values(systemRole)), validate(UV.updatePasswordValidation), UC.updatePassword);
router.post("/resetPassword", validate(UV.resetPasswordValidation), UC.resetPassword);

// Address management routes
router.patch('/updateAddress', auth(Object.values(systemRole)), validate(UV.updateAddressValidation), UC.updateAddress);
router.delete('/deleteAddress', auth(Object.values(systemRole)), validate(UV.deleteAddressValidation), UC.deleteAddress);

export default router;
