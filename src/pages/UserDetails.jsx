import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  Clock,
  Loader2,
  ToggleLeft,
  ToggleRight,
  PawPrint,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminUsersApi } from "../api/adminService";
import { TableSkeleton } from "../components/ui/Skeleton";

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => adminUsersApi.getUserDetails(id),
    enabled: !!id,
  });

  const { data: petsData, isLoading: petsLoading } = useQuery({
    queryKey: ["userPets", id],
    queryFn: () => adminUsersApi.getUserPets(id),
    enabled: !!id,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ field, value }) =>
      adminUsersApi.verifyUser(id, { [field]: value }),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", id]);
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleToggle = (field, currentValue) => {
    verifyMutation.mutate({ field, value: !currentValue });
  };

  const user = data?.data?.user;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400">Failed to load user details</p>
        <button
          onClick={() => navigate("/users")}
          className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/users")}
          className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">User Details</h1>
          <p className="text-sm text-neutral-400 mt-1">
            View and manage user verification
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <TableSkeleton rows={3} cols={1} />
        </div>
      ) : user ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-2xl">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-50">
                  {user.name || "Unknown"}
                </h2>
                <p className="text-sm text-neutral-400">{user.email}</p>
              </div>
            </div>

            {/* Verification Toggles */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                Verification Controls
              </h3>

              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-neutral-400" />
                  <div>
                    <p className="text-sm text-neutral-200">Email Verified</p>
                    <p className="text-xs text-neutral-500">
                      User has verified their email
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle("isVerified", user.isVerified)}
                  disabled={verifyMutation.isPending}
                  className="flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {user.isVerified ? (
                    <ToggleRight
                      size={32}
                      className="text-green-500"
                    />
                  ) : (
                    <ToggleLeft
                      size={32}
                      className="text-neutral-500"
                    />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-neutral-400" />
                  <div>
                    <p className="text-sm text-neutral-200">Aadhar Verified</p>
                    <p className="text-xs text-neutral-500">
                      User has verified their Aadhar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggle("isAdharVerified", user.isAdharVerified)
                  }
                  disabled={verifyMutation.isPending}
                  className="flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {user.isAdharVerified ? (
                    <ToggleRight
                      size={32}
                      className="text-green-500"
                    />
                  ) : (
                    <ToggleLeft
                      size={32}
                      className="text-neutral-500"
                    />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-neutral-400" />
                  <div>
                    <p className="text-sm text-neutral-200">User Verified</p>
                    <p className="text-xs text-neutral-500">
                      Full user verification status
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggle("userVerified", user.userVerified)
                  }
                  disabled={verifyMutation.isPending}
                  className="flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {user.userVerified ? (
                    <ToggleRight
                      size={32}
                      className="text-green-500"
                    />
                  ) : (
                    <ToggleLeft
                      size={32}
                      className="text-neutral-500"
                    />
                  )}
                </button>
              </div>

              {verifyMutation.isPending && (
                <div className="flex items-center justify-center gap-2 text-orange-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          </div>

          {/* User Details Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4">
              User Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Phone size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Phone</p>
                  <p className="text-sm text-neutral-200">
                    {user.phoneNumber || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <MapPin size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Location</p>
                  <p className="text-sm text-neutral-200">
                    {user.city && user.state
                      ? `${user.city}, ${user.state}`
                      : user.city || user.state || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Calendar size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Joined</p>
                  <p className="text-sm text-neutral-200">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              {user.dateOfBirth && (
                <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <Calendar size={18} className="text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">
                      Date of Birth
                    </p>
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
                    <p className="text-sm text-neutral-200">
                      {user.UserManualAddress}
                    </p>
                  </div>
                </div>
              )}

              {user.adharCardNumber && (
                <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <Shield size={18} className="text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">
                      Aadhar Card
                    </p>
                    <p className="text-sm text-neutral-200">
                      {user.adharCardNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images Card */}
          {(user.adharCardFrontImage ||
            user.adharCardBackImage ||
            user.profileImage) && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4">
                User Images
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.profileImage && (
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">Profile</p>
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-32 object-cover rounded-lg border border-neutral-700"
                    />
                  </div>
                )}
                {user.adharCardFrontImage && (
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">Aadhar Front</p>
                    <img
                      src={user.adharCardFrontImage}
                      alt="Aadhar Front"
                      className="w-full h-32 object-cover rounded-lg border border-neutral-700"
                    />
                  </div>
                )}
                {user.adharCardBackImage && (
                  <div>
                    <p className="text-xs text-neutral-400 mb-2">Aadhar Back</p>
                    <img
                      src={user.adharCardBackImage}
                      alt="Aadhar Back"
                      className="w-full h-32 object-cover rounded-lg border border-neutral-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User's Pets Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                User's Pets ({petsData?.data?.pets?.length || 0})
              </h3>
              <PawPrint size={18} className="text-orange-400" />
            </div>

            {petsLoading ? (
              <TableSkeleton rows={2} cols={1} />
            ) : petsData?.data?.pets && petsData.data.pets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {petsData.data.pets.map((pet) => (
                  <div
                    key={pet._id}
                    className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                    onClick={() => navigate(`/pets/${pet._id}`)}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
                      {pet.images?.[0] ? (
                        <img
                          src={pet.images[0]}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={20} className="text-neutral-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">
                        {pet.name}
                      </p>
                      <p className="text-xs text-neutral-500 capitalize">
                        {pet.type} • {pet.breed}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {pet.isAdopted ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                            Adopted
                          </span>
                        ) : pet.isApproved ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PawPrint size={32} className="text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-500">No pets listed by this user</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-neutral-400">User not found</p>
          <button
            onClick={() => navigate("/users")}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700"
          >
            Back to Users
          </button>
        </div>
      )}
    </div>
  );
}