import React, { useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";

const VenueManagement = () => {
  const [venues] = useState([
    {
      id: 1,
      name: "Main Hall A",
      building: "Engineering Block",
      capacity: "300",
      facilities: "Projector, AC",
    },
    {
      id: 2,
      name: "Main Hall B",
      building: "Science Block",
      capacity: "250",
      facilities: "AC, Speaker System",
    },
    {
      id: 3,
      name: "Seminar Room 302",
      building: "Mathematics Hub",
      capacity: "50",
      facilities: "Board, Projector",
    },
  ]);

  const columns = [
    { key: "name", label: "Venue Name" },
    { key: "building", label: "Building" },
    { key: "capacity", label: "Capacity" },
    { key: "facilities", label: "Facilities" },
  ];

  const actions = [
    { label: "View", onClick: () => alert("View venue") },
    { label: "Edit", onClick: () => alert("Edit venue") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Venue Management</h1>
          <p className="text-gray-600 mt-1">Manage examination venues and resources</p>
        </div>
        <Button>
          <Plus size={20} />
          Add Venue
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={venues} actions={actions} />
      </Card>
    </div>
  );
};

export default VenueManagement;
