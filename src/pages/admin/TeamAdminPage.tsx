import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  getTeam, saveCmsDocument, deleteCmsDocument, reorderCmsDocuments 
} from '../../lib/cmsService';
import { TeamMember, ContentStatus } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Users, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Check, X, 
  RefreshCw, Image as ImageIcon, AlertCircle, Star 
} from 'lucide-react';

export const TeamAdminPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TeamMember | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTeam();
      setTeam(data);
    } catch (err) {
      console.error('Error loading team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name) return;
    setSaving(true);

    try {
      const memberId = editingMember.id || `team-${Date.now()}`;
      const payload: TeamMember = {
        id: memberId,
        name: editingMember.name || '',
        role: editingMember.role || '',
        shortBio: editingMember.shortBio || '',
        fullBio: editingMember.fullBio || '',
        portraitUrl: editingMember.portraitUrl || '',
        portraitMediaId: editingMember.portraitMediaId || '',
        displayOrder: editingMember.displayOrder ?? (team.length + 1),
        featured: editingMember.featured ?? true,
        status: editingMember.status || 'PUBLISHED',
        focalPoint: editingMember.focalPoint || { x: 50, y: 40 },
        updatedAt: new Date().toISOString(),
      };

      await saveCmsDocument('team', memberId, payload, 'SAVE_TEAM_MEMBER');
      await loadData();
      setEditingMember(null);
    } catch (err) {
      console.error('Error saving team member:', err);
      alert('Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: TeamMember) => {
    try {
      await deleteCmsDocument('team', member.id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('Failed to delete member');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= team.length) return;

    const reordered = [...team];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setTeam(reordered);
    await reorderCmsDocuments('team', reordered.map((m) => m.id));
  };

  return (
    <ProtectedRoute requiredPermission="projects.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Users className="w-4 h-4" /> STUDIO LEADERSHIP
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">TEAM & EXECUTIVES CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage founders, production directors, camera department leaders, and executive studio profiles.
              </p>
            </div>

            <button
              onClick={() =>
                setEditingMember({
                  name: '',
                  role: '',
                  status: 'PUBLISHED',
                  featured: true,
                  displayOrder: team.length + 1,
                  focalPoint: { x: 50, y: 40 },
                })
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Add Team Profile
            </button>
          </div>

          {/* Team Grid */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading Studio Profiles...</span>
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
              <Users className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Team Members Found</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Add executives and production leaders to display on the studio page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, idx) => (
                <div
                  key={member.id}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-black border border-zinc-800 shrink-0 relative">
                        {member.portraitUrl ? (
                          <StargazeImage
                            src={member.portraitUrl}
                            alt={member.name}
                            focalPoint={member.focalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                            No Photo
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                          0{idx + 1} // {member.role}
                        </span>
                        <h3 className="text-base font-bold text-white uppercase">{member.name}</h3>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold inline-block ${
                            member.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-3">{member.shortBio}</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === team.length - 1}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(member)}
                        className="p-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit / Create Modal */}
          {editingMember && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 text-white my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-mono uppercase">
                        {editingMember.id ? 'Edit Team Profile' : 'Add Team Profile'}
                      </h2>
                      <p className="text-xs text-zinc-400">Executive and leadership showcase</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingMember(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={editingMember.name || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        placeholder="e.g. Satish Mohod"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Role / Designation *</label>
                      <input
                        type="text"
                        required
                        value={editingMember.role || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                        placeholder="e.g. Founder & Managing Director"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Portrait Media Picker */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Executive Portrait
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" /> Select from Library
                      </button>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-black border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                        {editingMember.portraitUrl ? (
                          <StargazeImage
                            src={editingMember.portraitUrl}
                            alt="Portrait"
                            focalPoint={editingMember.focalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                            No Image
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL or pick from library..."
                        value={editingMember.portraitUrl || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, portraitUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Short Biography (Card Overview)</label>
                    <textarea
                      rows={2}
                      value={editingMember.shortBio || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, shortBio: e.target.value })}
                      placeholder="Brief role and career focus..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Full Biography / Background</label>
                    <textarea
                      rows={3}
                      value={editingMember.fullBio || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, fullBio: e.target.value })}
                      placeholder="Detailed achievements, background, and studio portfolio..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Status</label>
                      <select
                        value={editingMember.status || 'PUBLISHED'}
                        onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as ContentStatus })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingMember.featured ?? true}
                          onChange={(e) => setEditingMember({ ...editingMember, featured: e.target.checked })}
                          className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4"
                        />
                        <span className="text-xs font-mono text-white">Feature on About Studio Page</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>Save Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Media Picker */}
          {showMediaPicker && (
            <MediaPickerModal
              isOpen={true}
              onClose={() => setShowMediaPicker(false)}
              categoryFilterDefault="team"
              onSelect={({ mediaId, url, focalPoint }) => {
                setEditingMember((prev) => ({
                  ...prev,
                  portraitMediaId: mediaId,
                  portraitUrl: url,
                  focalPoint,
                }));
                setShowMediaPicker(false);
              }}
            />
          )}

          {/* Delete Confirm Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-6 text-white text-center shadow-2xl">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Remove Team Member?</h3>
                  <p className="text-xs text-zinc-400">
                    This will remove &quot;{deleteConfirm.name}&quot; from the studio leadership directory.
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs rounded-xl font-bold"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
