const express = require("express");
const { getAttendanceSummary } = require("../controllers/attendance.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);
router.get("/summary", authorizeRoles("ADMIN"), getAttendanceSummary);

module.exports = router;
