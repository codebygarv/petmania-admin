import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const PREDEFINED_REASONS = [
  "Incomplete or missing details",
  "Low quality or unclear image",
  "Duplicate pet listing",
  "Inappropriate or restricted content",
  "Invalid location details",
];

export default function RejectionModal({ isOpen, onClose, onSubmit, petName }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason || "Rejected by admin");
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-10">
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2.5 text-yellow-500 font-semibold text-lg">
            <AlertTriangle size={20} />
            <span>Reject Pet Listing</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-neutral-300">
            Please select or specify a reason for rejecting{" "}
            <span className="font-semibold text-neutral-100">{petName || "this pet"}</span>:
          </p>

          <div className="flex flex-wrap gap-2">
            {PREDEFINED_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  reason === r
                    ? "bg-orange-500/20 border-orange-500 text-orange-400"
                    : "bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type custom rejection reason here..."
            rows={3}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
