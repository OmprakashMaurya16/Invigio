const express = require("express");
const { getReportsSummary } = require("../controllers/report.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);
router.get("/summary", authorizeRoles("ADMIN"), getReportsSummary);

module.exports = router;
