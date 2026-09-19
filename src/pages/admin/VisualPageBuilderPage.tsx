import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Eye, Smartphone, Tablet, Monitor, 
  Laptop, Plus, Layers, Settings, Sparkles, Undo2, 
  Redo2, Trash2, Copy, MoveUp, MoveDown, Check,
  ExternalLink, Code2, AlertCircle, LayoutTemplate
} from 'lucide-react';
import { CustomPage, PageBlock } from '../../types';
import { getCustomPageById, saveCustomPage } from '../../lib/cmsService';
import { BlockRenderer } from '../../components/builder/BlockRenderer';
import { BlockInspector } from '../../components/builder/BlockInspector';
import { BlockLibraryModal } from '../../components/builder/BlockLibraryModal';
import { TemplatePickerModal } from '../../components/builder/TemplatePickerModal';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';

export const VisualPageBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeLeftTab, setActiveLeftTab] = useState<'blocks' | 'settings' | 'layers'>('blocks');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop');
  
  // Modals
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  // History for Undo/Redo
  const [history, setHistory] = useState<PageBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Status & Save indicator
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Custom Page Data
  useEffect(() => {
    async function loadPage() {
      if (!id) return;
      try {
        setLoading(true);
        const fetched = await getCustomPageById(id);
        if (fetched) {
          setPage(fetched);
          setHistory([fetched.blocks || []]);
          setHistoryIndex(0);
          if (fetched.blocks && fetched.blocks.length > 0) {
            setSelectedBlockId(fetched.blocks[0].id);
          }
        } else {
          // New blank page template
          const newPage: CustomPage = {
            id,
            title: 'Untitled Custom Page',
            slug: id,
            status: 'DRAFT',
            template: 'default',
            blocks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setPage(newPage);
          setHistory([[]]);
          setHistoryIndex(0);
        }
      } catch (err: any) {
        console.error('Error loading custom page:', err);
        setErrorMsg('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [id]);

  // Push new state to undo/redo history
  const pushBlocksChange = (newBlocks: PageBlock[]) => {
    if (!page) return;
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newBlocks);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setPage({ ...page, blocks: newBlocks, updatedAt: new Date().toISOString() });
  };

  const handleUndo = () => {
    if (historyIndex > 0 && page) {
      const prevIndex = historyIndex - 1;
      const prevBlocks = history[prevIndex];
      setHistoryIndex(prevIndex);
      setPage({ ...page, blocks: prevBlocks });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && page) {
      const nextIndex = historyIndex + 1;
      const nextBlocks = history[nextIndex];
      setHistoryIndex(nextIndex);
      setPage({ ...page, blocks: nextBlocks });
    }
  };

  // Block Operations
  const handleAddBlock = (block: PageBlock) => {
    if (!page) return;
    const blocks = [...page.blocks];
    if (insertIndex !== null && insertIndex >= 0) {
      blocks.splice(insertIndex + 1, 0, block);
    } else {
      blocks.push(block);
    }
    pushBlocksChange(blocks);
    setSelectedBlockId(block.id);
    setInsertIndex(null);
  };

  const handleUpdateBlock = (updatedBlock: PageBlock) => {
    if (!page) return;
    const updated = page.blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    pushBlocksChange(updated);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!page) return;
    const updated = page.blocks.filter((b) => b.id !== blockId);
    pushBlocksChange(updated);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleDuplicateBlock = (blockId: string) => {
    if (!page) return;
    const idx = page.blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const target = page.blocks[idx];
    const duplicated: PageBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: `block-${target.type}-${Date.now()}`,
    };
    const updated = [...page.blocks];
    updated.splice(idx + 1, 0, duplicated);
    pushBlocksChange(updated);
    setSelectedBlockId(duplicated.id);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (!page) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.blocks.length) return;
    const updated = [...page.blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    pushBlocksChange(updated);
  };

  // Save Page
  const handleSave = async (statusOverride?: 'DRAFT' | 'PUBLISHED') => {
    if (!page) return;
    try {
      setIsSaving(true);
      setErrorMsg(null);
      const toSave: CustomPage = {
        ...page,
        status: statusOverride || page.status,
        updatedAt: new Date().toISOString(),
      };
      await saveCustomPage(page.id, toSave);
      setPage(toSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving custom page:', err);
      setErrorMsg(err.message || 'Failed to save page.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPermission="pages.view">
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
          <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-4" />
          <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            INITIALIZING ELEMENTOR VISUAL CANVAS...
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!page) {
    return (
      <ProtectedRoute requiredPermission="pages.view">
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <h2 className="text-lg font-bold font-mono uppercase mb-2">Page Not Found</h2>
          <button
            onClick={() => navigate('/admin/pages')}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 font-mono text-xs"
          >
            Return to Pages Catalog
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  const selectedBlock = page.blocks.find((b) => b.id === selectedBlockId);
  const selectedIndex = page.blocks.findIndex((b) => b.id === selectedBlockId);

  // Responsive device frame width
  const deviceContainerWidth = 
    deviceMode === 'laptop' ? 'max-w-[1200px]' :
    deviceMode === 'tablet' ? 'max-w-[768px]' :
    deviceMode === 'mobile' ? 'max-w-[420px]' :
    'w-full';

  return (
    <ProtectedRoute requiredPermission="pages.view">
      <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden select-none font-sans">
      {/* ================================================================= */}
      {/* TOP NAVIGATION BAR: Elementor Top Toolbar */}
      {/* ================================================================= */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950/90 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/pages"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Back to Pages List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold uppercase font-mono tracking-tight text-white truncate max-w-xs">
                {page.title}
              </h1>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                page.status === 'PUBLISHED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {page.status}
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 truncate">
              URL: /p/{page.slug}
            </p>
          </div>
        </div>

        {/* Center: Device Mode Viewport Switcher & History */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setDeviceMode('desktop')}
              title="Desktop View (Full Screen)"
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'desktop' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('laptop')}
              title="Laptop View (1200px)"
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'laptop' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'tablet' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              title="Mobile Portrait View (9:16 - 420px)"
              className={`p-1.5 rounded-lg transition ${
                deviceMode === 'mobile' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 transition"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">TEMPLATES</span>
          </button>

          <a
            href={`/p/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PREVIEW</span>
          </a>

          <button
            onClick={() => handleSave('DRAFT')}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition disabled:opacity-50"
          >
            SAVE DRAFT
          </button>

          <button
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isSaving ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? 'PUBLISHED!' : 'PUBLISH'}</span>
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MAIN WORKSPACE: Left Panel, Center Canvas, Right Inspector */}
      {/* ================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ========================================== */}
        {/* LEFT DOCK: Elements / Settings / Layers */}
        {/* ========================================== */}
        <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col z-20 shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40 text-xs font-mono font-bold">
            <button
              onClick={() => setActiveLeftTab('blocks')}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeLeftTab === 'blocks'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/30'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              + ELEMENTS
            </button>
            <button
              onClick={() => setActiveLeftTab('layers')}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeLeftTab === 'layers'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/30'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              LAYERS ({page.blocks.length})
            </button>
            <button
              onClick={() => setActiveLeftTab('settings')}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeLeftTab === 'settings'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/30'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              PAGE
            </button>
          </div>

          {/* TAB 1: ADD ELEMENTS QUICK ACCESS */}
          {activeLeftTab === 'blocks' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <button
                onClick={() => {
                  setInsertIndex(null);
                  setLibraryOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/5"
              >
                <Plus className="w-4 h-4" />
                <span>Open Element Library</span>
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                  QUICK INSERT
                </span>
                {[
                  { label: 'Hero Banner', type: 'hero' },
                  { label: 'Feature Cards Grid', type: 'feature_cards' },
                  { label: 'Heading & Eyebrow', type: 'heading' },
                  { label: 'Video Trailer Reel', type: 'video_player' },
                  { label: 'Milestone Stats', type: 'stats_counter' },
                  { label: 'FAQ Accordion', type: 'faq_accordion' },
                  { label: 'Direct Enquiry Form', type: 'contact_form' },
                  { label: 'Call to Action Banner', type: 'cta_banner' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      setInsertIndex(null);
                      setLibraryOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-left text-xs text-zinc-300 hover:text-white flex items-center justify-between group transition font-mono"
                  >
                    <span>{item.label}</span>
                    <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition">+</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LAYERS TREE */}
          {activeLeftTab === 'layers' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {page.blocks.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                  No sections yet. Click "+ Elements" to begin building.
                </div>
              ) : (
                page.blocks.map((b, idx) => {
                  const isSelected = b.id === selectedBlockId;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBlockId(b.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs font-mono ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] text-zinc-500">#{idx + 1}</span>
                        <span className="font-bold uppercase truncate">
                          {b.title || b.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(idx, 'down');
                          }}
                          disabled={idx === page.blocks.length - 1}
                          className="p-1 text-zinc-500 hover:text-white disabled:opacity-20"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(b.id);
                          }}
                          className="p-1 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: PAGE METADATA & SEO SETTINGS */}
          {activeLeftTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Page Title</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => setPage({ ...page, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">URL Slug</label>
                <div className="flex items-center rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2">
                  <span className="text-zinc-500 font-mono text-xs">/p/</span>
                  <input
                    type="text"
                    value={page.slug}
                    onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none ml-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Page Template</label>
                <select
                  value={page.template || 'default'}
                  onChange={(e) => setPage({ ...page, template: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
                >
                  <option value="default">Default (With Header & Footer)</option>
                  <option value="canvas-blank">Blank Canvas (No Header/Footer)</option>
                  <option value="cinema-landing">Cinema Landing Page</option>
                </select>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-3">
                  SEO & SOCIAL METADATA
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={page.seoTitle || ''}
                      onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
                      placeholder="e.g. Masterclass | Stargaze Media"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      value={page.seoDescription || ''}
                      onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
                      placeholder="Summary for search engines..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ========================================== */}
        {/* CENTER CANVAS: Interactive Live Editor */}
        {/* ========================================== */}
        <main className="flex-1 bg-zinc-950/90 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className={`transition-all duration-300 ${deviceContainerWidth} w-full bg-zinc-950 min-h-[85vh] rounded-2xl shadow-2xl border border-zinc-800/80 overflow-hidden relative flex flex-col`}>
            {/* CANVAS WATERMARK */}
            <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="uppercase font-bold text-amber-500/80">
                STARGAZE CANVAS // {deviceMode.toUpperCase()}
              </span>
              <span>{page.blocks.length} SECTIONS LOADED</span>
            </div>

            {/* BLOCKS STREAM */}
            {page.blocks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display uppercase text-white mb-2">
                  This Canvas is Empty
                </h3>
                <p className="text-xs text-zinc-400 max-w-md font-light mb-6">
                  Build custom pages visually with modular cinema blocks or start instantly with a curated template.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setInsertIndex(null);
                      setLibraryOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" /> Add First Block
                  </button>
                  <button
                    onClick={() => setTemplateModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                  >
                    <LayoutTemplate className="w-4 h-4 text-amber-400" /> Load Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-zinc-800/40">
                {page.blocks.map((block, idx) => {
                  const isSelected = block.id === selectedBlockId;
                  return (
                    <div key={block.id} className="relative group">
                      {/* INTERACTIVE FLOATING TOOLBAR ON HOVER */}
                      <div className="absolute top-2 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900/90 border border-zinc-700 rounded-xl p-1 flex items-center gap-1 shadow-2xl backdrop-blur-md">
                        <span className="text-[9px] font-mono uppercase font-bold text-amber-400 px-2 py-0.5">
                          {block.type.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleMoveBlock(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveBlock(idx, 'down')}
                          disabled={idx === page.blocks.length - 1}
                          title="Move Down"
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateBlock(block.id)}
                          title="Duplicate Section"
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          title="Delete Section"
                          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* RENDER BLOCK */}
                      <BlockRenderer
                        block={block}
                        isEditing={true}
                        isSelected={isSelected}
                        onSelect={() => setSelectedBlockId(block.id)}
                      />

                      {/* INSERT SECTION INLINE BUTTON */}
                      <div className="relative h-2 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setInsertIndex(idx);
                            setLibraryOpen(true);
                          }}
                          className="absolute z-20 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono text-[10px] font-bold uppercase shadow-xl hover:scale-105 transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Section
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* ========================================== */}
        {/* RIGHT DOCK: Elementor Style Inspector */}
        {/* ========================================== */}
        {selectedBlock && (
          <BlockInspector
            block={selectedBlock}
            onChange={handleUpdateBlock}
            onDuplicate={() => handleDuplicateBlock(selectedBlock.id)}
            onDelete={() => handleDeleteBlock(selectedBlock.id)}
            onMoveUp={() => handleMoveBlock(selectedIndex, 'up')}
            onMoveDown={() => handleMoveBlock(selectedIndex, 'down')}
            canMoveUp={selectedIndex > 0}
            canMoveDown={selectedIndex < page.blocks.length - 1}
            onClose={() => setSelectedBlockId(null)}
          />
        )}
      </div>

      {/* ================================================================= */}
      {/* MODALS: Widget Library & Starter Templates */}
      {/* ================================================================= */}
      <BlockLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onAddBlock={handleAddBlock}
      />

      <TemplatePickerModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={(blocks) => pushBlocksChange(blocks)}
      />
      </div>
    </ProtectedRoute>
  );
};
