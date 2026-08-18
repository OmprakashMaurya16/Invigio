import React, { useState, useEffect } from "react";
import { Bell, Trash2, AlertTriangle, CheckCircle2, ClipboardList, Info } from "lucide-react";
import Card from "../../components/Card";
import { getMyNotifications, deleteNotification } from "../../services/notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
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

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      alert("Failed to delete notification.");
    }
  };

  const getStyleAndIcon = (type, title) => {
    if (title === "New Volunteer" || title === "Volunteer Request Approved") {
      return { 
        colorClass: "bg-primary-50 border-primary-200 text-primary-900",
        Icon: ClipboardList
      };
    }
    if (type === "duty_rejected" || type === "conflict_reported") {
      return { 
        colorClass: "bg-red-50 border-red-200 text-red-900",
        Icon: AlertTriangle
      };
    }
    if (type === "duty_accepted" || type === "allocation_done") {
      return { 
        colorClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
        Icon: CheckCircle2
      };
    }
    return { 
      colorClass: "bg-slate-50 border-slate-200 text-slate-900",
      Icon: Info
    };
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div className="mt-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1 text-sm">Stay updated with your duties and system alerts</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white border border-slate-200 rounded-lg">No notifications right now.</div>
        ) : (
          notifications.map((notification) => {
            const { colorClass, Icon } = getStyleAndIcon(notification.type, notification.title);
            
            return (
              <Card key={notification._id} className={`border ${colorClass} transition-shadow hover:shadow-md`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 bg-white/50 p-2 rounded-full">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{notification.title}</h3>
                      <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                      <p className="text-xs mt-3 opacity-75 font-medium">
                        {new Date(notification.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 hover:bg-black/5 text-slate-500 hover:text-red-600 rounded-full transition-colors flex-shrink-0"
                    title="Delete Notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
