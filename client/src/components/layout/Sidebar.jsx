import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiUserX, FiMap, FiBarChart2, FiSettings, FiLogOut, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/students', icon: FiUsers, label: 'Students' },
  { to: '/dropouts', icon: FiUserX, label: 'Dropouts' },
  { to: '/pathways', icon: FiMap, label: 'Pathways' },
  { to: '/reports', icon: FiBarChart2, label: 'Reports' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-600/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        {!collapsed && (
          <div className="overflow-hidden"><h1 className="text-sm font-bold text-white leading-tight">Dropout</h1><p className="text-[10px] text-gray-400">Re-entry Pathway</p></div>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 sidebar-scroll overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-400 text-xs font-bold">{user.first_name?.[0] || user.firstName?.[0] || 'A'}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user.first_name || user.firstName} {user.last_name || user.lastName}</p>
              <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <FiLogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
        {sidebarContent}
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 w-6 h-6 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-50">
          <FiChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] z-50">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
