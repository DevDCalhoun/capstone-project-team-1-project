const pino = require('pino');

// Add custom levels here:
const levels = {
    notice: 35, // Between INFO and WARN - Used for new user account logs
};

// Create a logger instance
const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    customLevels: levels,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },

});

module.exports = logger;
