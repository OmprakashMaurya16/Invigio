const express = require("express");
const { getMyDuties, respondToDuty } = require("../controllers/duty.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);

router.get("/my-duties", authorizeRoles("PROFESSOR"), getMyDuties);
router.patch("/:id/respond", authorizeRoles("PROFESSOR"), respondToDuty);

module.exports = router;
