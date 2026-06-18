import React, { useState } from "react";
import { Save } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";

const Availability = () => {
  const [availability, setAvailability] = useState({
    overall: "Available for Duty",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    morningOnly: false,
    afternoonOnly: false,
    weekendOnly: false,
  });

  const [selectedDates, setSelectedDates] = useState({
    unavailable: [],
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setAvailability((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("Availability updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
        <p className="text-gray-600 mt-1">Update your availability for invigilator duties</p>
      </div>

      {/* Current Status */}
      <Card title="Current Availability Status">
        <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
          <div>
            <p className="font-semibold text-success-900">Status</p>
            <p className="text-sm text-success-700 mt-1">{availability.overall}</p>
          </div>
          <span className="px-4 py-2 bg-success-100 text-success-700 rounded-full font-semibold">
            {availability.overall}
          </span>
        </div>
      </Card>

      {/* Availability Settings */}
      <Card title="Availability Preferences">
        <div className="space-y-6">
          {/* Time Period */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={availability.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={availability.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Time Preferences */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="morningOnly"
                  checked={availability.morningOnly}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Morning slots only (8:00 AM - 12:00 PM)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="afternoonOnly"
                  checked={availability.afternoonOnly}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Afternoon slots only (1:00 PM - 5:00 PM)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="weekendOnly"
                  checked={availability.weekendOnly}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Weekends only</span>
              </label>
            </div>
          </div>

          {/* Unavailable Dates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Unavailable Dates</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select specific dates when you are not available
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-center text-gray-600">Calendar component for date selection</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-6 border-t">
            <Button onClick={handleSave}>
              <Save size={20} />
              Save Availability
            </Button>
            <Button variant="secondary">
              Cancel
            </Button>
          </div>
        </div>
      </Card>

      {/* Availability History */}
      <Card title="Recent Updates">
        <div className="space-y-3">
          {[
            "Oct 15, 2024 - Marked unavailable: Oct 20, 21",
            "Oct 01, 2024 - Set availability: Oct 1 - Dec 31, 2024",
          ].map((update, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded text-sm text-gray-700">
              {update}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Availability;
