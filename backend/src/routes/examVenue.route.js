const express = require("express");
const {
  createExamVenue,
  updateExamVenue,
  deleteExamVenue,
} = require("../controllers/examVenue.controller.js");
const {
  protect,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.post("/", createExamVenue);
router.patch("/:id", updateExamVenue);
router.delete("/:id", deleteExamVenue);

module.exports = router;
