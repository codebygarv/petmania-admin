import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Shield,
  CheckCircle,
  Clock,
  Loader2,
  ToggleLeft,
  ToggleRight,
  User,
  Phone,
  Mail,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminPetsApi } from "../api/adminService";
import { TableSkeleton } from "../components/ui/Skeleton";
import ImageLightbox from "../components/ui/ImageLightbox";
import { useToast } from "../components/ui/Toast";

export default function PetDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pet", id],
    queryFn: () => adminPetsApi.getPetDetails(id),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => adminPetsApi.approvePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pet", id]);
      queryClient.invalidateQueries(["pets"]);
      addToast("Pet approved successfully!", "success");
    },
    onError: () => addToast("Failed to approve pet", "error"),
  });

  const rejectMutation = useMutation({
    mutationFn: (reason) => adminPetsApi.rejectPet(id, reason || "Rejected by admin"),
    onSuccess: () => {
      queryClient.invalidateQueries(["pet", id]);
      queryClient.invalidateQueries(["pets"]);
      addToast("Pet approval status updated", "info");
    },
    onError: () => addToast("Failed to update status", "error"),
  });

  const handleApproveToggle = (currentValue) => {
    if (currentValue) {
      rejectMutation.mutate("Approval revoked by admin");
    } else {
      approveMutation.mutate();
    }
  };

  const pet = data?.data?.pet;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400">Failed to load pet details</p>
        <button
          onClick={() => navigate("/pets")}
          className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700"
        >
          Back to Pets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/pets")}
          className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Pet Details</h1>
          <p className="text-sm text-neutral-400 mt-1">
            View and manage pet listing
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <TableSkeleton rows={3} cols={1} />
        </div>
      ) : pet ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pet Info Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-800">
                {pet.images?.[0] ? (
                  <img
                    src={pet.images[0]}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-50">
                  {pet.name}
                </h2>
                <p className="text-sm text-neutral-400">
                  {pet.type} / {pet.breed}
                </p>
              </div>
            </div>

            {/* Approval Toggle */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                Status Control
              </h3>

              <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {pet.isApproved ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <Clock size={20} className="text-yellow-400" />
                  )}
                  <div>
                    <p className="text-sm text-neutral-200">Approval Status</p>
                    <p className="text-xs text-neutral-500">
                      {pet.isApproved ? "Approved for adoption" : "Pending approval"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleApproveToggle(pet.isApproved)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className="flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {pet.isApproved ? (
                    <ToggleRight size={32} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={32} className="text-neutral-500" />
                  )}
                </button>
              </div>

              {(pet.isAdopted || false) && (
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <div>
                      <p className="text-sm text-green-400">Adopted</p>
                      <p className="text-xs text-green-400/70">
                        This pet has been adopted
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(approveMutation.isPending || rejectMutation.isPending) && (
                <div className="flex items-center justify-center gap-2 text-orange-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          </div>

          {/* Pet Details Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4">
              Pet Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Calendar size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Age</p>
                  <p className="text-sm text-neutral-200">{pet.age} years</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Shield size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Gender</p>
                  <p className="text-sm text-neutral-200">{pet.gender}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <MapPin size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Location</p>
                  <p className="text-sm text-neutral-200">
                    {pet.city && pet.state
                      ? `${pet.city}, ${pet.state}`
                      : pet.city || pet.state || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <MapPin size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Pin Code</p>
                  <p className="text-sm text-neutral-200">{pet.pinCode || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <MapPin size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Country</p>
                  <p className="text-sm text-neutral-200">{pet.country || "-"}</p>
                </div>
              </div>

              {pet.lastVaccinationDate && (
                <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <Calendar size={18} className="text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">
                      Last Vaccination
                    </p>
                    <p className="text-sm text-neutral-200">
                      {new Date(pet.lastVaccinationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Calendar size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Listed On</p>
                  <p className="text-sm text-neutral-200">
                    {pet.createdAt
                      ? new Date(pet.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
              </div>

              {pet.description && (
                <div className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <MapPin size={18} className="text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">Description</p>
                    <p className="text-sm text-neutral-200">{pet.description}</p>
                  </div>
                </div>
              )}

              {pet.color && pet.color !== "Unknown" && (
                <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <Shield size={18} className="text-neutral-400" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">Color</p>
                    <p className="text-sm text-neutral-200">{pet.color}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4">
              Owner Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <User size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Name</p>
                  <p className="text-sm text-neutral-200">
                    {pet.userId?.name || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Mail size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Email</p>
                  <p className="text-sm text-neutral-200">
                    {pet.userId?.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                <Phone size={18} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Phone</p>
                  <p className="text-sm text-neutral-200">
                    {pet.userId?.phoneNumber || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Images Card */}
          {pet.images && pet.images.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                  Pet Images Gallery
                </h3>
                <span className="text-xs text-orange-400">Click to view full screen</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pet.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                    className="cursor-pointer group relative overflow-hidden rounded-xl border border-neutral-800 hover:border-orange-500/50 transition-all"
                  >
                    <img
                      src={img}
                      alt={`${pet.name} - Image ${index + 1}`}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-neutral-400">Pet not found</p>
          <button
            onClick={() => navigate("/pets")}
            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg hover:bg-neutral-700"
          >
            Back to Pets
          </button>
        </div>
      )}

      {pet && pet.images && (
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          initialIndex={lightboxIndex}
          images={pet.images}
        />
      )}
    </div>
  );
}