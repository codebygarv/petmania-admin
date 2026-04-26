import React from "react";
import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Dashboard",
  "/users": "Users Management",
  "/pets": "Pets Management",
  "/settings": "Settings",
};

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();

  const title = pageTitles[location.pathname] ||
    location.pathname.split("/").filter(Boolean).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" / ") ||
    "Dashboard";

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
      <button
        className="text-neutral-400 hover:text-orange-400 transition-colors"
        onClick={toggleSidebar}
      >
        <Menu size={22} />
      </button>

      <h1 className="text-lg font-semibold tracking-wide text-neutral-200">{title}</h1>

      <button className="text-neutral-400 hover:text-orange-400 transition-colors">
        <Bell size={20} />
      </button>
    </header>
  );
}