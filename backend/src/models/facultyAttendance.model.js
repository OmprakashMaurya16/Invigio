const mongoose = require("mongoose");

const facultyAttendanceSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Faculty reference is required"],
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    session: {
      type: String,
      required: [true, "Session is required"],
      enum: ["Morning", "Afternoon", "Evening", "Full Day"],
      default: "Morning",
    },

    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent", "On Leave", "Late", "Excused"],
      default: "Present",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const FacultyAttendance = mongoose.model(
  "FacultyAttendance",
  facultyAttendanceSchema,
);

module.exports = FacultyAttendance;
