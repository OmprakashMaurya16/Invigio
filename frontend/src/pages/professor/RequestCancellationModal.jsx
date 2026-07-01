import React, { useEffect, useMemo, useState } from "react";
import { X, Calendar, AlertTriangle } from "lucide-react";
import { createCancellationRequest } from "../../services/cancellationRequest";

const RequestCancellationModal = ({ isOpen, onClose, exam }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setDetails("");
      setError("");
      setSuccess("");
      setSubmitting(false);
    }
  }, [isOpen]);

  const dutyLabel = useMemo(() => {
    if (!exam) return "Selected duty";
    return `${exam.subjectName || exam.subjectCode || "Duty"}`;
  }, [exam]);

  const dutyDate = useMemo(() => {
    if (!exam?.examDate) return "";
    return new Date(exam.examDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [exam]);

  const handleSubmit = async () => {
    if (!exam?._id || !reason) {
      setError("Please select a reason for the cancellation request.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createCancellationRequest({
        examId: exam._id,
        allocationId: exam.allocationId || null,
        reason,
        details,
      });

      setSuccess("Cancellation request submitted successfully.");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to submit cancellation request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Request Cancellation</h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-5">
          {/* Duty Details Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3">
            <Calendar className="text-primary-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Duty Details</p>
              <h3 className="text-sm font-bold text-slate-900">{dutyLabel}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{dutyDate ? `${dutyDate} • ${exam?.startTime || ""}` : "Selected duty"}</p>
            </div>
          </div>

          {/* Reason Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Reason for Cancellation
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              <option value="">Select a reason...</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Unforeseen Schedule Conflict">Unforeseen Schedule Conflict</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Additional Details
            </label>
            <textarea
              rows="3"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide more context for your request..."
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            ></textarea>
          </div>

          {/* Warning Alert */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-red-800 leading-relaxed">
              Cancellations within <span className="font-bold">48 hours</span> of the duty require administrative approval. This request will be forwarded to the Department Head.
            </p>
          </div>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-primary-50 text-primary-700 font-semibold text-sm rounded-md hover:bg-primary-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-md hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCancellationModal;
