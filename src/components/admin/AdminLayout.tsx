import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../permissions';
import { Permission } from '../../types';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Film,
  Camera,
  Calendar,
  Globe,
  Newspaper,
  Mail,
  Sliders,
  History,
  UserCheck,
  LogOut,
  KeyRound,
  ChevronDown,
  Bell,
  Search,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
  permission?: Permission;
  superAdminOnly?: boolean;
}

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const role = profile?.role || 'VIEWER';

  const navItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, permission: 'dashboard.view' },
    { label: 'Users', path: '/admin/users', icon: Users, superAdminOnly: true },
    { label: 'Projects Slate', path: '/admin/projects', icon: Film, permission: 'projects.view' },
    { label: 'Media Library', path: '/admin/media', icon: Camera, permission: 'projects.view' },
    { label: 'Equipment Rental', path: '/admin/equipment', icon: Camera, permission: 'equipment.view' },
    { label: 'Events & Premieres', path: '/admin/events', icon: Calendar, permission: 'events.view' },
    { label: 'Distribution', path: '/admin/distribution', icon: Globe, permission: 'distribution.view' },
    { label: 'Newsroom & PR', path: '/admin/news', icon: Newspaper, permission: 'news.view' },
    { label: 'Studio Enquiries', path: '/admin/enquiries', icon: Mail, permission: 'enquiries.view' },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: History, permission: 'activity_logs.view' },
    { label: 'Site Settings', path: '/admin/settings', icon: Sliders, permission: 'settings.view' },
  ];

  // Filter items based on user permissions & super admin restrictions
  const filteredNavItems = navItems.filter((item) => {
    if (item.superAdminOnly) {
      return role === 'SUPER_ADMIN';
    }
    if (item.permission) {
      return hasPermission(role, item.permission);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* HEADER */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6 z-40 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <a href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-extrabold shadow-md">
              <Sparkles className="w-5 h-5 fill-black" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-widest text-white block uppercase font-mono">
                STARGAZE CMS
              </span>
              <span className="text-[9px] tracking-widest text-amber-400 block uppercase font-mono">
                STUDIO CONTROL
              </span>
            </div>
          </a>
        </div>

        {/* Search Bar & Header Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 w-64 text-xs">
            <Search className="w-3.5 h-3.5 text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search CMS records..."
              className="bg-transparent text-white focus:outline-none w-full placeholder:text-zinc-600"
            />
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition"
            title="Preview Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" /> Public Site
          </a>

          {/* User Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 transition"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs uppercase overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.slice(0, 2).toUpperCase() || 'SA'
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-white block truncate max-w-[120px]">
                  {profile?.displayName || profile?.email || 'Admin'}
                </span>
                <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40 inline-block">
                  {role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 text-xs divide-y divide-zinc-800"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="px-4 py-3">
                  <p className="font-semibold text-white">{profile?.displayName}</p>
                  <p className="text-zinc-400 text-[11px] truncate">{profile?.email}</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-1">Role: {role}</p>
                </div>

                <div className="py-1">
                  <a
                    href="/admin/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                  >
                    <UserCheck className="w-4 h-4 text-amber-400" /> My Profile
                  </a>
                  <a
                    href="/admin/change-password"
                    className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" /> Change Password
                  </a>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => signOut().then(() => (window.location.href = '/admin/login'))}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-left"
                  >
                    <LogOut className="w-4 h-4" /> Secure Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`w-64 bg-zinc-900/90 border-r border-zinc-800 shrink-0 flex flex-col justify-between transition-all duration-300 z-30 ${
            mobileSidebarOpen ? 'fixed inset-y-16 left-0 bg-zinc-950 w-64 shadow-2xl' : 'hidden md:flex'
          }`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              NAVIGATION MODULES
            </div>

            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;

              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-amber-500/80'}`} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Role Summary Box at Bottom */}
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40 text-[11px]">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold mb-1">
              <Shield className="w-3.5 h-3.5" /> AUTHORIZED AS
            </div>
            <div className="text-zinc-300 font-bold font-mono uppercase">{role}</div>
            <div className="text-zinc-400 text-[10px] mt-0.5">
              {role === 'SUPER_ADMIN'
                ? 'Full system access & User Admin'
                : 'Role-based access active'}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-zinc-950 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
