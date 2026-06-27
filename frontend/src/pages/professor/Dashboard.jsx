import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import RequestCancellationModal from "./RequestCancellationModal";
import AvailabilityModal from "./AvailabilityModal";
import { getExams } from "../../services/exam";

const ProfessorDashboard = () => {
  const [showCancellation, setShowCancellation] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState(null);
  const [openExams, setOpenExams] = useState([]);
  
  const [dutyConfirmed, setDutyConfirmed] = useState(() => {
    return localStorage.getItem("dutyConfirmed_ECON402") === "true";
  });

  const handleConfirmDuty = () => {
    setDutyConfirmed(true);
    localStorage.setItem("dutyConfirmed_ECON402", "true");
  };
  
  // Selected dates (e.g., availability marked)
  const [selectedDates, setSelectedDates] = useState([28]); 
  
  // Confirmed duty dates (e.g., Oct 24th)
  const confirmedDates = dutyConfirmed ? [24] : [];

  const handleDateClick = (day) => {
    setModalInitialDate(day);
    setShowAvailabilityModal(true);
  };

  React.useEffect(() => {
    const fetchOpenExams = async () => {
      try {
        const data = await getExams({ status: "Scheduled" });
        setOpenExams(data.exams || []);
      } catch (error) {
        console.error("Failed to fetch open exams:", error);
      }
    };
    fetchOpenExams();
  }, []);

  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // Calculate days for the calendar grid
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const currentMonth = currentDate.getMonth();
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  
  // Padding from previous month
  const prevMonthDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }
  
  // Days of current month
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  
  // Padding for next month (to fill a 6x7 grid = 42 cells)
  const nextMonthDays = [];
  const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(i);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-slate-900">Professor Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your invigilation duties and availability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Upcoming Duty Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Duty</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-md tracking-wider whitespace-nowrap">
                CONFIRMED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm font-semibold text-slate-900">Advanced Macroeconomics (ECON-402)</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Room</p>
                <p className="text-sm font-semibold text-slate-900">Main Hall A, Level 2</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date & Time</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <Calendar size={16} className="text-primary-600" />
                  {currentMonthName} 24, {currentYear} • 09:00 AM - 12:00 PM
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Reporting Status</p>
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-slate-500" />
                  On standby - Arrive 20m early
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center gap-3">
              <button 
                onClick={handleConfirmDuty}
                disabled={dutyConfirmed}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dutyConfirmed 
                    ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" 
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                <CheckCircle2 size={16} />
                {dutyConfirmed ? "Duty Confirmed!" : "Confirm Duty"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                <AlertTriangle size={16} />
                Report Issue
              </button>
              <button 
                onClick={() => setShowCancellation(true)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <XCircle size={16} />
                Request Cancellation
              </button>
            </div>
          </div>

          {/* My Duties Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">My Duties</h2>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View All
              </button>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">{currentMonthName.substring(0, 3)} 28</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">Quant Finance</td>
                  <td className="px-5 py-3 text-slate-700">Lab 402</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md whitespace-nowrap">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">Next 02</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">Business Ethics</td>
                  <td className="px-5 py-3 text-slate-700">Auditorium 1</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md whitespace-nowrap">Confirmed</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">Next 15</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">Statistics II</td>
                  <td className="px-5 py-3 text-slate-700">Main Hall B</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md whitespace-nowrap">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Open Opportunities Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Open Opportunities</h2>
                <p className="text-xs text-slate-500 mt-1">Upcoming exams needing invigilators</p>
              </div>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View All
              </button>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {openExams.length > 0 ? (
                  openExams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-700">
                        {new Date(exam.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-900">{exam.subjectName}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => alert(`Successfully volunteered for ${exam.subjectName} duty!`)} className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-md text-xs font-semibold transition-colors shadow-sm whitespace-nowrap">
                          Volunteer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-5 py-8 text-center text-slate-500 text-sm">
                      No open opportunities right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-5">
          {/* Availability Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Availability</h2>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="mb-6 text-center">
              <h3 className="text-sm font-bold text-slate-900 mb-4">{currentMonthName} {currentYear}</h3>
              
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2 font-semibold text-slate-500 uppercase">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              
              <div className="grid grid-cols-7 gap-y-3 text-sm text-slate-700 text-center font-medium">
                {prevMonthDays.map((day, idx) => (
                  <div key={`prev-${idx}`} className="text-slate-300 mx-auto w-7 h-7 flex items-center justify-center">
                    {day}
                  </div>
                ))}
                
                {currentMonthDays.map((day) => (
                  <div
                    key={`curr-${day}`}
                    onClick={() => handleDateClick(day)}
                    className={`cursor-pointer mx-auto w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                      confirmedDates.includes(day)
                        ? "bg-emerald-500 text-white shadow-sm font-bold ring-2 ring-offset-1 ring-emerald-500"
                        : selectedDates.includes(day)
                        ? "bg-primary-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </div>
                ))}
                
                {nextMonthDays.map((day, idx) => (
                  <div key={`next-${idx}`} className="text-slate-300 mx-auto w-7 h-7 flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 italic text-center">
              Click on specific dates in the calendar to mark your availability.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 pb-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="font-bold text-slate-900 text-sm mr-2">Invigio</span>
          <span>© 2024 University Examination Operations Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">System Status</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Technical Support</a>
        </div>
      </footer>
      
      {/* Modals */}
      <RequestCancellationModal 
        isOpen={showCancellation} 
        onClose={() => setShowCancellation(false)} 
      />
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        initialDate={modalInitialDate}
      />
    </div>
  );
};

export default ProfessorDashboard;

