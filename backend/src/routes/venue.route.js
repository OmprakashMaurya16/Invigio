const express = require("express");
const {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
} = require("../controllers/venue.controller.js");
const {
  protect,
  authorizeRoles,
} = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.post("/", createVenue);
router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.patch("/:id", updateVenue);
router.delete("/:id", deleteVenue);

module.exports = router;
