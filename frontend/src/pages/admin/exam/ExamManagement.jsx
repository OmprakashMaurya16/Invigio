import React, { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import Table from "../../../components/Table";
import Button from "../../../components/Button";

const ExamManagement = () => {
  const navigate = useNavigate();
  const [exams] = useState([
    {
      id: 1,
      code: "CS-402",
      name: "Operating Systems",
      year: "2024",
      semester: "IV",
      date: "May 24, 2024",
      time: "09:00 - 12:00",
      venue: "Main Hall A",
      status: "Confirmed",
    },
    {
      id: 2,
      code: "CS-201",
      name: "Data Structures",
      year: "2026",
      semester: "II",
      date: "May 25, 2024",
      time: "02:00 - 05:00",
      venue: "Main Hall B",
      status: "In Progress",
    },
    {
      id: 3,
      code: "PY-101",
      name: "Applied Physics",
      year: "2027",
      semester: "I",
      date: "May 26, 2024",
      time: "09:00 - 12:00",
      venue: "Seminar Room 302",
      status: "Conflict",
    },
  ]);

  const columns = [
    { key: "code", label: "Course Code" },
    { key: "name", label: "Exam Name" },
    { key: "year", label: "Year" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Confirmed"
              ? "bg-success-100 text-success-700"
              : row.status === "In Progress"
              ? "bg-primary-100 text-primary-700"
              : "bg-danger-100 text-danger-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      onClick: (row) => navigate(`/admin/exams/${row.id}`),
    },
    {
      label: "Edit",
      onClick: (row) => navigate(`/admin/exams/edit/${row.id}`),
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: () => alert("Delete confirmed"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
          <p className="text-gray-600 mt-1">Manage and schedule all exams</p>
        </div>
        <Button onClick={() => navigate("/admin/exams/add")}>
          <Plus size={20} />
          Add Exam
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by course code or name..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>In Progress</option>
            <option>Conflict</option>
          </select>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition">
            Filter
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table columns={columns} data={exams} actions={actions} />
      </Card>
    </div>
  );
};

export default ExamManagement;
