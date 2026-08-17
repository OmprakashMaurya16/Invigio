
const ExamDuty = require("../models/examDuty.model.js");
const Exam = require("../models/exam.model.js");
const Notification = require("../models/notification.model.js");
const User = require("../models/user.model.js");

const getMyDuties = async (req, res) => {
  try {
    const duties = await ExamDuty.find({
      professorId: req.user._id,
    })
      .populate("examId")
      .populate("venueId", "block room capacity")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: duties.length,
      duties,
    });
  } catch (error) {
    console.error(
      "Get duties error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch duties",
    });
  }
};

const respondToDuty = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    /*
     * Validate duty response status.
     */
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be either Accepted or Rejected",
      });
    }

    /*
     * Rejection reason is mandatory.
     */
    if (
      status === "Rejected" &&
      (!reason || reason.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A reason is required when rejecting a duty",
      });
    }

    /*
     * Find the duty belonging to the logged-in professor.
     *
     * populate("examId") is important because the
     * notification needs exam subject/code.
     */
    const duty = await ExamDuty.findOne({
      _id: id,
      professorId: req.user._id,
    }).populate("examId");

    if (!duty) {
      return res.status(404).json({
        success: false,
        message:
          "Duty not found or unauthorized",
      });
    }

    /*
     * A duty can only be responded to once.
     */
    if (duty.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Duty has already been responded to",
      });
    }

    /*
     * Make sure the associated exam exists.
     */
    if (!duty.examId) {
      return res.status(404).json({
        success: false,
        message:
          "Associated exam not found",
      });
    }

    /*
     * Professors cannot respond to cancelled
     * or completed exams.
     */
    if (
      ["Cancelled", "Completed"].includes(
        duty.examId.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot respond to a ${duty.examId.status.toLowerCase()} exam duty`,
      });
    }

    /*
     * Update duty status.
     */
    duty.status = status;

    if (status === "Rejected") {
      duty.rejectionReason = reason.trim();

      /*
       * A rejected professor must not retain
       * a venue assignment.
       */
      duty.venueId = undefined;
    }

    if (status === "Accepted") {
      /*
       * Clear any old rejection reason.
       */
      duty.rejectionReason = "";
    }

    await duty.save();

    /*
     * --------------------------------------------------
     * ADMIN NOTIFICATION
     * --------------------------------------------------
     *
     * Notify all active admins when a professor
     * accepts or rejects an exam duty.
     *
     * Notification failure must NOT break the
     * actual duty response.
     */
    try {
      const admins = await User.find({
        role: "ADMIN",
        isActive: true,
      }).select("_id");

      if (admins.length > 0) {
        const notifications = admins.map((admin) => ({
          userId: admin._id,

          title:
            status === "Accepted"
              ? "Duty Accepted"
              : "Duty Rejected",

          message:
            status === "Accepted"
              ? `A professor has accepted the invigilation duty for ${duty.examId.subjectName} (${duty.examId.subjectCode}).`
              : `A professor has rejected the invigilation duty for ${duty.examId.subjectName} (${duty.examId.subjectCode}). Reason: ${reason.trim()}`,

          type:
            status === "Accepted"
              ? "duty_accepted"
              : "duty_rejected",

          relatedId: duty._id,
        }));

        /*
         * Save notifications in MongoDB.
         */
        await Notification.insertMany(
          notifications,
        );

        /*
         * Send real-time notifications through Socket.IO.
         */
        const io = req.app.get("io");

        if (io) {
          admins.forEach((admin) => {
            io.emit("new_notification", {
              userId: admin._id,

              title:
                status === "Accepted"
                  ? "Duty Accepted"
                  : "Duty Rejected",

              message:
                status === "Accepted"
                  ? `A professor has accepted the duty for ${duty.examId.subjectName}.`
                  : `A professor has rejected the duty for ${duty.examId.subjectName}.`,

              type:
                status === "Accepted"
                  ? "duty_accepted"
                  : "duty_rejected",

              relatedId: duty._id,
            });
          });
        }
      }
    } catch (notificationError) {
      console.error(
        "Duty response notification failed:",
        notificationError.message,
      );
    }

    /*
     * Existing Socket.IO duty status event.
     */
    const io = req.app.get("io");

    if (io) {
      io.emit("duty_status_update", {
        dutyId: duty._id,
        status: duty.status,
        examId: duty.examId._id,
        professorId: req.user._id,
      });
    }

    /*
     * Return successful response.
     */
    return res.status(200).json({
      success: true,
      message:
        status === "Accepted"
          ? "Duty accepted successfully"
          : "Duty rejected successfully",
      duty,
    });
  } catch (error) {
    console.error(
      "Respond duty error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to respond to duty",
    });
  }
};

module.exports = {
  getMyDuties,
  respondToDuty,
};

