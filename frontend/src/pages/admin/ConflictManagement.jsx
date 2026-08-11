import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { getConflicts, resolveConflict } from "../../services/conflict";

const STATUS_OPTIONS = ["Pending", "Under Review", "Resolved", "Dismissed"];

const statusBadge = (status) => {
  const map = {
    Pending: "bg-yellow-100 text-yellow-700",
    "Under Review": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
    Dismissed: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

const ConflictManagement = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [resolveForm, setResolveForm] = useState({
    status: "Pending",
    adminNotes: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchConflicts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getConflicts();
      setConflicts(data.conflicts || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load conflicts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  const openResolve = (conflict) => {
    setSelected(conflict);
    setResolveForm({
      status: conflict.status || "Pending",
      adminNotes: conflict.adminNotes || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setResolveForm({ status: "Pending", adminNotes: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await resolveConflict(selected._id, {
        status: resolveForm.status,
        adminNotes: resolveForm.adminNotes,
      });
      toast.success("Conflict updated successfully.");
      closeModal();
      fetchConflicts();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update conflict.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Conflict Management
        </h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Review and resolve scheduling conflicts reported by faculty.
        </p>
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
                  Professor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Exam
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Date Reported
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
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : conflicts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No conflicts found.
                  </td>
                </tr>
              ) : (
                conflicts.map((conflict) => (
                  <tr key={conflict._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {conflict.facultyId?.name ||
                        conflict.professorName ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {conflict.examId?.subjectName || conflict.examName || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {conflict.type || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(conflict.status)}`}
                      >
                        {conflict.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(conflict.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openResolve(conflict)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Resolve Conflict
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Professor:</span>{" "}
                {selected.facultyId?.name || "—"}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {selected.type || "—"}
              </p>
              {selected.description && (
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {selected.description}
                </p>
              )}
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={resolveForm.status}
                  onChange={(e) =>
                    setResolveForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <textarea
                  value={resolveForm.adminNotes}
                  onChange={(e) =>
                    setResolveForm((prev) => ({
                      ...prev,
                      adminNotes: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Optional notes for the faculty member..."
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictManagement;
