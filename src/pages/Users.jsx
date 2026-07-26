import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  ChevronDown,
  Download,
  CheckSquare,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminUsersApi } from "../api/adminService";
import { TableSkeleton } from "../components/ui/Skeleton";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useToast } from "../components/ui/Toast";
import { exportToCsv } from "../utils/exportToCsv";

export default function Users() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("all");

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["users", search, page, pageSize, filter],
    queryFn: () =>
      adminUsersApi.getAll({
        search,
        page,
        limit: pageSize,
        isVerified: filter === "verified" ? "true" : undefined,
        isAdharVerified: filter === "adhar" ? "true" : undefined,
      }),
    keepPreviousData: true,
    retry: 1,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, data }) => adminUsersApi.verifyUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      addToast("User verified successfully!", "success");
    },
    onError: () => addToast("Failed to verify user", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminUsersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setSelectedUserIds((prev) => prev.filter((i) => i !== deletingUserId));
      addToast("User account deleted", "success");
    },
    onError: () => addToast("Failed to delete user", "error"),
  });

  const handleVerify = (id) => {
    verifyMutation.mutate({
      id,
      data: { isVerified: true, isAdharVerified: true, userVerified: true },
    });
  };

  const handleDeleteConfirm = () => {
    if (bulkDeleting) {
      selectedUserIds.forEach((id) => deleteMutation.mutate(id));
      setSelectedUserIds([]);
      setBulkDeleting(false);
    } else if (deletingUserId) {
      deleteMutation.mutate(deletingUserId);
      setDeletingUserId(null);
    }
  };

  const users = data?.data?.users || [];
  const totalPages = data?.data?.totalPages || 1;
  const total = data?.data?.total || 0;

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length && users.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u._id));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkVerify = () => {
    selectedUserIds.forEach((id) =>
      verifyMutation.mutate({
        id,
        data: { isVerified: true, isAdharVerified: true, userVerified: true },
      })
    );
    setSelectedUserIds([]);
  };

  const handleExportCSV = () => {
    exportToCsv("users_report.csv", users, {
      _id: "ID",
      name: "Name",
      email: "Email",
      phoneNumber: "Phone",
      isVerified: "Email Verified",
      isAdharVerified: "Aadhar Verified",
      createdAt: "Joined Date",
    });
    addToast("Exported users to CSV", "info");
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400">Failed to load users</p>
        <p className="text-sm text-neutral-500">Please check if the backend server is running</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">Users Management</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage and verify user accounts
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!users.length}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-neutral-200 placeholder-neutral-500 outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {["all", "verified", "pending"].map((f) => (
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

      {/* Bulk Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl animate-fade-in">
          <span className="text-sm font-medium text-orange-400">
            {selectedUserIds.length} user(s) selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkVerify}
              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Verify Selected
            </button>
            <button
              onClick={() => setBulkDeleting(true)}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table Section */}
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
                    <th className="px-4 py-3 w-10">
                      <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-white">
                        {users.length > 0 && selectedUserIds.length === users.length ? (
                          <CheckSquare size={18} className="text-orange-500" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Email Verified</th>
                    <th className="px-4 py-3 font-medium">Aadhar Verified</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-neutral-800/50 transition-colors ${
                        selectedUserIds.includes(user._id) ? "bg-orange-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleSelectUser(user._id)}
                          className="text-neutral-400 hover:text-white"
                        >
                          {selectedUserIds.includes(user._id) ? (
                            <CheckSquare size={18} className="text-orange-500" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-semibold text-sm shrink-0">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-neutral-200">
                            {user.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-400">{user.email}</td>
                      <td className="px-4 py-3 text-neutral-400">
                        {user.phoneNumber || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                            <CheckCircle size={12} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {user.isAdharVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">
                            <CheckCircle size={12} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium">
                            <Clock size={12} />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerify(user._id)}
                            disabled={verifyMutation.isPending}
                            className="p-1.5 rounded-md hover:bg-green-500/10 text-neutral-400 hover:text-green-400 transition-colors disabled:opacity-50"
                            title="Verify user"
                          >
                            <RefreshCw
                              size={16}
                              className={
                                verifyMutation.isPending ? "animate-spin" : ""
                              }
                            />
                          </button>
                          <button
                            onClick={() => navigate(`/users/${user._id}`)}
                            className="p-1.5 rounded-md hover:bg-neutral-700 text-neutral-400 hover:text-blue-400 transition-colors"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingUserId(user._id)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-neutral-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400">Show:</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="appearance-none bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm rounded-lg px-3 py-2 pr-8 cursor-pointer hover:bg-neutral-700 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>
              <p className="text-sm text-neutral-400">
                Page {page} of {totalPages} ({total} users)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="p-2 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="p-2 rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingUserId || bulkDeleting}
        onClose={() => {
          setDeletingUserId(null);
          setBulkDeleting(false);
        }}
        onConfirm={handleDeleteConfirm}
        title={bulkDeleting ? "Delete Selected Users?" : "Delete User Account?"}
        description={
          bulkDeleting
            ? `Are you sure you want to delete ${selectedUserIds.length} user accounts?`
            : "Are you sure you want to delete this user account?"
        }
      />
    </div>
  );
}