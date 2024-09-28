const { MongoClient } = require('mongodb');

// Function to log messages to MongoDB
async function mongoTransport(logObject) {
  const uri = process.env.DB_URL || 'mongodb://localhost:27017/disruptutorDB'; // Use your existing DB URL
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('disruptutorDB'); // Use the existing database
    const collection = database.collection('logs'); // Store logs in a 'logs' collection

    // Insert the log object into the logs collection
    await collection.insertOne(logObject);
  } catch (err) {
    console.error('Error writing log to MongoDB:', err);
  } finally {
    await client.close();
  }
}

module.exports = mongoTransport;
