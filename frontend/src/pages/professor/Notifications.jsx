import React, { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import Card from "../../components/Card";
import { getNotifications } from "../../services/notifications";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "assignment":
        return "bg-primary-50 border-primary-200 text-primary-900";
      case "reminder":
        return "bg-warning-50 border-warning-200 text-warning-900";
      case "conflict alert":
      case "conflict":
        return "bg-danger-50 border-danger-200 text-danger-900";
      case "system info":
      case "update":
        return "bg-gray-50 border-gray-200 text-gray-900";
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

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading notifications...</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">No notifications yet.</div>
      ) : notifications.map((notification) => (
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
