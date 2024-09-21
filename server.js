const app = require('./app'); // Import the app instance
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

const logger = require('./logging/logger');
logger.info('Testing pino logging');
