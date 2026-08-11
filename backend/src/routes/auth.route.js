const {
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/auth.controller.js");
const express = require("express");

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
