const express = require("express");
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  cancelExam,
} = require("../controllers/exam.controller.js");
const {
  protect,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.post("/", createExam);
router.get("/", getAllExams);
router.get("/:id", getExamById);
router.patch("/:id", updateExam);
router.delete("/:id", deleteExam);
router.patch("/:id/cancel", cancelExam);

module.exports = router;
