const ExamAllocation = require("../models/examAllocation.model.js");
const Exam = require("../models/exam.model.js");
const Venue = require("../models/venue.model.js");
const ExamDuty = require("../models/examDuty.model.js");
const Notification = require("../models/notification.model.js");
const Availability = require("../models/availability.model.js");

const populateAllocation = async (allocation) => {
  await allocation.populate([
    {
      path: "examId",
      select:
        "subjectCode subjectName examDate startTime endTime status",
    },
    {
      path: "venueId",
      select: "block room capacity",
    },
  ]);

  return allocation;
};

const getExamVenues = async (req, res) => {
  try {
    const allocations = await ExamAllocation.find()
      .populate([
        {
          path: "examId",
          select:
            "subjectCode subjectName examDate startTime endTime status",
        },
        {
          path: "venueId",
          select: "block room capacity",
        },
      ])
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: allocations.length,
      examVenues: allocations,
    });
  } catch (error) {
    console.error(
      "Get exam-venues error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch exam-venue allocations",
    });
  }
};

const createExamVenue = async (req, res) => {
  try {
    const {
      examId,
      venueId,
      requiredInvigilators,
    } = req.body;

    if (
      !examId ||
      !venueId ||
      requiredInvigilators === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "examId, venueId and requiredInvigilators are required",
      });
    }

    const requiredCount = Number(
      requiredInvigilators,
    );

    if (
      !Number.isInteger(requiredCount) ||
      requiredCount < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "requiredInvigilators must be a positive integer",
      });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (
      ["Cancelled", "Completed"].includes(
        exam.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot assign a venue to a cancelled or completed exam",
      });
    }

    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    if (
      venue.capacity !== undefined &&
      requiredCount > venue.capacity
    ) {
      return res.status(400).json({
        success: false,
        message:
          `requiredInvigilators cannot exceed venue capacity (${venue.capacity})`,
      });
    }

    const duplicate =
      await ExamAllocation.findOne({
        examId,
        venueId,
      });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "This venue is already assigned to this exam",
      });
    }

    /*
     * There is no exam.requiredInvigilators anymore.
     *
     * Every classroom has its own invigilator requirement.
     *
     * Example:
     *
     * Room 101 -> 2
     * Room 102 -> 3
     * Room 103 -> 1
     *
     * Total = 6
     *
     * The total is calculated dynamically when
     * generating the professor allocation.
     */

    const allocation =
      await ExamAllocation.create({
        examId,
        venueId,
        requiredInvigilators: requiredCount,
      });

    await populateAllocation(allocation);

    return res.status(201).json({
      success: true,
      message:
        "Venue assigned to exam successfully",
      examVenue: allocation,
    });
  } catch (error) {
    console.error(
      "Create exam-venue error:",
      error.message,
    );

    /*
     * Handles MongoDB duplicate-key errors as well.
     */
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This venue is already assigned to this exam",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to assign venue to exam",
    });
  }
};

const updateExamVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      venueId,
      requiredInvigilators,
    } = req.body;

    const allocation =
      await ExamAllocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message:
          "Exam-venue allocation not found",
      });
    }

    const exam = await Exam.findById(
      allocation.examId,
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Associated exam not found",
      });
    }

    if (
      ["Cancelled", "Completed"].includes(
        exam.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot update venue allocation for a cancelled or completed exam",
      });
    }

    let finalVenueId = allocation.venueId;

    /*
     * Change classroom if requested.
     */
    if (
      venueId &&
      String(venueId) !==
        String(allocation.venueId)
    ) {
      const venue =
        await Venue.findById(venueId);

      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      const duplicate =
        await ExamAllocation.findOne({
          examId: allocation.examId,
          venueId,
          _id: { $ne: id },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "This venue is already assigned to this exam",
        });
      }

      allocation.venueId = venueId;
      finalVenueId = venueId;
    }

    /*
     * Change classroom-specific invigilator count.
     */
    if (
      requiredInvigilators !== undefined
    ) {
      const requiredCount = Number(
        requiredInvigilators,
      );

      if (
        !Number.isInteger(requiredCount) ||
        requiredCount < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "requiredInvigilators must be a positive integer",
        });
      }

      const venue =
        await Venue.findById(finalVenueId);

      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      if (
        venue.capacity !== undefined &&
        requiredCount > venue.capacity
      ) {
        return res.status(400).json({
          success: false,
          message:
            `requiredInvigilators cannot exceed venue capacity (${venue.capacity})`,
        });
      }

      allocation.requiredInvigilators =
        requiredCount;
    }

    await allocation.save();

    await populateAllocation(allocation);

    return res.status(200).json({
      success: true,
      message:
        "Exam-venue allocation updated successfully",
      examVenue: allocation,
    });
  } catch (error) {
    console.error(
      "Update exam-venue error:",
      error.message,
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This venue is already assigned to this exam",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update exam-venue allocation",
    });
  }
};

const deleteExamVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation =
      await ExamAllocation.findById(id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message:
          "Exam-venue allocation not found",
      });
    }

    const exam = await Exam.findById(
      allocation.examId,
    );

    if (
      exam &&
      ["Ongoing", "Completed"].includes(
        exam.status,
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot remove venue allocation for an ongoing or completed exam",
      });
    }

    /*
     * Remove venue assignment from duties that
     * belonged to this classroom.
     */
    await ExamDuty.updateMany(
      {
        examId: allocation.examId,
        venueId: allocation.venueId,
      },
      {
        $unset: {
          venueId: "",
        },
      },
    );

    await allocation.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Exam-venue allocation removed successfully",
    });
  } catch (error) {
    console.error(
      "Delete exam-venue error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to remove exam-venue allocation",
    });
  }
};

const timeToMinutes = (timeStr) => {
  if (
    !timeStr ||
    typeof timeStr !== "string"
  ) {
    return null;
  }

  const match =
    /^(\d{1,2}):(\d{2})$/.exec(
      timeStr.trim(),
    );

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const isSameCalendarDate = (
  date1,
  date2,
) => {
  const a = new Date(date1);
  const b = new Date(date2);

  if (
    Number.isNaN(a.getTime()) ||
    Number.isNaN(b.getTime())
  ) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const isProfessorAvailable = async (
  professorId,
  exam,
) => {
  const availability =
    await Availability.findOne({
      professorId,
    });

  /*
   * No availability record means
   * professor is considered available.
   */
  if (!availability) {
    return true;
  }

  if (availability.isAvailable === false) {
    return false;
  }

  const examDate =
    new Date(exam.examDate);

  if (
    Number.isNaN(examDate.getTime())
  ) {
    return false;
  }

  if (availability.startDate) {
    const startDate =
      new Date(
        availability.startDate,
      );

    if (examDate < startDate) {
      return false;
    }
  }

  if (availability.endDate) {
    const endDate =
      new Date(
        availability.endDate,
      );

    if (examDate > endDate) {
      return false;
    }
  }

  const day = examDate.getDay();

  const isWeekend =
    day === 0 || day === 6;

  if (
    availability.weekendOnly &&
    !isWeekend
  ) {
    return false;
  }

  const examStart =
    timeToMinutes(exam.startTime);

  if (examStart === null) {
    return false;
  }

  /*
   * Morning = before 12:00.
   */
  if (
    availability.morningOnly &&
    examStart >= 12 * 60
  ) {
    return false;
  }

  /*
   * Afternoon = 12:00 onwards.
   */
  if (
    availability.afternoonOnly &&
    examStart < 12 * 60
  ) {
    return false;
  }

  return true;
};

const hasTimeConflict = async (
  duty,
  exam,
) => {
  const examStart =
    timeToMinutes(exam.startTime);

  const examEnd =
    timeToMinutes(exam.endTime);

  if (
    examStart === null ||
    examEnd === null
  ) {
    return true;
  }

  const existingDuties =
    await ExamDuty.find({
      professorId: duty.professorId,
      status: "Accepted",
      examId: {
        $ne: exam._id,
      },
    }).populate({
      path: "examId",
      select:
        "examDate startTime endTime status",
    });

  for (const existingDuty of existingDuties) {
    if (!existingDuty.examId) {
      continue;
    }

    if (
      [
        "Cancelled",
        "Completed",
      ].includes(
        existingDuty.examId.status,
      )
    ) {
      continue;
    }

    if (
      !isSameCalendarDate(
        existingDuty.examId.examDate,
        exam.examDate,
      )
    ) {
      continue;
    }

    const existingStart =
      timeToMinutes(
        existingDuty.examId.startTime,
      );

    const existingEnd =
      timeToMinutes(
        existingDuty.examId.endTime,
      );

    if (
      existingStart === null ||
      existingEnd === null
    ) {
      continue;
    }

    /*
     * Two time ranges overlap when:
     *
     * newStart < existingEnd
     * AND
     * newEnd > existingStart
     */
    const overlaps =
      examStart < existingEnd &&
      examEnd > existingStart;

    if (overlaps) {
      return true;
    }
  }

  return false;
};

const generateAllocations = async (
  req,
  res,
) => {
  try {
    const {
      examId: targetExamId,
    } = req.body;

    if (!targetExamId) {
      return res.status(400).json({
        success: false,
        message: "examId is required",
      });
    }

    const exam =
      await Exam.findById(
        targetExamId,
      );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (
      [
        "Cancelled",
        "Completed",
      ].includes(exam.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot generate allocations for a cancelled or completed exam",
      });
    }

    const examStart =
      timeToMinutes(exam.startTime);

    const examEnd =
      timeToMinutes(exam.endTime);

    if (
      examStart === null ||
      examEnd === null ||
      examStart >= examEnd
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Exam startTime and endTime must be valid and startTime must be before endTime",
      });
    }

    /*
     * Get every classroom assigned to this exam.
     */
    const examAllocations =
      await ExamAllocation.find({
        examId: exam._id,
      }).sort({
        createdAt: 1,
      });

    if (!examAllocations.length) {
      return res.status(400).json({
        success: false,
        message:
          "No venues have been assigned to this exam",
      });
    }

    /*
     * Calculate total invigilators required
     * from classroom allocations.
     *
     * Example:
     *
     * Room A = 2
     * Room B = 3
     * Room C = 1
     *
     * Total = 6
     */
    const totalRequired =
      examAllocations.reduce(
        (total, allocation) =>
          total +
          allocation.requiredInvigilators,
        0,
      );

    /*
     * Calculate current workload of professors.
     *
     * Only accepted duties count.
     */
    const workloadAgg =
      await ExamDuty.aggregate([
        {
          $match: {
            status: "Accepted",
          },
        },
        {
          $group: {
            _id: "$professorId",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const workloadMap = {};

    for (const entry of workloadAgg) {
      workloadMap[
        String(entry._id)
      ] = entry.count;
    }

    /*
     * Get professors who accepted this exam
     * and do not already have a venue.
     */
    const candidates =
      await ExamDuty.find({
        examId: exam._id,
        status: "Accepted",
        $or: [
          {
            venueId: {
              $exists: false,
            },
          },
          {
            venueId: null,
          },
        ],
      });

    if (!candidates.length) {
      return res.status(400).json({
        success: false,
        message:
          "No accepted and unassigned professors are available for this exam",
      });
    }

    /*
     * Filter professors by:
     *
     * 1. Availability
     * 2. Existing exam time conflicts
     */
    const eligibleCandidates = [];

    for (const duty of candidates) {
      const available =
        await isProfessorAvailable(
          duty.professorId,
          exam,
        );

      if (!available) {
        continue;
      }

      const hasConflict =
        await hasTimeConflict(
          duty,
          exam,
        );

      if (hasConflict) {
        continue;
      }

      eligibleCandidates.push(duty);
    }

    if (!eligibleCandidates.length) {
      return res.status(400).json({
        success: false,
        message:
          "No eligible professors are available after checking availability and time conflicts",
      });
    }

    /*
     * Lowest workload professors are selected first.
     */
    eligibleCandidates.sort(
      (a, b) => {
        const workloadA =
          workloadMap[
            String(a.professorId)
          ] || 0;

        const workloadB =
          workloadMap[
            String(b.professorId)
          ] || 0;

        return workloadA - workloadB;
      },
    );

    let candidateIndex = 0;
    let totalAssigned = 0;

    /*
     * Assign professors classroom by classroom.
     */
    for (const allocation of examAllocations) {
      /*
       * Count professors already assigned
       * to this classroom.
       */
      const alreadyAssigned =
        await ExamDuty.countDocuments({
          examId: exam._id,
          venueId: allocation.venueId,
          status: "Accepted",
        });

      const needed =
        allocation.requiredInvigilators -
        alreadyAssigned;

      if (needed <= 0) {
        continue;
      }

      for (
        let i = 0;
        i < needed;
        i++
      ) {
        if (
          candidateIndex >=
          eligibleCandidates.length
        ) {
          break;
        }

        const duty =
          eligibleCandidates[
            candidateIndex
          ];

        /*
         * Assign this professor to
         * this specific classroom.
         */
        duty.venueId =
          allocation.venueId;

        await duty.save();

        const professorKey =
          String(
            duty.professorId,
          );

        workloadMap[
          professorKey
        ] =
          (workloadMap[
            professorKey
          ] || 0) + 1;

        /*
         * Notification is kept for now.
         * Your friend can handle/refactor this part later.
         */
        try {
          await Notification.create({
            userId:
              duty.professorId,
            title:
              "Exam Duty Venue Assigned",
            message:
              `You have been assigned a venue for ${exam.subjectName} (${exam.subjectCode}) on ${new Date(exam.examDate).toDateString()}.`,
            type:
              "duty_assigned",
            relatedId: duty._id,
          });
        } catch (notificationError) {
          /*
           * Notification failure should NOT
           * break the actual allocation.
           */
          console.error(
            "Notification creation failed:",
            notificationError.message,
          );
        }

        candidateIndex++;
        totalAssigned++;
      }

      /*
       * If we run out of professors,
       * stop assigning further classrooms.
       */
      if (
        candidateIndex >=
        eligibleCandidates.length
      ) {
        break;
      }
    }

    /*
     * Count final assigned professors.
     */
    const finalAssigned =
      await ExamDuty.countDocuments({
        examId: exam._id,
        status: "Accepted",
        venueId: {
          $exists: true,
          $ne: null,
        },
      });

    const complete =
      finalAssigned >= totalRequired;

    return res.status(200).json({
      success: true,

      message: complete
        ? `Successfully allocated ${finalAssigned} professors across all classrooms`
        : `Allocation completed partially. ${finalAssigned} of ${totalRequired} required professors are assigned`,

      totalAssigned,

      totalRequired,

      finalAssigned,

      fullyAllocated: complete,
    });
  } catch (error) {
    console.error(
      "Generate allocation error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate allocations",
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
