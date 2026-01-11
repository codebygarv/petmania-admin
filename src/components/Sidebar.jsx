import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Users,
  Database,
  FileText,
  Settings,
  MoreHorizontal,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function Sidebar({ collapsed, mobileOpen }) {
  const navSections = [
    {
      title: "Home",
      links: [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        // { to: "/components", label: "Components", icon: <Folder size={18} /> }, 
        { to: "/team", label: "Team", icon: <Users size={18} /> },
      ],
    },
    {
      title: "Appl",
      links: [
        { to: "/users", label: "Users", icon: <Users size={18} /> }, 
        // { to: "/reports", label: "Reports", icon: <FileText size={18} /> }, 
      ],
    },
  ];

  const sidebarWidth = collapsed ? "w-20" : "w-60";

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 lg:hidden z-40"></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#0f0f0f] text-white border-r border-white/10
          flex flex-col justify-between transition-all duration-300 z-50
          ${sidebarWidth}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div>
          <div className="p-3 font-semibold text-lg border-b border-white/10">
            {!collapsed ? "Admin Dashboard" : "AD"}
          </div>

          {/* Navigation */}
          <nav className="mt-3 px-2 space-y-5">
            {navSections.map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <h3 className="text-[11px] uppercase text-gray-400 mb-1 px-2">
                    {section.title}
                  </h3>
                )}

                <div className="flex flex-col gap-1">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-md transition-all
                        ${isActive
                          ? "bg-orange-500/20 text-orange-400"
                          : "text-gray-300 hover:bg-orange-500/10 hover:text-orange-400"
                        }`
                      }
                    >
                      {link.icon}
                      {!collapsed && (
                        <span className="font-medium">{link.label}</span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Section */}
        <div className="border-t border-white/10 p-3">
          {/* Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                isActive
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-orange-500/10 hover:text-orange-400"
              }`
            }
          >
            <Settings size={18} />
            {!collapsed && <span className="font-medium">Settings</span>}
          </NavLink>

          {/* Profile */}
          <div className="mt-3 bg-white/5 px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=68"
                alt="avatar"
                className="w-7 h-7 rounded-full border border-orange-500/40"
              />
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold">codebygarv</p>
                  <p className="text-[11px] text-gray-400">
                    codebygarv@gmail.com
                  </p>
                </div>
              )}
            </div>
            {!collapsed && <MoreHorizontal size={18} />}
          </div>
        </div>
      </aside>
    </>
  );
}
