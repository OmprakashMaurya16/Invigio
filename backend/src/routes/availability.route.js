const express = require("express");
const {
  getMyAvailability,
  saveAvailability,
  getAllAvailability,
} = require("../controllers/availability.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);

router.get("/my", authorizeRoles("PROFESSOR"), getMyAvailability);
router.post("/", authorizeRoles("PROFESSOR"), saveAvailability);
router.get("/", authorizeRoles("ADMIN"), getAllAvailability);

module.exports = router;
