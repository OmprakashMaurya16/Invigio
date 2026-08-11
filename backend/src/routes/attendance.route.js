const express = require("express");
const {
  getAttendance,
  markAttendance,
  getMyAttendance,
} = require("../controllers/attendance.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);

router.get("/", authorizeRoles("ADMIN"), getAttendance);
router.post("/", authorizeRoles("ADMIN"), markAttendance);
router.get("/my", authorizeRoles("PROFESSOR"), getMyAttendance);

module.exports = router;
