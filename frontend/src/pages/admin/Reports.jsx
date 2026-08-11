import React, { useEffect, useState } from "react";
import {
  getDutySummary,
  getExamSummary,
  getConflictSummary,
} from "../../services/report";

const TABS = ["Duty Summary", "Exam Summary", "Conflict Summary"];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Duty Summary");
  const [dutyData, setDutyData] = useState([]);
  const [examData, setExamData] = useState([]);
  const [conflictData, setConflictData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTab = async (tab) => {
    setLoading(true);
    setError("");
    try {
      if (tab === "Duty Summary") {
        const data = await getDutySummary();
        setDutyData(data.duties || data.data || []);
      } else if (tab === "Exam Summary") {
        const data = await getExamSummary();
        setExamData(data.exams || data.data || []);
      } else if (tab === "Conflict Summary") {
        const data = await getConflictSummary();
        setConflictData(data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab]);

  const statusBadge = (status) => {
    const map = {
      Scheduled: "bg-green-100 text-green-700",
      Completed: "bg-gray-100 text-gray-600",
      Cancelled: "bg-red-100 text-red-700",
      Draft: "bg-yellow-100 text-yellow-700",
    };
    const key = Object.keys(map).find(
      (k) => k.toLowerCase() === (status || "").toLowerCase(),
    );
    return key ? map[key] : "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-600 mt-0.5">
          View duty, exam, and conflict summary reports.
        </p>
      </div>

      <div className="flex border-b border-gray-200 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">
          Loading report...
        </div>
      ) : (
        <>
          {activeTab === "Duty Summary" && (
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Professor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Accepted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Rejected
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Pending
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dutyData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No duty records found.
                        </td>
                      </tr>
                    ) : (
                      dutyData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {row.professor || row.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.department || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.total ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.accepted ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.rejected ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.pending ?? "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Exam Summary" && (
            <div className="bg-white border border-gray-200 rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Exam
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Total Duties
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Accepted Duties
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {examData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No exam records found.
                        </td>
                      </tr>
                    ) : (
                      examData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {row.exam || row.subjectName || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.code || row.subjectCode || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.date
                              ? new Date(row.date).toLocaleDateString("en-IN")
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}
                            >
                              {row.status || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.totalDuties ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.acceptedDuties ?? "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Conflict Summary" && (
            <div className="space-y-4">
              {!conflictData ? (
                <p className="text-center py-8 text-gray-500 text-sm">
                  No conflict data available.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total",
                        value: conflictData.total ?? 0,
                        color: "border-gray-200 bg-gray-50",
                      },
                      {
                        label: "Pending",
                        value: conflictData.pending ?? 0,
                        color: "border-yellow-200 bg-yellow-50",
                      },
                      {
                        label: "Resolved",
                        value: conflictData.resolved ?? 0,
                        color: "border-green-200 bg-green-50",
                      },
                      {
                        label: "Dismissed",
                        value: conflictData.dismissed ?? 0,
                        color: "border-red-200 bg-red-50",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`border ${stat.color} rounded p-4`}
                      >
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {conflictData.byType &&
                    Object.keys(conflictData.byType).length > 0 && (
                      <div className="bg-white border border-gray-200 rounded overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700">
                            By Type
                          </h3>
                        </div>
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Type
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                Count
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(conflictData.byType).map(
                              ([type, count]) => (
                                <tr key={type} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-gray-900">
                                    {type}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">
                                    {count}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
