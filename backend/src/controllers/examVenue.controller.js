const ExamAllocation = require("../models/examAllocation.model.js");
const Exam = require("../models/exam.model.js");
const Venue = require("../models/venue.model.js");
const ExamDuty = require("../models/examDuty.model.js");
const Notification = require("../models/notification.model.js");

const getExamVenues = async (req, res) => {
  try {
    const allocations = await ExamAllocation.find()
      .populate([
        {
          path: "examId",
          select: "subjectCode subjectName examDate startTime endTime status",
        },
        { path: "venueId", select: "block room" },
      ])
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: allocations.length,
      examVenues: allocations,
    });
  } catch (error) {
    console.error("Get exam-venues error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch exam-venue allocations",
    });
  }
};

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
      {
        path: "examId",
        select: "subjectCode subjectName examDate startTime endTime status",
      },
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
      {
        path: "examId",
        select: "subjectCode subjectName examDate startTime endTime status",
      },
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

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const generateAllocations = async (req, res) => {
  try {
    const { examId: targetExamId } = req.body;

    let exams;
    if (targetExamId) {
      const exam = await Exam.findById(targetExamId);
      if (!exam) {
        return res
          .status(404)
          .json({ success: false, message: "Exam not found" });
      }
      exams = [exam];
    } else {
      const allAllocations = await ExamAllocation.distinct("examId");
      exams = await Exam.find({
        _id: { $in: allAllocations },
        status: { $nin: ["Cancelled", "Completed"] },
      });
    }

    let totalAssigned = 0;

    const workloadAgg = await ExamDuty.aggregate([
      { $match: { status: "Accepted" } },
      { $group: { _id: "$professorId", count: { $sum: 1 } } },
    ]);
    const workloadMap = {};
    for (const entry of workloadAgg) {
      workloadMap[String(entry._id)] = entry.count;
    }

    for (const exam of exams) {
      const examAllocations = await ExamAllocation.find({ examId: exam._id });
      if (!examAllocations.length) continue;

      const candidates = await ExamDuty.find({
        examId: exam._id,
        status: "Accepted",
        $or: [{ venueId: { $exists: false } }, { venueId: null }],
      });

      if (!candidates.length) continue;

      const examDateStr = new Date(exam.examDate).toDateString();
      const examStart = timeToMinutes(exam.startTime);
      const examEnd = timeToMinutes(exam.endTime);

      const filteredCandidates = [];
      for (const duty of candidates) {
        const clashingDuties = await ExamDuty.find({
          professorId: duty.professorId,
          status: "Accepted",
          examId: { $ne: exam._id },
        }).populate({ path: "examId", select: "examDate startTime endTime" });

        let hasOverlap = false;
        for (const other of clashingDuties) {
          if (!other.examId) continue;
          const otherDateStr = new Date(other.examId.examDate).toDateString();
          if (otherDateStr !== examDateStr) continue;
          const otherStart = timeToMinutes(other.examId.startTime);
          const otherEnd = timeToMinutes(other.examId.endTime);
          if (examStart < otherEnd && examEnd > otherStart) {
            hasOverlap = true;
            break;
          }
        }

        if (!hasOverlap) filteredCandidates.push(duty);
      }

      filteredCandidates.sort((a, b) => {
        const wa = workloadMap[String(a.professorId)] || 0;
        const wb = workloadMap[String(b.professorId)] || 0;
        return wa - wb;
      });

      let candidateIndex = 0;

      for (const allocation of examAllocations) {
        const alreadyAssigned = await ExamDuty.countDocuments({
          examId: exam._id,
          venueId: allocation.venueId,
        });

        const needed = allocation.requiredInvigilators - alreadyAssigned;

        for (let i = 0; i < needed; i++) {
          if (candidateIndex >= filteredCandidates.length) break;

          const duty = filteredCandidates[candidateIndex];
          duty.venueId = allocation.venueId;
          await duty.save();

          workloadMap[String(duty.professorId)] =
            (workloadMap[String(duty.professorId)] || 0) + 1;

          await Notification.create({
            userId: duty.professorId,
            title: "Exam Duty Venue Assigned",
            message: `You have been assigned a venue for ${exam.subjectName} (${exam.subjectCode}) on ${new Date(exam.examDate).toDateString()}.`,
            type: "duty_assigned",
            relatedId: duty._id,
          });

          candidateIndex++;
          totalAssigned++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully allocated ${totalAssigned} professors to venues`,
      totalAssigned,
    });
  } catch (error) {
    console.error("Generate allocation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate allocations",
    });
  }
};

module.exports = {
  getExamVenues,
  createExamVenue,
  updateExamVenue,
  deleteExamVenue,
  generateAllocations,
};
