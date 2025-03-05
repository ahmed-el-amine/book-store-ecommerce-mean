import jwt from 'jsonwebtoken';
import AppError from '../../utils/customError';

export const authorizeAdmin = (req, res, next) => {
  try {
    const token = req.cookies[process.env.JWT_Cookie_Name];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SEC_KEY);
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'forbidden' });
    }
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: `Invalid token access denied,${error.message}` });
  }
};
