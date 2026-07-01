const express = require("express");
const { getNotifications } = require("../controllers/notification.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);
router.get("/", authorizeRoles("ADMIN", "PROFESSOR"), getNotifications);

module.exports = router;
