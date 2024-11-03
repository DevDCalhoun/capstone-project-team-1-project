const mongoose = require('mongoose');

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});