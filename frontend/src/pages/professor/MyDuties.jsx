import React, { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { getMyDuties, respondToDuty } from "../../services/duty";
import { useSocket } from "../../context/SocketContext";

const MyDuties = () => {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedDutyId, setSelectedDutyId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const socket = useSocket();

  const fetchDuties = async () => {
    try {
      const data = await getMyDuties();
      if (data.success) {
        setDuties(data.duties);
      }
    } catch (error) {
      toast.error("Failed to load duties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDuties();
  }, []);

  useEffect(() => {
    if (!socket) return;

    
    socket.on("new_exam_schedule", () => {
      toast.info("A new exam schedule has been posted! Refreshing duties...");
      fetchDuties(); 
    });

    
    socket.on("duty_status_update", (data) => {
      setDuties((prev) => 
        prev.map(duty => 
          duty._id === data.dutyId ? { ...duty, status: data.status } : duty
        )
      );
    });

    return () => {
      socket.off("new_exam_schedule");
      socket.off("duty_status_update");
    };
  }, [socket]);

  const handleRespond = async (id, status, reason = "") => {
    try {
      const response = await respondToDuty(id, status, reason);
      if (response.success) {
        toast.success(`Duty ${status.toLowerCase()}!`);
        
        setDuties((prev) => 
          prev.map(duty => duty._id === id ? { ...duty, status } : duty)
        );
        if (status === "Rejected") {
          setRejectModalOpen(false);
          setRejectionReason("");
          setSelectedDutyId(null);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} duty.`);
    }
  };

  const openRejectModal = (id) => {
    setSelectedDutyId(id);
    setRejectModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Duties</h1>
        <p className="text-gray-600 mt-1">View all your assigned invigilator duties</p>
      </div>

      {loading ? (
        <p className="text-gray-500 py-10 text-center">Loading your duties...</p>
      ) : duties.length > 0 ? (
        duties.map((duty) => (
          <Card key={duty._id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{duty.examId?.subjectName} ({duty.examId?.subjectCode})</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(duty.examId?.examDate).toLocaleDateString()} • {duty.examId?.startTime} - {duty.examId?.endTime}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  duty.status === "Accepted"
                    ? "bg-success-100 text-success-700"
                    : duty.status === "Rejected" 
                    ? "bg-red-100 text-red-700"
                    : "bg-warning-100 text-warning-700"
                } whitespace-nowrap `}>
                  {duty.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Venue</p>
                  <p className="text-gray-900 mt-1">
                    {duty.venueId 
                      ? `${duty.venueId.block} ${duty.venueId.room}` 
                      : "To be assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Role</p>
                  <p className="text-gray-900 mt-1">{duty.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Reporting Status</p>
                  <p className="text-gray-900 mt-1">
                    {duty.status === "Accepted" ? "Confirmed" : duty.status === "Rejected" ? "Declined" : "Pending Confirmation"}
                  </p>
                </div>
              </div>

              {duty.status === "Accepted" && (
                <div className="flex gap-3">
                  <Button size="sm" variant="secondary">
                    View Details
                  </Button>
                  <Button size="sm" variant="secondary">
                    Report Issue
                  </Button>
                </div>
              )}

              {duty.status === "Pending" && (
                <div className="flex gap-3">
                  <Button size="sm" onClick={() => handleRespond(duty._id, "Accepted")}>
                    Confirm Duty
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => openRejectModal(duty._id)}>
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <Clock size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No assigned duties</h2>
          <p className="text-gray-600">You do not have any invigilation duties assigned at the moment.</p>
        </Card>
      )}

      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Decline Duty</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a valid reason for declining this invigilation duty.
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
              placeholder="e.g., Medical leave, overlapping schedule..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleRespond(selectedDutyId, "Rejected", rejectionReason)}
                disabled={!rejectionReason.trim()}
              >
                Submit Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDuties;

