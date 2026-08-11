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

router.use(protect);

router.post("/", authorizeRoles("ADMIN"), createExam);
router.get("/", authorizeRoles("ADMIN", "PROFESSOR"), getAllExams);
router.get("/:id", authorizeRoles("ADMIN", "PROFESSOR"), getExamById);
router.patch("/:id", authorizeRoles("ADMIN"), updateExam);
router.delete("/:id", authorizeRoles("ADMIN"), deleteExam);
router.patch("/:id/cancel", authorizeRoles("ADMIN"), cancelExam);

module.exports = router;
