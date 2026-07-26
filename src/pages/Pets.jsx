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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminPetsApi } from "../api/adminService";
import { TableSkeleton } from "../components/ui/Skeleton";

export default function Pets() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

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
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) =>
      adminPetsApi.rejectPet(id, reason || "Rejected by admin"),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminPetsApi.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
    },
  });

  const handleApprove = (id) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id) => {
    const reason = prompt("Enter rejection reason (optional):");
    rejectMutation.mutate({ id, reason });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pet listing?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const pets = data?.data?.pets || [];
  const totalPages = data?.data?.totalPages || 1;
  const total = data?.data?.total || 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400">Failed to load pets</p>
        <p className="text-sm text-neutral-500">
          Please check if the backend server is running
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50">Pet Posts Management</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Review, approve, or reject pet listings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search by name, type or breed..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-neutral-200 placeholder-neutral-500 outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="relative w-full sm:w-60">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Filter by city..."
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-neutral-200 placeholder-neutral-500 outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {["all", "approved", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={7} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-400 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Pet</th>
                    <th className="px-4 py-3 font-medium">Type/Breed</th>
                    <th className="px-4 py-3 font-medium">Age/Gender</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {pets.map((pet) => (
                    <tr
                      key={pet._id}
                      className="hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800">
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
                            <p className="font-medium text-neutral-200">
                              {pet.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              ID: {pet._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-neutral-200">{pet.type}</p>
                          <p className="text-xs text-neutral-500">{pet.breed}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {pet.age} yrs / {pet.gender}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {pet.city || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-neutral-200 text-sm">
                            {pet.userId?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {pet.userId?.email || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {pet.isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
                            <CheckCircle size={12} />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {pet.isApproved ? (
                            <button
                              onClick={() => handleReject(pet._id)}
                              disabled={rejectMutation.isPending}
                              className="p-1.5 rounded-md hover:bg-yellow-500/10 text-neutral-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(pet._id)}
                              disabled={approveMutation.isPending}
                              className="p-1.5 rounded-md hover:bg-green-500/10 text-neutral-400 hover:text-green-400 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/pets/${pet._id}`)}
                            className="p-1.5 rounded-md hover:bg-neutral-700 text-neutral-400 hover:text-blue-400 transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(pet._id)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
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
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-neutral-400"
                      >
                        No pets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400">Show:</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="appearance-none bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2 pr-8 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
                <span className="text-sm text-neutral-400">entries</span>
              </div>
              <p className="text-sm text-neutral-400">
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total} pets
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="p-2 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-neutral-300 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="p-2 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}