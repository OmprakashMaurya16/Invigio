import React from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  GitBranch,
  AlertCircle,
  CalendarCheck,
  BarChart3,
  Bell,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AdminLayout = ({ onLogout }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: BookOpen, label: "Exams", path: "/admin/exams" },
    { icon: Users, label: "Faculty", path: "/admin/faculty" },
    { icon: Building2, label: "Venues", path: "/admin/venues" },
    { icon: GitBranch, label: "Allocations", path: "/admin/allocations" },
    { icon: AlertCircle, label: "Conflicts", path: "/admin/conflicts" },
    { icon: CalendarCheck, label: "Attendance", path: "/admin/attendance" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar
        menuItems={menuItems}
        onLogout={onLogout}
        userInitial="A"
        userRole="admin"
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
