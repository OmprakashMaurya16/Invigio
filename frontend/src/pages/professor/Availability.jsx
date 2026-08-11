import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getMyAvailability,
  saveAvailability,
} from "../../services/availability";

const TIME_PREFS = [
  { key: "morning", label: "Morning (8:00 AM – 12:00 PM)" },
  { key: "afternoon", label: "Afternoon (1:00 PM – 5:00 PM)" },
  { key: "evening", label: "Evening (5:00 PM – 9:00 PM)" },
];

const defaultForm = {
  isAvailable: true,
  startDate: "",
  endDate: "",
  timePreferences: [],
};

const Availability = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const data = await getMyAvailability();
        if (data.availability) {
          setForm({
            isAvailable: data.availability.isAvailable ?? true,
            startDate: data.availability.startDate
              ? data.availability.startDate.slice(0, 10)
              : "",
            endDate: data.availability.endDate
              ? data.availability.endDate.slice(0, 10)
              : "",
            timePreferences: data.availability.timePreferences || [],
          });
        }
      } catch (err) {
        // no existing availability, use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAvailable = () => {
    setForm((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const togglePref = (key) => {
    setForm((prev) => ({
      ...prev,
      timePreferences: prev.timePreferences.includes(key)
        ? prev.timePreferences.filter((p) => p !== key)
        : [...prev.timePreferences, key],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      setError("End date must be after start date.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveAvailability(form);
      toast.success("Availability saved successfully.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to save availability.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Availability</h1>
        <p className="text-sm text-gray-600 mt-0.5">
          Set your availability for invigilation duties.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white border border-gray-200 rounded p-6 space-y-5"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Available for Duty
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Toggle to mark yourself as available or unavailable.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAvailable}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              form.isAvailable ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.isAvailable ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div
          className={`space-y-5 transition-opacity ${!form.isAvailable ? "opacity-40 pointer-events-none" : ""}`}
        >
          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Available Period
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Time Preferences
            </p>
            <div className="space-y-2">
              {TIME_PREFS.map((pref) => (
                <label
                  key={pref.key}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={form.timePreferences.includes(pref.key)}
                    onChange={() => togglePref(pref.key)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{pref.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded transition-colors"
          >
            {saving ? "Saving..." : "Save Availability"}
          </button>
          <button
            type="button"
            onClick={() => setForm(defaultForm)}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Availability;
