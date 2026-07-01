const Exam = require("../models/exam.model.js");
const FacultyAttendance = require("../models/facultyAttendance.model.js");

const getAttendanceSummary = async (req, res) => {
  try {
    const exams = await Exam.find({}).sort({ examDate: 1, startTime: 1 }).lean();

    const attendanceRows = await Promise.all(
      exams.map(async (exam) => {
        const startOfDay = new Date(exam.examDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(exam.examDate);
        endOfDay.setHours(23, 59, 59, 999);

        const records = await FacultyAttendance.find({
          date: { $gte: startOfDay, $lte: endOfDay },
        }).lean();

        const registered = records.length || exam.requiredInvigilators || 0;
        const present = records.filter((record) => ["Present", "Late", "Excused"].includes(record.status)).length;
        const absent = Math.max(registered - present, 0);
        const percentage = registered > 0 ? ((present / registered) * 100).toFixed(1) : "0.0";

        return {
          id: exam._id,
          exam: `${exam.subjectName || "Exam"}${exam.subjectCode ? ` (${exam.subjectCode})` : ""}`,
          date: new Date(exam.examDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          registered,
          present,
          absent,
          percentage: `${percentage}%`,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      attendance: attendanceRows,
    });
  } catch (error) {
    console.error("Get attendance summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch attendance summary",
    });
  }
};

module.exports = { getAttendanceSummary };
