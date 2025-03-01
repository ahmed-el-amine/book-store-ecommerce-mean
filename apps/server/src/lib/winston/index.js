import winston from 'winston';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(), // Adds timestamp
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: 'info', // Default level: logs info, warn, error
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/app.log', level: 'info' }), // Logs all info+ messages
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs only errors
  ],
});

// If not in production, log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: logFormat }));
}

export default logger;
