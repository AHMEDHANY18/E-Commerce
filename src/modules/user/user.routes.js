import { Router } from "express";
const router = Router();
import * as UC from "./user.controller.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as UV from "./userValidation.js";

/**
 * User registration/signup
 */
router.post("/signup", validate(UV.signupValidation), UC.signup);

/**
 * User login/signin
 */
router.post("/signin", validate(UV.signinValidation), UC.signin);

/**
 * Get authenticated user's account details
 */
router.get("/getacc", auth(), UC.getAcc);

/**
 * Request a password reset (e.g., for forgotten password)
 */
router.post("/requestPasswordReset", validate(UV.requestPasswordResetValidation), UC.requestPasswordReset);

/**
 * Update user password (for Company_HR role)
 */
router.patch('/updatePassword', auth(), validate(UV.updatePasswordValidation), UC.updatePassword);

/**
 * Reset user password using a token from the password reset request
 */
router.post("/resetPassword", validate(UV.resetPasswordValidation), UC.resetPassword);

/**
 * Confirm email address (e.g., after registration or email change)
 */
router.post("/confirm", UC.confirmEmail);

export default router;
