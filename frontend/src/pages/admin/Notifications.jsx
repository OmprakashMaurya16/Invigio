import React, { useState } from "react";
import { 
  AlertTriangle, 
  ClipboardList, 
  DoorOpen, 
  Info, 
  CalendarX2, 
  CheckCheck 
} from "lucide-react";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Assignments", "Room Changes", "Emergency"];

  const notifications = [
    {
      id: 1,
      type: "Emergency",
      title: "Fire Alarm Testing - North Wing",
      message: "Mandatory testing will commence at 14:00. Exams in halls N1-N5 will be paused.",
      time: "Just now",
      icon: AlertTriangle,
      color: "red"
    },
    {
      id: 2,
      type: "Assignment",
      title: "New Invigilation Duty Added",
      message: "You have been assigned to 'Advanced Calculus (MATH301)' tomorrow at 09:00 in Hall A.",
      time: "10 mins ago",
      icon: ClipboardList,
      color: "blue"
    },
    {
      id: 3,
      type: "Room Change",
      title: "Venue Update: PHYS202",
      message: "The venue for 'Quantum Mechanics' has been moved from Hall C to the Main Auditorium.",
      time: "2 hours ago",
      icon: DoorOpen,
      color: "slate"
    },
    {
      id: 4,
      type: "System Info",
      title: "System Maintenance Scheduled",
      message: "ExamControl will be offline for routine maintenance on Sunday from 02:00 to 04:00 AM.",
      time: "Yesterday",
      icon: Info,
      color: "slate"
    },
    {
      id: 5,
      type: "Conflict Alert",
      title: "Schedule Overlap Detected",
      message: "Dr. Smith is double-booked for invigilation on Thursday at 14:00. Action required.",
      time: "Yesterday",
      icon: CalendarX2,
      color: "slate"
    }
  ];

  return (
    <div className="space-y-6 pb-20 mt-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Notifications</h1>
          <p className="text-slate-500 text-sm">Manage your alerts, assignments, and system updates.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex space-x-2 mr-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary-600 text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-primary-200">
            <CheckCheck size={16} />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className={`bg-white border rounded-lg p-5 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer ${
              notif.color === "red" ? "border-l-4 border-l-red-500 border-red-100" :
              notif.color === "blue" ? "border-l-4 border-l-slate-300 border-slate-200" :
              "border-l-4 border-l-slate-400 border-slate-200"
            }`}
          >
            {/* Icon */}
            <div className={`p-3 rounded-lg flex-shrink-0 h-min ${
              notif.color === "red" ? "bg-red-100 text-red-600" :
              notif.color === "blue" ? "bg-primary-50 text-primary-600" :
              "bg-slate-100 text-slate-500"
            }`}>
              <notif.icon size={24} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  notif.color === "red" ? "text-red-600" :
                  notif.color === "blue" ? "text-slate-500" :
                  "text-slate-500"
                }`}>
                  {notif.type}
                </span>
                <span className="text-xs text-slate-500">{notif.time}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{notif.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8 pt-4">
        <button className="px-6 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
          Load Older Notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;
