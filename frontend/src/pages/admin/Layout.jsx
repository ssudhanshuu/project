// frontend/src/pages/admin/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#111115] text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[76px] md:ml-[200px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
