import React from "react";

const Card = ({ children, className = "", title, subtitle }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 ${className}`}>
      {(title || subtitle) && (
        <div className="px-lg py-md border-b border-slate-200">
          {title && <h3 className="text-headline-sm font-semibold text-on-surface">{title}</h3>}
          {subtitle && <p className="text-body-md text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={title || subtitle ? "px-lg py-md" : "p-lg"}>
        {children}
      </div>
    </div>
  );
};

export default Card;
