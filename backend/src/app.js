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
const facultyRoutes = require("./routes/faculty.route.js");
const venueRoutes = require("./routes/venue.route.js");
const examRoutes = require("./routes/exam.route.js");
const examVenueRoutes = require("./routes/examVenue.route.js");

app.use("/api/user", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exam-venues", examVenueRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All Good! Backend is running.",
  });
});

module.exports = app;
