import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  getHeroSlides, saveCmsDocument, deleteCmsDocument, reorderCmsDocuments 
} from '../../lib/cmsService';
import { HeroSlideItem, ContentStatus } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Sparkles, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Eye, Check, X, 
  Image as ImageIcon, RefreshCw, Smartphone, Monitor, Link as LinkIcon, 
  AlertCircle, CheckCircle2 
} from 'lucide-react';

export const HeroAdminPage: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideItem> | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlideItem | null>(null);
  const [deleteConfirmSlide, setDeleteConfirmSlide] = useState<HeroSlideItem | null>(null);

  // Media Picker state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'desktop' | 'mobile' | null>(null);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const data = await getHeroSlides();
      setSlides(data);
    } catch (err) {
      console.error('Error fetching hero slides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title) return;
    setSaving(true);

    try {
      const slideId = editingSlide.id || `hero-${Date.now()}`;
      const payload: HeroSlideItem = {
        id: slideId,
        title: editingSlide.title || '',
        category: editingSlide.category || 'FEATURE FILM',
        projectRef: editingSlide.projectRef || '',
        eyebrow: editingSlide.eyebrow || '',
        description: editingSlide.description || '',
        desktopMediaId: editingSlide.desktopMediaId || '',
        mobileMediaId: editingSlide.mobileMediaId || '',
        desktopSrc: editingSlide.desktopSrc || '',
        mobileSrc: editingSlide.mobileSrc || '',
        desktopFocalPoint: editingSlide.desktopFocalPoint || { x: 50, y: 50 },
        mobileFocalPoint: editingSlide.mobileFocalPoint || { x: 50, y: 50 },
        caption: editingSlide.caption || '',
        ctaLabel: editingSlide.ctaLabel || '',
        ctaDestination: editingSlide.ctaDestination || '',
        status: editingSlide.status || 'PUBLISHED',
        displayOrder: editingSlide.displayOrder ?? (slides.length + 1),
        createdAt: editingSlide.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveCmsDocument('heroSlides', slideId, payload, 'SAVE_HERO_SLIDE');
      await loadSlides();
      setEditingSlide(null);
    } catch (err) {
      console.error('Failed to save slide:', err);
      alert('Error saving hero slide');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slide: HeroSlideItem) => {
    try {
      await deleteCmsDocument('heroSlides', slide.id);
      await loadSlides();
      setDeleteConfirmSlide(null);
    } catch (err) {
      console.error('Failed to delete slide:', err);
      alert('Error deleting slide');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setSlides(reordered);
    await reorderCmsDocuments('heroSlides', reordered.map((s) => s.id));
  };

  const toggleStatus = async (slide: HeroSlideItem) => {
    const nextStatus: ContentStatus = slide.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await saveCmsDocument<HeroSlideItem>('heroSlides', slide.id, { status: nextStatus }, 'TOGGLE_STATUS');
    await loadSlides();
  };

  return (
    <ProtectedRoute requiredPermission="projects.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Sparkles className="w-4 h-4" /> VISUAL SCREENING WALL
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">HERO SLIDER CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage visual-first artwork slides, desktop and mobile assets, and presentation ordering for the homepage hero.
              </p>
            </div>

            <button
              onClick={() =>
                setEditingSlide({
                  title: '',
                  category: 'FEATURE FILM',
                  status: 'PUBLISHED',
                  displayOrder: slides.length + 1,
                  desktopFocalPoint: { x: 50, y: 50 },
                  mobileFocalPoint: { x: 50, y: 50 },
                })
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Add Hero Slide
            </button>
          </div>

          {/* Slides List */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading Hero Slide Catalog...</span>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
              <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Hero Slides Configured</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Create your first cinematic artwork slide to feature on the homepage screening wall.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col lg:flex-row gap-5 items-center justify-between transition"
                >
                  {/* Left: Ordering & Thumbnails */}
                  <div className="flex items-center gap-4 w-full lg:w-auto">
                    {/* Reorder controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-lg font-bold text-amber-400 w-8 text-center">
                      0{index + 1}
                    </div>

                    {/* Artwork Preview Card */}
                    <div className="w-36 h-20 bg-black rounded-xl overflow-hidden border border-zinc-800 relative shrink-0">
                      {slide.desktopSrc ? (
                        <StargazeImage
                          src={slide.desktopSrc}
                          alt={slide.title}
                          focalPoint={slide.desktopFocalPoint}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-amber-400 border border-white/10">
                        {slide.desktopSrc && slide.mobileSrc ? 'D+M' : slide.desktopSrc ? 'DESK' : 'NONE'}
                      </div>
                    </div>

                    {/* Slide Information */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                          {slide.category}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            slide.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {slide.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white uppercase">{slide.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                        {slide.eyebrow || slide.description || 'Image-first cinema presentation'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 border-zinc-800/80 pt-3 lg:pt-0">
                    <button
                      onClick={() => toggleStatus(slide)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300"
                    >
                      {slide.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => setPreviewSlide(slide)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      title="Preview Screening"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                      title="Edit Slide"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmSlide(slide)}
                      className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit / Create Modal */}
          {editingSlide && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 text-white my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-mono uppercase">
                        {editingSlide.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                      </h2>
                      <p className="text-xs text-zinc-400">Cinematic image-first screening wall item</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingSlide(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Slide Title / Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingSlide.title || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        placeholder="e.g. SAHEB VIKAS KARI"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Category / Badge</label>
                      <input
                        type="text"
                        value={editingSlide.category || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, category: e.target.value })}
                        placeholder="e.g. FEATURE FILM, SHORT FILM, LIVE EXPERIENCE"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Eyebrow (Optional)</label>
                      <input
                        type="text"
                        value={editingSlide.eyebrow || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, eyebrow: e.target.value })}
                        placeholder="e.g. 01 // FEATURE FILM PREMIERE"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Status</label>
                      <select
                        value={editingSlide.status || 'PUBLISHED'}
                        onChange={(e) => setEditingSlide({ ...editingSlide, status: e.target.value as ContentStatus })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Supporting Synopsis / Description (Shown on hover)
                    </label>
                    <textarea
                      rows={2}
                      value={editingSlide.description || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                      placeholder="Brief synopsis, production partner or talent highlights..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Artwork Selection: Desktop & Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                    {/* Desktop Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-amber-400" /> Desktop Artwork (16:9)
                        </span>
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget('desktop')}
                          className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" /> Select from Library
                        </button>
                      </div>

                      <div className="aspect-[16/9] rounded-xl bg-black border border-zinc-800 overflow-hidden relative">
                        {editingSlide.desktopSrc ? (
                          <StargazeImage
                            src={editingSlide.desktopSrc}
                            alt="Desktop Artwork"
                            focalPoint={editingSlide.desktopFocalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                            No Desktop Asset
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Direct image URL or use picker..."
                        value={editingSlide.desktopSrc || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, desktopSrc: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono"
                      />
                    </div>

                    {/* Mobile Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Mobile Artwork (4:5 / 9:16)
                        </span>
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget('mobile')}
                          className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" /> Select from Library
                        </button>
                      </div>

                      <div className="aspect-[16/9] rounded-xl bg-black border border-zinc-800 overflow-hidden relative">
                        {editingSlide.mobileSrc ? (
                          <StargazeImage
                            src={editingSlide.mobileSrc}
                            alt="Mobile Artwork"
                            focalPoint={editingSlide.mobileFocalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
                            No Mobile Asset (falls back to desktop)
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Direct image URL or use picker..."
                        value={editingSlide.mobileSrc || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, mobileSrc: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  {/* CTA link & label */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Action Button Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingSlide.ctaLabel || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, ctaLabel: e.target.value })}
                        placeholder="e.g. VIEW PROJECT, WATCH TRAILER"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Action Destination URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingSlide.ctaDestination || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, ctaDestination: e.target.value })}
                        placeholder="e.g. /projects or https://youtube.com/..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingSlide(null)}
                      className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg"
                    >
                      {saving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Save Slide</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Media Picker Modal for Hero */}
          {mediaPickerTarget && (
            <MediaPickerModal
              isOpen={true}
              onClose={() => setMediaPickerTarget(null)}
              categoryFilterDefault="hero"
              onSelect={({ mediaId, url, focalPoint }) => {
                if (mediaPickerTarget === 'desktop') {
                  setEditingSlide((prev) => ({
                    ...prev,
                    desktopMediaId: mediaId,
                    desktopSrc: url,
                    desktopFocalPoint: focalPoint,
                  }));
                } else if (mediaPickerTarget === 'mobile') {
                  setEditingSlide((prev) => ({
                    ...prev,
                    mobileMediaId: mediaId,
                    mobileSrc: url,
                    mobileFocalPoint: focalPoint,
                  }));
                }
                setMediaPickerTarget(null);
              }}
            />
          )}

          {/* Screening Wall Preview Modal */}
          {previewSlide && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
              <div className="relative w-full max-w-6xl aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                <button
                  onClick={() => setPreviewSlide(null)}
                  className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/80 text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>

                {previewSlide.desktopSrc ? (
                  <StargazeImage
                    src={previewSlide.desktopSrc}
                    alt={previewSlide.title}
                    focalPoint={previewSlide.desktopFocalPoint}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono">
                    No image uploaded
                  </div>
                )}

                {/* Subtle bottom edge gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Restrained project tag near bottom */}
                <div className="absolute bottom-6 left-8 z-20 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10">
                    {previewSlide.category}
                  </span>
                  <h2 className="text-2xl font-bold font-serif-cinematic text-white uppercase drop-shadow">
                    {previewSlide.title}
                  </h2>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirm Modal */}
          {deleteConfirmSlide && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-6 text-white text-center shadow-2xl">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Remove Hero Slide?</h3>
                  <p className="text-xs text-zinc-400">
                    This will remove &quot;{deleteConfirmSlide.title}&quot; from the homepage screening wall.
                  </p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={() => setDeleteConfirmSlide(null)}
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmSlide)}
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
