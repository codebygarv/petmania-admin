import React, { useState, useEffect } from "react";
import { Search, User, PawPrint, LayoutDashboard, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { title: "Dashboard", path: "/", icon: LayoutDashboard },
    { title: "Users Management", path: "/users", icon: User },
    { title: "Pets Management", path: "/pets", icon: PawPrint },
  ];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-fade-in">
        <div className="flex items-center px-4 border-b border-neutral-800">
          <Search size={20} className="text-neutral-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages or press Esc to close..."
            autoFocus
            className="w-full bg-transparent py-4 text-neutral-100 placeholder-neutral-500 outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <p className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Quick Navigation
          </p>
          {quickLinks
            .filter((l) => l.title.toLowerCase().includes(query.toLowerCase()))
            .map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => handleSelect(link.path)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-neutral-300 hover:bg-neutral-800 hover:text-orange-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm font-medium">{link.title}</span>
                  </div>
                  <ChevronRight size={16} className="text-neutral-600" />
                </button>
              );
            })}
        </div>

        <div className="p-3 bg-neutral-950/60 border-t border-neutral-800 text-xs text-neutral-500 flex items-center justify-between px-4">
          <span>Navigate with mouse or click item</span>
          <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">
            Esc to exit
          </span>
        </div>
      </div>
    </div>
  );
}
