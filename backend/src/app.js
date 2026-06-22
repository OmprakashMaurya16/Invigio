const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const authRoutes = require("./routes/auth.route.js");

app.use("/api/user", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All Good! Backend is running.",
  });
});

module.exports = app;
