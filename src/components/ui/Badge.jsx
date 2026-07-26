import React from "react";

const variants = {
  default: "bg-neutral-800 text-neutral-200 border-neutral-700",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function Badge({ children, variant = "default", className = "" }) {
  const variantClass = variants[variant] || variants.default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm backdrop-blur-sm transition-all ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
}
