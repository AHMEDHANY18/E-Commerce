import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 3,
        maxLength: 30,
        lowercase: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String,
        minLength: 3,
        maxLength: 30,
        trim: true,
        unique: true
    },
    image: {
        secure_url: String,
        public_id: String // Ensure consistent casing here
    },
    customid:String
}, { timestamps: true });

const Category = model('Category', categorySchema);

export default Category;
