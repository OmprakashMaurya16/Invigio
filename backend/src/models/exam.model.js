const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
      uppercase: true,
    },

    subjectName: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
    },

    branch: {
      type: [String],
      required: [true, "At least one branch is required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "You must specify at least one branch.",
      },
    },

    examDate: {
      type: Date,
      required: [true, "Exam date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
      trim: true,
    },

    endTime: {
      type: String,
      required: [true, "End time is required"],
      trim: true,
    },

    requiredInvigilators: {
      type: Number,
      required: [true, "Number of required invigilators is required"],
      min: [1, "Must require at least 1 invigilator"],
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Draft",
        "Scheduled",
        "Ongoing",
        "Completed",
        "Cancelled",
        "Postponed",
      ],
      default: "Scheduled",
    },
  },
  { timestamps: true },
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
