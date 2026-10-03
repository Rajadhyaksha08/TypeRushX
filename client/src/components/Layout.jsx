import React, { useState ,useEffect} from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
  refreshUser();
}, [location.pathname, refreshUser]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: '⌂' },
  { name: 'Typing Test', path: '/test', icon: '⌨' },
  { name: 'Missions', path: '/missions', icon: '🎯' },
  { name: 'Daily Challenge', path: '/daily-challenge', icon: '⚡' },
  { name: 'Results', path: '/results', icon: '📊' },
];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-slate-200 overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0d0d14] border-b border-gray-800 flex items-center justify-between px-4 z-20">
        <div className="font-mono text-[#00ff88] font-bold text-xl drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">
          TYPE⚡RUSH X
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-6 h-0.5 bg-current"></div>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-[#0d0d14] border-r-2 border-r-[#00ff88]/30 flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 hidden lg:block border-b border-gray-800/50">
          <h1 className="font-mono text-[#00ff88] font-bold text-2xl tracking-wider drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">
            TYPE⚡RUSH X
          </h1>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-gray-800/60 border-l-4 border-[#00d4ff] text-white shadow-[inset_0_0_10px_rgba(0,212,255,0.1)]' 
                    : 'text-slate-400 hover:bg-gray-800/40 hover:text-slate-200 border-l-4 border-transparent'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800/50 bg-[#0d0d14]">
          {user && (
            <div className="mb-4 px-2">
              <div className="font-medium text-slate-200">{user.name || 'Hacker'}</div>
              <div className="text-sm text-slate-500 truncate">{user.email || 'hacker@typerush.x'}</div>
              <div className="mt-2 inline-block px-2 py-1 rounded bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono border border-[#00ff88]/20">
                LEVEL {user.level || 1}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 flex items-center justify-center gap-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors border border-rose-500/20"
          >
            <span>🚪</span>
            <span className="font-medium">Disconnect</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0f] relative pt-16 lg:pt-0">
        <main className="min-h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
