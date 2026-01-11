import React from "react";
import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();

  const title = location.pathname
    .split("/")
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(" / ") || "Dashboard";

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-white/10 sticky top-0 z-30">
      <button
        className="text-gray-300 hover:text-orange-400"
        onClick={toggleSidebar}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold tracking-wide">{title}</h1>

      <Bell size={20} className="text-gray-300" />
    </header>
  );
}
