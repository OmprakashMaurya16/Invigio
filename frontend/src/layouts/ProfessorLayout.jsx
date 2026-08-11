import React from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  AlertCircle,
  Bell,
} from "lucide-react";
import Navbar from "../components/Navbar";

const ProfessorLayout = ({ onLogout }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/professor" },
    { icon: ClipboardList, label: "My Duties", path: "/professor/duties" },
    {
      icon: CalendarDays,
      label: "Availability",
      path: "/professor/availability",
    },
    {
      icon: AlertCircle,
      label: "Conflict Report",
      path: "/professor/conflict-report",
    },
    { icon: Bell, label: "Notifications", path: "/professor/notifications" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar
        menuItems={menuItems}
        onLogout={onLogout}
        userInitial="P"
        userRole="professor"
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfessorLayout;
