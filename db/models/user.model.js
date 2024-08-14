import pkg from 'joi';
const { object } = pkg;
import { Schema, model } from 'mongoose';
import { systemRole } from '../../Utility/sysrole.js';


const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryEmail: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    confirmed: { type: Boolean, default: false },
    passwordChangeAt: { type: Date },
    role: {
        type: String,
        enum: Object.values(systemRole),
        default: systemRole.user
    },
    addresses: [{
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true }
    }]
}, { timestamps: true });

const User = model('User', userSchema);
export default User;

