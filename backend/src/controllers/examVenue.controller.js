const ExamAllocation = require("../models/examAllocation.model.js");
const Exam = require("../models/exam.model.js");
const Venue = require("../models/venue.model.js");

const createExamVenue = async (req, res) => {
  try {
    const { examId, venueId, requiredInvigilators } = req.body;

    if (!examId || !venueId || !requiredInvigilators) {
      return res.status(400).json({
        success: false,
        message: "examId, venueId and requiredInvigilators are required",
      });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (exam.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign a venue to a cancelled exam",
      });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const duplicate = await ExamAllocation.findOne({ examId, venueId });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This venue is already assigned to this exam",
      });
    }

    const allocation = await ExamAllocation.create({
      examId,
      venueId,
      requiredInvigilators,
    });

    await allocation.populate([
      { path: "examId", select: "subjectCode subjectName examDate startTime endTime status" },
      { path: "venueId", select: "block room" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Venue assigned to exam successfully",
      examVenue: allocation,
    });
  } catch (error) {
    console.error("Create exam-venue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to assign venue to exam",
    });
  }
};

const updateExamVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { venueId, requiredInvigilators } = req.body;

    const allocation = await ExamAllocation.findById(id);
    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Exam-venue allocation not found",
      });
    }

    if (venueId && venueId !== String(allocation.venueId)) {
      const venue = await Venue.findById(venueId);
      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      const duplicate = await ExamAllocation.findOne({
        examId: allocation.examId,
        venueId,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "This venue is already assigned to this exam",
        });
      }

      allocation.venueId = venueId;
    }

    if (requiredInvigilators !== undefined) {
      allocation.requiredInvigilators = requiredInvigilators;
    }

    await allocation.save();

    await allocation.populate([
      { path: "examId", select: "subjectCode subjectName examDate startTime endTime status" },
      { path: "venueId", select: "block room" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Exam-venue allocation updated successfully",
      examVenue: allocation,
    });
  } catch (error) {
    console.error("Update exam-venue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update exam-venue allocation",
    });
  }
};

const deleteExamVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await ExamAllocation.findByIdAndDelete(id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Exam-venue allocation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam-venue allocation removed successfully",
    });
  } catch (error) {
    console.error("Delete exam-venue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to remove exam-venue allocation",
    });
  }
};

module.exports = {
  createExamVenue,
  updateExamVenue,
  deleteExamVenue,
};
