import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Image as ImageIcon,
  MapPin,
  Clock,
  ChevronDown,
  Download,
  CheckSquare,
  Square,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminPetsApi } from "../api/adminService";
import { TableSkeleton } from "../components/ui/Skeleton";
import RejectionModal from "../components/ui/RejectionModal";
import ConfirmModal from "../components/ui/ConfirmModal";
import QuickViewModal from "../components/ui/QuickViewModal";
import Tabs from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import { useToast } from "../components/ui/Toast";
import { exportToCsv } from "../utils/exportToCsv";

export default function Pets() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

  const [selectedPetIds, setSelectedPetIds] = useState([]);
  const [rejectingPet, setRejectingPet] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [quickViewPet, setQuickViewPet] = useState(null);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["pets", search, page, pageSize, filter, cityFilter],
    queryFn: () =>
      adminPetsApi.getAll({
        search,
        page,
        limit: pageSize,
        isApproved:
          filter === "approved"
            ? "true"
            : filter === "pending"
            ? "false"
            : undefined,
        city: cityFilter,
      }),
    keepPreviousData: true,
    retry: 1,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => adminPetsApi.approvePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      addToast("Pet approved successfully!", "success");
    },
    onError: () => addToast("Failed to approve pet", "error"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      adminPetsApi.rejectPet(id, reason || "Rejected by admin"),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      addToast("Pet listing rejected", "info");
    },
    onError: () => addToast("Failed to reject pet", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminPetsApi.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      setSelectedPetIds((prev) => prev.filter((i) => i !== deletingPetId));
      addToast("Pet listing deleted", "success");
    },
    onError: () => addToast("Failed to delete pet", "error"),
  });

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleRejectSubmit = (reason) => {
    if (rejectingPet) {
      rejectMutation.mutate({ id: rejectingPet._id, reason });
      setRejectingPet(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (bulkDeleting) {
      selectedPetIds.forEach((id) => deleteMutation.mutate(id));
      setSelectedPetIds([]);
      setBulkDeleting(false);
    } else if (deletingPetId) {
      deleteMutation.mutate(deletingPetId);
      setDeletingPetId(null);
    }
  };

  const pets = data?.data?.pets || [];
  const totalPages = data?.data?.totalPages || 1;
  const total = data?.data?.total || 0;

  const toggleSelectAll = () => {
    if (selectedPetIds.length === pets.length && pets.length > 0) {
      setSelectedPetIds([]);
    } else {
      setSelectedPetIds(pets.map((p) => p._id));
    }
  };

  const toggleSelectPet = (id) => {
    setSelectedPetIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    selectedPetIds.forEach((id) => approveMutation.mutate(id));
    setSelectedPetIds([]);
  };

  const handleExportCSV = () => {
    exportToCsv("pets_report.csv", pets, {
      _id: "ID",
      name: "Pet Name",
      type: "Type",
      breed: "Breed",
      age: "Age",
      gender: "Gender",
      city: "City",
      isApproved: "Is Approved",
    });
    addToast("Exported pets to CSV", "info");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400 font-semibold">Failed to load pets</p>
        <p className="text-sm text-neutral-500">
          Please check if the backend server is running
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Pet Posts Management</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Review, approve, or reject pet listings with quick inspection tools
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!pets.length}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-50 self-start sm:self-auto"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Search name, type or breed..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-neutral-200 placeholder-neutral-500 outline-none focus:border-orange-500/80 transition-colors text-sm"
            />
          </div>
          <div className="relative w-full sm:w-56">
            <MapPin
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Filter city..."
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-neutral-200 placeholder-neutral-500 outline-none focus:border-orange-500/80 transition-colors text-sm"
            />
          </div>
        </div>

        <Tabs
          tabs={[
            { id: "all", label: "All Listings" },
            { id: "approved", label: "Approved" },
            { id: "pending", label: "Pending Review" },
          ]}
          activeTab={filter}
          onChange={(newTab) => {
            setFilter(newTab);
            setPage(1);
          }}
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedPetIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl animate-fade-in shadow-xl shadow-orange-500/5 backdrop-blur-md">
          <span className="text-sm font-semibold text-orange-400">
            {selectedPetIds.length} pet listing(s) selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkApprove}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
            >
              Approve Selected
            </button>
            <button
              onClick={() => setBulkDeleting(true)}
              className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Glassmorphic Table Frame */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={7} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
                    <th className="px-4 py-3.5 w-10">
                      <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-white">
                        {pets.length > 0 && selectedPetIds.length === pets.length ? (
                          <CheckSquare size={18} className="text-orange-500" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3.5 font-semibold">Pet</th>
                    <th className="px-4 py-3.5 font-semibold">Type / Breed</th>
                    <th className="px-4 py-3.5 font-semibold">Age / Gender</th>
                    <th className="px-4 py-3.5 font-semibold">Location</th>
                    <th className="px-4 py-3.5 font-semibold">Owner</th>
                    <th className="px-4 py-3.5 font-semibold">Status</th>
                    <th className="px-4 py-3.5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {pets.map((pet) => (
                    <tr
                      key={pet._id}
                      className={`hover:bg-neutral-800/40 transition-colors ${
                        selectedPetIds.includes(pet._id) ? "bg-orange-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleSelectPet(pet._id)}
                          className="text-neutral-400 hover:text-white"
                        >
                          {selectedPetIds.includes(pet._id) ? (
                            <CheckSquare size={18} className="text-orange-500" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/60 shrink-0">
                            {pet.images?.[0] ? (
                              <img
                                src={pet.images[0]}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-100">{pet.name}</p>
                            <p className="text-[11px] text-neutral-500 font-mono">
                              ID: {pet._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-neutral-200">{pet.type}</p>
                          <p className="text-xs text-neutral-500">{pet.breed}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-300">
                        {pet.age} yrs / {pet.gender}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {pet.city || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-neutral-200 text-sm font-medium">
                            {pet.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {pet.userId?.email || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {pet.isApproved ? (
                          <Badge variant="success">
                            <CheckCircle size={12} /> Approved
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <Clock size={12} /> Pending Review
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {pet.isApproved ? (
                            <button
                              onClick={() => setRejectingPet(pet)}
                              disabled={rejectMutation.isPending}
                              className="p-2 rounded-lg hover:bg-amber-500/10 text-neutral-400 hover:text-amber-400 transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(pet._id)}
                              disabled={approveMutation.isPending}
                              className="p-2 rounded-lg hover:bg-emerald-500/10 text-neutral-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setQuickViewPet(pet)}
                            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-orange-400 transition-colors"
                            title="Quick View Inspector"
                          >
                            <SlidersHorizontal size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/pets/${pet._id}`)}
                            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-sky-400 transition-colors"
                            title="Full Page Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingPetId(pet._id)}
                            disabled={deleteMutation.isPending}
                            className="p-2 rounded-lg hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pets.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-neutral-400">
                        No pets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800/80 bg-neutral-950/40">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">Show:</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="appearance-none bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-3 py-1.5 pr-8 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Page {page} of {totalPages} ({total} pets)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick View Drawer Inspector */}
      <QuickViewModal
        isOpen={!!quickViewPet}
        onClose={() => setQuickViewPet(null)}
        data={quickViewPet}
        type="pet"
      />

      {/* Custom Modals */}
      <RejectionModal
        isOpen={!!rejectingPet}
        onClose={() => setRejectingPet(null)}
        onSubmit={handleRejectSubmit}
        petName={rejectingPet?.name}
      />

      <ConfirmModal
        isOpen={!!deletingPetId || bulkDeleting}
        onClose={() => {
          setDeletingPetId(null);
          setBulkDeleting(false);
        }}
        onConfirm={handleDeleteConfirm}
        title={bulkDeleting ? "Delete Selected Pets?" : "Delete Pet Listing?"}
        description={
          bulkDeleting
            ? `Are you sure you want to delete ${selectedPetIds.length} pet listings?`
            : "Are you sure you want to delete this pet listing?"
        }
      />
    </div>
  );
}