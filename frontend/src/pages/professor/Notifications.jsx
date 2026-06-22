import React from "react";
import { Bell, Trash2 } from "lucide-react";
import Card from "../../components/Card";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "assignment",
      title: "New Invigilator Duty Assigned",
      message: "You have been assigned to 'Advanced Macroeconomics (ECON-402)' on Oct 24, 2024.",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "reminder",
      title: "Duty Reminder",
      message: "Don't forget: Advanced Macroeconomics exam tomorrow at 09:00 in Main Hall A.",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "conflict",
      title: "Schedule Conflict Detected",
      message: "You have overlapping duties. Please review your conflict report.",
      time: "2 days ago",
    },
    {
      id: 4,
      type: "update",
      title: "Schedule Updated",
      message: "The venue for Business Ethics has been changed to Auditorium 1.",
      time: "3 days ago",
    },
    {
      id: 5,
      type: "system",
      title: "System Maintenance Notice",
      message: "ExamControl will be offline for maintenance on Sunday 02:00 - 04:00 AM.",
      time: "1 week ago",
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "assignment":
        return "bg-primary-50 border-primary-200 text-primary-900";
      case "reminder":
        return "bg-warning-50 border-warning-200 text-warning-900";
      case "conflict":
        return "bg-danger-50 border-danger-200 text-danger-900";
      case "update":
        return "bg-primary-50 border-primary-200 text-primary-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with your duties and system alerts</p>
      </div>

      {notifications.map((notification) => (
        <Card key={notification.id} className={`border ${getTypeColor(notification.type)}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Bell size={20} className="mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                <p className="text-xs mt-2 opacity-75">{notification.time}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded transition flex-shrink-0">
              <Trash2 size={18} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Notifications;
