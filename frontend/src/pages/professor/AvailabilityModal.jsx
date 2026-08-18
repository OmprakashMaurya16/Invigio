import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, AlertCircle, Clock } from "lucide-react";

const AvailabilityModal = ({ isOpen, onClose, initialDate }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timePreferences, setTimePreferences] = useState({
    morning: false,
    afternoon: false,
  });

  useEffect(() => {
    if (initialDate) {
      // Format: YYYY-MM-DD
      const dateStr = `2024-10-${String(initialDate).padStart(2, "0")}`;
      setStartDate(dateStr);
      setEndDate(dateStr);
    }
  }, [initialDate]);

  if (!isOpen) return null;

  // Mock data for occupied slots based on the date range
  const occupiedSlots = [
    { date: "2024-10-24", subject: "Advanced Macroeconomics", time: "09:00 AM - 12:00 PM" },
    { date: "2024-10-28", subject: "Quant Finance", time: "02:00 PM - 05:00 PM" },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    // Here we would typically save the availability preferences to the backend
    console.log("Saving availability:", { startDate, endDate, timePreferences });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Set Availability</h2>
            <p className="text-sm text-slate-500 mt-1">Specify when you are available for duty.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="availability-form" onSubmit={handleSave} className="space-y-6">
            
            {/* Date Range */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-primary-600" />
                Date Range
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Time Preferences */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-primary-600" />
                Available Timings
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={timePreferences.morning}
                    onChange={(e) => setTimePreferences(prev => ({ ...prev, morning: e.target.checked }))}
                    className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">Morning Slots</span>
                    <span className="text-xs text-slate-500">Usually 08:00 AM - 12:00 PM</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-md border border-transparent hover:border-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={timePreferences.afternoon}
                    onChange={(e) => setTimePreferences(prev => ({ ...prev, afternoon: e.target.checked }))}
                    className="w-4 h-4 rounded text-primary-600 border-slate-300 focus:ring-primary-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">Afternoon Slots</span>
                    <span className="text-xs text-slate-500">Usually 01:00 PM - 05:00 PM</span>
                  </div>
                </label>
              </div>
              <p className="text-xs text-slate-500 italic mt-2 ml-2">
                * Leave both unchecked if you are unavailable for this entire period.
              </p>
            </div>

            {/* Occupied Slots (Schedule) */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" />
                Schedule Conflicts
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                The following slots are already packed or occupied within your selected date range.
              </p>
              
              {occupiedSlots.length > 0 ? (
                <div className="space-y-2">
                  {occupiedSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div>
                        <p className="text-xs font-bold text-amber-900">{slot.date}</p>
                        <p className="text-sm font-medium text-amber-800 mt-0.5">{slot.subject}</p>
                      </div>
                      <span className="px-2 py-1 bg-white text-amber-700 text-xs font-semibold rounded shadow-sm whitespace-nowrap">
                        {slot.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-center">
                  <p className="text-sm text-slate-600 font-medium">No conflicts found!</p>
                  <p className="text-xs text-slate-500 mt-1">Your schedule is clear for this period.</p>
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 mt-auto">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-md transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="availability-form"
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-sm"
          >
            Confirm Availability
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AvailabilityModal;

