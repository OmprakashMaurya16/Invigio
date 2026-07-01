const Exam = require("../models/exam.model.js");
const CancellationRequest = require("../models/cancellationRequest.model.js");

const formatTimeLabel = (date) => {
  if (!date) return "Recently updated";

  const targetTime = new Date(date).getTime();
  const diffMs = Date.now() - targetTime;
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getNotifications = async (req, res) => {
  try {
    const notifications = [];
    const now = new Date();

    const scheduledExams = await Exam.find({
      status: "Scheduled",
      examDate: { $gte: now },
    })
      .sort({ examDate: 1, startTime: 1 })
      .limit(3);

    if (req.user.role === "ADMIN") {
      scheduledExams.forEach((exam) => {
        notifications.push({
          id: `exam-${exam._id}`,
          type: "Assignment",
          title: "Upcoming exam scheduled",
          message: `${exam.subjectName} is scheduled for ${new Date(exam.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${exam.startTime}.`,
          time: formatTimeLabel(exam.examDate),
          createdAt: exam.examDate,
        });
      });

      const pendingRequests = await CancellationRequest.find({ status: "Pending" })
        .populate("professorId", "name")
        .populate("examId", "subjectName")
        .sort({ createdAt: -1 })
        .limit(3);

      pendingRequests.forEach((request) => {
        notifications.push({
          id: `cancellation-${request._id}`,
          type: "Conflict Alert",
          title: "Cancellation request pending",
          message: `${request.professorId?.name || "A professor"} requested cancellation for ${request.examId?.subjectName || "an exam"}.`,
          time: formatTimeLabel(request.createdAt),
          createdAt: request.createdAt,
        });
      });
    } else {
      scheduledExams.forEach((exam) => {
        notifications.push({
          id: `duty-${exam._id}`,
          type: "Assignment",
          title: "Upcoming duty reminder",
          message: `You have an upcoming invigilation duty for ${exam.subjectName} on ${new Date(exam.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
          time: formatTimeLabel(exam.examDate),
          createdAt: exam.examDate,
        });
      });

      const myRequests = await CancellationRequest.find({ professorId: req.user._id })
        .populate("examId", "subjectName")
        .sort({ createdAt: -1 })
        .limit(3);

      myRequests.forEach((request) => {
        notifications.push({
          id: `my-request-${request._id}`,
          type: request.status === "Approved" ? "System Info" : "Reminder",
          title: request.status === "Approved" ? "Cancellation request approved" : "Cancellation request submitted",
          message: `${request.examId?.subjectName || "Your duty"} request is currently ${request.status.toLowerCase()}.`,
          time: formatTimeLabel(request.createdAt),
          createdAt: request.createdAt,
        });
      });
    }

    if (notifications.length === 0) {
      notifications.push({
        id: "empty-notifications",
        type: "System Info",
        title: "No new notifications",
        message: "You are all caught up for now.",
        time: "Just now",
        createdAt: new Date(),
      });
    }

    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications",
    });
  }
};

module.exports = { getNotifications };
