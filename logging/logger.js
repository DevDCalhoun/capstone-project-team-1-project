const pino = require('pino');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Create a logger instance with pino-pretty transport for non-production
const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // Default log level
  base: { pid: false },                   // Optionally remove PID from logs
  timestamp: pino.stdTimeFunctions.isoTime // Add ISO timestamp to logs
}, isDevelopment
    ? pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,                // Adds colors to logs
          translateTime: 'SYS:standard', // Adds timestamps in a readable format
          ignore: 'pid,hostname',        // Removes unnecessary fields
          levelFirst: true               // Display log level first
        }
      })
    : undefined // For production, no transport is added, and logs are JSON
);

module.exports = logger;
