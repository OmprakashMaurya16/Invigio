const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken.js");
const { sendPasswordResetOTP } = require("../utils/sendEmail.js");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Inactive user",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to Login",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, an OTP has been sent.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Inactive user account",
      });
    }

    const otp = generateOTP();

    const salt = await bcryptjs.genSalt(10);
    const hashedOTP = await bcryptjs.hash(otp, salt);

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
    user.resetPasswordOTPVerified = false;

    await user.save();

    await sendPasswordResetOTP(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your registered email address",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to process request. Please try again later.",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordOTPVerified",
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP requested. Please request a new one.",
      });
    }

    if (user.resetPasswordOTPExpiry < new Date()) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      user.resetPasswordOTPVerified = false;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    const isOTPValid = await bcryptjs.compare(otp, user.resetPasswordOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.resetPasswordOTPVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You may now reset your password.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await User.findOne({ email }).select(
      "+password +resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordOTPVerified",
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    if (!user.resetPasswordOTPVerified) {
      return res.status(403).json({
        success: false,
        message: "OTP not verified. Please verify your OTP first.",
      });
    }

    if (
      !user.resetPasswordOTPExpiry ||
      user.resetPasswordOTPExpiry < new Date()
    ) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpiry = undefined;
      user.resetPasswordOTPVerified = false;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "OTP session expired. Please start over.",
      });
    }

    user.password = newPassword;

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordOTPVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
