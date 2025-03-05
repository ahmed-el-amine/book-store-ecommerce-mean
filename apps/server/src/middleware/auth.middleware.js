import jwt from "jsonwebtoken";
import User from '../database/models/user.model.js';
import AppError from '../utils/customError.js';
import { promisify } from 'util'

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.auth_token
    if (!token) {
        return next(new AppError("You are not logged in", 401))
    }




    const tokenPayload = await promisify(jwt.verify)(token, process.env.JWT_SEC_KEY, { algorithms: ['HS256'] });

    const currUser = await User.findById(tokenPayload.id)
    if (!currUser) {
        return next(new AppError("The user that is belong to the current token no longer exists", 401))
    }

    if (currUser.hasPasswordChangedAfterToken(tokenPayload.iat)) {
        return next(new AppError("User has recently changed password, Pleas login again", 401))
    }


    req.user = currUser;
    next();
}

export default authMiddleware;