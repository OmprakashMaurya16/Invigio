require("dotenv").config({ quiet: true });

const connectDB = require("../config/db.js");
const User = require("../models/user.model.js");

const DUMMY_USER = {
  name: "Omprakash Maurya",
  email: "mauryaomprakash2005@gmail.com",
  password: "12345678",
  role: "PROFESSOR",
  phone: "9999999999",
};

const main = async () => {
  await connectDB();

  const existing = await User.findOne({ email: DUMMY_USER.email });
  if (existing) {
    console.log("✓ Dummy user already exists:", existing.email);
    process.exit(0);
  }

  const user = await User.create(DUMMY_USER);

  console.log("✓ Dummy user created successfully:");
  console.log({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  process.exit(0);
};

main().catch((error) => {
  console.error("✗ Failed to create dummy user:", error.message);
  process.exit(1);
});
