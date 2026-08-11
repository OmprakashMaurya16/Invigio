const FacultyAttendance = require("../models/facultyAttendance.model.js");

const getAttendance = async (req, res) => {
  try {
    const { facultyId, date, status } = req.query;

    const filter = {};

    if (facultyId) filter.facultyId = facultyId;
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const records = await FacultyAttendance.find(filter)
      .populate({ path: "facultyId", select: "name email department" })
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      total: records.length,
      attendance: records,
    });
  } catch (error) {
    console.error("Get attendance error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch attendance records",
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { facultyId, date, session, status, remarks } = req.body;

    if (!facultyId || !date || !session || !status) {
      return res.status(400).json({
        success: false,
        message: "facultyId, date, session, and status are required",
      });
    }

    const record = await FacultyAttendance.findOneAndUpdate(
      { facultyId, date: new Date(date), session },
      { status, remarks: remarks || "" },
      { new: true, upsert: true, runValidators: true }
    ).populate({ path: "facultyId", select: "name email department" });

    return res.status(200).json({
      success: true,
      message: "Attendance recorded successfully",
      attendance: record,
    });
  } catch (error) {
    console.error("Mark attendance error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to record attendance",
    });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const records = await FacultyAttendance.find({ facultyId: req.user._id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      total: records.length,
      attendance: records,
    });
  } catch (error) {
    console.error("Get my attendance error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch your attendance records",
    });
  }
};

module.exports = {
  getAttendance,
  markAttendance,
  getMyAttendance,
};
