import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  getPartners, saveCmsDocument, deleteCmsDocument, reorderCmsDocuments 
} from '../../lib/cmsService';
import { PartnerItem, ContentStatus } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  UserCheck, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Check, X, 
  RefreshCw, Image as ImageIcon, AlertCircle, ExternalLink 
} from 'lucide-react';

export const PartnersAdminPage: React.FC = () => {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerItem> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<PartnerItem | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPartners();
      setPartners(data);
    } catch (err) {
      console.error('Error loading partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner || !editingPartner.name) return;
    setSaving(true);

    try {
      const partnerId = editingPartner.id || `partner-${Date.now()}`;
      const payload: PartnerItem = {
        id: partnerId,
        name: editingPartner.name || '',
        category: editingPartner.category || 'Production Partner',
        logoUrl: editingPartner.logoUrl || '',
        logoMediaId: editingPartner.logoMediaId || '',
        websiteUrl: editingPartner.websiteUrl || '',
        description: editingPartner.description || '',
        displayOrder: editingPartner.displayOrder ?? (partners.length + 1),
        status: editingPartner.status || 'PUBLISHED',
        updatedAt: new Date().toISOString(),
      };

      await saveCmsDocument('partners', partnerId, payload, 'SAVE_PARTNER');
      await loadData();
      setEditingPartner(null);
    } catch (err) {
      console.error('Error saving partner:', err);
      alert('Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partner: PartnerItem) => {
    try {
      await deleteCmsDocument('partners', partner.id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting partner:', err);
      alert('Failed to delete partner');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= partners.length) return;

    const reordered = [...partners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setPartners(reordered);
    await reorderCmsDocuments('partners', reordered.map((p) => p.id));
  };

  return (
    <ProtectedRoute requiredPermission="projects.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <UserCheck className="w-4 h-4" /> ALLIANCES & DISTRIBUTION
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">INDUSTRY PARTNERS CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage partner brandings, studio alliances, network logos, and exact naming (e.g. Hungama Media Group / Orange City Production).
              </p>
            </div>

            <button
              onClick={() =>
                setEditingPartner({
                  name: '',
                  category: 'Production Partner',
                  status: 'PUBLISHED',
                  displayOrder: partners.length + 1,
                })
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Add Industry Partner
            </button>
          </div>

          {/* Partner Grid */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading Partner Roster...</span>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
              <UserCheck className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Partners Found</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Add broadcast partners, OTT platforms, co-producers, and sponsors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner, idx) => (
                <div
                  key={partner.id}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-black/60 border border-zinc-800 shrink-0 flex items-center justify-center p-2 relative">
                        {partner.logoUrl ? (
                          <StargazeImage
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-zinc-600 font-mono">No Logo</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                          0{idx + 1} // {partner.category}
                        </span>
                        <h3 className="text-base font-bold text-white uppercase">{partner.name}</h3>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold inline-block ${
                            partner.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {partner.status}
                        </span>
                      </div>
                    </div>

                    {partner.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2">{partner.description}</p>
                    )}

                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/80 hover:text-amber-300"
                      >
                        <ExternalLink className="w-3 h-3" /> Visit Partner URL
                      </a>
                    )}
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
                        disabled={idx === partners.length - 1}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        title="Edit Partner"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(partner)}
                        className="p-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                        title="Delete Partner"
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
          {editingPartner && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 text-white my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-mono uppercase">
                        {editingPartner.id ? 'Edit Partner Entry' : 'Add Partner Entry'}
                      </h2>
                      <p className="text-xs text-zinc-400">Alliance, co-producer, or distribution label</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingPartner(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Partner / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPartner.name || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                      placeholder="e.g. Hungama Media Group, Orange City Production"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Alliance Category</label>
                      <input
                        type="text"
                        value={editingPartner.category || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, category: e.target.value })}
                        placeholder="e.g. Distribution Partner, Co-Producer, Media"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Status</label>
                      <select
                        value={editingPartner.status || 'PUBLISHED'}
                        onChange={(e) => setEditingPartner({ ...editingPartner, status: e.target.value as ContentStatus })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  {/* Logo Picker */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Partner Logo
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
                      <div className="w-24 h-16 bg-black border border-zinc-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                        {editingPartner.logoUrl ? (
                          <StargazeImage
                            src={editingPartner.logoUrl}
                            alt="Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="text-[10px] text-zinc-600 font-mono">No Logo</div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Logo image URL or pick from library..."
                        value={editingPartner.logoUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, logoUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Partner Website URL (Optional)</label>
                    <input
                      type="text"
                      value={editingPartner.websiteUrl || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, websiteUrl: e.target.value })}
                      placeholder="e.g. https://hungama.com"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Collaboration Summary (Optional)</label>
                    <textarea
                      rows={2}
                      value={editingPartner.description || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                      placeholder="Co-production agreements, OTT syndication, or audio rights..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingPartner(null)}
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
                      <span>Save Partner</span>
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
              categoryFilterDefault="partners"
              onSelect={({ mediaId, url }) => {
                setEditingPartner((prev) => ({
                  ...prev,
                  logoMediaId: mediaId,
                  logoUrl: url,
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
                  <h3 className="text-xl font-bold">Remove Partner?</h3>
                  <p className="text-xs text-zinc-400">
                    This will remove &quot;{deleteConfirm.name}&quot; from the studio alliance roster.
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
