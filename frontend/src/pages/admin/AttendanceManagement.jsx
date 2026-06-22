import React, { useState } from "react";
import { Download } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";

const AttendanceManagement = () => {
  const [attendance] = useState([
    {
      id: 1,
      exam: "Operating Systems (CS-402)",
      date: "May 24, 2024",
      registered: "150",
      present: "148",
      absent: "2",
      percentage: "98.7%",
    },
    {
      id: 2,
      exam: "Data Structures (CS-201)",
      date: "May 25, 2024",
      registered: "120",
      present: "115",
      absent: "5",
      percentage: "95.8%",
    },
    {
      id: 3,
      exam: "Applied Physics (PY-101)",
      date: "May 26, 2024",
      registered: "200",
      present: "189",
      absent: "11",
      percentage: "94.5%",
    },
  ]);

  const columns = [
    { key: "exam", label: "Exam" },
    { key: "date", label: "Date" },
    { key: "registered", label: "Registered" },
    { key: "present", label: "Present" },
    { key: "absent", label: "Absent" },
    { key: "percentage", label: "Attendance %" },
  ];

  const actions = [
    { label: "View Details", onClick: () => alert("View attendance details") },
    { label: "Download", onClick: () => alert("Download report") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track student attendance for each exam</p>
        </div>
        <Button>
          <Download size={20} />
          Export Report
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={attendance} actions={actions} />
      </Card>
    </div>
  );
};

export default AttendanceManagement;
