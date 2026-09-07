import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { STARGAZE_MEDIA_REGISTRY, StargazeMedia } from '../../data/media';
import { Search, Copy, Check, Eye, X, Image as ImageIcon, AlertCircle, Folder, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

export const MediaLibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL, INSTALLED, MISSING
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<StargazeMedia | null>(null);

  // Filter registry items
  const filteredMedia = STARGAZE_MEDIA_REGISTRY.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.src.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.project && item.project.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesProject = projectFilter === 'ALL' || item.project === projectFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'INSTALLED' && item.installed) ||
      (statusFilter === 'MISSING' && !item.installed);

    return matchesSearch && matchesCategory && matchesProject && matchesStatus;
  });

  const totalRegistered = STARGAZE_MEDIA_REGISTRY.length;
  const totalInstalled = STARGAZE_MEDIA_REGISTRY.filter((i) => i.installed).length;
  const totalMissing = totalRegistered - totalInstalled;

  const handleCopyPath = (path: string, id: string) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const categories = ['ALL', 'HERO', 'WORK', 'EVENTS', 'EQUIPMENT', 'TEAM', 'PARTNERS', 'NEWSROOM', 'GENERAL'];
  const projects = ['ALL', 'NAYI SOCH', 'PSYCHO', 'SAHEB VIKAS KARI', 'FATHER & SON DUO', 'CAMERA', 'LENS', 'DIRECTOR', 'PRODUCER'];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 pb-16">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-1">
                <Folder className="w-4 h-4" />
                Project Asset Library & Verification
              </div>
              <h1 className="text-3xl font-black font-serif-cinematic text-white tracking-wide">
                Stargaze Asset Registry
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Truthful inspection of physical client asset files in <code className="text-amber-400 font-mono text-xs">/public/assets/stargaze/</code>.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-zinc-900/90 border border-zinc-800 px-5 py-3 rounded-2xl text-xs font-mono">
              <div>
                <span className="text-zinc-500 block">Total Registered</span>
                <span className="text-white font-bold">{totalRegistered}</span>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <span className="text-zinc-500 block">Installed</span>
                <span className="text-emerald-400 font-bold">{totalInstalled}</span>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div>
                <span className="text-zinc-500 block">Missing Files</span>
                <span className="text-amber-400 font-bold">{totalMissing}</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Banner */}
          <div className="bg-zinc-900/80 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-zinc-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Physical Asset Installation Status</h4>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Registry entries verify metadata structure, but physical image files must be placed directly into <code className="text-amber-400 font-mono">public/assets/stargaze/</code>. Firebase Storage cloud uploads have been permanently removed from this static architecture.
                </p>
              </div>
            </div>
            <div className="shrink-0 font-mono text-xs bg-black/60 border border-zinc-800 px-4 py-2.5 rounded-xl text-amber-400">
              Firebase Storage: REMOVED
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets by title or path..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-black/50 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="ALL">All Status</option>
                  <option value="INSTALLED">Installed Only</option>
                  <option value="MISSING">Missing Physical File</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-black/50 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-500">Project:</span>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="bg-black/50 border border-zinc-800 text-zinc-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                >
                  {projects.map((proj) => (
                    <option key={proj} value={proj}>
                      {proj}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="group bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-video sm:aspect-[16/10] bg-black overflow-hidden">
                  <StargazeImage
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-[#E5C158] font-mono text-[10px] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Installation Status Badge */}
                  <div className="absolute top-3 right-3">
                    {item.installed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> INSTALLED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                        <XCircle className="w-3 h-3 text-amber-400" /> MISSING
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    <button
                      onClick={() => setSelectedMedia(item)}
                      className="p-2.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition transform hover:scale-110 shadow-lg"
                      title="Inspect Asset"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyPath(item.src, item.id)}
                      className="p-2.5 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition transform hover:scale-110 shadow-lg"
                      title="Copy Public Path"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif-cinematic font-bold text-white text-base tracking-wide truncate">
                      {item.title}
                    </h3>
                    {item.project && (
                      <p className="text-xs font-mono text-amber-500/90 mt-0.5">
                        {item.project} {item.variant && `• ${item.variant}`}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="truncate max-w-[180px]" title={item.src}>
                        {item.src}
                      </span>
                      {item.width && item.height && (
                        <span className="text-zinc-500 shrink-0">
                          {item.width}×{item.height}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleCopyPath(item.src, item.id)}
                      className="w-full py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 font-mono text-xs flex items-center justify-center gap-2 transition"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Path Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Asset Path</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No assets found</h3>
              <p className="text-zinc-500 text-xs mt-1">Try adjusting your search query or status filters.</p>
            </div>
          )}

          {/* Detail Modal */}
          {selectedMedia && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-xs">
                      {selectedMedia.category}
                    </span>
                    <h3 className="text-lg font-bold text-white font-serif-cinematic">
                      {selectedMedia.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800">
                    <StargazeImage
                      src={selectedMedia.src}
                      alt={selectedMedia.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 font-mono text-xs bg-black/40 p-4 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-zinc-500 block">Asset ID</span>
                      <span className="text-white font-bold">{selectedMedia.id}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Status</span>
                      <span className={selectedMedia.installed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {selectedMedia.installed ? 'INSTALLED (Physical File Exists)' : 'MISSING PHYSICAL FILE'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Project</span>
                      <span className="text-amber-400 font-bold">{selectedMedia.project || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Variant</span>
                      <span className="text-white">{selectedMedia.variant || 'Standard'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-500 block">Physical / Public Path</span>
                      <code className="text-amber-300 bg-zinc-900 px-2 py-1 rounded block mt-1 select-all">{selectedMedia.src}</code>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-500 block">Alt Text</span>
                      <span className="text-zinc-300">{selectedMedia.alt}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      onClick={() => handleCopyPath(selectedMedia.src, selectedMedia.id)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition"
                    >
                      {copiedId === selectedMedia.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedId === selectedMedia.id ? 'Copied Path!' : 'Copy Public Path'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
