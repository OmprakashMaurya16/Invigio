import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import { getExams, deleteExam } from "../../../services/exam";

const ExamManagement = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchExams = async (params = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await getExams(params);
      setExams(response.exams || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchExams({ search: searchTerm, status: statusFilter });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((exam) => exam._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete exam.");
    }
  };

  const columns = [
    { key: "subjectCode", label: "Course Code" },
    { key: "subjectName", label: "Exam Name" },
    { key: "academicYear", label: "Year" },
    {
      key: "branch",
      label: "Branch",
      render: (row) => (Array.isArray(row.branch) ? row.branch.join(", ") : row.branch),
    },
    {
      key: "examDate",
      label: "Date",
      render: (row) => (row.examDate ? new Date(row.examDate).toLocaleDateString() : ""),
    },
    { key: "startTime", label: "Start" },
    { key: "endTime", label: "End" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const status = row.status || "Scheduled";
        const statusClasses =
          status === "Scheduled"
            ? "bg-primary-100 text-primary-700"
            : status === "Ongoing"
            ? "bg-success-100 text-success-700"
            : status === "Completed"
            ? "bg-slate-100 text-slate-700"
            : status === "Cancelled"
            ? "bg-danger-100 text-danger-700"
            : "bg-warning-100 text-warning-700";

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses} whitespace-nowrap `}>
            {status}
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: (row) => navigate(`/admin/exams/${row._id}`),
    },
    {
      label: "Edit",
      onClick: (row) => navigate(`/admin/exams/edit/${row._id}`),
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: (row) => handleDelete(row._id),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">Manage and schedule all exams.</p>
        </div>
        <Button onClick={() => navigate("/admin/exams/add")}>
          <Plus size={20} />
          Add Exam
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_240px] gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by course code or name..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Postponed">Postponed</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
          >
            Apply
          </button>
        </form>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <Table columns={columns} data={exams} actions={actions} loading={loading} />
      </Card>
    </div>
  );
};

export default ExamManagement;

