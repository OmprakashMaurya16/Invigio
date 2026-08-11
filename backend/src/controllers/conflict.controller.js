const ConflictReport = require("../models/conflictReport.model.js");
const ExamDuty = require("../models/examDuty.model.js");
const Notification = require("../models/notification.model.js");
const User = require("../models/user.model.js");

const createConflict = async (req, res) => {
  try {
    const { examDutyId, type, description } = req.body;

    if (!examDutyId || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "examDutyId, type, and description are required",
      });
    }

    const duty = await ExamDuty.findOne({
      _id: examDutyId,
      professorId: req.user._id,
    });

    if (!duty) {
      return res.status(404).json({
        success: false,
        message: "Exam duty not found or does not belong to you",
      });
    }

    const conflict = await ConflictReport.create({
      professorId: req.user._id,
      examDutyId,
      examId: duty.examId,
      type,
      description,
    });

    const admins = await User.find({ role: "ADMIN", isActive: true }).select("_id");

    const notifications = admins.map((admin) => ({
      userId: admin._id,
      title: "New Conflict Report",
      message: `A conflict has been reported by ${req.user.name || req.user.email}: ${type}`,
      type: "conflict_reported",
      relatedId: conflict._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      success: true,
      message: "Conflict report submitted successfully",
      conflict,
    });
  } catch (error) {
    console.error("Create conflict error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to submit conflict report",
    });
  }
};

const getAllConflicts = async (req, res) => {
  try {
    const conflicts = await ConflictReport.find()
      .populate({ path: "professorId", select: "name email department" })
      .populate({ path: "examDutyId" })
      .populate({ path: "examId", select: "subjectCode subjectName examDate" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: conflicts.length,
      conflicts,
    });
  } catch (error) {
    console.error("Get all conflicts error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch conflict reports",
    });
  }
};

const getMyConflicts = async (req, res) => {
  try {
    const conflicts = await ConflictReport.find({ professorId: req.user._id })
      .populate({ path: "examDutyId" })
      .populate({ path: "examId", select: "subjectCode subjectName examDate startTime endTime" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: conflicts.length,
      conflicts,
    });
  } catch (error) {
    console.error("Get my conflicts error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch your conflict reports",
    });
  }
};

const resolveConflict = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required",
      });
    }

    const conflict = await ConflictReport.findById(id);

    if (!conflict) {
      return res.status(404).json({
        success: false,
        message: "Conflict report not found",
      });
    }

    conflict.status = status;
    if (adminNotes !== undefined) conflict.adminNotes = adminNotes;
    conflict.resolvedBy = req.user._id;
    conflict.resolvedAt = new Date();

    await conflict.save();

    await Notification.create({
      userId: conflict.professorId,
      title: "Conflict Report Updated",
      message: `Your conflict report has been ${status.toLowerCase()} by an admin.`,
      type: "conflict_resolved",
      relatedId: conflict._id,
    });

    return res.status(200).json({
      success: true,
      message: "Conflict report updated successfully",
      conflict,
    });
  } catch (error) {
    console.error("Resolve conflict error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update conflict report",
    });
  }
};

module.exports = {
  createConflict,
  getAllConflicts,
  getMyConflicts,
  resolveConflict,
};
