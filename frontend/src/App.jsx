import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuthCredentials, clearAuthCredentials, mapRole } from "./services/auth";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ProfessorLayout from "./layouts/ProfessorLayout";

// Auth Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import FacultyManagement from "./pages/admin/FacultyManagement";

// Exam Management
import ExamManagement from "./pages/admin/exam/ExamManagement";
import AddExam from "./pages/admin/exam/AddExam";
import EditExam from "./pages/admin/exam/EditExam";
import ExamDetails from "./pages/admin/exam/ExamDetails";

// Allocation Management
import AllocationManagement from "./pages/admin/AllocationManagement";

// Conflict Management
import ConflictManagement from "./pages/admin/ConflictManagement";

// Attendance Management
import AttendanceManagement from "./pages/admin/AttendanceManagement";

// Schedule Management
import ScheduleManagement from "./pages/admin/ScheduleManagement";

// Invigilator Management
import InvigilatorManagement from "./pages/admin/InvigilatorManagement";

// Venue Management
import VenueManagement from "./pages/admin/VenueManagement";

// Notifications
import AdminNotifications from "./pages/admin/Notifications";

// Reports
import Reports from "./pages/admin/Reports";

// Professor Pages
import ProfessorDashboard from "./pages/professor/Dashboard";
import MyDuties from "./pages/professor/MyDuties";
import Availability from "./pages/professor/Availability";
import ConflictReport from "./pages/professor/ConflictReport";
import ProfessorNotifications from "./pages/professor/Notifications";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const { token, user } = getAuthCredentials();
    if (token && user) {
      setIsAuthenticated(true);
      setUserRole(mapRole(user.role));
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    clearAuthCredentials();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {userRole === "admin" && (
          <Route element={<AdminLayout onLogout={handleLogout} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/faculty" element={<FacultyManagement />} />
            <Route path="/admin/exams" element={<ExamManagement />} />
            <Route path="/admin/exams/add" element={<AddExam />} />
            <Route path="/admin/exams/edit/:id" element={<EditExam />} />
            <Route path="/admin/exams/:id" element={<ExamDetails />} />
            <Route path="/admin/allocations" element={<AllocationManagement />} />
            <Route path="/admin/conflicts" element={<ConflictManagement />} />
            <Route path="/admin/attendance" element={<AttendanceManagement />} />
            <Route path="/admin/schedule" element={<ScheduleManagement />} />
            <Route path="/admin/invigilators" element={<InvigilatorManagement />} />
            <Route path="/admin/venues" element={<VenueManagement />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        )}

        {userRole === "professor" && (
          <Route element={<ProfessorLayout onLogout={handleLogout} />}>
            <Route path="/professor" element={<ProfessorDashboard />} />
            <Route path="/professor/duties" element={<MyDuties />} />
            <Route path="/professor/availability" element={<Availability />} />
            <Route path="/professor/conflict-report" element={<ConflictReport />} />
            <Route path="/professor/notifications" element={<ProfessorNotifications />} />
            <Route path="*" element={<Navigate to="/professor" replace />} />
          </Route>
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
