import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import { getExam, updateExam } from "../../../services/exam";

const EditExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    year: "",
    semester: "",
    branch: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    invigilators: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getExam(id);
        const exam = response.exam;

        setFormData({
          code: exam.subjectCode || "",
          name: exam.subjectName || "",
          year: exam.academicYear || "",
          semester: exam.semester ? String(exam.semester) : "",
          branch: Array.isArray(exam.branch) ? exam.branch.join(", ") : exam.branch || "",
          date: exam.examDate ? new Date(exam.examDate).toISOString().split("T")[0] : "",
          startTime: exam.startTime || "",
          endTime: exam.endTime || "",
          capacity: exam.capacity || "",
          invigilators: exam.invigilators || "",
          description: exam.description || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load exam details.");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.code ||
      !formData.name ||
      !formData.year ||
      !formData.semester ||
      !formData.branch ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const branchList = formData.branch
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (branchList.length === 0) {
      setError("Please provide at least one branch.");
      return;
    }

    setSubmitting(true);

    try {
      await updateExam(id, {
        subjectCode: formData.code,
        subjectName: formData.name,
        academicYear: formData.year,
        semester: Number(formData.semester),
        branch: branchList,
        examDate: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description,
      });
      navigate("/admin/exams");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update exam.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-600">Loading exam details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/exams")}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
          <p className="text-gray-600 mt-1">Update exam details (Exam ID: {id})</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">I</option>
                  <option value="2">II</option>
                  <option value="3">III</option>
                  <option value="4">IV</option>
                  <option value="5">V</option>
                  <option value="6">VI</option>
                  <option value="7">VII</option>
                  <option value="8">VIII</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branches *</label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g., CSE, ECE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple branches with commas.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Invigilators</label>
                <input
                  type="number"
                  name="invigilators"
                  value={formData.invigilators}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <Button variant="secondary" onClick={() => navigate("/admin/exams")}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Updating..." : "Update Exam"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditExam;

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button variant="secondary" onClick={() => navigate("/admin/exams")}>
              Cancel
            </Button>
            <Button type="submit">Update Exam</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

