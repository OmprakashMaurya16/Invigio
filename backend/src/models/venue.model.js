const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    block: {
      type: String,
      require: [true, "Block or building name is required"],
      toUpperCase: true,
    },

    room: {
      type: String,
      require: [true, "Room number is required"],
      trim: true,
      toUpperCase: true,
    },
  },
  { timestamps: true },
);

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
