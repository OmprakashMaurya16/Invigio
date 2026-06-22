import React, { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";

const MyDuties = () => {
  const [duties] = useState([
    {
      id: 1,
      exam: "Advanced Macroeconomics (ECON-402)",
      date: "Oct 24, 2024",
      time: "09:00 - 12:00",
      venue: "Main Hall A, Level 2",
      role: "Chief Invigilator",
      status: "Confirmed",
      reportingStatus: "On standby - Arrive 20min early",
    },
    {
      id: 2,
      exam: "Quant Finance",
      date: "Oct 28, 2024",
      time: "Not Specified",
      venue: "Lab 402",
      role: "Assistant",
      status: "Pending",
      reportingStatus: "Awaiting confirmation",
    },
    {
      id: 3,
      exam: "Business Ethics",
      date: "Nov 02, 2024",
      time: "Not Specified",
      venue: "Auditorium 1",
      role: "Invigilator",
      status: "Pending",
      reportingStatus: "Not confirmed",
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Duties</h1>
        <p className="text-gray-600 mt-1">View all your assigned invigilator duties</p>
      </div>

      {duties.map((duty) => (
        <Card key={duty.id}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{duty.exam}</h3>
                <p className="text-sm text-gray-600 mt-1">{duty.date} • {duty.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                duty.status === "Confirmed"
                  ? "bg-success-100 text-success-700"
                  : "bg-warning-100 text-warning-700"
              }`}>
                {duty.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-200">
              <div>
                <p className="text-sm text-gray-600 font-medium">Venue</p>
                <p className="text-gray-900 mt-1">{duty.venue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Role</p>
                <p className="text-gray-900 mt-1">{duty.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Reporting Status</p>
                <p className="text-gray-900 mt-1">{duty.reportingStatus}</p>
              </div>
            </div>

            {duty.status === "Confirmed" && (
              <div className="flex gap-3">
                <Button size="sm" variant="secondary">
                  View Details
                </Button>
                <Button size="sm" variant="secondary">
                  Report Issue
                </Button>
              </div>
            )}

            {duty.status === "Pending" && (
              <div className="flex gap-3">
                <Button size="sm">
                  Confirm Duty
                </Button>
                <Button size="sm" variant="danger">
                  Decline
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyDuties;
