import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { createExamVenue, deleteExamVenue, getExamVenues, updateExamVenue } from "../../services/examVenue";
import { getExams } from "../../services/exam";
import { getVenues } from "../../services/venue";

const emptyForm = {
  examId: "",
  venueId: "",
  requiredInvigilators: "",
};

const AllocationManagement = () => {
  const [allocations, setAllocations] = useState([]);
  const [exams, setExams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [examResponse, venueResponse, allocationResponse] = await Promise.all([
        getExams(),
        getVenues(),
        getExamVenues(),
      ]);

      setExams(examResponse.exams || []);
      setVenues(venueResponse.venues || []);
      setAllocations(
        (allocationResponse.examVenues || []).map((allocation) => ({
          ...allocation,
          id: allocation._id,
          examId: allocation.examId?._id || allocation.examId,
          venueId: allocation.venueId?._id || allocation.venueId,
          examLabel: allocation.examId
            ? `${allocation.examId.subjectCode} - ${allocation.examId.subjectName}`
            : "Unknown exam",
          venueLabel: allocation.venueId
            ? `${allocation.venueId.block} ${allocation.venueId.room}`
            : "Unknown venue",
          status: allocation.examId?.status || "Unknown",
          examDate: allocation.examId?.examDate,
          timeSlot: allocation.examId
            ? `${allocation.examId.startTime} - ${allocation.examId.endTime}`
            : "",
        })),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load allocations.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingAllocation(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
    setError("");
  };

  const handleOpenEdit = (allocation) => {
    setEditingAllocation(allocation);
    setFormData({
      examId: allocation.examId || "",
      venueId: allocation.venueId || "",
      requiredInvigilators: allocation.requiredInvigilators || "",
    });
    setIsFormOpen(true);
    setError("");
  };

  const handleOpenDetails = (allocation) => {
    setSelectedAllocation(allocation);
    setIsDetailsOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedAllocation(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.examId) {
      setError("Please select an exam.");
      return;
    }

    if (!formData.venueId) {
      setError("Please select a venue.");
      return;
    }

    const requiredInvigilators = Number(formData.requiredInvigilators);
    if (!Number.isInteger(requiredInvigilators) || requiredInvigilators < 1) {
      setError("Required invigilators must be a positive number.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingAllocation) {
        await updateExamVenue(editingAllocation.id, {
          venueId: formData.venueId,
          requiredInvigilators,
        });
      } else {
        await createExamVenue({
          examId: formData.examId,
          venueId: formData.venueId,
          requiredInvigilators,
        });
      }

      await fetchData();
      handleCloseForm();
    } catch (err) {
      setError(err?.response?.data?.message || (editingAllocation ? "Unable to update allocation." : "Unable to create allocation."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (allocationId) => {
    if (!window.confirm("Delete this allocation?")) return;

    try {
      await deleteExamVenue(allocationId);
      setAllocations((prev) => prev.filter((allocation) => allocation.id !== allocationId));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete allocation.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { key: "examLabel", label: "Exam" },
    { key: "venueLabel", label: "Venue" },
    { key: "requiredInvigilators", label: "Required Invigilators" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === "Completed"
              ? "bg-success-100 text-success-700"
              : row.status === "Ongoing"
              ? "bg-primary-100 text-primary-700"
              : row.status === "Cancelled"
              ? "bg-error-100 text-error-700"
              : "bg-warning-100 text-warning-700"
          } whitespace-nowrap`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const actions = [
    { label: "View", onClick: (row) => handleOpenDetails(row) },
    { label: "Edit", onClick: (row) => handleOpenEdit(row) },
    { label: "Delete", variant: "danger", onClick: (row) => handleDelete(row.id) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Allocation Management</h1>
          <p className="text-gray-600 mt-1">Manage exam-to-venue allocations</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus size={20} />
          Generate Allocation
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <Table columns={columns} data={allocations} actions={actions} loading={loading} />
      </Card>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingAllocation ? "Edit Allocation" : "Create Allocation"}
              </h2>
              <button onClick={handleCloseForm} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Exam</label>
                  <select
                    name="examId"
                    value={formData.examId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={Boolean(editingAllocation)}
                  >
                    <option value="">Select exam</option>
                    {exams.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.subjectCode} - {exam.subjectName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                  <select
                    name="venueId"
                    value={formData.venueId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select venue</option>
                    {venues.map((venue) => (
                      <option key={venue._id} value={venue._id}>
                        {venue.block} {venue.room}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Required Invigilators</label>
                  <input
                    type="number"
                    name="requiredInvigilators"
                    min="1"
                    value={formData.requiredInvigilators}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (editingAllocation ? "Updating..." : "Creating...") : editingAllocation ? "Update Allocation" : "Create Allocation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailsOpen && selectedAllocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Allocation Details</h2>
              <button onClick={handleCloseDetails} className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-3">
              <div>
                <span className="text-sm font-semibold text-slate-500">Exam</span>
                <p className="text-slate-900">{selectedAllocation.examLabel}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500">Venue</span>
                <p className="text-slate-900">{selectedAllocation.venueLabel}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500">Required Invigilators</span>
                <p className="text-slate-900">{selectedAllocation.requiredInvigilators}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500">Status</span>
                <p className="text-slate-900">{selectedAllocation.status}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-500">Scheduled Time</span>
                <p className="text-slate-900">{selectedAllocation.timeSlot || "Not available"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationManagement;

