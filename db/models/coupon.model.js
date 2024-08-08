import { Schema, model } from 'mongoose';

const couponSchema = new Schema({
    code: {
        type: String,
        minLength: 3,
        maxLength: 30,
        lowercase: true,
        trim: true,
        required: true 
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        min: 1,
        max: 100,
        required: true
    },
    usedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Coupon = model('Coupon', couponSchema);

export default Coupon;
