import React, { useState } from "react";
import { Menu, Bell, Search, Command } from "lucide-react";
import { useLocation } from "react-router-dom";
import CommandPalette from "./ui/CommandPalette";

const pageTitles = {
  "/": "Dashboard",
  "/users": "Users Management",
  "/pets": "Pets Management",
  "/settings": "Settings",
};

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const title =
    pageTitles[location.pathname] ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(" / ") ||
    "Dashboard";

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            className="text-neutral-400 hover:text-orange-400 transition-colors"
            onClick={toggleSidebar}
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold tracking-wide text-neutral-200">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setCmdOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-400 text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            <Search size={14} />
            <span>Search...</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-neutral-400 hover:text-orange-400 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 z-40 animate-fade-in">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
                  <h3 className="text-sm font-semibold text-neutral-200">Notifications</h3>
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                    2 New
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-200">Pending Pet Listings</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        New pet listings are waiting for approval.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-200">User Verifications</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Aadhar identity documents pending review.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}