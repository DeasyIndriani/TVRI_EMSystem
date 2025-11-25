
import React from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from './Button';

export const Layout: React.FC = () => {
  const { currentUser, logout } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) {
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, label, icon }: { to: string; label: string; icon?: React.ReactNode }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <button
        onClick={() => navigate(to)}
        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
          isActive 
            ? 'bg-tvriBlue text-white shadow-md' 
            : 'text-blue-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {label}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-tvriBlueDark flex flex-col shadow-xl z-20">
        {/* Sidebar Header / Logo */}
        <div className="h-16 flex items-center px-6 bg-tvriBlue shadow-sm">
          <div className="flex items-center gap-3">
             <div className="bg-white rounded-md p-1 flex items-center justify-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/29/TVRI_2023.svg" 
                  alt="TVRI" 
                  className="h-6 w-auto"
                />
             </div>
             <div>
               <h1 className="text-white text-base font-bold tracking-wide leading-tight">EMS</h1>
               <p className="text-blue-200 text-[10px] font-medium leading-tight">Mgmt. System</p>
             </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Menu Utama
          </div>

          {/* GLOBAL MENU FOR ALL ROLES */}
          <NavItem to="/cases" label={t('nav.cases')} icon="📂" />

          {/* REQUESTER SPECIFIC */}
          {(currentUser.role === 'requester' || currentUser.role === 'admin') && (
              <>
                <NavItem to="/cases/new" label={t('case.new')} icon="➕" />
              </>
          )}
          
          {/* REVIEWER SPECIFIC */}
          {(currentUser.role === 'reviewer' || currentUser.role === 'admin') && (
              <>
               <NavItem to="/division" label="Inbox Tugas" icon="📥" />
               <NavItem to="/division/executions" label="Eksekusi" icon="⚡" />
              </>
          )}
          
          {/* EXECUTIVE SPECIFIC */}
          {(currentUser.role === 'executive' || currentUser.role === 'admin') && (
              <>
                <NavItem to="/executive" label={t('nav.cockpit')} icon="✈️" />
                <NavItem to="/executive/kpi" label="KPI & Stats" icon="📊" />
              </>
          )}

          {/* ADMIN SPECIFIC */}
          {currentUser.role === 'admin' && (
              <>
                <div className="mt-6 px-4 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Admin Panel
                </div>
                <NavItem to="/admin/users" label="Manajemen User" icon="👥" />
                <NavItem to="/admin/divisions" label="Manajemen Divisi" icon="🏢" />
              </>
          )}
            
          <div className="mt-6 px-4 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Lainnya
          </div>
          <NavItem to="/kb" label={t('nav.kb')} icon="📚" />
        </nav>

        {/* Sidebar Footer (Optional info) */}
        <div className="p-4 bg-black/10 text-center">
          <p className="text-[10px] text-blue-300">v1.1.0 (Mock)</p>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP HEADER (User Info) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
           {/* Breadcrumb or Title placeholder */}
           <div className="text-lg font-medium text-gray-800">
              {/* Could be dynamic based on route, for now generic welcome */}
              Selamat Datang, <span className="text-tvriBlue font-bold">{currentUser.name.split(' ')[0]}</span>
           </div>

           {/* User Profile & Logout */}
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1">
                   <span className="text-xs text-gray-500 uppercase font-medium bg-gray-100 px-2 rounded-full">
                     {currentUser.role}
                   </span>
                   {currentUser.division && (
                     <span className="text-xs text-tvriBlue font-bold bg-blue-50 px-2 rounded-full border border-blue-100">
                       {currentUser.division}
                     </span>
                   )}
                </div>
              </div>
              <img 
                src={currentUser.avatar} 
                alt="Profile" 
                className="h-9 w-9 rounded-full bg-gray-200 border border-gray-300"
              />
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                {t('nav.logout')}
              </Button>
           </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 scroll-smooth">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>

          {/* Footer inside scroll area */}
          <footer className="mt-12 py-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2024 LPP TVRI. Executive Management System.
            </p>
          </footer>
        </main>

      </div>
    </div>
  );
};
