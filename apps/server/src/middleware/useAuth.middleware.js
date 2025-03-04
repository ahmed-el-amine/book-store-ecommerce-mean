import jwt from 'jsonwebtoken';
import User, { userRoles } from '../database/models/user.model';
import httpStatus from 'http-status';
import AppError from '../utils/customError';

const defaultAllowedRoles = [userRoles.user];

const useAuth =
  (allowedRoles = defaultAllowedRoles) =>
  async (req, res, next) => {
    // read the cookie from the request
    const token = req.cookies[process.env.JWT_Cookie_Name];

    // check if token exist
    if (!token) throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, please login first');
    // verify the token
    try {
      const { id, iat } = jwt.verify(token, process.env.JWT_SEC_KEY);

      const user = await User.findById(id);

      if (!user) {
        res.clearCookie(process.env.JWT_Cookie_Name);
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized, please login first');
      }

      if (user.hasPasswordChangedAfterToken(iat)) {
        res.clearCookie(process.env.JWT_Cookie_Name);
        throw new AppError(httpStatus.UNAUTHORIZED, 'User has recently changed password, Pleas login again');
      }

      const isRoleValid = allowedRoles.find((x) => user.role == x);

      if (!isRoleValid) throw new AppError(httpStatus.FORBIDDEN, `Forbidden, you don't have access to this resource`);

      req.user = user;
      next();
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, `Unauthorized, please login first`);
    }
  };

export default useAuth;
