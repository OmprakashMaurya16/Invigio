const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Use an in-memory DB if no URI is provided or if it's localhost
    if (!uri || uri.includes("localhost") || uri.includes("127.0.0.1")) {
      try {
        console.log("Starting in-memory MongoDB server on port 27027...");
        const mongoServer = await MongoMemoryServer.create({ instance: { port: 27027 } });
        uri = mongoServer.getUri();
        console.log("In-memory MongoDB started at:", uri);
      } catch (err) {
        // If it fails to start, it's likely because the port is already in use by the running backend server
        console.log("In-memory MongoDB is likely already running. Connecting to it...");
        uri = "mongodb://127.0.0.1:27027/";
      }
    }

    await mongoose.connect(uri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
