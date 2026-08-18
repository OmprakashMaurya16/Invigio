
const Exam = require("../models/exam.model.js");
const ExamDuty = require("../models/examDuty.model.js");
const ExamAllocation = require("../models/examAllocation.model.js");
const User = require("../models/user.model.js");
const Notification = require("../models/notification.model.js");

const VALID_STATUSES = [
  "Draft",
  "Scheduled",
  "Ongoing",
  "Completed",
  "Cancelled",
  "Postponed",
];

const timeToMinutes = (timeStr) => {
  if (
    typeof timeStr !== "string" ||
    !/^\d{1,2}:\d{2}$/.test(timeStr)
  ) {
    return NaN;
  }

  const [hours, minutes] = timeStr.split(":").map(Number);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return NaN;
  }

  return hours * 60 + minutes;
};

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

    const missingFields = [];

    if (!subjectCode) missingFields.push("subjectCode");
    if (!subjectName) missingFields.push("subjectName");
    if (!academicYear) missingFields.push("academicYear");

    if (semester === undefined || semester === null) {
      missingFields.push("semester");
    }

    if (!branch) missingFields.push("branch");
    if (!examDate) missingFields.push("examDate");
    if (!startTime) missingFields.push("startTime");
    if (!endTime) missingFields.push("endTime");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing fields: " + missingFields.join(", "),
      });
    }

    if (!Array.isArray(branch) || branch.length === 0) {
      return res.status(400).json({
        success: false,
        message: "branch must be a non-empty array",
      });
    }

    if (
      !Number.isInteger(Number(semester)) ||
      Number(semester) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "semester must be a positive integer",
      });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid values: " +
          VALID_STATUSES.join(", "),
      });
    }

    const examStart = timeToMinutes(startTime);
    const examEnd = timeToMinutes(endTime);

    if (
      Number.isNaN(examStart) ||
      Number.isNaN(examEnd) ||
      examStart >= examEnd
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid exam time. startTime must be before endTime",
      });
    }

    const exam = await Exam.create({
      subjectCode,
      subjectName,
      academicYear,
      semester: Number(semester),
      branch,
      examDate,
      startTime,
      endTime,
      status: status || "Scheduled",
    });

    /*
     * Create one Pending duty for every professor.
     *
     * Required invigilators are decided later by
     * ExamAllocation for each classroom.
     */
    const professors = await User.find({
      role: "PROFESSOR",
    }).select("_id");

    if (professors.length > 0) {
      const duties = professors.map((professor) => ({
        examId: exam._id,
        professorId: professor._id,
        status: "Pending",
        role: "Invigilator",
      }));

      await ExamDuty.insertMany(duties);
    }

    /*
     * Create exam notifications.
     *
     * Notification failure must not break exam creation.
     */
    try {
      if (professors.length > 0) {
        const notifications = professors.map((professor) => ({
          userId: professor._id,
          title: "New Exam Scheduled",
          message:
            "A new exam has been scheduled: " +
            exam.subjectName +
            " (" +
            exam.subjectCode +
            ") on " +
            new Date(exam.examDate).toDateString() +
            " from " +
            exam.startTime +
            " to " +
            exam.endTime +
            ". Please check your duties.",
          type: "exam_created",
          relatedId: exam._id,
        }));

        await Notification.insertMany(notifications);

        const io = req.app.get("io");

        if (io) {
          professors.forEach((professor) => {
            io.emit("new_notification", {
              userId: professor._id,
              title: "New Exam Scheduled",
              message:
                "A new exam has been scheduled: " +
                exam.subjectName +
                " (" +
                exam.subjectCode +
                "). Please check your duties.",
              type: "exam_created",
              relatedId: exam._id,
            });
          });
        }
      }
    } catch (notificationError) {
      console.error(
        "Exam creation notification failed:",
        notificationError.message
      );
    }

    /*
     * Notify connected clients about the new exam.
     */
    const io = req.app.get("io");

    if (io) {
      io.emit("new_exam_schedule", exam);
    }

    return res.status(201).json({
      success: true,
      message: "Exam created successfully",
      exam,
      dutiesCreated: professors.length,
    });
  } catch (error) {
    console.error(
      "Create exam error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create exam",
    });
  }
};

const getAllExams = async (req, res) => {
  try {
    const {
      status,
      branch,
      semester,
      academicYear,
      search,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (semester) {
      const semesterNumber = Number(semester);

      if (!Number.isNaN(semesterNumber)) {
        filter.semester = semesterNumber;
      }
    }

    if (academicYear) {
      filter.academicYear = academicYear;
    }

    if (branch) {
      filter.branch = branch;
    }

    if (search) {
      filter.$or = [
        {
          subjectCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subjectName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const exams = await Exam.find(filter).sort({
      examDate: 1,
      startTime: 1,
    });

    return res.status(200).json({
      success: true,
      total: exams.length,
      exams,
    });
  } catch (error) {
    console.error(
      "Get all exams error:",
      error.message
    );

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
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    console.error(
      "Get exam by id error:",
      error.message
    );

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
        message:
          "Invalid status. Valid values: " +
          VALID_STATUSES.join(", "),
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

    if (
      semester !== undefined &&
      (
        !Number.isInteger(Number(semester)) ||
        Number(semester) < 1
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "semester must be a positive integer",
      });
    }

    const finalStartTime =
      startTime !== undefined
        ? startTime
        : exam.startTime;

    const finalEndTime =
      endTime !== undefined
        ? endTime
        : exam.endTime;

    const examStart = timeToMinutes(finalStartTime);
    const examEnd = timeToMinutes(finalEndTime);

    if (
      Number.isNaN(examStart) ||
      Number.isNaN(examEnd) ||
      examStart >= examEnd
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid exam time. startTime must be before endTime",
      });
    }

    if (subjectCode !== undefined) {
      exam.subjectCode = subjectCode;
    }

    if (subjectName !== undefined) {
      exam.subjectName = subjectName;
    }

    if (academicYear !== undefined) {
      exam.academicYear = academicYear;
    }

    if (semester !== undefined) {
      exam.semester = Number(semester);
    }

    if (branch !== undefined) {
      exam.branch = branch;
    }

    if (examDate !== undefined) {
      exam.examDate = examDate;
    }

    if (startTime !== undefined) {
      exam.startTime = startTime;
    }

    if (endTime !== undefined) {
      exam.endTime = endTime;
    }

    if (status !== undefined) {
      exam.status = status;
    }

    await exam.save();

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    console.error(
      "Update exam error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update exam",
    });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const dutyCount =
      await ExamDuty.countDocuments({
        examId: id,
      });

    const allocationCount =
      await ExamAllocation.countDocuments({
        examId: id,
      });

    if (dutyCount > 0 || allocationCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete an exam with existing duties or venue allocations. Cancel the exam instead.",
      });
    }

    await exam.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete exam error:",
      error.message
    );

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

    /*
     * Find professors with duties before changing
     * the duty statuses.
     */
    const affectedDuties = await ExamDuty.find({
      examId: exam._id,
    }).select("professorId status");

    exam.status = "Cancelled";

    await exam.save();

    /*
     * Pending duties are rejected.
     * Accepted duties are retained for history.
     */
    await ExamDuty.updateMany(
      {
        examId: exam._id,
        status: "Pending",
      },
      {
        $set: {
          status: "Rejected",
          rejectionReason: "Exam cancelled",
        },
        $unset: {
          venueId: "",
        },
      }
    );

    /*
     * Send cancellation notifications.
     */
    try {
      if (affectedDuties.length > 0) {
        const professorIds = affectedDuties.map(
          (duty) => duty.professorId
        );

        const uniqueProfessorIds = [
          ...new Map(
            professorIds.map((id) => [
              String(id),
              id,
            ])
          ).values(),
        ];

        const notifications =
          uniqueProfessorIds.map((professorId) => ({
            userId: professorId,
            title: "Exam Cancelled",
            message:
              "The exam " +
              exam.subjectName +
              " (" +
              exam.subjectCode +
              ") scheduled for " +
              new Date(exam.examDate).toDateString() +
              " has been cancelled.",
            type: "exam_cancelled",
            relatedId: exam._id,
          }));

        await Notification.insertMany(notifications);

        const io = req.app.get("io");

        if (io) {
          uniqueProfessorIds.forEach((professorId) => {
            io.emit("new_notification", {
              userId: professorId,
              title: "Exam Cancelled",
              message:
                "The exam " +
                exam.subjectName +
                " (" +
                exam.subjectCode +
                ") has been cancelled.",
              type: "exam_cancelled",
              relatedId: exam._id,
            });
          });
        }
      }
    } catch (notificationError) {
      console.error(
        "Exam cancellation notification failed:",
        notificationError.message
      );
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("exam_cancelled", {
        examId: exam._id,
        subjectCode: exam.subjectCode,
        subjectName: exam.subjectName,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam cancelled successfully",
      exam,
    });
  } catch (error) {
    console.error(
      "Cancel exam error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to cancel exam",
    });
  }
};

const volunteerForExam = async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = req.user._id;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    if (["Cancelled", "Completed"].includes(exam.status)) {
      return res.status(400).json({ success: false, message: `Cannot volunteer for a ${exam.status.toLowerCase()} exam` });
    }

    // Check if already assigned
    const existingDuty = await ExamDuty.findOne({ examId: id, professorId });
    if (existingDuty && existingDuty.status === "Accepted") {
      return res.status(400).json({ success: false, message: "You are already assigned to this exam." });
    }

    // Initialize array if undefined
    if (!exam.volunteers) exam.volunteers = [];

    // Check if already volunteered
    if (exam.volunteers.includes(professorId)) {
      return res.status(400).json({ success: false, message: "You have already volunteered for this exam." });
    }

    exam.volunteers.push(professorId);
    await exam.save();

    // Notify Admins
    try {
      const admins = await User.find({ role: "ADMIN", isActive: true }).select("_id");

      if (admins.length > 0) {
        const notifications = admins.map(admin => ({
          userId: admin._id,
          title: "New Volunteer",
          message: `Professor ${req.user.name} volunteered for ${exam.subjectName} (${exam.subjectCode}).`,
          type: "general",
          relatedId: exam._id,
          metadata: { 
            professorId: req.user._id,
            professorName: req.user.name,
            professorEmail: req.user.email,
            professorDepartment: req.user.department,
            professorPhone: req.user.phone
          }
        }));

        await Notification.insertMany(notifications);

        const io = req.app.get("io");
        if (io) {
          admins.forEach(admin => {
            io.emit("new_notification", {
              userId: admin._id,
              title: "New Volunteer",
              message: `Professor ${req.user.name} volunteered for ${exam.subjectName}.`,
              type: "general",
              relatedId: exam._id,
              metadata: { 
                professorId: req.user._id,
                professorName: req.user.name,
                professorEmail: req.user.email,
                professorDepartment: req.user.department,
                professorPhone: req.user.phone
              }
            });
          });
        }
      }
    } catch (notificationError) {
      console.error("Volunteer notification error:", notificationError.message);
    }

    return res.status(200).json({ success: true, message: "Volunteered successfully" });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }
    console.error("Volunteer error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to volunteer" });
  }
};

const assignVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const { professorId } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const professor = await User.findOne({ _id: professorId, role: "PROFESSOR" });
    if (!professor) {
      return res.status(404).json({ success: false, message: "Professor not found" });
    }

    // Create duty with Accepted status since they volunteered
    const existingDuty = await ExamDuty.findOne({ examId: id, professorId });
    if (existingDuty) {
      return res.status(400).json({ success: false, message: "Professor is already assigned." });
    }

    const newDuty = await ExamDuty.create({
      examId: id,
      professorId: professorId,
      status: "Accepted"
    });

    // Remove from volunteers array
    if (exam.volunteers) {
      exam.volunteers = exam.volunteers.filter(vol => vol.toString() !== professorId.toString());
      await exam.save();
    }

    // Notify the Professor
    try {
      await Notification.create({
        userId: professorId,
        title: "Volunteer Request Approved",
        message: `Your request to volunteer for ${exam.subjectName} has been approved!`,
        type: "duty_assigned",
        relatedId: newDuty._id
      });

      const io = req.app.get("io");
      if (io) {
        io.emit("new_notification", {
          userId: professorId,
          title: "Volunteer Request Approved",
          message: `Your request to volunteer for ${exam.subjectName} has been approved!`,
          type: "duty_assigned",
          relatedId: newDuty._id
        });
      }
    } catch (notifErr) {
      console.error("Assign volunteer notification error:", notifErr.message);
    }

    return res.status(200).json({ success: true, message: "Volunteer assigned successfully", duty: newDuty });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Invalid ID" });
    }
    console.error("Assign volunteer error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to assign volunteer" });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  cancelExam,
  volunteerForExam,
  assignVolunteer
};

