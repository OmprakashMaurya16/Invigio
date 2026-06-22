import React, { useState } from "react";
import { Info, MapPin, Clock, Users, CheckCircle2 } from "lucide-react";

const initialIssues = [
  {
    id: 1,
    type: "Double Booking",
    typeColor: "red",
    timeAgo: "2m ago",
    title: "Hall A - Physics 101",
    subtitle: "Overlap with CS-404 Advanced Algorithms",
    details: {
      issueId: "CF-8291",
      date: "Thursday, Oct 24",
      time: "09:00 - 12:00",
      activeTitle: "Physics 101",
      activeStudents: "124 / 150 capacity",
      activeInvigilator: "Johnathan Doe",
      activePriority: "High",
      conflictTitle: "CS-404 Advanced",
      conflictStudents: "88 / 150 capacity",
      conflictInvigilator: "Dr. Emily Chen",
      conflictImpact: "Overlapping Slot",
      recommendation: "The system recommends moving **CS-404** to a different venue as Physics 101 has specific lab equipment requirements already present in Hall A.",
    },
    actions: [
      { id: 1, icon: MapPin, title: "Lab 204", subtitle1: "Capacity: 100 students", subtitle2: "Distance: 50m from Hall A", btnText: "Move CS-404 Here" },
      { id: 2, icon: Clock, title: "Postpone", subtitle1: "To: 14:00 - 17:00 Today", subtitle2: "Venue: Remains Hall A", btnText: "Shift Time Slot" },
      { id: 3, icon: Users, title: "Split Group", subtitle1: "Split into Seminar 1 & 2", subtitle2: "Requires +1 Invigilator", btnText: "Apply Split" }
    ]
  },
  {
    id: 2,
    type: "Unassigned Room",
    typeColor: "blue",
    timeAgo: "15m ago",
    title: "Economics Final",
    subtitle: "450 students, no venue capacity matches",
    details: {
      issueId: "CF-8292",
      date: "Friday, Oct 25",
      time: "14:00 - 17:00",
      activeTitle: "Economics Final",
      activeStudents: "450 Enrolled",
      activeInvigilator: "Pending Assignment",
      activePriority: "Critical",
      conflictTitle: "No Single Venue",
      conflictStudents: "Max available: 300 (Main Aud)",
      conflictInvigilator: "N/A",
      conflictImpact: "Capacity Exceeded",
      recommendation: "The system recommends splitting this exam across the Main Auditorium and Seminar Hall C.",
    },
    actions: [
      { id: 1, icon: Users, title: "Split Group", subtitle1: "Main Aud + Seminar C", subtitle2: "Requires +2 Invigilators", btnText: "Apply Split Allocation" }
    ]
  },
  {
    id: 3,
    type: "Invigilator Clash",
    typeColor: "slate",
    timeAgo: "1h ago",
    title: "Dr. Sarah Miller",
    subtitle: "Assigned to Hall B and Seminar Room 4",
    details: {
      issueId: "CF-8293",
      date: "Monday, Oct 28",
      time: "09:00 - 12:00",
      activeTitle: "Chemistry 101",
      activeStudents: "Hall B (120/150)",
      activeInvigilator: "Dr. Sarah Miller",
      activePriority: "Medium",
      conflictTitle: "Biology Lab",
      conflictStudents: "Seminar Room 4 (30/30)",
      conflictInvigilator: "Dr. Sarah Miller",
      conflictImpact: "Double Booked Staff",
      recommendation: "The system recommends assigning a backup invigilator (Prof. Mark Evans) to the Biology Lab session to free up Dr. Miller.",
    },
    actions: [
      { id: 1, icon: Users, title: "Reassign Backup", subtitle1: "Assign Prof. Mark Evans", subtitle2: "Status: Available", btnText: "Reassign to Biology" },
      { id: 2, icon: Clock, title: "Swap Duties", subtitle1: "Swap with Dr. John Kim", subtitle2: "Dr. Kim takes Biology", btnText: "Swap Invigilator" }
    ]
  },
  {
    id: 4,
    type: "Constraint",
    typeColor: "blue",
    timeAgo: "3h ago",
    title: "Special Needs (DS-12)",
    subtitle: "Quiet room required, currently in Main Hall",
    details: {
      issueId: "CF-8294",
      date: "Tuesday, Oct 29",
      time: "10:00 - 13:00",
      activeTitle: "Student DS-12",
      activeStudents: "Special Accommodations",
      activeInvigilator: "N/A",
      activePriority: "High",
      conflictTitle: "Main Hall Assignment",
      conflictStudents: "300 Students",
      conflictInvigilator: "Multiple",
      conflictImpact: "Environment Unsuitable",
      recommendation: "The system recommends moving student DS-12 to the Accessibility Center Room 2.",
    },
    actions: [
      { id: 1, icon: MapPin, title: "Accessibility Center", subtitle1: "Room 2 (Quiet Zone)", subtitle2: "Status: Available", btnText: "Relocate Student" }
    ]
  }
];

const ConflictManagement = () => {
  const [issues, setIssues] = useState(initialIssues);
  const [activeIssueId, setActiveIssueId] = useState(1);

  const handleResolve = (actionText) => {
    alert(`${actionText} successful. Issue resolved!`);
    setIssues(issues.filter(issue => issue.id !== activeIssueId));
    
    // Set next available issue as active
    const remaining = issues.filter(issue => issue.id !== activeIssueId);
    if (remaining.length > 0) {
      setActiveIssueId(remaining[0].id);
    } else {
      setActiveIssueId(null);
    }
  };

  const activeIssue = issues.find(i => i.id === activeIssueId);

  return (
    <div className="space-y-6 pb-20">
      <div className="mt-6">
        <p className="text-slate-500 text-sm">Triage and resolve scheduling overlaps and resource constraints.</p>
      </div>

      {issues.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">All Clear!</h2>
          <p className="text-slate-600">There are no active scheduling conflicts or issues at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Issue Queue */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Issue Queue ({issues.length})</div>
            
            {issues.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setActiveIssueId(issue.id)}
                className={`bg-white border-l-4 rounded-r-lg p-4 shadow-sm cursor-pointer transition-all ${
                  activeIssueId === issue.id 
                    ? "border border-slate-200 ring-2 ring-primary-500/20" 
                    : "border border-slate-200 opacity-70 hover:opacity-100 hover:bg-slate-50"
                } ${
                  issue.typeColor === "red" ? "border-l-red-500" :
                  issue.typeColor === "blue" ? "border-l-blue-500" :
                  "border-l-slate-500"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${
                    issue.typeColor === "red" ? "text-red-600" :
                    issue.typeColor === "blue" ? "text-blue-600" :
                    "text-slate-600"
                  }`}>
                    {issue.type}
                  </span>
                  <span className="text-xs text-slate-400">{issue.timeAgo}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{issue.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{issue.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Center Content: Issue Details */}
          {activeIssue && (
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Issue Details: {activeIssue.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">ID: {activeIssue.details.issueId} • {activeIssue.details.date} • {activeIssue.details.time}</p>
                  </div>
                  <button 
                    onClick={() => handleResolve("Auto-Resolution")}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Auto-Resolve
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Assignment</p>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{activeIssue.details.activeTitle}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Students:</span>
                        <span className="font-medium text-slate-900">{activeIssue.details.activeStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Invigilator:</span>
                        <span className="font-medium text-slate-900">{activeIssue.details.activeInvigilator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Priority:</span>
                        <span className="font-medium text-primary-600">{activeIssue.details.activePriority}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-red-200 bg-red-50/30 rounded-lg p-4">
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Conflicting Entry</p>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{activeIssue.details.conflictTitle}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Students:</span>
                        <span className="font-medium text-slate-900">{activeIssue.details.conflictStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Invigilator:</span>
                        <span className="font-medium text-slate-900">{activeIssue.details.conflictInvigilator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Impact:</span>
                        <span className="font-medium text-red-600">{activeIssue.details.conflictImpact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex gap-3">
                  <Info className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-slate-700 leading-relaxed" 
                     dangerouslySetInnerHTML={{
                       __html: activeIssue.details.recommendation.replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold text-slate-900">$1</span>')
                     }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Sidebar: Resolution Actions */}
          {activeIssue && (
            <div className="lg:col-span-3 space-y-4">
              {activeIssue.actions.map((action) => (
                <div key={action.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md">
                      <action.icon size={18} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{action.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{action.subtitle1}</p>
                  <p className="text-xs text-slate-500 mb-4">{action.subtitle2}</p>
                  <button 
                    onClick={() => handleResolve(action.btnText)}
                    className="w-full py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-semibold rounded-md transition-colors"
                  >
                    {action.btnText}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConflictManagement;
