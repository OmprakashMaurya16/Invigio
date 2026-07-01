import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  DoorOpen,
  Info,
  CalendarX2,
  CheckCheck,
} from "lucide-react";
import { getNotifications } from "../../services/notifications";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["All", "Assignments", "Room Changes", "Emergency"];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications();
        setNotifications(response.notifications || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const visibleNotifications = useMemo(() => {
    const normalized = activeTab.toLowerCase();
    if (normalized === "all") return notifications;

    return notifications.filter((notif) => {
      const type = notif.type?.toLowerCase() || "";
      if (normalized === "assignments") return type.includes("assignment") || type.includes("duty") || type.includes("reminder");
      if (normalized === "room changes") return type.includes("room") || type.includes("venue") || type.includes("update");
      if (normalized === "emergency") return type.includes("alert") || type.includes("emergency") || type.includes("conflict");
      return true;
    });
  }, [activeTab, notifications]);

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
          <button className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-primary-200 whitespace-nowrap">
            <CheckCheck size={16} />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading notifications...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
      ) : (
        <div className="space-y-4">
          {visibleNotifications.map((notif) => {
            const Icon = notif.type?.toLowerCase().includes("alert") || notif.type?.toLowerCase().includes("conflict")
              ? AlertTriangle
              : notif.type?.toLowerCase().includes("assignment") || notif.type?.toLowerCase().includes("duty")
              ? ClipboardList
              : notif.type?.toLowerCase().includes("venue") || notif.type?.toLowerCase().includes("update")
              ? DoorOpen
              : Info;

            const color = notif.type?.toLowerCase().includes("alert") || notif.type?.toLowerCase().includes("conflict")
              ? "red"
              : notif.type?.toLowerCase().includes("assignment") || notif.type?.toLowerCase().includes("duty")
              ? "blue"
              : "slate";

            return (
              <div
                key={notif.id}
                className={`bg-white border rounded-lg p-5 flex gap-4 transition-colors hover:bg-slate-50 ${
                  color === "red"
                    ? "border-l-4 border-l-red-500 border-red-100"
                    : color === "blue"
                    ? "border-l-4 border-l-slate-300 border-slate-200"
                    : "border-l-4 border-l-slate-400 border-slate-200"
                }`}
              >
                <div className={`p-3 rounded-lg flex-shrink-0 h-min ${
                  color === "red"
                    ? "bg-red-100 text-red-600"
                    : color === "blue"
                    ? "bg-primary-50 text-primary-600"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  <Icon size={24} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                      color === "red" ? "text-red-600" : "text-slate-500"
                    }`}>
                      {notif.type}
                    </span>
                    <span className="text-xs text-slate-500">{notif.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{notif.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

