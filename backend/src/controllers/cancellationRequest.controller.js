const CancellationRequest = require("../models/cancellationRequest.model.js");
const Exam = require("../models/exam.model.js");
const ExamAllocation = require("../models/examAllocation.model.js");

const createCancellationRequest = async (req, res) => {
  try {
    const { examId, allocationId, reason, details } = req.body;

    if (!examId || !reason) {
      return res.status(400).json({
        success: false,
        message: "examId and reason are required",
      });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (allocationId) {
      const allocation = await ExamAllocation.findById(allocationId);
      if (!allocation) {
        return res.status(404).json({
          success: false,
          message: "Allocation not found",
        });
      }
    }

    const request = await CancellationRequest.create({
      professorId: req.user._id,
      examId,
      allocationId: allocationId || null,
      reason,
      details: details || "",
    });

    return res.status(201).json({
      success: true,
      message: "Cancellation request submitted",
      request,
    });
  } catch (error) {
    console.error("Create cancellation request error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to submit cancellation request",
    });
  }
};

const getMyCancellationRequests = async (req, res) => {
  try {
    const requests = await CancellationRequest.find({ professorId: req.user._id })
      .populate({ path: "examId", select: "subjectCode subjectName examDate startTime endTime status" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get cancellation requests error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch cancellation requests",
    });
  }
};

module.exports = {
  createCancellationRequest,
  getMyCancellationRequests,
};
