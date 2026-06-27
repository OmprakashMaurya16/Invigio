import React from "react";
import { AlertCircle } from "lucide-react";
import Card from "../../components/Card";

const ConflictReport = () => {
  const conflicts = [
    {
      id: 1,
      type: "Double Booking",
      date: "Thursday, Oct 24",
      description: "You have been assigned to two exams at overlapping times",
      exam1: "Advanced Macroeconomics (09:00 - 12:00)",
      exam2: "Quant Finance (Not Specified)",
      status: "Resolved",
    },
    {
      id: 2,
      type: "Schedule Clash",
      date: "Friday, Oct 28",
      description: "Exam schedule conflicts with another duty",
      exam1: "Business Ethics (Pending)",
      exam2: "Not fully scheduled yet",
      status: "Pending Resolution",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conflict Report</h1>
        <p className="text-gray-600 mt-1">View and manage any scheduling conflicts with your duties</p>
      </div>

      {/* Summary */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-danger-50 p-4 rounded-lg border border-danger-200">
            <p className="text-sm text-danger-700 font-medium">Total Conflicts</p>
            <p className="text-2xl font-bold text-danger-900 mt-2">{conflicts.length}</p>
          </div>
          <div className="bg-success-50 p-4 rounded-lg border border-success-200">
            <p className="text-sm text-success-700 font-medium">Resolved</p>
            <p className="text-2xl font-bold text-success-900 mt-2">
              {conflicts.filter(c => c.status === "Resolved").length}
            </p>
          </div>
          <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
            <p className="text-sm text-warning-700 font-medium">Pending</p>
            <p className="text-2xl font-bold text-warning-900 mt-2">
              {conflicts.filter(c => c.status === "Pending Resolution").length}
            </p>
          </div>
        </div>
      </Card>

      {/* Conflicts List */}
      {conflicts.map((conflict) => (
        <Card key={conflict.id}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-danger-600 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{conflict.type}</h3>
                  <p className="text-sm text-gray-600 mt-1">{conflict.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                conflict.status === "Resolved"
                  ? "bg-success-100 text-success-700"
                  : "bg-warning-100 text-warning-700"
              } whitespace-nowrap `}>
                {conflict.status}
              </span>
            </div>

            <p className="text-gray-700">{conflict.description}</p>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Exam 1</p>
                  <p className="text-gray-900">{conflict.exam1}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Exam 2</p>
                  <p className="text-gray-900">{conflict.exam2}</p>
                </div>
              </div>
            </div>

            {conflict.status === "Pending Resolution" && (
              <div className="flex gap-3 pt-2">
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition">
                  Report Issue
                </button>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition">
                  Decline Duty
                </button>
              </div>
            )}
          </div>
        </Card>
      ))}

      {conflicts.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-600 text-lg">No conflicts detected</p>
          <p className="text-gray-500 mt-2">Your schedule is clear!</p>
        </Card>
      )}
    </div>
  );
};

export default ConflictReport;

