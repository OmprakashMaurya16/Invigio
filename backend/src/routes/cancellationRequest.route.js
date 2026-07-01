const express = require("express");
const {
  createCancellationRequest,
  getMyCancellationRequests,
} = require("../controllers/cancellationRequest.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect);
router.post("/", createCancellationRequest);
router.get("/", getMyCancellationRequests);

module.exports = router;
