require("dotenv").config({ quiet: true });
const app = require("./app.js");
const connectDB = require("./config/db.js");

const PORT = process.env.PORT || 5000;

const User = require("./models/user.model.js");

connectDB()
  .then(async () => {
    try {
      // Auto-seed default users
      const adminExists = await User.findOne({ email: "admin@invigio.com" });
      if (!adminExists) {
        await User.create({ name: 'Admin', email: 'admin@invigio.com', password: 'password123', role: 'ADMIN', phone: '9876543210' });
        await User.create({ name: 'Professor', email: 'professor@invigio.com', password: 'password123', role: 'PROFESSOR', phone: '9876543211', department: 'INFT' });
        console.log("Database seeded with default Admin and Professor accounts.");
      }
    } catch (e) {
      console.error("Seeding failed:", e);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  });
