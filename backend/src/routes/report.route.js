const express = require("express");
const {
  getDutySummary,
  getExamSummary,
  getConflictSummary,
} = require("../controllers/report.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.get("/duties", getDutySummary);
router.get("/exams", getExamSummary);
router.get("/conflicts", getConflictSummary);

module.exports = router;
