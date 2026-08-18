require("dotenv").config({ path: "d:/Projects/Invigio/Invigio/backend/.env" });
const mongoose = require("mongoose");
const Notification = require("./src/models/notification.model.js");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:56782/"); // wait, it's memory server, so I don't know the port.
}
