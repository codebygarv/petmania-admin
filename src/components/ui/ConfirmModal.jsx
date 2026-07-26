import React from "react";
import { AlertCircle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  confirmVariant = "danger",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4 z-10 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
            <AlertCircle size={22} />
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-neutral-50">{title}</h3>
          <p className="text-sm text-neutral-400 mt-1">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
              confirmVariant === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
