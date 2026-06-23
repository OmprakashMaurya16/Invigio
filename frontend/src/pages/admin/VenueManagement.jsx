import React, { useEffect, useState } from "react";
import { Plus, Eye, Edit3, Trash2 } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { getVenues, deleteVenue } from "../../services/venue";

const VenueManagement = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVenues = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVenues();
      setVenues(
        (data.venues || []).map((venue) => ({
          ...venue,
          name: `${venue.block} ${venue.room}`,
          building: venue.block,
          capacity: "N/A",
          facilities: "N/A",
        })),
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load venues.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (venueId) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      await deleteVenue(venueId);
      setVenues((prev) => prev.filter((venue) => venue._id !== venueId));
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete venue.");
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const columns = [
    { key: "name", label: "Venue Name" },
    { key: "building", label: "Building" },
    { key: "capacity", label: "Capacity" },
    { key: "facilities", label: "Facilities" },
  ];

  const actions = [
    { label: "View", onClick: () => window.alert("View venue details") },
    { label: "Edit", onClick: () => window.alert("Edit venue") },
    { label: "Delete", variant: "danger", onClick: (row) => handleDelete(row._id) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
          <p className="text-gray-600 mt-1">Manage examination venues and resources</p>
        </div>
        <Button onClick={() => window.alert("Add venue flow not implemented yet") }>
          <Plus size={20} />
          Add Venue
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <Card>
        <Table columns={columns} data={venues} actions={actions} loading={loading} />
      </Card>
    </div>
  );
};

export default VenueManagement;
