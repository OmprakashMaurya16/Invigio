const mongoose = require("mongoose");

const conflictReportSchema = new mongoose.Schema(
  {
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examDutyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamDuty",
      required: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    type: {
      type: String,
      enum: ["Double Booking", "Schedule Clash", "Personal Emergency", "Other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Resolved", "Dismissed"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ConflictReport = mongoose.model("ConflictReport", conflictReportSchema);

module.exports = ConflictReport;
