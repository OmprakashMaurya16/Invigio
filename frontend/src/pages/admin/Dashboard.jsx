import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, AlertTriangle, UserMinus, Upload, Zap, Plus, Eye, Filter, AlertCircle } from "lucide-react";
import { getExams } from "../../services/exam";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 5;

  const [upcomingExams, setUpcomingExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        if (data.success && data.exams) {
          const formattedExams = data.exams.map(exam => ({
            id: exam._id,
            subject: exam.subjectName,
            code: exam.subjectCode,
            yearBranch: `${exam.academicYear} / ${Array.isArray(exam.branch) ? exam.branch.join(", ") : exam.branch}`,
            sem: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][exam.semester - 1] || exam.semester,
            date: new Date(exam.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            time: exam.startTime,
            reqs: exam.volunteers?.length ? `${exam.volunteers.length} Vols` : "-- / --",
            alloc: "-- / --",
            status: exam.status?.toUpperCase() || "PENDING"
          }));
          setUpcomingExams(formattedExams);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };
    fetchExams();
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

