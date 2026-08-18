const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    morningOnly: {
      type: Boolean,
      default: false,
    },
    afternoonOnly: {
      type: Boolean,
      default: false,
    },
    weekendOnly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
