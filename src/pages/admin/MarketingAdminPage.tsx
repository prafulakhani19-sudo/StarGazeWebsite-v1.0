import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  getMarketingProjects, saveCmsDocument, deleteCmsDocument, reorderCmsDocuments 
} from '../../lib/cmsService';
import { MarketingProjectItem, ContentStatus } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Tag, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Check, X, 
  RefreshCw, Image as ImageIcon, AlertCircle, Star, Sparkles 
} from 'lucide-react';

export const MarketingAdminPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<MarketingProjectItem> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MarketingProjectItem | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMarketingProjects();
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading marketing campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.title) return;
    setSaving(true);

    try {
      const id = editingCampaign.id || `mkt-${Date.now()}`;
      const payload: MarketingProjectItem = {
        id,
        title: editingCampaign.title || '',
        client: editingCampaign.client || '',
        serviceCategory: editingCampaign.serviceCategory || 'Commercial Cinema PR',
        campaignGoal: editingCampaign.campaignGoal || '',
        keyDeliverables: editingCampaign.keyDeliverables || [],
        metrics: editingCampaign.metrics || '',
        heroUrl: editingCampaign.heroUrl || '',
        heroMediaId: editingCampaign.heroMediaId || '',
        featured: editingCampaign.featured ?? true,
        status: editingCampaign.status || 'PUBLISHED',
        displayOrder: editingCampaign.displayOrder ?? (campaigns.length + 1),
        focalPoint: editingCampaign.focalPoint || { x: 50, y: 50 },
        updatedAt: new Date().toISOString(),
      };

      await saveCmsDocument('marketingProjects', id, payload, 'SAVE_MARKETING_CAMPAIGN');
      await loadData();
      setEditingCampaign(null);
    } catch (err) {
      console.error('Error saving marketing campaign:', err);
      alert('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MarketingProjectItem) => {
    try {
      await deleteCmsDocument('marketingProjects', item.id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting marketing campaign:', err);
      alert('Failed to delete campaign');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= campaigns.length) return;

    const reordered = [...campaigns];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setCampaigns(reordered);
    await reorderCmsDocuments('marketingProjects', reordered.map((c) => c.id));
  };

  return (
    <ProtectedRoute requiredPermission="projects.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Tag className="w-4 h-4" /> CAMPAIGN SHOWCASE
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">MARKETING & PR CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage high-impact brand campaigns, theatrical promotions, civic initiatives, and commercial video case studies.
              </p>
            </div>

            <button
              onClick={() =>
                setEditingCampaign({
                  title: '',
                  client: '',
                  serviceCategory: 'Theatrical Marketing',
                  status: 'PUBLISHED',
                  featured: true,
                  displayOrder: campaigns.length + 1,
                  focalPoint: { x: 50, y: 50 },
                })
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Add Campaign
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading Campaign Portfolio...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
              <Tag className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Marketing Projects Found</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Add campaigns and theatrical promotions to showcase agency work.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black border border-zinc-800 relative">
                      {item.heroUrl ? (
                        <StargazeImage
                          src={item.heroUrl}
                          alt={item.title}
                          focalPoint={item.focalPoint}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-mono text-zinc-600">
                          No Visual
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-400 uppercase">
                          {item.serviceCategory}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1">
                        <span>Client: {item.client || 'Direct'}</span>
                        <span
                          className={`px-2 py-0.5 rounded uppercase font-bold ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white uppercase">{item.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{item.campaignGoal}</p>
                    </div>
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
                        disabled={idx === campaigns.length - 1}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCampaign(item)}
                        className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        title="Edit Campaign"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        className="p-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                        title="Delete Campaign"
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
          {editingCampaign && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 text-white my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-mono uppercase">
                        {editingCampaign.id ? 'Edit Campaign' : 'Add Campaign'}
                      </h2>
                      <p className="text-xs text-zinc-400">PR, digital marketing, or brand project</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingCampaign(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Campaign Title *</label>
                      <input
                        type="text"
                        required
                        value={editingCampaign.title || ''}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                        placeholder="e.g. Nagpur Police Road Safety Drive"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Client / Brand</label>
                      <input
                        type="text"
                        value={editingCampaign.client || ''}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, client: e.target.value })}
                        placeholder="e.g. Nagpur City Police"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Service Category</label>
                      <input
                        type="text"
                        value={editingCampaign.serviceCategory || ''}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, serviceCategory: e.target.value })}
                        placeholder="e.g. Civic Awareness, Theatrical PR, Commercial"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Status</label>
                      <select
                        value={editingCampaign.status || 'PUBLISHED'}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as ContentStatus })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  {/* Visual Artwork Picker */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Campaign Artwork / Still
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
                      <div className="w-28 h-18 bg-black border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                        {editingCampaign.heroUrl ? (
                          <StargazeImage
                            src={editingCampaign.heroUrl}
                            alt="Visual preview"
                            focalPoint={editingCampaign.focalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                            No Visual
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL or pick from library..."
                        value={editingCampaign.heroUrl || ''}
                        onChange={(e) => setEditingCampaign({ ...editingCampaign, heroUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Campaign Goal / Overview</label>
                    <textarea
                      rows={2}
                      value={editingCampaign.campaignGoal || ''}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, campaignGoal: e.target.value })}
                      placeholder="High-level goal, outreach strategy, or release roadmap..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Key Metrics / Impact</label>
                    <input
                      type="text"
                      value={editingCampaign.metrics || ''}
                      onChange={(e) => setEditingCampaign({ ...editingCampaign, metrics: e.target.value })}
                      placeholder="e.g. 5M+ Impressions, 100K+ Theater Footfall"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingCampaign(null)}
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
                      <span>Save Campaign</span>
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
              categoryFilterDefault="work"
              onSelect={({ mediaId, url, focalPoint }) => {
                setEditingCampaign((prev) => ({
                  ...prev,
                  heroMediaId: mediaId,
                  heroUrl: url,
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
                  <h3 className="text-xl font-bold">Delete Campaign?</h3>
                  <p className="text-xs text-zinc-400">
                    This will remove &quot;{deleteConfirm.title}&quot; from the marketing portfolio.
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
