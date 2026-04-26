import React from "react";
import { X, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, Clock } from "lucide-react";

export default function UserDetails({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-50">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-2xl">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-50">{user.name || "Unknown"}</h3>
              <p className="text-sm text-neutral-400">{user.email}</p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="flex gap-3">
            {user.isVerified ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm">
                <CheckCircle size={14} />
                Email Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
                <Clock size={14} />
                Email Pending
              </span>
            )}
            {user.isAdharVerified ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm">
                <Shield size={14} />
                Aadhar Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-full text-sm">
                <Clock size={14} />
                Aadhar Pending
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
              <Mail size={18} className="text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500 uppercase">Email</p>
                <p className="text-sm text-neutral-200">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
              <Phone size={18} className="text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500 uppercase">Phone</p>
                <p className="text-sm text-neutral-200">{user.phoneNumber || "-"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
              <MapPin size={18} className="text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500 uppercase">Location</p>
                <p className="text-sm text-neutral-200">
                  {user.city && user.state ? `${user.city}, ${user.state}` : user.city || user.state || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
              <Calendar size={18} className="text-neutral-400" />
              <div>
                <p className="text-xs text-neutral-500 uppercase">Joined</p>
                <p className="text-sm text-neutral-200">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "-"}
                </p>
              </div>
            </div>

            {user.dateOfBirth && (
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Calendar size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Date of Birth</p>
                  <p className="text-sm text-neutral-200">
                    {new Date(user.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {user.pinCode && (
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <MapPin size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Pin Code</p>
                  <p className="text-sm text-neutral-200">{user.pinCode}</p>
                </div>
              </div>
            )}

            {user.UserManualAddress && (
              <div className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <MapPin size={18} className="text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Address</p>
                  <p className="text-sm text-neutral-200">{user.UserManualAddress}</p>
                </div>
              </div>
            )}

            {user.adharCardNumber && (
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Shield size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Aadhar Card</p>
                  <p className="text-sm text-neutral-200">{user.adharCardNumber}</p>
                </div>
              </div>
            )}
          </div>

          {/* Aadhar Images */}
          {(user.adharCardFrontImage || user.adharCardBackImage) && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 uppercase">Aadhar Images</p>
              <div className="flex gap-3">
                {user.adharCardFrontImage && (
                  <div className="flex-1">
                    <p className="text-xs text-neutral-400 mb-1">Front</p>
                    <img
                      src={user.adharCardFrontImage}
                      alt="Aadhar Front"
                      className="w-full h-24 object-cover rounded-lg border border-neutral-700"
                    />
                  </div>
                )}
                {user.adharCardBackImage && (
                  <div className="flex-1">
                    <p className="text-xs text-neutral-400 mb-1">Back</p>
                    <img
                      src={user.adharCardBackImage}
                      alt="Aadhar Back"
                      className="w-full h-24 object-cover rounded-lg border border-neutral-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Image */}
          {user.profileImage && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 uppercase">Profile Image</p>
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border-2 border-neutral-700"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}