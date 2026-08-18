import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import RequestCancellationModal from "./RequestCancellationModal";
import AvailabilityModal from "./AvailabilityModal";
import { getExams, volunteerForExam } from "../../services/exam";
import { getMyDuties } from "../../services/duty";

const ProfessorDashboard = () => {
  const [showCancellation, setShowCancellation] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState(null);
  const [openExams, setOpenExams] = useState([]);
  const [requestedExams, setRequestedExams] = useState(new Set());
  
  const [dutyConfirmed, setDutyConfirmed] = useState(() => {
    return localStorage.getItem("dutyConfirmed_ECON402") === "true";
  });

  const [duties, setDuties] = useState([]);
  
  // Selected dates (e.g., availability marked)
  const [selectedDates, setSelectedDates] = useState([28]); 
  
  // Confirmed duty dates (dynamic from fetched duties)
  const [currentDateState, setCurrentDateState] = useState(new Date());

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
    const fetchDuties = async () => {
      try {
        const data = await getMyDuties();
        setDuties(data.duties || []);
      } catch (error) {
        console.error("Failed to fetch duties:", error);
      }
    };
    fetchOpenExams();
    fetchDuties();
  }, []);

  const handleVolunteer = async (exam) => {
    try {
      await volunteerForExam(exam._id);
      setRequestedExams(prev => new Set(prev).add(exam._id));
      alert(`Successfully volunteered for ${exam.subjectName} duty!`);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to volunteer");
    }
  };

  const currentMonthName = currentDateState.toLocaleString('default', { month: 'long' });
  const currentYear = currentDateState.getFullYear();
  
  // Calculate days for the calendar grid
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const currentMonth = currentDateState.getMonth();
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

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDateState(new Date(currentYear, currentMonth - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDateState(new Date(currentYear, currentMonth + 1, 1));
  };

  // Determine volunteer dates for current viewed month
  const volunteerDates = openExams
    .filter(exam => {
      const d = new Date(exam.examDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .map(exam => new Date(exam.examDate).getDate());

  // Determine today's date for highlighting
  const today = new Date();
  const isCurrentMonthViewed = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const todayDate = today.getDate();

  const confirmedDates = duties
    .filter(duty => {
      if (duty.status !== "Accepted" || !duty.examId?.examDate) return false;
      const d = new Date(duty.examId.examDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .map(duty => new Date(duty.examId.examDate).getDate());

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
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              {duties.length > 0 ? (() => {
                const upcomingDuty = duties.find(d => d.status === "Accepted");
                if (!upcomingDuty) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                      <p>No upcoming duties at the moment.</p>
                    </div>
                  );
                }
                return (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-bold text-slate-900">Next Upcoming Duty</h2>
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
                        CONFIRMED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Subject</p>
                        <p className="text-sm font-semibold text-slate-900">{upcomingDuty.examId?.subjectName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Room</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {upcomingDuty.venueId?.room ? `Room ${upcomingDuty.venueId.room}` : "TBD"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date & Time</p>
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <Calendar size={16} className="text-primary-600" />
                          {upcomingDuty.examId?.examDate ? new Date(upcomingDuty.examId.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                          {' • '} 
                          {upcomingDuty.examId?.startTime || "TBD"}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center gap-3">
                      <button 
                        disabled
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors bg-emerald-100 text-emerald-700 cursor-not-allowed"
                      >
                        <CheckCircle2 size={16} />
                        Duty Confirmed!
                      </button>
                      <button 
                        onClick={() => setShowCancellation(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                      >
                        <AlertTriangle size={16} />
                        Request Cancellation
                      </button>
                    </div>
                  </>
                );
              })() : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                  <p>No upcoming duties at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* My Duties Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">My Duties</h2>
              <Link to="/professor/duties" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View All
              </Link>
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
                  <td className="px-5 py-3 text-slate-700">Oct 28</td>
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
              <Link to="/professor/duties" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View All
              </Link>
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
                        {requestedExams.has(exam._id) || (exam.volunteers && exam.volunteers.includes(localStorage.getItem("userId") || "")) ? (
                           <button disabled className="px-3 py-1.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-md text-xs font-semibold shadow-sm whitespace-nowrap cursor-not-allowed">
                             Requested
                           </button>
                        ) : (
                          <button onClick={() => handleVolunteer(exam)} className="px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-md text-xs font-semibold transition-colors shadow-sm whitespace-nowrap">
                            Volunteer
                          </button>
                        )}
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
                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
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
                
                {currentMonthDays.map((day) => {
                  const isOctober2024 = currentMonth === 9 && currentYear === 2024;
                  const isConfirmed = isOctober2024 && confirmedDates.includes(day);
                  const isSelected = isOctober2024 && selectedDates.includes(day);
                  
                  return (
                  <div
                    key={`curr-${day}`}
                    onClick={() => handleDateClick(day)}
                    className={`cursor-pointer mx-auto w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                      isConfirmed
                        ? "bg-emerald-500 text-white shadow-sm font-bold ring-2 ring-offset-1 ring-emerald-500"
                        : volunteerDates.includes(day)
                        ? "bg-blue-500 text-white shadow-sm font-bold ring-2 ring-offset-1 ring-blue-500"
                        : isSelected
                        ? "bg-primary-600 text-white shadow-sm"
                        : (isCurrentMonthViewed && day === todayDate)
                        ? "border-2 border-primary-500 text-primary-700 font-bold bg-primary-50"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </div>
                  );
                })}
                
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

