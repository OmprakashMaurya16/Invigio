import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { getFaculty, deleteFaculty } from "../../services/faculty";

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFaculty = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getFaculty();
      setFaculty((data.faculty || []).map((member) => ({
        ...member,
        id: member._id,
      })));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load faculty.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty member?")) return;
    try {
      await deleteFaculty(id);
      setFaculty((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete faculty.");
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "phone", label: "Phone" },
    { key: "isActive", label: "Status", render: (row) => (row.isActive ? "Active" : "Inactive") },
  ];

  const actions = [
    { label: "View", onClick: () => window.alert("View faculty details") },
    { label: "Delete", variant: "danger", onClick: (row) => handleDelete(row._id) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600 mt-1">Manage professors and invigilator records</p>
        </div>
        <Button onClick={() => window.alert("Add faculty flow not implemented yet") }>
          <Plus size={20} />
          Add Faculty
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <Table columns={columns} data={faculty} actions={actions} loading={loading} />
      </Card>
    </div>
  );
};

export default FacultyManagement;
