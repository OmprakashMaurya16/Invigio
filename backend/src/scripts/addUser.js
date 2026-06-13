require("dotenv").config({ quiet: true });

const connectDB = require("../config/db.js");
const User = require("../models/user.model.js");

const [email, password, role] = process.argv.slice(2);

const validRoles = ["SUPER_ADMIN", "ADMIN", "PROFESSOR"];

const main = async () => {
  if (!email || !password) {
    console.error("Usage: npm run seed:user -- <email> <password> [role]");
    process.exit(1);
  }

  if (role && !validRoles.includes(role)) {
    console.error(`Invalid role. Use one of: ${validRoles.join(", ")}`);
    process.exit(1);
  }

  await connectDB();

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    console.error("A user with that email already exists.");
    process.exit(1);
  }

  const user = await User.create({
    email,
    password,
    role: role || "PROFESSOR",
  });

  console.log("User created successfully:", {
    id: user._id,
    email: user.email,
    role: user.role,
  });

  process.exit(0);
};

main().catch((error) => {
  console.error("Failed to create user:", error.message);
  process.exit(1);
});
