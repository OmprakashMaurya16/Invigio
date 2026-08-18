const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("In-Memory MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;