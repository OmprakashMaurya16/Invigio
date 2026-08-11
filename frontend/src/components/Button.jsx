import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-colors duration-200 flex items-center gap-md justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants = {
    primary:
      "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-primary-600",
    secondary:
      "bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-on-surface disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-primary-600",
    danger:
      "bg-error-500 hover:bg-error-600 active:bg-error-700 text-white disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-error-500",
    outline:
      "border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-on-surface disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-primary-600",
  };

  const sizes = {
    sm: "px-md py-1 text-caption",
    md: "px-lg py-2 text-label-md",
    lg: "px-xl py-3 text-body-md",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
