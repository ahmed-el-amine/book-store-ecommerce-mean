import logger from '../lib/winston/index.js';

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

  if (process.env.NODE_ENV === 'production') {
    res.status(err.statusCode).json({
      status: err.status,
      message:
        err.statusCode >= 500
          ? 'Something went wrong on the server'
          : err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
};
