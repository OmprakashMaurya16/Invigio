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
      enum: ["Invigilator"],
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
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * One professor can have only ONE duty record
 * for a particular exam.
 *
 * This prevents:
 *
 * Exam A + Professor X
 * Exam A + Professor X
 * Exam A + Professor X
 *
 * from being created accidentally.
 */
examDutySchema.index(
  {
    examId: 1,
    professorId: 1,
  },
  {
    unique: true,
  },
);

const ExamDuty = mongoose.model(
  "ExamDuty",
  examDutySchema,
);

module.exports = ExamDuty;