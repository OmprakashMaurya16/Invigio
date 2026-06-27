import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, AlertTriangle, UserMinus, Upload, Zap, Plus, Eye, Filter, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 5;

  const initialExams = [
    { id: 100, subject: "Advanced Macroeconomics", code: "ECON-402", yearBranch: "2024 / ECON", sem: "IV", date: "Oct 24, 2024", time: "09:00 AM", reqs: "1 / 1", alloc: "1 / 1", status: "PENDING" },
    { id: 1, subject: "Operating Systems", code: "CS-402", yearBranch: "2024 / CSE", sem: "IV", date: "May 12, 2024", time: "09:00 AM", reqs: "12 / 18", alloc: "12 / 18", status: "CONFIRMED" },
    { id: 2, subject: "Data Structures", code: "CS-201", yearBranch: "2026 / CSE", sem: "II", date: "May 12, 2024", time: "02:00 PM", reqs: "10 / 15", alloc: "8 / 15", status: "IN PROGRESS" },
    { id: 3, subject: "Applied Physics", code: "PY-101", yearBranch: "2027 / ALL", sem: "I", date: "May 13, 2024", time: "09:00 AM", reqs: "40 / 60", alloc: "0 / 0", status: "CONFLICT" },
    { id: 4, subject: "Thermodynamics", code: "ME-301", yearBranch: "2025 / MECH", sem: "III", date: "May 13, 2024", time: "09:00 AM", reqs: "15 / 22", alloc: "15 / 22", status: "CONFIRMED" },
    { id: 5, subject: "Discrete Mathematics", code: "MA-202", yearBranch: "2026 / CSE", sem: "II", date: "May 14, 2024", time: "02:00 PM", reqs: "25 / 35", alloc: "-- / --", status: "DRAFT" },
    { id: 6, subject: "Computer Networks", code: "CS-501", yearBranch: "2024 / CSE", sem: "V", date: "May 15, 2024", time: "09:00 AM", reqs: "14 / 20", alloc: "14 / 20", status: "CONFIRMED" },
    { id: 7, subject: "Machine Learning", code: "CS-601", yearBranch: "2024 / CSE", sem: "VI", date: "May 15, 2024", time: "02:00 PM", reqs: "10 / 12", alloc: "5 / 12", status: "IN PROGRESS" },
    { id: 8, subject: "Fluid Mechanics", code: "ME-401", yearBranch: "2025 / MECH", sem: "IV", date: "May 16, 2024", time: "09:00 AM", reqs: "18 / 25", alloc: "0 / 0", status: "CONFLICT" },
    { id: 9, subject: "Engineering Chemistry", code: "CH-101", yearBranch: "2027 / ALL", sem: "I", date: "May 16, 2024", time: "02:00 PM", reqs: "35 / 50", alloc: "35 / 50", status: "CONFIRMED" },
    { id: 10, subject: "Digital Logic Design", code: "EC-301", yearBranch: "2025 / ECE", sem: "III", date: "May 17, 2024", time: "09:00 AM", reqs: "20 / 30", alloc: "-- / --", status: "DRAFT" },
    { id: 11, subject: "Microprocessors", code: "EC-501", yearBranch: "2024 / ECE", sem: "V", date: "May 18, 2024", time: "09:00 AM", reqs: "15 / 20", alloc: "10 / 20", status: "IN PROGRESS" },
    { id: 12, subject: "Software Engineering", code: "CS-403", yearBranch: "2024 / CSE", sem: "IV", date: "May 18, 2024", time: "02:00 PM", reqs: "12 / 16", alloc: "12 / 16", status: "CONFIRMED" },
  ];

  const [upcomingExams, setUpcomingExams] = useState(() => {
    const exams = [...initialExams];
    if (localStorage.getItem("dutyConfirmed_ECON402") === "true") {
      const econExam = exams.find(e => e.code === "ECON-402");
      if (econExam) econExam.status = "CONFIRMED";
    }
    return exams;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      // If the professor confirms duty in another tab, update the admin dashboard
      if (e.key === "dutyConfirmed_ECON402" && e.newValue === "true") {
        setUpcomingExams(prev => 
          prev.map(exam => exam.code === "ECON-402" ? { ...exam, status: "CONFIRMED" } : exam)
        );
      }
    };

    // Note: The storage event only fires for changes made in *other* documents (tabs/windows)
    window.addEventListener("storage", handleStorageChange);
    
    // Also periodically poll in case it changes in the same window (e.g. they switch routes without reloading)
    const interval = setInterval(() => {
      if (localStorage.getItem("dutyConfirmed_ECON402") === "true") {
        setUpcomingExams(prev => 
          prev.map(exam => exam.code === "ECON-402" && exam.status !== "CONFIRMED" ? { ...exam, status: "CONFIRMED" } : exam)
        );
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const filteredExams = statusFilter === "All" 
    ? upcomingExams 
    : upcomingExams.filter(exam => exam.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / itemsPerPage));
  
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 pb-20 relative min-h-screen">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mt-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Operations Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Operational command center for real-time examination oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Schedule successfully exported as CSV.")}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Upload size={16} />
            Export Schedule
          </button>
          <button 
            onClick={() => alert("Auto-allocation process initiated for pending exams.")}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <Zap size={16} />
            Generate Allocation
          </button>
          <button 
            onClick={() => navigate("/admin/exams/add")}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Exam
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Upcoming Exams</h3>
            <Calendar size={18} className="text-primary-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">{upcomingExams.length}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
              12%
            </span>
          </div>
          <p className="text-xs text-slate-500">Scheduled for current semester</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocation Pending</h3>
            <ClipboardList size={18} className="text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">
              {upcomingExams.filter(e => e.status === "IN PROGRESS" || e.status === "DRAFT").length}
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Action Required</span>
          </div>
          <p className="text-xs text-slate-500">Rooms or faculty not yet assigned</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Conflicts</h3>
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">
              {upcomingExams.filter(e => e.status === "CONFLICT").length}
            </span>
            <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded">High Priority</span>
          </div>
          <p className="text-xs text-slate-500">Schedule or room overlaps detected</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unavailable Professors</h3>
            <UserMinus size={18} className="text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-slate-900">15</span>
            <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Leaves Noted</span>
          </div>
          <p className="text-xs text-slate-500">Medical or research leave period</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Exams</h2>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md appearance-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white cursor-pointer hover:bg-slate-50 transition shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="CONFLICT">Conflict</option>
              <option value="DRAFT">Draft</option>
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">SUBJECT</th>
                <th className="px-6 py-4">YEAR/BRANCH</th>
                <th className="px-6 py-4">SEM</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TIME</th>
                <th className="px-6 py-4">REQS (R/F)</th>
                <th className="px-6 py-4">ALLOC (R/F)</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm">
              {paginatedExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{exam.subject}</p>
                    <p className="text-slate-500 text-xs">{exam.code}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{exam.yearBranch}</td>
                  <td className="px-6 py-4 text-slate-700">{exam.sem}</td>
                  <td className="px-6 py-4 text-slate-700">{exam.date}</td>
                  <td className="px-6 py-4 text-slate-700">{exam.time}</td>
                  <td className="px-6 py-4 text-slate-700">{exam.reqs}</td>
                  <td className="px-6 py-4 font-medium">
                    <span className={`${
                      exam.alloc === exam.reqs ? "text-emerald-600" :
                      exam.alloc === "0 / 0" ? "text-red-600" :
                      exam.alloc === "-- / --" ? "text-slate-500" :
                      "text-amber-600"
                    }`}>
                      {exam.alloc}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide ${
                      exam.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                      exam.status === "IN PROGRESS" ? "bg-amber-100 text-amber-700" :
                      exam.status === "CONFLICT" ? "bg-red-100 text-red-700" :
                      "bg-slate-100 text-slate-700"
                    } whitespace-nowrap `}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      to={`/admin/exams/${exam.id}`}
                      className="text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 font-medium">
            Showing {filteredExams.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredExams.length)} of {filteredExams.length} exams
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-slate-300 rounded text-sm font-medium transition-colors ${
                currentPage === 1 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-white text-slate-600 hover:bg-slate-100"
              } whitespace-nowrap `}
            >
              Previous
            </button>
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages 
                  ? "bg-primary-300 text-white cursor-not-allowed" 
                  : "bg-primary-600 text-white hover:bg-primary-700"
              } whitespace-nowrap `}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Conflicts */}
      <Link 
        to="/admin/conflicts"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/30 font-semibold transition-transform hover:-translate-y-1"
      >
        <AlertCircle size={20} />
        {upcomingExams.filter(e => e.status === "CONFLICT").length} Active Conflicts
      </Link>
    </div>
  );
};

export default AdminDashboard;

