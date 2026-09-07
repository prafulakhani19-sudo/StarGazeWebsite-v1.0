import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_PROJECTS, INITIAL_EQUIPMENT, INITIAL_EVENTS, INITIAL_DISTRIBUTION, INITIAL_NEWS } from '../../data/mockData';
import {
  Users,
  Film,
  Camera,
  Calendar,
  Globe,
  Newspaper,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const role = profile?.role || 'VIEWER';

  return (
    <ProtectedRoute requiredPermission="dashboard.view">
      <AdminLayout>
        <div className="space-y-8 font-sans">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                STARGAZE CMS CONTROL CENTER
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
                WELCOME BACK, {profile?.displayName?.toUpperCase() || 'ADMINISTRATOR'}
              </h1>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Logistics, film slate, rental equipment availability, and user management center. Authorized role: <span className="text-amber-400 font-mono font-bold">{role}</span>.
              </p>
            </div>

            <div className="shrink-0 flex gap-3 relative z-10 font-mono text-xs">
              <a
                href="/admin/profile"
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition"
              >
                My Profile
              </a>
              {role === 'SUPER_ADMIN' && (
                <a
                  href="/admin/users"
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/10"
                >
                  Manage Users
                </a>
              )}
            </div>
          </div>

          {/* ROLE-SPECIFIC METRIC STAT CARDS */}

          {/* 1. SUPER ADMIN METRICS */}
          {role === 'SUPER_ADMIN' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Total System Users</span>
                  <span className="text-3xl font-black text-white font-mono">1</span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">✓ Active Super Admin</span>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Film Projects</span>
                  <span className="text-3xl font-black text-white font-mono">{INITIAL_PROJECTS.length}</span>
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">3 Published • 1 Draft</span>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <Film className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Equipment Assets</span>
                  <span className="text-3xl font-black text-white font-mono">{INITIAL_EQUIPMENT.length}</span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">3 Available • 1 Rented</span>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Pending Enquiries</span>
                  <span className="text-3xl font-black text-white font-mono">2</span>
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">Rental & Distribution</span>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <Mail className="w-6 h-6" />
                </div>
              </div>
            </div>
          )}

          {/* 2. EQUIPMENT MANAGER DASHBOARD */}
          {role === 'EQUIPMENT_MANAGER' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
                <Camera className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="text-lg font-bold text-white uppercase font-mono">RENTAL INVENTORY</h3>
                <p className="text-3xl font-black text-white font-mono">{INITIAL_EQUIPMENT.length} Packages</p>
                <p className="text-xs text-zinc-400">ARRI ALEXA 35, Cooke Anamorphics, RED V-Raptor XL</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                <h3 className="text-lg font-bold text-white uppercase font-mono">AVAILABILITY RATE</h3>
                <p className="text-3xl font-black text-emerald-400 font-mono">75% Ready</p>
                <p className="text-xs text-zinc-400">3 packages available for immediate soundstage checkout</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
                <Mail className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="text-lg font-bold text-white uppercase font-mono">EQUIPMENT ENQUIRIES</h3>
                <p className="text-3xl font-black text-white font-mono">4 New</p>
                <p className="text-xs text-zinc-400">Rental inquiries pending DOP verification</p>
              </div>
            </div>
          )}

          {/* 3. EVENT MANAGER DASHBOARD */}
          {role === 'EVENT_MANAGER' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-2">
                <Calendar className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="text-lg font-bold text-white uppercase font-mono">UPCOMING PREMIERES</h3>
                <p className="text-3xl font-black text-white font-mono">{INITIAL_EVENTS.length} Events</p>
                <p className="text-xs text-zinc-400">Cannes Gala Premiere 2026 & Cinematography Masters</p>
              </div>
            </div>
          )}

          {/* Quick Action Cards & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-500" /> ACTIVE FILM SLATE SUMMARY
                </h3>
                <a href="/admin/projects" className="text-xs font-mono text-amber-400 hover:underline">
                  View All →
                </a>
              </div>

              <div className="space-y-3">
                {INITIAL_PROJECTS.slice(0, 3).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-white block">{proj.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Director: {proj.director} • {proj.genre}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        proj.status === 'PUBLISHED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status / Quick Log */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Clock className="w-4 h-4 text-amber-500" /> SECURITY STATUS
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-amber-400 font-mono uppercase block">Firebase Auth</span>
                  <span className="text-zinc-200">Email/Password Session Active</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-emerald-400 font-mono uppercase block">Firestore Security Rules</span>
                  <span className="text-zinc-200">Role-aware collection rules enforced</span>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-amber-400 font-mono uppercase block">Initial Super Admin</span>
                  <span className="text-zinc-200">praful.akhani19@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
