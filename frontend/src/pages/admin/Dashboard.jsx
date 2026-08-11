import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Filter } from "lucide-react";
import { getExams } from "../../services/exam";

const statusBadge = (status) => {
  const map = {
    SCHEDULED: "bg-green-100 text-green-700",
    ONGOING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-gray-100 text-gray-600",
    CANCELLED: "bg-red-100 text-red-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    POSTPONED: "bg-orange-100 text-orange-700",
  };
  return map[(status || "").toUpperCase()] || "bg-gray-100 text-gray-600";
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getExams();
        setExams(data.exams || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load exams.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const counts = {
    total: exams.length,
    scheduled: exams.filter(
      (e) => (e.status || "").toUpperCase() === "SCHEDULED",
    ).length,
    completed: exams.filter(
      (e) => (e.status || "").toUpperCase() === "COMPLETED",
    ).length,
    cancelled: exams.filter(
      (e) => (e.status || "").toUpperCase() === "CANCELLED",
    ).length,
  };

  const filtered =
    statusFilter === "All"
      ? exams
      : exams.filter((e) => (e.status || "").toUpperCase() === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Overview of all examination activities.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/exams/add")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          <Plus size={16} />
          Add Exam
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Exams",
            value: counts.total,
            color: "border-gray-200",
          },
          {
            label: "Scheduled",
            value: counts.scheduled,
            color: "border-green-200",
          },
          {
            label: "Completed",
            value: counts.completed,
            color: "border-gray-200",
          },
          {
            label: "Cancelled",
            value: counts.cancelled,
            color: "border-red-200",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border ${stat.color} rounded p-4`}
          >
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">All Exams</h2>
          <div className="relative flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="POSTPONED">Postponed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Branch
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading exams...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No exams found.
                  </td>
                </tr>
              ) : (
                paginated.map((exam) => (
                  <tr key={exam._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {exam.subjectName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {exam.subjectCode}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {exam.examDate
                        ? new Date(exam.examDate).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {exam.startTime && exam.endTime
                        ? `${exam.startTime} – ${exam.endTime}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {exam.branch?.join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(exam.status)}`}
                      >
                        {exam.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/exams/${exam._id}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            Showing{" "}
            {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
