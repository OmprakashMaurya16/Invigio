import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Table = ({
  columns,
  data,
  actions,
  loading = false,
  pagination,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-xl">
        <p className="text-on-surface-variant text-body-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-lg py-md text-left text-label-sm font-semibold text-on-surface uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {actions && <th className="px-lg py-md text-left text-label-sm font-semibold text-on-surface uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-lg py-md text-body-md text-on-surface">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-lg py-md text-body-md">
                  <div className="flex gap-md">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => action.onClick(row)}
                        className={`px-md py-1 rounded-lg text-label-sm font-medium transition-colors ${
                          action.variant === "danger"
                            ? "bg-error-50 text-error-700 hover:bg-error-100"
                            : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-lg py-md border-t border-slate-200 bg-slate-50">
          <p className="text-body-md text-on-surface-variant">
            Showing {pagination.from} to {pagination.to} of {pagination.total}
          </p>
          <div className="flex gap-md">
            <button
              onClick={() => onPageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="p-md hover:bg-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              onClick={() => onPageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="p-md hover:bg-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
