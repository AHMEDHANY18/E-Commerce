
import jwt from "jsonwebtoken";
import userModel from "../../db/models/user.model.js";
import dotenv from 'dotenv';

dotenv.config();

export const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.headers['token'];
            if (!token) {
                return res.status(400).json({ msg: "Token not found" });
            }

            if (!token.startsWith(process.env.TOKEN_PREFIX)) {
                return res.status(400).json({ msg: "Token not valid" });
            }

            const newToken = token.split(process.env.TOKEN_PREFIX)[1];
            const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
            if (!decoded?.id) {
                return res.status(400).json({ msg: "Invalid payload" });
            }

            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ msg: "User not found" });
            }

            if (!roles.includes(user.role)) {
                return res.status(401).json({ msg: "You do not have permission" });
            }
           if (user.passwordChangeAt && parseInt(user.passwordChangeAt.getTime() / 1000) > decoded.iat) {
                return res.status(403).json({ msg: "Token expired, please login again" });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(400).json({ msg: "Catch error", error: error.message });
        }
    };
};
