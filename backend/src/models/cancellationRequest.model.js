const mongoose = require("mongoose");

const cancellationRequestSchema = new mongoose.Schema(
  {
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    allocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamAllocation",
      default: null,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CancellationRequest = mongoose.model(
  "CancellationRequest",
  cancellationRequestSchema,
);

module.exports = CancellationRequest;
