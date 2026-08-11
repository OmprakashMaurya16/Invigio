import React from "react";
import { X, Calendar, AlertTriangle } from "lucide-react";

const RequestCancellationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col">
        {}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Request Cancellation
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {}
        <div className="px-6 pb-6 space-y-5">
          {}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3">
            <Calendar className="text-primary-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Duty Details
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                Advanced Macroeconomics
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Oct 24, 2024 • 09:00 AM
              </p>
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Reason for Cancellation
            </label>
            <select className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none">
              <option value="" disabled selected>
                Select a reason...
              </option>
              <option value="medical">Medical Emergency</option>
              <option value="schedule_conflict">
                Unforeseen Schedule Conflict
              </option>
              <option value="personal">Personal Leave</option>
              <option value="other">Other</option>
            </select>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Additional Details
            </label>
            <textarea
              rows="3"
              placeholder="Provide more context for your request..."
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            ></textarea>
          </div>

          {}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3">
            <AlertTriangle
              className="text-red-500 flex-shrink-0 mt-0.5"
              size={18}
            />
            <p className="text-xs text-red-800 leading-relaxed">
              Cancellations within <span className="font-bold">48 hours</span>{" "}
              of the duty require administrative approval. This request will be
              forwarded to the Department Head.
            </p>
          </div>
        </div>

        {}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-50 text-primary-700 font-semibold text-sm rounded-md hover:bg-primary-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.success("Cancellation request submitted successfully!");
              onClose();
            }}
            className="px-6 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-md hover:bg-red-700 transition-colors shadow-sm"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCancellationModal;
