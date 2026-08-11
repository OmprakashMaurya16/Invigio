import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { getFaculty } from "../../services/faculty";

const InvigilatorManagement = () => {
  const [invigilators, setInvigilators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvigilators = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getFaculty();
        setInvigilators(
          (data.faculty || []).map((member) => ({
            id: member._id,
            name: member.name,
            department: member.department,
            available: member.isActive ? "Yes" : "No",
            exams: member.maxAssignmentsPerSemester ?? "—",
          })),
        );
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load faculty.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvigilators();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    {
      key: "available",
      label: "Available",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.available === "Yes"
              ? "bg-success-100 text-success-700"
              : "bg-warning-100 text-warning-700"
          } whitespace-nowrap `}
        >
          {row.available}
        </span>
      ),
    },
    { key: "exams", label: "Max Assignments" },
  ];

  const actions = [
    {
      label: "View",
      onClick: (row) => toast.info(`Viewing invigilator: ${row.name}`),
    },
    {
      label: "Edit",
      onClick: (row) =>
        toast.info(`Edit invigilator: ${row.name} - coming soon`),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invigilator Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage invigilators and their assignments
          </p>
        </div>
        <Button>
          <Plus size={20} />
          Add Invigilator
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <Table
          columns={columns}
          data={invigilators}
          actions={actions}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default InvigilatorManagement;
