import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CalendarDays, ArrowRight } from "lucide-react";
import { getMyDuties } from "../../services/duty";
import { getExams } from "../../services/exam";

const ProfessorDashboard = () => {
  const [duties, setDuties] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dutyData, examData] = await Promise.all([
          getMyDuties(),
          getExams({ status: "Scheduled" }),
        ]);
        setDuties(dutyData.duties || []);
        setExams(examData.exams || []);
      } catch (err) {
        // non-fatal
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcoming = duties.filter((d) => {
    const status = (d.status || "").toLowerCase();
    return status === "pending" || status === "accepted";
  });

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Welcome back. Here is your exam invigilation summary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
              <ClipboardList size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">My Duties</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? "—" : upcoming.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Upcoming / pending duties
          </p>
          <Link
            to="/professor/duties"
            className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all duties <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
              <CalendarDays size={16} className="text-green-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">
              Availability
            </h2>
          </div>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            Keep your availability up to date for future invigilation
            allocations.
          </p>
          <Link
            to="/professor/availability"
            className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Manage availability <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">
            Scheduled Exams
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Exams currently scheduled in the system.
          </p>
        </div>
        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            Loading...
          </p>
        ) : exams.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            No scheduled exams found.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {exams.slice(0, 8).map((exam) => (
              <div
                key={exam._id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {exam.subjectName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {exam.subjectCode}
                    {exam.examDate &&
                      ` · ${new Date(exam.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                    {exam.startTime &&
                      exam.endTime &&
                      ` · ${exam.startTime} – ${exam.endTime}`}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/professor/duties"
          className="flex-1 border border-gray-300 rounded px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View My Duties
        </Link>
        <Link
          to="/professor/availability"
          className="flex-1 border border-gray-300 rounded px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Update Availability
        </Link>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
