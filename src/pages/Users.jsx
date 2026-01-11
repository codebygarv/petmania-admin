import React, { useMemo, useState, useEffect } from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";

const sampleUsers = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    adhar: "https://via.placeholder.com/160x100?text=Adhar+1",
    pincode: "110001",
    cityState: "New Delhi, Delhi",
    address: "12/4 MG Road, Connaught Place",
    dob: "1990-05-12",
    verified: true,
    pwdChangeCount: 2,
  },
  {
    id: 2,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 91234 56789",
    adhar: "https://via.placeholder.com/160x100?text=Adhar+2",
    pincode: "400001",
    cityState: "Mumbai, Maharashtra",
    address: "Flat 5B, Marine Drive",
    dob: "1988-11-03",
    verified: false,
    pwdChangeCount: 0,
  },
  {
    id: 3,
    fullName: "Carlos Ruiz",
    email: "carlos.ruiz@example.com",
    phone: "+91 99876 54321",
    adhar: "https://via.placeholder.com/160x100?text=Adhar+3",
    pincode: "560001",
    cityState: "Bengaluru, Karnataka",
    address: "88 Brigade Road",
    dob: "1995-07-21",
    verified: true,
    pwdChangeCount: 1,
  },
  {
    id: 4,
    fullName: "Aisha Khan",
    email: "aisha.khan@example.com",
    phone: "+91 90123 45678",
    adhar: "https://via.placeholder.com/160x100?text=Adhar+4",
    pincode: "700001",
    cityState: "Kolkata, West Bengal",
    address: "24 Park Street",
    dob: "1992-02-14",
    verified: false,
    pwdChangeCount: 3,
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Users() {
  const [users, setUsers] = useState(sampleUsers);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.pincode.includes(q)
      );
    });
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function handleEdit(user) {
    const name = prompt("Edit full name", user.fullName);
    if (name && name.trim()) {
      setUsers((prev) => prev.map((p) => (p.id === user.id ? { ...p, fullName: name.trim() } : p)));
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <p className="text-sm text-gray-400">List with Adhar images and address details</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search name, email, phone or pincode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/3 placeholder-gray-400 text-sm px-3 py-2 rounded-md outline-none border border-white/8"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow text-white overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-400">
              <th className="px-3 py-2">FullName</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone Number</th>
              <th className="px-3 py-2">Adhar Card (Images)</th>
              <th className="px-3 py-2">Pincode</th>
              <th className="px-3 py-2">City & State</th>
              <th className="px-3 py-2">Address (Manually)</th>
              <th className="px-3 py-2">DOB</th>
              <th className="px-3 py-2">Verified</th>
              <th className="px-3 py-2">Password Change Count</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/6">
            {paginated.map((u) => (
              <tr key={u.id} className="hover:bg-white/3 align-top">
                <td className="px-3 py-3 align-middle">
                  <div className="font-medium">{u.fullName}</div>
                </td>
                <td className="px-3 py-3 align-middle text-gray-300">{u.email}</td>
                <td className="px-3 py-3 align-middle">{u.phone}</td>
                <td className="px-3 py-3 align-middle">
                  <img src={u.adhar} alt={`Adhar-${u.id}`} className="w-32 h-20 object-cover rounded-md border border-white/6" />
                </td>
                <td className="px-3 py-3 align-middle">{u.pincode}</td>
                <td className="px-3 py-3 align-middle">{u.cityState}</td>
                <td className="px-3 py-3 align-middle max-w-xs">{u.address}</td>
                <td className="px-3 py-3 align-middle">{formatDate(u.dob)}</td>
                <td className="px-3 py-3 align-middle">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.verified ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {u.verified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-3 py-3 align-middle">{u.pwdChangeCount}</td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert(`View ${u.fullName}`)} className="p-1 rounded-md hover:bg-white/5">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => handleEdit(u)} className="p-1 rounded-md hover:bg-white/5">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="p-1 rounded-md hover:bg-red-700/10 text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Showing <span className="text-white">{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> - <span className="text-white">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="text-white">{filtered.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-white/3 disabled:opacity-30"
            >
              Prev
            </button>

            <div className="px-3 py-1 rounded-md bg-white/6 text-sm">
              Page {page} / {totalPages}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-white/3 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}