require("dotenv").config({ quiet: true });

const connectDB = require("../config/db.js");
const User = require("../models/user.model.js");

const ADMIN_USER = {
  name: "Abhishek Wali",
  email: "mauryaompraksh2005@gmail.com",
  password: "Admin@1234",
  role: "ADMIN",
  phone: "9888888888",
};

const main = async () => {
  await connectDB();

  const existing = await User.findOne({ email: ADMIN_USER.email });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  const admin = await User.create(ADMIN_USER);

  console.log("Admin created successfully:");
  console.log({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  process.exit(0);
};

main().catch((error) => {
  console.error("Failed to create admin:", error.message);
  process.exit(1);
});
