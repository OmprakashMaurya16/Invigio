import React, { useState } from "react";
import { Calendar } from "lucide-react";
import Card from "../../components/Card";

const ScheduleManagement = () => {
  const [schedule] = useState([
    {
      date: "May 24, 2024",
      exams: [
        { time: "09:00 - 12:00", exam: "Operating Systems (CS-402)", venue: "Main Hall A" },
        { time: "14:00 - 17:00", exam: "Database Systems (CS-301)", venue: "Main Hall B" },
      ],
    },
    {
      date: "May 25, 2024",
      exams: [
        { time: "09:00 - 12:00", exam: "Data Structures (CS-201)", venue: "Main Hall B" },
        { time: "14:00 - 17:00", exam: "Web Development (CS-401)", venue: "Seminar Room 302" },
      ],
    },
    {
      date: "May 26, 2024",
      exams: [
        { time: "09:00 - 12:00", exam: "Applied Physics (PY-101)", venue: "Main Hall A" },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
        <p className="text-gray-600 mt-1">View and manage examination schedule</p>
      </div>

      {schedule.map((day, index) => (
        <Card key={index} title={day.date}>
          <div className="space-y-3">
            {day.exams.map((exam, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Calendar className="text-primary-600 mt-1" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exam.exam}</h4>
                      <p className="text-sm text-gray-600 mt-1">{exam.venue}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold whitespace-nowrap">
                      {exam.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleManagement;

