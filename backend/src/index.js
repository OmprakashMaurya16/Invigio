require("dotenv").config({ path: "../.env", quiet: true });

const app = require("./app.js");
const connectDB = require("./config/db.js");

const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/user.model.js");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(
    "New client connected:",
    socket.id,
  );

  socket.on("disconnect", () => {
    console.log(
      "Client disconnected:",
      socket.id,
    );
  });
});

const seedDefaultUsers = async () => {
  try {
    const adminExists = await User.findOne({
      email: "admin@invigio.com",
    });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@invigio.com",
        password: "password123",
        role: "ADMIN",
        phone: "9876543210",
      });

      console.log(
        "Default Admin account created.",
      );
    }

    const professorExists = await User.findOne({
      email: "professor@invigio.com",
    });

    if (!professorExists) {
      await User.create({
        name: "Professor",
        email: "professor@invigio.com",
        password: "password123",
        role: "PROFESSOR",
        phone: "9876543211",
        department: "INFT",
      });

      console.log(
        "Default Professor account created.",
      );
    }
  } catch (error) {
    console.error(
      "Default user seeding failed:",
      error.message,
    );
  }
};

connectDB()
  .then(async () => {
    await seedDefaultUsers();

    server.listen(PORT, () => {
      console.log(
        `Server is running on port http://localhost:${PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error(
      "Failed to connect to the database:",
      error.message,
    );

    process.exit(1);
  });