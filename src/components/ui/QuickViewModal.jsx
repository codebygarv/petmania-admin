import React from "react";
import { X, ExternalLink, Calendar, MapPin, Mail, Phone, Shield, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickViewModal({ isOpen, onClose, data, type = "pet" }) {
  const navigate = useNavigate();

  if (!isOpen || !data) return null;

  const isPet = type === "pet";

  const handleFullDetails = () => {
    onClose();
    if (isPet) navigate(`/pets/${data._id}`);
    else navigate(`/users/${data._id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-neutral-900/95 border-l border-neutral-800 shadow-2xl h-full overflow-y-auto z-10 flex flex-col justify-between p-6 animate-fade-in">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Quick Inspector
              </span>
              <h2 className="text-xl font-bold text-neutral-50 mt-0.5">
                {isPet ? data.name : data.name || "Unknown User"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Image Banner */}
          {isPet && data.images?.[0] && (
            <div className="w-full h-48 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <img src={data.images[0]} alt={data.name} className="w-full h-full object-cover" />
            </div>
          )}

          {!isPet && data.profileImage && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orange-500/40 bg-neutral-950">
              <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Status Badges */}
          <div className="flex items-center gap-2">
            {isPet ? (
              data.isApproved ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
                  <CheckCircle size={12} /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full">
                  <Clock size={12} /> Pending Approval
                </span>
              )
            ) : data.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
                <CheckCircle size={12} /> Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold rounded-full">
                <Clock size={12} /> Email Unverified
              </span>
            )}

            {!isPet && data.isAdharVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold rounded-full">
                <Shield size={12} /> Aadhar Verified
              </span>
            )}
          </div>

          {/* Key Quick Fields */}
          <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
            {isPet ? (
              <>
                <div className="flex justify-between text-sm py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Type / Breed</span>
                  <span className="font-semibold text-neutral-200">{data.type} • {data.breed}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Age / Gender</span>
                  <span className="font-semibold text-neutral-200">{data.age} yrs • {data.gender}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Location</span>
                  <span className="font-semibold text-neutral-200">{data.city || "-"}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-neutral-400">Owner</span>
                  <span className="font-semibold text-neutral-200">{data.userId?.name || "Unknown"}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Email</span>
                  <span className="font-semibold text-neutral-200">{data.email}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Phone</span>
                  <span className="font-semibold text-neutral-200">{data.phoneNumber || "-"}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Location</span>
                  <span className="font-semibold text-neutral-200">{data.city || "-"}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-neutral-400">Joined</span>
                  <span className="font-semibold text-neutral-200">
                    {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "-"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="pt-4 border-t border-neutral-800 mt-6">
          <button
            onClick={handleFullDetails}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
          >
            <span>Open Full Page View</span>
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
