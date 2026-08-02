import React, { useState } from "react";
import { AlertCircle, X, Mail, Loader2 } from "lucide-react";

const PREDEFINED_RECHECK_REASONS = [
  "Aadhaar card image is blurry or unreadable",
  "Name on Aadhaar does not match profile name",
  "Aadhaar number does not match document",
  "Document corners or text are cut off",
  "Back side of Aadhaar card is missing or unclear",
  "Uploaded document is invalid or expired",
];

export default function RecheckModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
  userEmail,
  isLoading = false,
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit(reason.trim());
  };

  const handleClose = () => {
    if (isLoading) return;
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 space-y-4 z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle size={22} />
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-100">
            Request Profile Re-check
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            Flag{" "}
            <span className="font-medium text-neutral-200">
              {userName || "this user"}
            </span>{" "}
            for re-verification and send instructions to their email.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick preset chips */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400">
              Quick Reasons
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PREDEFINED_RECHECK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors text-left ${
                    reason === r
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium"
                      : "bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Reason Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-400">
              Feedback Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain what needs to be corrected or re-uploaded..."
              rows={3}
              required
              className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
            />
          </div>

          {/* Info notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-800/40 border border-neutral-800 text-neutral-400 text-xs">
            <Mail size={14} className="text-amber-400 shrink-0" />
            <span className="truncate">
              Dispatches directly to{" "}
              <span className="text-neutral-300 font-medium">
                {userEmail || "user's email"}
              </span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isLoading}
              className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                "Send Re-check"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
