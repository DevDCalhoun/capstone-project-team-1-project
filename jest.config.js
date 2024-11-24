module.exports = {
  preset: '@shelf/jest-mongodb',    // Enables MongoDB in-memory testing
  testEnvironment: 'node',
  testMatch: ["<rootDir>/test/**/*.test.js"],  
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Ensures custom setup after environment setup
  "collectCoverage": true,
  "coverageReporters" : [
    "html",
    "text"
  ],
  "coverageDirectory": "docs/coverage",
};