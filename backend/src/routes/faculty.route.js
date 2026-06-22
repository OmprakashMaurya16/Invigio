const express = require("express");
const {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/faculty.controller.js");
const {
  protect,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.post("/", createFaculty);
router.get("/", getAllFaculty);
router.get("/:id", getFacultyById);
router.patch("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);

module.exports = router;
