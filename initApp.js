import dotenv from 'dotenv';
import connectionDB from './db/connectionDB.js';
import * as router from './src/modules/index.routes.js';
import deleteFromCloudinary from "./Utility/deleteFromCloudinary.js"
import deleteFromDB from "./Utility/deleteFromDB.js"
import { GlobalErrorHandler } from './src/middelware/asyncHandler.js';
import cors from "cors"
dotenv.config();

export const initApp = (app, express) => {
    const port = process.env.PORT || 3001;
    app.use(cors())
    app.get('/', (req, res) => {
        res.json({msg: "server is run"})
    })

    // Connect to the database
    connectionDB();

    // Middleware to parse JSON
    app.use(express.json())

    // Set up routes
    app.use('/user', router.UserRouter);
    app.use('/category', router.categoryRouter);
    app.use('/subcategory', router.subcategory);
    app.use('/brand', router.brandRouter);
    app.use('/product', router.productRouter);
    app.use('/coupon', router.couponRouter);
    app.use('/cart', router.cartRouter);
    app.use('/order', router.orderRouter);
    app.use('/review', router.reviewRouter);
    app.use('/wishList', router.wishListRouter);

    // Handle invalid requests
    app.use('*', (req, res, next) => {
        const err = new Error(`Invalid request ${req.originalUrl}`);
        next(err);
    });

    //GlobalErrorHandler
    app.use(GlobalErrorHandler, deleteFromCloudinary, deleteFromDB)
    // Start the server
    app.listen(port, () => console.log(`Server listening on port ${port}!`));
};

