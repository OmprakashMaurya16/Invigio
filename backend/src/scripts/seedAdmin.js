require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const connectDB = require("../config/db");
const User = require("../models/user.model");

const users = [
  {
    name: "Admin User",
    email: "admin@invigio.com",
    password: "Admin@1234",
    role: "ADMIN",
    phone: "9000000001",
    department: "CMPN",
    isActive: true,
  },
  {
    name: "Prof. John Doe",
    email: "john.doe@invigio.com",
    password: "Prof@1234",
    role: "PROFESSOR",
    phone: "9000000002",
    department: "INFT",
    isActive: true,
  },
];

const seedUsers = async () => {
  await connectDB();

  for (const userData of users) {
    try {
      const existing = await User.findOne({ email: userData.email });

      if (existing) {
        console.log(`⚠️  User already exists: ${existing.email} (${existing.role})`);
        continue;
      }

      const user = await User.create(userData);
      const label = user.role === "ADMIN" ? "✅ Admin" : "🎓 Professor";
      console.log(`${label} user created successfully!`);
      console.log("────────────────────────────────────");
      console.log(`   Name     : ${user.name}`);
      console.log(`   Email    : ${user.email}`);
      console.log(`   Role     : ${user.role}`);
      console.log(`   Dept     : ${user.department}`);
      console.log(`   Phone    : ${user.phone}`);
      console.log(`   Password : ${userData.password}  (change after first login)`);
      console.log("────────────────────────────────────");
    } catch (err) {
      console.error(`❌ Error creating user (${userData.email}):`, err.message);
    }
  }

  process.exit(0);
};

seedUsers();
