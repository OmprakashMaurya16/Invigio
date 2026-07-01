import React, { useEffect, useState } from "react";
import { GraduationCap, Calendar, Clock, ArrowLeft, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import { cancelExam, getExam } from "../../../services/exam";

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getExam(id);
        setExam(response.exam);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load exam details.");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this exam?")) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await cancelExam(id);
      setExam((prev) => prev ? { ...prev, status: response.exam?.status || "Cancelled" } : prev);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to cancel exam.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-600">
        Loading exam details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-20">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
        <Button onClick={() => navigate("/admin/exams")}>Back to Exams</Button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="py-20 text-slate-600">No exam information found.</div>
    );
  }

  return (
    <div className="space-y-6 pb-20 mt-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 mb-2">
            <GraduationCap size={18} />
            <span className="text-sm font-semibold uppercase tracking-wide">COURSE CODE: {exam.subjectCode}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{exam.subjectName}</h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(exam.examDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{exam.startTime} — {exam.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Semester:</span>
              <span>{exam.semester}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate("/admin/exams")}>Back</Button>
          <Button onClick={() => navigate(`/admin/exams/edit/${id}`)}>Edit Exam</Button>
          {(exam?.status !== "Cancelled" && exam?.status !== "Completed") && (
            <Button variant="secondary" onClick={handleCancel} disabled={submitting}>
              {submitting ? "Cancelling..." : "Cancel Exam"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Exam Status</h2>
                <p className="mt-2 text-lg font-semibold text-slate-900">{exam.status}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Academic Year</h2>
                <p className="mt-2 text-lg font-semibold text-slate-900">{exam.academicYear}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Branches</h2>
                <p className="mt-2 text-lg font-semibold text-slate-900">{Array.isArray(exam.branch) ? exam.branch.join(", ") : exam.branch}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Exam Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Exam ID</p>
                <p className="mt-2">{exam._id}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Time Window</p>
                <p className="mt-2">{exam.startTime} to {exam.endTime}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Duration</p>
                <p className="mt-2">{exam.startTime && exam.endTime ? `${exam.startTime} - ${exam.endTime}` : "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Created On</p>
                <p className="mt-2">{exam.createdAt ? formatDate(exam.createdAt) : "N/A"}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info size={20} className="text-primary-600" />
              <h3 className="text-base font-bold text-slate-900">Important Details</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The exam will be scheduled and assigned to venues separately. Faculty assignments and venue allocations are managed in the allocation workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
