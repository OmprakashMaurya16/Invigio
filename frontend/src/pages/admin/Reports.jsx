import React from "react";
import { BarChart3, Download } from "lucide-react";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";

const Reports = () => {
  const reportStats = [
    {
      label: "Total Exams Conducted",
      value: "142",
      icon: BarChart3,
    },
    {
      label: "Average Attendance",
      value: "96.2%",
      icon: BarChart3,
    },
    {
      label: "Venues Used",
      value: "45",
      icon: BarChart3,
    },
    {
      label: "Invigilators Deployed",
      value: "87",
      icon: BarChart3,
    },
  ];

  const reportTypes = [
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
  ];

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

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Available Reports */}
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
