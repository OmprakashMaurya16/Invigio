import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { getAttendanceSummary } from "../../services/attendance";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const response = await getAttendanceSummary();
        setAttendance(response.attendance || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load attendance summary.");
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const columns = [
    { key: "exam", label: "Exam" },
    { key: "date", label: "Date" },
    { key: "registered", label: "Registered" },
    { key: "present", label: "Present" },
    { key: "absent", label: "Absent" },
    { key: "percentage", label: "Attendance %" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track attendance for each exam</p>
        </div>
        <Button>
          <Download size={20} />
          Export Report
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-4 text-sm text-slate-600">Loading attendance summary...</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-700">{error}</div>
        ) : (
          <Table columns={columns} data={attendance} />
        )}
      </Card>
    </div>
  );
};

export default AttendanceManagement;
