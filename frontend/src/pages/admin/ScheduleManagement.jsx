import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Card from "../../components/Card";
import { getExams } from "../../services/exam";
import { getExamVenues } from "../../services/examVenue";

const formatDate = (value) => {
  if (!value) return "Unscheduled";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ScheduleManagement = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSchedule = async () => {
    setLoading(true);
    setError("");

    try {
      const [examsResponse, examVenuesResponse] = await Promise.all([
        getExams({ status: "Scheduled" }),
        getExamVenues(),
      ]);

      const exams = examsResponse.exams || [];
      const allocations = examVenuesResponse.examVenues || [];

      const grouped = exams.reduce((acc, exam) => {
        const dateKey = exam.examDate ? new Date(exam.examDate).toISOString().slice(0, 10) : "unscheduled";
        const dateLabel = formatDate(exam.examDate);

        if (!acc[dateKey]) {
          acc[dateKey] = { dateKey, date: dateLabel, exams: [] };
        }

        const relatedAllocations = allocations.filter((allocation) => {
          const allocationExamId = allocation?.examId?._id || allocation?.examId;
          return String(allocationExamId) === String(exam._id);
        });

        const venues = relatedAllocations
          .map((allocation) => {
            const block = allocation?.venueId?.block;
            const room = allocation?.venueId?.room;
            return block && room ? `${block} ${room}` : null;
          })
          .filter(Boolean);

        acc[dateKey].exams.push({
          id: exam._id,
          time: `${exam.startTime} - ${exam.endTime}`,
          exam: `${exam.subjectName} (${exam.subjectCode})`,
          venue: venues.length ? venues.join(", ") : "Venue TBD",
        });

        return acc;
      }, {});

      setSchedule(
        Object.values(grouped)
          .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
          .map((day) => ({
            ...day,
            exams: day.exams.sort((a, b) => a.time.localeCompare(b.time)),
          })),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
        <p className="text-gray-600 mt-1">View the examination schedule from live exam data</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Card>
          <p className="text-gray-600">Loading schedule...</p>
        </Card>
      ) : schedule.length === 0 ? (
        <Card>
          <p className="text-gray-600">No scheduled exams found.</p>
        </Card>
      ) : (
        schedule.map((day) => (
          <Card key={day.dateKey} title={day.date}>
            <div className="space-y-3">
              {day.exams.map((exam) => (
                <div key={exam.id} className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <Calendar className="mt-1 text-primary-600" size={20} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exam.exam}</h4>
                        <p className="mt-1 text-sm text-gray-600">{exam.venue}</p>
                      </div>
                      <span className="whitespace-nowrap rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                        {exam.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ScheduleManagement;

