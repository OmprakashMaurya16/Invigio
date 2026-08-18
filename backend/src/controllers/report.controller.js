const ExamDuty = require("../models/examDuty.model.js");
const Exam = require("../models/exam.model.js");
const ConflictReport = require("../models/conflictReport.model.js");
const mongoose = require("mongoose");

const getDutySummary = async (req, res) => {
  try {
    const summary = await ExamDuty.aggregate([
      {
        $group: {
          _id: "$professorId",
          total: { $sum: 1 },
          accepted: { $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "professor",
        },
      },
      { $unwind: "$professor" },
      {
        $project: {
          _id: 0,
          professorId: "$_id",
          name: "$professor.name",
          email: "$professor.email",
          department: "$professor.department",
          total: 1,
          accepted: 1,
          rejected: 1,
          pending: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      total: summary.length,
      summary,
    });
  } catch (error) {
    console.error("Duty summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate duty summary",
    });
  }
};

const getExamSummary = async (req, res) => {
  try {
    const summary = await Exam.aggregate([
      {
        $lookup: {
          from: "examduties",
          localField: "_id",
          foreignField: "examId",
          as: "duties",
        },
      },
      {
        $lookup: {
          from: "examallocations",
          localField: "_id",
          foreignField: "examId",
          as: "allocations",
        },
      },
      {
        $project: {
          subjectName: 1,
          subjectCode: 1,
          examDate: 1,
          status: 1,
          totalDuties: { $size: "$duties" },
          acceptedDuties: {
            $size: {
              $filter: {
                input: "$duties",
                as: "d",
                cond: { $eq: ["$$d.status", "Accepted"] },
              },
            },
          },
          assignedVenues: { $size: "$allocations" },
        },
      },
      { $sort: { examDate: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      total: summary.length,
      summary,
    });
  } catch (error) {
    console.error("Exam summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate exam summary",
    });
  }
};

const getConflictSummary = async (req, res) => {
  try {
    const [totals] = await ConflictReport.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          underReview: { $sum: { $cond: [{ $eq: ["$status", "Under Review"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
          dismissed: { $sum: { $cond: [{ $eq: ["$status", "Dismissed"] }, 1, 0] } },
          doubleBooking: { $sum: { $cond: [{ $eq: ["$type", "Double Booking"] }, 1, 0] } },
          scheduleClash: { $sum: { $cond: [{ $eq: ["$type", "Schedule Clash"] }, 1, 0] } },
          personalEmergency: { $sum: { $cond: [{ $eq: ["$type", "Personal Emergency"] }, 1, 0] } },
          other: { $sum: { $cond: [{ $eq: ["$type", "Other"] }, 1, 0] } },
        },
      },
    ]);

    const result = totals || {
      total: 0,
      pending: 0,
      underReview: 0,
      resolved: 0,
      dismissed: 0,
      doubleBooking: 0,
      scheduleClash: 0,
      personalEmergency: 0,
      other: 0,
    };

    return res.status(200).json({
      success: true,
      summary: {
        total: result.total,
        byStatus: {
          pending: result.pending,
          underReview: result.underReview,
          resolved: result.resolved,
          dismissed: result.dismissed,
        },
        byType: {
          doubleBooking: result.doubleBooking,
          scheduleClash: result.scheduleClash,
          personalEmergency: result.personalEmergency,
          other: result.other,
        },
      },
    });
  } catch (error) {
    console.error("Conflict summary error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate conflict summary",
    });
  }
};

module.exports = {
  getDutySummary,
  getExamSummary,
  getConflictSummary,
};
