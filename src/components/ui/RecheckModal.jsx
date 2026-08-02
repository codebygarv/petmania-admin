import React, { useState } from "react";
import { X, AlertTriangle, Mail, Send, Loader2 } from "lucide-react";

const PREDEFINED_RECHECK_REASONS = [
  "Aadhaar card image is blurry or unreadable",
  "Name on Aadhaar does not match profile name",
  "Aadhaar number does not match document",
  "Corners or details of the document are cut off",
  "Back side of Aadhaar card is missing or illegible",
  "Uploaded document is expired or invalid",
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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2.5 text-amber-500 font-semibold text-lg">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-neutral-100 font-semibold leading-tight text-base">
                Request Verification Re-check
              </h3>
              <p className="text-xs text-neutral-400 font-normal">
                Flag user for re-verification & send email notification
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-neutral-800/50 border border-neutral-800 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">User:</span>
              <span className="font-semibold text-neutral-200">{userName || "User"}</span>
            </div>
            {userEmail && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Email:</span>
                <span className="font-mono text-orange-400/90">{userEmail}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Common Quick Reasons
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PREDEFINED_RECHECK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left ${
                    reason === r
                      ? "bg-orange-500/20 border-orange-500 text-orange-300 font-medium"
                      : "bg-neutral-800/70 border-neutral-700/80 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Reason / Feedback Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why the profile/Aadhaar needs to be rechecked or re-uploaded..."
              rows={3}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
          </div>

          {/* Email dispatch notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs leading-relaxed">
            <Mail size={16} className="shrink-0 mt-0.5 text-orange-400" />
            <span>
              This feedback will be saved to the user's profile and immediately dispatched to{" "}
              <b className="text-orange-200">{userEmail || "the user's email"}</b> with instructions to resubmit.
            </span>
          </div>

          {/* Footer Actions */}
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
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending Recheck...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Recheck & Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
