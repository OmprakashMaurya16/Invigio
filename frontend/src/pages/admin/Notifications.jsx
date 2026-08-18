import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  ClipboardList, 
  DoorOpen, 
  Info, 
  CalendarX2, 
  CheckCheck,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building
} from "lucide-react";
import { getMyNotifications, markAllAsRead, markAsRead } from "../../services/notification";
import { assignVolunteer } from "../../services/exam";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["All", "Assignments", "Room Changes", "Emergency"];

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleApproveVolunteer = async (examId, professorId, notifId) => {
    try {
      await assignVolunteer(examId, professorId);
      await markAsRead(notifId);
      alert("Successfully assigned the volunteer!");
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to assign volunteer");
    }
  };

  // Map backend notification types to icons and colors
  const getIconAndColor = (type, title) => {
    if (title === "New Volunteer") return { icon: ClipboardList, color: "blue" };
    if (type === "duty_rejected" || type === "conflict_reported") return { icon: AlertTriangle, color: "red" };
    if (type === "duty_accepted" || type === "allocation_done") return { icon: CheckCircle2, color: "blue" };
    return { icon: Info, color: "slate" };
  };

  const filteredNotifs = activeTab === "All" 
    ? notifications 
    : notifications.filter(n => {
        if (activeTab === "Assignments") return n.type.includes("duty") || n.title === "New Volunteer";
        if (activeTab === "Emergency") return n.type.includes("conflict");
        return true;
      });

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
          <button onClick={handleMarkAllRead} className="flex items-center gap-2 px-3 py-1.5 text-primary-600 hover:bg-primary-50 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-primary-200 whitespace-nowrap">
            <CheckCheck size={16} />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white border border-slate-200 rounded-lg">No notifications right now.</div>
        ) : (
          filteredNotifs.map((notif) => {
            const { icon: Icon, color } = getIconAndColor(notif.type, notif.title);
            
            return (
              <div 
                key={notif._id}
                className={`bg-white border rounded-lg p-5 flex gap-4 transition-colors hover:bg-slate-50 ${
                  color === "red" ? "border-l-4 border-l-red-500 border-red-100" :
                  color === "blue" ? "border-l-4 border-l-primary-500 border-slate-200" :
                  "border-l-4 border-l-slate-400 border-slate-200"
                } ${!notif.isRead ? "bg-slate-50" : ""}`}
              >
                {/* Icon */}
                <div className={`p-3 rounded-lg flex-shrink-0 h-min ${
                  color === "red" ? "bg-red-100 text-red-600" :
                  color === "blue" ? "bg-primary-50 text-primary-600" :
                  "bg-slate-100 text-slate-500"
                }`}>
                  <Icon size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        color === "red" ? "text-red-600" :
                        color === "blue" ? "text-primary-600" :
                        "text-slate-500"
                      }`}>
                        {notif.type.replace("_", " ")}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base">{notif.title}</h3>
                    <p className="text-sm mt-1 text-slate-600 leading-relaxed">{notif.message}</p>
                    
                    {notif.title === "New Volunteer" && notif.metadata && notif.metadata.professorName && (
                      <div className="mt-4 bg-slate-50 border border-slate-100 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Professor Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <User size={14} className="text-slate-400" />
                            <span className="font-medium">{notif.metadata.professorName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Building size={14} className="text-slate-400" />
                            <span>Dept: {notif.metadata.professorDepartment || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Mail size={14} className="text-slate-400" />
                            <span>{notif.metadata.professorEmail || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Phone size={14} className="text-slate-400" />
                            <span>{notif.metadata.professorPhone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs mt-3 text-slate-400 font-medium">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  
                  {notif.title === "New Volunteer" && notif.relatedId && notif.metadata?.professorId && (
                    <button 
                      onClick={() => handleApproveVolunteer(notif.relatedId, notif.metadata.professorId, notif._id)}
                      className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md text-sm font-semibold whitespace-nowrap self-start shadow-sm"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
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

