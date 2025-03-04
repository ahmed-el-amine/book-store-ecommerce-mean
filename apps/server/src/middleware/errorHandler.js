import logger from '../lib/winston/index.js';
import AppError from '../utils/customError.js';
import httpStatus from 'http-status';

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(httpStatus.BAD_REQUEST, message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicated field value: ${value}. Please use another value!`;

  return new AppError(httpStatus.BAD_REQUEST, message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(httpStatus.BAD_REQUEST, message);
};

const sentErroDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sentErroProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    logger.error('ERROR: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};
/**
 * Global error handling controller
 */
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const logMessage = `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;

  if (err.statusCode >= 500) {
    logger.error(logMessage);
    logger.error(err.stack);
  } else if (err.statusCode >= 400) {
    logger.warn(logMessage);
  } else {
    logger.info(logMessage);
  }
  if (process.env.NODE_ENV === 'development') {
    sentErroDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sentErroProd(error, res);
  }
};
