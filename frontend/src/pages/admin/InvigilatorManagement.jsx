import React, { useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";

const InvigilatorManagement = () => {
  const [invigilators] = useState([
    {
      id: 1,
      name: "Dr. Jane Smith",
      department: "Computer Science",
      available: "Yes",
      exams: "3",
    },
    {
      id: 2,
      name: "Prof. Robert Kim",
      department: "Physics",
      available: "No",
      exams: "2",
    },
    {
      id: 3,
      name: "Dr. Linda Martinez",
      department: "Mathematics",
      available: "Yes",
      exams: "4",
    },
  ]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    {
      key: "available",
      label: "Available",
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.available === "Yes"
            ? "bg-success-100 text-success-700"
            : "bg-warning-100 text-warning-700"
        }`}>
          {row.available}
        </span>
      ),
    },
    { key: "exams", label: "Assigned Exams" },
  ];

  const actions = [
    { label: "View", onClick: () => alert("View invigilator") },
    { label: "Edit", onClick: () => alert("Edit invigilator") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invigilator Management</h1>
          <p className="text-gray-600 mt-1">Manage invigilators and their assignments</p>
        </div>
        <Button>
          <Plus size={20} />
          Add Invigilator
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={invigilators} actions={actions} />
      </Card>
    </div>
  );
};

export default InvigilatorManagement;
