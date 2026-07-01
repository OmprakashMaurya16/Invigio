const {
  register,
  login,
  forgotPassword,
  verifyOTP,
  getMyAvailability,
  updateMyAvailability,
  resetPassword,
} = require("../controllers/auth.controller.js");
const express = require("express");
const { protect } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.get("/me/availability", protect, getMyAvailability);
router.patch("/me/availability", protect, updateMyAvailability);
router.post("/reset-password", resetPassword);

module.exports = router;
