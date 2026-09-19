import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Edit3, Trash2, Eye, Copy, ExternalLink, 
  Sparkles, Search, Layers, FileText, CheckCircle2, 
  Clock, LayoutTemplate, MoreVertical
} from 'lucide-react';
import { CustomPage } from '../../types';
import { getCustomPages, saveCustomPage, deleteCustomPage } from '../../lib/cmsService';
import { ConfirmationModal } from '../../components/admin/ConfirmationModal';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const PagesAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create / Edit Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<CustomPage | null>(null);

  // Status feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadPages = async () => {
    try {
      setLoading(true);
      const data = await getCustomPages();
      setPages(data);
    } catch (err) {
      console.error('Failed to load custom pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const slug = (newPageSlug || newPageTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const id = `page-${Date.now()}`;
    const newPage: CustomPage = {
      id,
      title: newPageTitle.trim(),
      slug,
      status: 'DRAFT',
      template: 'default',
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveCustomPage(id, newPage);
      setCreateModalOpen(false);
      setNewPageTitle('');
      setNewPageSlug('');
      navigate(`/admin/pages/builder/${id}`);
    } catch (err) {
      console.error('Error creating page:', err);
    }
  };

  const handleDuplicate = async (p: CustomPage) => {
    const id = `page-${Date.now()}`;
    const duplicated: CustomPage = {
      ...p,
      id,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveCustomPage(id, duplicated);
      setFeedback('Page duplicated successfully!');
      setTimeout(() => setFeedback(null), 3000);
      loadPages();
    } catch (err) {
      console.error('Duplicate page error:', err);
    }
  };

  const handleToggleStatus = async (p: CustomPage) => {
    const nextStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await saveCustomPage(p.id, { ...p, status: nextStatus, updatedAt: new Date().toISOString() });
      loadPages();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;
    try {
      await deleteCustomPage(pageToDelete.id);
      setDeleteModalOpen(false);
      setPageToDelete(null);
      loadPages();
    } catch (err) {
      console.error('Delete page error:', err);
    }
  };

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute requiredPermission="pages.view">
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            ELEMENTOR PAGE BUILDER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-display tracking-tight text-white">
            Custom Visual Pages
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Build, design, and publish bespoke pages using our drag-and-drop Elementor canvas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search custom pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:border-amber-500 focus:outline-none font-mono"
          />
        </div>

        <div className="text-xs font-mono text-zinc-400">
          Total Pages: <span className="text-amber-400 font-bold">{pages.length}</span>
        </div>
      </div>

      {/* PAGES LIST TABLE */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-500 animate-spin mb-3" />
            Loading custom pages...
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs flex flex-col items-center justify-center">
            <FileText className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="text-sm font-bold text-white uppercase mb-1">No Custom Pages Found</p>
            <p className="text-xs text-zinc-500 max-w-sm mb-4 font-light">
              Create your first custom page with drag-and-drop sections or pre-built templates.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono"
            >
              + Create New Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 font-mono text-zinc-400 uppercase text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Page Title</th>
                  <th className="py-3.5 px-4 font-bold">Route Slug</th>
                  <th className="py-3.5 px-4 font-bold">Sections</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Updated</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredPages.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/pages/builder/${p.id}`}
                          className="hover:text-amber-400 transition flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4 text-amber-500/80" />
                          <span>{p.title}</span>
                        </Link>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-zinc-400 text-[11px]">
                      <a
                        href={`/p/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-400 inline-flex items-center gap-1"
                      >
                        <span>/p/{p.slug}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </td>

                    <td className="py-4 px-4 font-mono text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                        {p.blocks?.length || 0} blocks
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase transition ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-zinc-400 text-xs font-mono">
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/pages/builder/${p.id}`}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono font-bold text-[11px] uppercase border border-amber-500/30 transition flex items-center gap-1"
                          title="Open Elementor Visual Canvas"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Builder</span>
                        </Link>

                        <button
                          onClick={() => handleDuplicate(p)}
                          title="Duplicate Page"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setPageToDelete(p);
                            setDeleteModalOpen(true);
                          }}
                          title="Delete Page"
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE NEW PAGE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold uppercase font-display text-white mb-1">
              Create New Visual Page
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-light">
              Name your page and specify its public URL slug.
            </p>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass & VFX Showcase"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-500">
                  <span>/p/</span>
                  <input
                    type="text"
                    required
                    placeholder="masterclass-vfx"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 bg-transparent text-white focus:outline-none ml-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition"
                >
                  Launch Builder →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Custom Page"
        description={`Are you sure you want to delete "${pageToDelete?.title || 'this page'}"? This action will permanently remove its visual layout and published URL.`}
        confirmText="Delete Page"
        danger={true}
      />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
