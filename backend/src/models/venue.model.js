const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    block: {
      type: String,
      required: [true, "Block or building name is required"],
      trim: true,
      uppercase: true,
    },

    room: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
      uppercase: true,
    },

    capacity: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true },
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
