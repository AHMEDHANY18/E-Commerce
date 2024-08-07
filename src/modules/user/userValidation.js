import Joi from 'joi';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

// Signup validation
export const signupValidation = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.base': 'Email should be a type of text',
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().pattern(passwordRegex).required().messages({
        'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
        'any.required': 'Password is required'
    }),
    recoveryEmail: Joi.string().email({ tlds: { allow: false } }).optional().messages({
        'string.email': 'Recovery email must be a valid email'
    })
});
// Signin validation
export const signinValidation = Joi.object({
    email: Joi.string().email().optional(),
    recoveryEmail: Joi.string().email().optional(),
    mobileNumber: Joi.string().pattern(/^01[0-2,5][0-9]{8}$/).optional(),
    password: Joi.string().required()
});

// Update account validation
export const updateAccountValidation = Joi.object({
    email: Joi.string().email().optional(),
    recoveryEmail: Joi.string().email().optional(),
    mobileNumber: Joi.string().pattern(/^01[0-2,5][0-9]{8}$/).optional(),
    DOB: Joi.date().iso().optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    firstName: Joi.string().min(1).max(50).optional(),
});

export const updatePasswordValidation = Joi.object({
    currentPassword: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$')),
    newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$'))
});
////////////////////////////////////////////////////////////////
//requset password
export const requestPasswordResetValidation = Joi.object({
    email: Joi.string().email().required()
});
///////////////////////////////////////////////////////////////
//reser password
export const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().integer().min(100000).max(999999).required(),
    newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$')),
    newPassword: Joi.string()
});