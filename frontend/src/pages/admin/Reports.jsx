import React, { useEffect, useMemo, useState } from "react";
import { Download, CalendarDays, Users, Building2, ClipboardList } from "lucide-react";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";
import { getReportsSummary } from "../../services/reports";

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const response = await getReportsSummary();
        setSummary(response.summary);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load reports summary.");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const reportTypes = useMemo(
    () => [
      {
        name: "Attendance Report",
        description: "Comprehensive attendance data for all exams",
        format: "PDF, Excel",
      },
      {
        name: "Conflict Resolution Report",
        description: "Analysis of conflicts detected and resolved",
        format: "PDF, Excel",
      },
      {
        name: "Resource Utilization",
        description: "Venue and invigilator resource usage statistics",
        format: "PDF, Excel",
      },
      {
        name: "Schedule Summary",
        description: "Complete examination schedule and timetable",
        format: "PDF, Excel",
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view system reports</p>
        </div>
        <Button>
          <Download size={20} />
          Export All
        </Button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading report summary...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CalendarDays} label="Total Exams" value={summary?.totalExams ?? 0} />
          <StatCard icon={ClipboardList} label="Scheduled Exams" value={summary?.scheduledExams ?? 0} />
          <StatCard icon={Users} label="Active Faculty" value={summary?.activeFaculty ?? 0} />
          <StatCard icon={Building2} label="Venue Allocations" value={summary?.allocationCount ?? 0} />
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
        {reportTypes.map((report, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                <p className="text-xs text-gray-500 mt-2">Available formats: {report.format}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg font-semibold transition">
                  PDF
                </button>
                <button className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg font-semibold transition">
                  Excel
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
