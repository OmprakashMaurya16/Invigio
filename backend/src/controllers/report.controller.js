const Exam = require("../models/exam.model.js");
const User = require("../models/user.model.js");
const Venue = require("../models/venue.model.js");
const ExamAllocation = require("../models/examAllocation.model.js");

const getReportsSummary = async (req, res) => {
  try {
    const [exams, faculty, venues, allocations] = await Promise.all([
      Exam.find({}).lean(),
      User.find({ role: "PROFESSOR" }).lean(),
      Venue.find({}).lean(),
      ExamAllocation.find({}).lean(),
    ]);

    const totalExams = exams.length;
    const scheduledExams = exams.filter((exam) => exam.status === "Scheduled").length;
    const completedExams = exams.filter((exam) => exam.status === "Completed").length;
    const cancelledExams = exams.filter((exam) => exam.status === "Cancelled").length;
    const activeFaculty = faculty.filter((person) => person.isActive).length;
    const totalVenues = venues.length;
    const allocationCount = allocations.length;
    const allocatedExamIds = new Set(allocations.map((allocation) => String(allocation.examId)));
    const examsWithAllocations = allocatedExamIds.size;

    return res.status(200).json({
      success: true,
      summary: {
        totalExams,
        scheduledExams,
        completedExams,
        cancelledExams,
        activeFaculty,
        totalVenues,
        allocationCount,
        examsWithAllocations,
        utilizationRate: totalExams > 0 ? Math.round((allocationCount / totalExams) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Get reports summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch reports summary",
    });
  }
};

module.exports = { getReportsSummary };
