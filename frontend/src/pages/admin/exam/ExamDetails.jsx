import React from "react";
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Hourglass, 
  Printer, 
  Edit3, 
  MoreVertical, 
  Plus, 
  Building2, 
  BadgeCheck, 
  Info,
  Map
} from "lucide-react";

const ExamDetails = () => {
  return (
    <div className="space-y-6 pb-20 mt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 mb-2">
            <GraduationCap size={18} />
            <span className="text-sm font-semibold uppercase tracking-wide">COURSE CODE: CS402</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Operating Systems</h1>
          
          <div className="flex items-center gap-6 text-slate-600 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>May 24, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>09:00 AM — 12:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Hourglass size={18} />
              <span>3 Hours Session</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
            <Printer size={16} />
            Print Manifest
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            <Edit3 size={16} />
            Edit Allocation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* Left Column: Venues & Invigilators */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Venue & Invigilator Assignments</h2>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3 VENUES ASSIGNED</span>
          </div>

          {/* Venue Card 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Main Hall A</h3>
              <p className="text-sm text-slate-500 mt-1">Level 1, Engineering Block</p>
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">STAFF MEMBER</th>
                    <th className="px-6 py-3">ROLE</th>
                    <th className="px-6 py-3">STATUS</th>
                    <th className="px-6 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-medium flex items-center justify-center text-sm">JS</div>
                      <div>
                        <p className="font-semibold text-slate-900">Dr. Jane Smith</p>
                        <p className="text-xs text-slate-500">Dept. of Computer Science</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                        Chief Invigilator
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        <span className="text-primary-700 font-medium text-sm">Confirmed</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-medium flex items-center justify-center text-sm">RK</div>
                      <div>
                        <p className="font-semibold text-slate-900">Robert Kim</p>
                        <p className="text-xs text-slate-500">Senior Teaching Fellow</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                        Assistant
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <span className="text-slate-600 font-medium text-sm">Pending</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Venue Card 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Seminar Room 302</h3>
              <p className="text-sm text-slate-500 mt-1">Level 3, Informatics Hub</p>
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">STAFF MEMBER</th>
                    <th className="px-6 py-3">ROLE</th>
                    <th className="px-6 py-3">STATUS</th>
                    <th className="px-6 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-medium flex items-center justify-center text-sm">LM</div>
                      <div>
                        <p className="font-semibold text-slate-900">Linda Martinez</p>
                        <p className="text-xs text-slate-500">Exam Support Team</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded">
                        Invigilator
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        <span className="text-primary-700 font-medium text-sm">Confirmed</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Venue Button */}
          <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Plus size={20} />
            Assign Additional Venue
          </button>
        </div>

        {/* Right Column: Summary & Notices */}
        <div className="space-y-6">
          {/* Allocation Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Allocation Summary</h2>
            
            <div className="space-y-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 leading-none mb-1">03</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">TOTAL VENUES</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 leading-none mb-1">06</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">STAFF MEMBERS</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Confirmed Staff</span>
                <span className="font-bold text-slate-900">4 / 6</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Room Capacity</span>
                <span className="font-bold text-slate-900">245 / 275</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Resource Conflict</span>
                <span className="font-semibold italic text-primary-600">None Detected</span>
              </div>
            </div>
          </div>

          {/* System Notices Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info size={20} className="text-primary-600" />
              <h3 className="text-base font-bold text-slate-900">System Notices</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Allocation must be finalized 48 hours before the exam start time. All staff will receive an automated briefing pack once status is set to 'Confirmed'.
            </p>
          </div>

          {/* Image Card */}
          <div className="rounded-xl overflow-hidden relative shadow-sm group cursor-pointer border border-slate-200 h-48">
            <img 
              src="/university_venue_layout.png" 
              alt="Venue Layout" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 text-white font-medium">
                <Map size={18} />
                View Venue Layouts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
