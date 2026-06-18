import React from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  AlertCircle,
  UserCheck,
  Calendar,
  BarChart3,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AdminLayout = ({ onLogout }) => {
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/admin" 
    },
    {
      icon: BookOpen,
      label: "Exams",
      path: "/admin/exams",
    },
    {
      icon: AlertCircle,
      label: "Issues",
      path: "/admin/conflicts",
    },
    {
      icon: BarChart3,
      label: "Reports",
      path: "/admin/reports",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar menuItems={menuItems} onLogout={onLogout} userInitial="A" userRole="admin" />
      
      {/* Page Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-lg max-w-container mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
