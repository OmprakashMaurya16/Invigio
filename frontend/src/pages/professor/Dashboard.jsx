import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import RequestCancellationModal from "./RequestCancellationModal";

const ProfessorDashboard = () => {
  const [availableForDuty, setAvailableForDuty] = useState(true);
  const [morningOnly, setMorningOnly] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);

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
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-md tracking-wider">
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
                  Oct 24, 2024 • 09:00 AM - 12:00 PM
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
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
                <CheckCircle2 size={16} />
                Confirm Duty
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

          {/* My Assignments Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">My Assignments</h2>
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
                  <td className="px-5 py-3 text-slate-700">Oct 28</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">Quant Finance</td>
                  <td className="px-5 py-3 text-slate-700">Lab 402</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">Nov 02</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">Business Ethics</td>
                  <td className="px-5 py-3 text-slate-700">Auditorium 1</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">Confirmed</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-slate-700">Nov 15</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">Statistics II</td>
                  <td className="px-5 py-3 text-slate-700">Main Hall B</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">Pending</span>
                  </td>
                </tr>
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
              <h3 className="text-sm font-bold text-slate-900 mb-4">October 2024</h3>
              
              <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2 font-semibold text-slate-500 uppercase">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              
              <div className="grid grid-cols-7 gap-y-3 text-sm text-slate-700 text-center font-medium">
                <div className="text-slate-300">29</div>
                <div className="text-slate-300">30</div>
                <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div><div>12</div>
                <div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div><div>19</div>
                <div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div><div>26</div>
                <div>27</div><div>28</div><div>29</div><div>30</div><div>31</div>
                <div className="text-slate-300">1</div><div className="text-slate-300">2</div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md">
                <span className="text-sm font-medium text-slate-700">Available for Duty</span>
                <button 
                  onClick={() => setAvailableForDuty(!availableForDuty)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${availableForDuty ? 'bg-primary-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${availableForDuty ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50/50">
                <span className="text-sm font-medium text-slate-700">Morning Only</span>
                <button 
                  onClick={() => setMorningOnly(!morningOnly)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${morningOnly ? 'bg-primary-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${morningOnly ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              Toggling availability impacts all future scheduling requests.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-8 pb-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <span className="font-bold text-slate-900 text-sm mr-2">UniExam Ops</span>
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
    </div>
  );
};

export default ProfessorDashboard;
