import jwt from 'jsonwebtoken';
import User, { userRoles } from '../database/models/user.model';
import httpStatus from 'http-status';
import AppError from '../utils/customError';

const defaultAllowedRoles = [userRoles.user];

const verifyToken = (token, key) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SEC_KEY);
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

const useAuth =
  (allowedRoles = defaultAllowedRoles) =>
  async (req, res, next) => {
    // read the cookie from the request
    const token = req.cookies[process.env.JWT_Cookie_Name];

    // check if token exist
    if (!token) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, please login first');
    // verify the token

    const [err, { id, iat }] = verifyToken(token, process.env.JWT_SEC_KEY);
    if (err) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, please login first');

    const user = await User.findById(id);

    if (!user) {
      res.clearCookie(process.env.JWT_Cookie_Name);
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, please login first');
    }

    if (user.hasPasswordChangedAfterToken(iat)) {
      res.clearCookie(process.env.JWT_Cookie_Name);
      throw new AppError(httpStatus.UNAUTHORIZED, 'User has recently changed password, Pleas login again');
    }

    // skip this if super admin
    if (userRoles.superAdmin != user.role) {
      const isRoleValid = allowedRoles.find((x) => user.role == x);

      if (!isRoleValid) throw new AppError(httpStatus.FORBIDDEN, `Forbidden, you don't have access to this resource`);
    }

    req.user = user;
    next();
  };

export default useAuth;
