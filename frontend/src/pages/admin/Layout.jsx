// frontend/src/pages/admin/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
