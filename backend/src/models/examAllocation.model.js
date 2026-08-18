const mongoose = require("mongoose");

const examAllocationSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam reference is required"],
      index: true,
    },

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue reference is required"],
      index: true,
    },

    requiredInvigilators: {
      type: Number,
      required: [
        true,
        "Number of required invigilators is required",
      ],
      min: [
        1,
        "At least 1 invigilator is required",
      ],
      validate: {
        validator: Number.isInteger,
        message:
          "requiredInvigilators must be a whole number",
      },
    },
  },
  {
    timestamps: true,
  },
);

/*
 * An exam cannot have the same venue allocated
 * more than once.
 *
 * This protects the database even if two requests
 * arrive at nearly the same time.
 */
examAllocationSchema.index(
  { examId: 1, venueId: 1 },
  { unique: true },
);

const ExamAllocation = mongoose.model(
  "ExamAllocation",
  examAllocationSchema,
);

module.exports = ExamAllocation;