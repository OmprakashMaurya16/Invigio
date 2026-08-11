const ExamDuty = require("../models/examDuty.model.js");
const Exam = require("../models/exam.model.js");

const getMyDuties = async (req, res) => {
  try {
    const duties = await ExamDuty.find({ professorId: req.user._id })
      .populate("examId")
      .populate("venueId", "block room")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, duties });
  } catch (error) {
    console.error("Get duties error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch duties" });
  }
};

const respondToDuty = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    if (status === "Rejected" && (!reason || reason.trim() === "")) {
      return res.status(400).json({ success: false, message: "A reason is required when rejecting a duty" });
    }

    const duty = await ExamDuty.findOne({ _id: id, professorId: req.user._id }).populate("examId");
    
    if (!duty) {
      return res.status(404).json({ success: false, message: "Duty not found or unauthorized" });
    }

    if (duty.status !== "Pending") {
      return res.status(400).json({ success: false, message: "Duty has already been responded to" });
    }

    duty.status = status;
    if (status === "Rejected") {
      duty.rejectionReason = reason;
    }
    
    await duty.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("duty_status_update", { 
        dutyId: duty._id, 
        status: duty.status, 
        examId: duty.examId._id,
        professorId: req.user._id
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Duty ${status.toLowerCase()} successfully`, 
      duty 
    });
  } catch (error) {
    console.error("Respond duty error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to respond to duty" });
  }
};

module.exports = { getMyDuties, respondToDuty };
