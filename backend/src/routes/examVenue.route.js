const express = require("express");
const {
  getExamVenues,
  createExamVenue,
  updateExamVenue,
  deleteExamVenue,
  generateAllocations,
} = require("../controllers/examVenue.controller.js");
const {
  protect,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/", getExamVenues);
router.post("/", createExamVenue);
router.post("/generate", generateAllocations);
router.patch("/:id", updateExamVenue);
router.delete("/:id", deleteExamVenue);

module.exports = router;
