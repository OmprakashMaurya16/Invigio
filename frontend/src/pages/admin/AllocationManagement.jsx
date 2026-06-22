import React, { useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";

const AllocationManagement = () => {
  const [allocations] = useState([
    {
      id: 1,
      exam: "Operating Systems (CS-402)",
      venue: "Main Hall A",
      slots: "10",
      status: "Completed",
    },
    {
      id: 2,
      exam: "Data Structures (CS-201)",
      venue: "Main Hall B",
      slots: "8",
      status: "In Progress",
    },
    {
      id: 3,
      exam: "Applied Physics (PY-101)",
      venue: "Seminar Room 302",
      slots: "5",
      status: "Pending",
    },
  ]);

  const columns = [
    { key: "exam", label: "Exam" },
    { key: "venue", label: "Venue" },
    { key: "slots", label: "Allocated Slots" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Completed"
              ? "bg-success-100 text-success-700"
              : row.status === "In Progress"
              ? "bg-primary-100 text-primary-700"
              : "bg-warning-100 text-warning-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: "View", onClick: () => alert("View allocation") },
    { label: "Edit", onClick: () => alert("Edit allocation") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Allocation Management</h1>
          <p className="text-gray-600 mt-1">Manage seat allocations for exams</p>
        </div>
        <Button>
          <Plus size={20} />
          Generate Allocation
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={allocations} actions={actions} />
      </Card>
    </div>
  );
};

export default AllocationManagement;
