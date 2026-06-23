import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black">
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition lg:hidden ${sidebarOpen ? 'visible' : 'invisible opacity-0'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
