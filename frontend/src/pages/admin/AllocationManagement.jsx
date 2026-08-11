import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Zap } from "lucide-react";
import { toast } from "react-toastify";
import {
  getExamVenues,
  createExamVenue,
  deleteExamVenue,
  generateAllocations,
} from "../../services/examVenue";
import { getExams } from "../../services/exam";
import { getVenues } from "../../services/venue";

const emptyForm = { examId: "", venueId: "", requiredInvigilators: 1 };

const statusBadge = (status) => {
  const map = {
    Scheduled: "bg-green-100 text-green-700",
    Completed: "bg-gray-100 text-gray-600",
    Cancelled: "bg-red-100 text-red-700",
    Draft: "bg-yellow-100 text-yellow-700",
  };
  const key = Object.keys(map).find(
    (k) => k.toLowerCase() === (status || "").toLowerCase(),
  );
  return key ? map[key] : "bg-gray-100 text-gray-600";
};

const AllocationManagement = () => {
  const [allocations, setAllocations] = useState([]);
  const [exams, setExams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAllocations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getExamVenues();
      setAllocations(data.examVenues || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load allocations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [examData, venueData] = await Promise.all([
        getExams(),
        getVenues(),
      ]);
      setExams(examData.exams || []);
      setVenues(venueData.venues || []);
    } catch (err) {
      // non-fatal
    }
  };

  useEffect(() => {
    fetchAllocations();
    fetchDropdowns();
  }, []);

  const openModal = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.examId || !form.venueId) {
      toast.error("Exam and venue are required.");
      return;
    }
    setSaving(true);
    try {
      await createExamVenue({
        examId: form.examId,
        venueId: form.venueId,
        requiredInvigilators: Number(form.requiredInvigilators),
      });
      toast.success("Allocation added successfully.");
      closeModal();
      fetchAllocations();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add allocation.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this allocation?")) return;
    try {
      await deleteExamVenue(id);
      toast.success("Allocation removed.");
      setAllocations((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to remove allocation.",
      );
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateAllocations();
      toast.success(data.message || "Allocations generated successfully.");
      fetchAllocations();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to generate allocations.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Allocation Management
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Assign venues to exams and generate invigilator allocations.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded transition-colors disabled:opacity-60"
          >
            <Zap size={15} />
            {generating ? "Generating..." : "Generate Allocations"}
          </button>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            <Plus size={16} />
            Add Venue to Exam
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Exam
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Venue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Required Invigilators
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Exam Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : allocations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No allocations found.
                  </td>
                </tr>
              ) : (
                allocations.map((alloc) => (
                  <tr key={alloc._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {alloc.examId?.subjectName || "—"}
                      {alloc.examId?.subjectCode && (
                        <span className="ml-1 text-gray-500 font-normal">
                          ({alloc.examId.subjectCode})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {alloc.venueId
                        ? `${alloc.venueId.block} ${alloc.venueId.room}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {alloc.requiredInvigilators ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(alloc.examId?.status)}`}
                      >
                        {alloc.examId?.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(alloc._id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Add Venue to Exam
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam
                </label>
                <select
                  name="examId"
                  value={form.examId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select exam</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.subjectName} ({exam.subjectCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <select
                  name="venueId"
                  value={form.venueId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select venue</option>
                  {venues.map((venue) => (
                    <option key={venue._id} value={venue._id}>
                      {venue.block} {venue.room} (Capacity: {venue.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Invigilators
                </label>
                <input
                  type="number"
                  name="requiredInvigilators"
                  value={form.requiredInvigilators}
                  onChange={handleChange}
                  min={1}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm rounded transition-colors"
                >
                  {saving ? "Saving..." : "Add Allocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationManagement;
