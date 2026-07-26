import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Settings,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import { logoutAction } from "../redux/actions/authActions";

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let adminUser = null;
  try {
    adminUser = JSON.parse(localStorage.getItem("admin_user"));
  } catch {
    adminUser = null;
  }

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  const handleNavClick = () => {
    if (mobileOpen && onClose) {
      onClose();
    }
  };

  const navSections = [
    {
      title: "Home",
      links: [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      ],
    },
    {
      title: "Management",
      links: [
        { to: "/users", label: "Users", icon: <Users size={18} /> },
        { to: "/pets", label: "Pets", icon: <PawPrint size={18} /> },
      ],
    },
  ];

  const sidebarWidth = collapsed ? "w-20" : "w-60";

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 lg:hidden z-40" />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-neutral-900 text-neutral-50 border-r border-neutral-800
          flex flex-col justify-between transition-all duration-300 z-50
          ${sidebarWidth}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div>
          <div className="p-3 font-semibold text-lg border-b border-neutral-800">
            {!collapsed ? "Admin Dashboard" : "AD"}
          </div>

          <nav className="mt-3 px-2 space-y-5">
            {navSections.map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <h3 className="text-[11px] uppercase text-neutral-500 mb-1 px-2 font-medium tracking-wide">
                    {section.title}
                  </h3>
                )}

                <div className="flex flex-col gap-1">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                          isActive
                            ? "bg-orange-500/20 text-orange-400"
                            : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
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

        <div className="border-t border-neutral-800 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 w-full mt-1 transition-colors"
          >
            <LogOut size={18} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>

          <div className="mt-3 bg-neutral-800 px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <img
                src="/sidebarProfile.png"
                alt="avatar"
                className="w-7 h-7 rounded-full border border-orange-500/40"
              />
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold text-neutral-200">
                    {adminUser?.name}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {adminUser?.email}
                  </p>
                  {/* <p className="text-[10px] text-neutral-500">
                    {adminUser?.role}
                  </p> */}
                </div>
              )}
            </div>
            {!collapsed && (
              <MoreHorizontal size={18} className="text-neutral-500" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}