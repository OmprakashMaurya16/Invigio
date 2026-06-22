import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProfessorLayout = ({ onLogout }) => {
  const menuItems = [];

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar menuItems={menuItems} onLogout={onLogout} userInitial="P" userRole="professor" />
      
      {/* Page Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-lg max-w-container mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfessorLayout;
