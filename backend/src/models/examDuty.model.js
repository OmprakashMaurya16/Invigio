const mongoose = require("mongoose");

const examDutySchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam reference is required"],
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Professor reference is required"],
    },
    role: {
      type: String,
      default: "Invigilator",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ExamDuty = mongoose.model("ExamDuty", examDutySchema);

module.exports = ExamDuty;
