import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  getProjects, saveCmsDocument, deleteCmsDocument, reorderCmsDocuments 
} from '../../lib/cmsService';
import { ProjectItem, ContentStatus } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Film, Plus, Edit3, Trash2, Eye, Check, X, RefreshCw, Star, 
  ArrowUp, ArrowDown, Image as ImageIcon, Video, AlertCircle 
} from 'lucide-react';

export const WorkAdminPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ProjectItem | null>(null);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'cover' | 'hero' | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;
    setSaving(true);

    try {
      const projId = editingProject.id || `proj-${Date.now()}`;
      const payload: ProjectItem = {
        id: projId,
        title: editingProject.title || '',
        slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        genre: editingProject.genre || 'Cinema Feature',
        director: editingProject.director || '',
        clientInfo: editingProject.clientInfo || '',
        releaseYear: Number(editingProject.releaseYear) || new Date().getFullYear(),
        synopsis: editingProject.synopsis || '',
        longDescription: editingProject.longDescription || '',
        credits: editingProject.credits || '',
        posterUrl: editingProject.posterUrl || '',
        coverMediaId: editingProject.coverMediaId || '',
        heroUrl: editingProject.heroUrl || '',
        heroMediaId: editingProject.heroMediaId || '',
        trailerUrl: editingProject.trailerUrl || '',
        videoUrl: editingProject.videoUrl || '',
        featured: editingProject.featured ?? false,
        status: editingProject.status || 'PUBLISHED',
        displayOrder: editingProject.displayOrder ?? (projects.length + 1),
        focalPoint: editingProject.focalPoint || { x: 50, y: 50 },
        createdAt: editingProject.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveCmsDocument('projects', projId, payload, 'SAVE_PROJECT');
      await loadData();
      setEditingProject(null);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (proj: ProjectItem) => {
    try {
      await deleteCmsDocument('projects', proj.id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  const toggleFeatured = async (proj: ProjectItem) => {
    await saveCmsDocument<ProjectItem>('projects', proj.id, { featured: !proj.featured }, 'TOGGLE_FEATURED');
    await loadData();
  };

  const toggleStatus = async (proj: ProjectItem) => {
    const nextStatus: ContentStatus = proj.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await saveCmsDocument<ProjectItem>('projects', proj.id, { status: nextStatus }, 'TOGGLE_STATUS');
    await loadData();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setProjects(reordered);
    await reorderCmsDocuments('projects', reordered.map((p) => p.id));
  };

  return (
    <ProtectedRoute requiredPermission="projects.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Film className="w-4 h-4" /> CINEMA PRODUCTION SLATE
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">FILMS & WORK CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage feature films, short films, trailers, credits, and featured cinema showcases.
              </p>
            </div>

            <button
              onClick={() =>
                setEditingProject({
                  title: '',
                  genre: 'Feature Film',
                  director: 'Satish Mohod',
                  releaseYear: new Date().getFullYear(),
                  status: 'PUBLISHED',
                  featured: false,
                  displayOrder: projects.length + 1,
                  focalPoint: { x: 50, y: 50 },
                })
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Add New Film / Project
            </button>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading Cinema Slate...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
              <Film className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Projects Found</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Create a new project entry to showcase in the Stargaze slate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black border border-zinc-800 relative group">
                      {proj.posterUrl ? (
                        <StargazeImage
                          src={proj.posterUrl}
                          alt={proj.title}
                          focalPoint={proj.focalPoint}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-mono text-zinc-600">
                          No Poster
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-400 uppercase">
                          {proj.genre}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          onClick={() => toggleFeatured(proj)}
                          className={`p-1.5 rounded-lg backdrop-blur-md border transition ${
                            proj.featured
                              ? 'bg-amber-500 text-black border-amber-400'
                              : 'bg-black/60 text-zinc-400 border-white/10 hover:text-white'
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1">
                        <span>Year: {proj.releaseYear}</span>
                        <span
                          className={`px-2 py-0.5 rounded uppercase font-bold ${
                            proj.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white uppercase">{proj.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{proj.synopsis}</p>
                      {proj.director && (
                        <p className="text-[11px] text-zinc-500 font-mono mt-2">Director: {proj.director}</p>
                      )}
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
                        disabled={idx === projects.length - 1}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(proj)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-zinc-300"
                      >
                        {proj.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(proj)}
                        className="p-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                        title="Delete Project"
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
          {editingProject && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 text-white my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-mono uppercase">
                        {editingProject.id ? 'Edit Cinema Project' : 'Add New Cinema Project'}
                      </h2>
                      <p className="text-xs text-zinc-400">Feature film, short film, or production slate entry</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Film / Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. SAHEB VIKAS KARI"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Genre / Category</label>
                      <input
                        type="text"
                        value={editingProject.genre || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, genre: e.target.value })}
                        placeholder="e.g. Social Drama, Short Film, Action Thriller"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Director / Key Talent</label>
                      <input
                        type="text"
                        value={editingProject.director || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, director: e.target.value })}
                        placeholder="e.g. Satish Mohod"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Release Year</label>
                      <input
                        type="number"
                        value={editingProject.releaseYear || new Date().getFullYear()}
                        onChange={(e) => setEditingProject({ ...editingProject, releaseYear: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Status</label>
                      <select
                        value={editingProject.status || 'PUBLISHED'}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ContentStatus })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Production / Partner Details</label>
                    <input
                      type="text"
                      value={editingProject.clientInfo || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, clientInfo: e.target.value })}
                      placeholder="e.g. Orange City Production, Nagpur Police"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Synopsis</label>
                    <textarea
                      rows={2}
                      value={editingProject.synopsis || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, synopsis: e.target.value })}
                      placeholder="Concise storyline for catalogue and cards..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Extended Overview / Details</label>
                    <textarea
                      rows={3}
                      value={editingProject.longDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                      placeholder="Extended synopsis, festival laurels, cast and crew details..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Artwork & Media Picker */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Poster / Cover Artwork
                      </span>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('cover')}
                        className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" /> Select from Library
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="w-32 h-20 bg-black border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                        {editingProject.posterUrl ? (
                          <StargazeImage
                            src={editingProject.posterUrl}
                            alt="Cover preview"
                            focalPoint={editingProject.focalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                            No Cover
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL or pick from library..."
                        value={editingProject.posterUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, posterUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  {/* Video / Trailer link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Trailer / Video Link</label>
                      <input
                        type="text"
                        value={editingProject.trailerUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, trailerUrl: e.target.value })}
                        placeholder="e.g. YouTube or Vimeo link"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.featured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4"
                        />
                        <span className="text-xs font-mono text-white">Feature in Homepage Curated Slate</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
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
                      <span>Save Project</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Media Picker */}
          {mediaPickerTarget && (
            <MediaPickerModal
              isOpen={true}
              onClose={() => setMediaPickerTarget(null)}
              categoryFilterDefault="work"
              onSelect={({ mediaId, url, focalPoint }) => {
                if (mediaPickerTarget === 'cover') {
                  setEditingProject((prev) => ({
                    ...prev,
                    coverMediaId: mediaId,
                    posterUrl: url,
                    focalPoint,
                  }));
                }
                setMediaPickerTarget(null);
              }}
            />
          )}

          {/* Delete Confirm Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-6 text-white text-center shadow-2xl">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Delete Project?</h3>
                  <p className="text-xs text-zinc-400">
                    This will delete &quot;{deleteConfirm.title}&quot; from the Stargaze slate.
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
