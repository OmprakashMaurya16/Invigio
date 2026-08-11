import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { getExams } from "../../services/exam";

const statusBadge = (status) => {
  const map = {
    Scheduled: "bg-green-100 text-green-700",
    Ongoing: "bg-blue-100 text-blue-700",
    Completed: "bg-gray-100 text-gray-600",
    Cancelled: "bg-red-100 text-red-700",
    Draft: "bg-yellow-100 text-yellow-700",
    Postponed: "bg-orange-100 text-orange-700",
  };
  const key = Object.keys(map).find(
    (k) => k.toLowerCase() === (status || "").toLowerCase(),
  );
  return key ? map[key] : "bg-gray-100 text-gray-600";
};

const ScheduleManagement = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getExams();
        const exams = data.exams || [];
        const groups = {};
        exams.forEach((exam) => {
          const dateKey = exam.examDate
            ? new Date(exam.examDate).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "No Date";
          if (!groups[dateKey]) groups[dateKey] = [];
          groups[dateKey].push(exam);
        });
        const sorted = Object.fromEntries(
          Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b)),
        );
        setGrouped(sorted);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load exams.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Schedule Management
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">
          View all exams grouped by date.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">
          Loading schedule...
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded">
          No exams found.
        </div>
      ) : (
        Object.entries(grouped).map(([date, exams]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">{date}</h2>
            </div>
            <div className="space-y-2">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="bg-white border border-gray-200 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {exam.subjectName}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {exam.subjectCode}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      {exam.startTime && exam.endTime && (
                        <span>
                          {exam.startTime} – {exam.endTime}
                        </span>
                      )}
                      {exam.branch && exam.branch.length > 0 && (
                        <span>Branch: {exam.branch.join(", ")}</span>
                      )}
                      {exam.semester && <span>Sem: {exam.semester}</span>}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(exam.status)} whitespace-nowrap`}
                  >
                    {exam.status || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleManagement;
