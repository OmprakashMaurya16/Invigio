const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user.model");

const DEFAULT_PASSWORD = "password123";

const users = [
  {
    name: "System Administrator",
    email: "admin@invigio.com",
    password: DEFAULT_PASSWORD,
    role: "ADMIN",
    phone: "9000000001",
    department: "CMPN",
  },
  {
    name: "Prof. Aditi Sharma",
    email: "aditi.sharma@invigio.com",
    password: DEFAULT_PASSWORD,
    role: "PROFESSOR",
    phone: "9000000002",
    department: "INFT",
  },
  {
    name: "Prof. Rahul Mehta",
    email: "rahul.mehta@invigio.com",
    password: DEFAULT_PASSWORD,
    role: "PROFESSOR",
    phone: "9000000003",
    department: "CMPN",
  },
  {
    name: "Prof. Neha Patel",
    email: "neha.patel@invigio.com",
    password: DEFAULT_PASSWORD,
    role: "PROFESSOR",
    phone: "9000000004",
    department: "EXTC",
  },
  {
    name: "Prof. Vikram Singh",
    email: "vikram.singh@invigio.com",
    password: DEFAULT_PASSWORD,
    role: "PROFESSOR",
    phone: "9000000005",
    department: "BIOMD",
  },
];

const seedDemoUsers = async () => {
  await connectDB();

  let created = 0;

  for (const userData of users) {
    const existingUser = await User.findOne({
      email: userData.email,
    });

    if (existingUser) {
      console.log(`Skipped existing user: ${userData.email}`);
      continue;
    }

    await User.create({
      ...userData,
      isActive: true,
    });

    created += 1;

    console.log(
      `Created ${userData.role.toLowerCase()}: ${userData.email}`,
    );
  }

  console.log(`Finished. ${created} user(s) created.`);
  console.log(
    `Default password for newly created accounts: ${DEFAULT_PASSWORD}`,
  );
};

seedDemoUsers()
  .catch((error) => {
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });