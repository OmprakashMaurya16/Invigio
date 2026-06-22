import React from "react";

const StatCard = ({ icon: Icon, label, value, change, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-on-surface-variant text-label-md font-medium">{label}</p>
          <p className="text-display-lg font-semibold text-on-surface mt-md">{value}</p>
          {change && (
            <p className={`text-caption mt-md font-medium ${trend === "up" ? "text-success-600" : "text-error-600"}`}>
              {trend === "up" ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-md bg-primary-50 rounded-lg">
            <Icon className="w-8 h-8 text-primary-600" strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
