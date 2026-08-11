const express = require("express");
const {
  createConflict,
  getAllConflicts,
  getMyConflicts,
  resolveConflict,
} = require("../controllers/conflict.controller.js");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);

router.post("/", authorizeRoles("PROFESSOR"), createConflict);
router.get("/", authorizeRoles("ADMIN"), getAllConflicts);
router.get("/my", authorizeRoles("PROFESSOR"), getMyConflicts);
router.patch("/:id/resolve", authorizeRoles("ADMIN"), resolveConflict);

module.exports = router;
