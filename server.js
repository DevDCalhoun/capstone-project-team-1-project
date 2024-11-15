const app = require('./app');
const port = process.env.PORT || 3000; // Default port is 3000, or set via environment

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

const logger = require('./logging/logger');
logger.info('Testing pino logging');