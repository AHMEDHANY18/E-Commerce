import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    stock: { type: Number, required: true },
    subprice: {
        type: Number,
        defualt: 1
    },
    discount: { type: Number },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    coverImages: [
        {
            secure_url: { type: String },
            public_id: { type: String }
        }
    ],
    customId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     rateAvg: {
        type: Number,
        default: 0
    },
    rateNum: {
        type: Number,
        default: 0
    },


});

const Product = mongoose.model('Product', productSchema);
export default Product;
