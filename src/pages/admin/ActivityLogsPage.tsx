import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { ActivityLog } from '../../types';
import { History, Shield, Clock, Search } from 'lucide-react';

export const ActivityLogsPage: React.FC = () => {
  const { getIdToken } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await getIdToken();
        const res = await fetch('/api/activity-logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.warn('Failed to fetch activity logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    return (
      log.actorName?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.entityType?.toLowerCase().includes(q)
    );
  });

  return (
    <ProtectedRoute requiredPermission="activity_logs.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <History className="w-4 h-4" /> AUDIT TRAIL & LOGS
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">ACTIVITY AUDIT LOGS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time security and administrative operation tracking. Passwords and sensitive secrets are never logged.
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit logs..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-4">Actor</th>
                    <th className="py-4 px-4">Action</th>
                    <th className="py-4 px-4">Entity Type</th>
                    <th className="py-4 px-6">Audit Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-zinc-500 font-mono">
                        Loading security audit trail...
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-zinc-500 font-mono">
                        No security activity recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-4 px-6 font-mono text-[11px] text-zinc-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-bold text-white">{log.actorName}</td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 rounded bg-zinc-950 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-zinc-400">{log.entityType}</td>
                        <td className="py-4 px-6 font-mono text-[11px] text-zinc-400">
                          {log.metadata ? JSON.stringify(log.metadata) : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
