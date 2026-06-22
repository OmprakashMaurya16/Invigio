const Exam = require("../models/exam.model.js");

const VALID_STATUSES = [
  "Draft",
  "Scheduled",
  "Ongoing",
  "Completed",
  "Cancelled",
  "Postponed",
];

const createExam = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      academicYear,
      semester,
      branch,
      examDate,
      startTime,
      endTime,
      status,
    } = req.body;

    if (
      !subjectCode ||
      !subjectName ||
      !academicYear ||
      !semester ||
      !branch ||
      !examDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "subjectCode, subjectName, academicYear, semester, branch, examDate, startTime and endTime are required",
      });
    }

    if (!Array.isArray(branch) || branch.length === 0) {
      return res.status(400).json({
        success: false,
        message: "branch must be a non-empty array",
      });
    }

    const exam = await Exam.create({
      subjectCode,
      subjectName,
      academicYear,
      semester,
      branch,
      examDate,
      startTime,
      endTime,
      status: status || "Scheduled",
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    console.error("Create exam error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create exam",
    });
  }
};

const getAllExams = async (req, res) => {
  try {
    const { status, branch, semester, academicYear, search } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (semester) filter.semester = Number(semester);
    if (academicYear) filter.academicYear = academicYear;
    if (branch) filter.branch = { $in: [branch] };

    if (search) {
      filter.$or = [
        { subjectCode: { $regex: search, $options: "i" } },
        { subjectName: { $regex: search, $options: "i" } },
      ];
    }

    const exams = await Exam.find(filter).sort({ examDate: 1, startTime: 1 });

    return res.status(200).json({
      success: true,
      total: exams.length,
      exams,
    });
  } catch (error) {
    console.error("Get all exams error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch exams",
    });
  }
};

const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.status(200).json({
      success: true,
      exam,
    });
  } catch (error) {
    console.error("Get exam by id error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch exam",
    });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subjectCode,
      subjectName,
      academicYear,
      semester,
      branch,
      examDate,
      startTime,
      endTime,
      status,
    } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (exam.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a cancelled exam",
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${VALID_STATUSES.join(", ")}`,
      });
    }

    if (
      branch !== undefined &&
      (!Array.isArray(branch) || branch.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "branch must be a non-empty array",
      });
    }

    if (subjectCode !== undefined) exam.subjectCode = subjectCode;
    if (subjectName !== undefined) exam.subjectName = subjectName;
    if (academicYear !== undefined) exam.academicYear = academicYear;
    if (semester !== undefined) exam.semester = semester;
    if (branch !== undefined) exam.branch = branch;
    if (examDate !== undefined) exam.examDate = examDate;
    if (startTime !== undefined) exam.startTime = startTime;
    if (endTime !== undefined) exam.endTime = endTime;
    if (status !== undefined) exam.status = status;

    await exam.save();

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    console.error("Update exam error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update exam",
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("Delete exam error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete exam",
    });
  }
};

const cancelExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (exam.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Exam is already cancelled",
      });
    }

    if (exam.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed exam",
      });
    }

    exam.status = "Cancelled";
    await exam.save();

    return res.status(200).json({
      success: true,
      message: "Exam cancelled successfully",
      exam,
    });
  } catch (error) {
    console.error("Cancel exam error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to cancel exam",
    });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  cancelExam,
};
