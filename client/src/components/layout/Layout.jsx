import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu, FiBell } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}`}>
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiMenu className="w-5 h-5 text-gray-600" /></button>
              <div className="hidden sm:block"><p className="text-sm text-gray-500">Welcome back, <span className="text-gray-900 font-semibold">{user?.first_name || user?.firstName || 'Admin'}</span></p></div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiBell className="w-5 h-5 text-gray-500" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /></button>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center ml-2">
                <span className="text-primary-700 text-xs font-bold">{(user?.first_name?.[0] || user?.firstName?.[0] || 'A')}{(user?.last_name?.[0] || user?.lastName?.[0] || '')}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
};

export default Layout;
