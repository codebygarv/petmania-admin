import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);   // icons-only mode
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
   <div className="min-h-screen bg-black text-white">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} />

      {/* Content Wrapper */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-60"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
