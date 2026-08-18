const express = require("express");
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
