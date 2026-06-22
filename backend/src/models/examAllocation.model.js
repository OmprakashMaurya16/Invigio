const mongoose = require("mongoose");

const examAllocationSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam reference is required"],
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue reference is required"],
    },

    requiredInvigilators: {
      type: Number,
      required: [true, "Number of required invigilators is required"],
      min: [1, "At least 1 invigilator is required"],
    },
  },
  {
    timestamps: true,
  },
);

const ExamAllocation = mongoose.model("ExamAllocation", examAllocationSchema);

module.exports = ExamAllocation;
