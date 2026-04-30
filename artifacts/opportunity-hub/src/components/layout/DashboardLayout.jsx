import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function DashboardLayout({ title }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setOpen(true)} title={title} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <footer className="text-center text-xs text-gray-400 py-4">
          OpportunityHub © {new Date().getFullYear()} — Built with MERN
        </footer>
      </div>
    </div>
  );
}
