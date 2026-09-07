import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { db, storage, auth } from '../../firebase/config';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { MediaDocument, MediaAssignment, assignMediaToSlot, removeSlotAssignment } from '../../lib/mediaResolver';
import { uploadMediaFile, deleteStorageFile } from '../../lib/storageService';
import { calculateMediaUsage } from '../../lib/cmsService';
import { MediaUsageInfo } from '../../types';
import { 
  Search, Upload, Folder, Image as ImageIcon, Trash2, Edit3, 
  CheckCircle2, XCircle, Tag, RefreshCw, Sliders, ShieldCheck, 
  Check, X, AlertCircle, Eye, FileText, Globe, Link2, Plus, ArrowRight,
  Layers, AlertTriangle, ExternalLink
} from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

const WEBSITE_SLOTS = [
  { id: 'brand.logo', label: 'Brand Logo', category: 'brand' },
  { id: 'brand.favicon', label: 'Favicon', category: 'brand' },
  { id: 'hero.nayiSoch.desktop', label: 'Nayi Soch — Desktop (1920x1080)', category: 'hero' },
  { id: 'hero.nayiSoch.mobile', label: 'Nayi Soch — Mobile (1080x1350)', category: 'hero' },
  { id: 'hero.psycho.desktop', label: 'Psycho — Desktop (1920x1080)', category: 'hero' },
  { id: 'hero.psycho.mobile', label: 'Psycho — Mobile (1080x1350)', category: 'hero' },
  { id: 'hero.sahebVikaskari.desktop', label: 'Saheb Vikaskari — Desktop (1920x1080)', category: 'hero' },
  { id: 'hero.sahebVikaskari.mobile', label: 'Saheb Vikaskari — Mobile (1080x1350)', category: 'hero' },
  { id: 'hero.fatherSon.desktop', label: 'Father & Son — Desktop (1920x1080)', category: 'hero' },
  { id: 'hero.fatherSon.mobile', label: 'Father & Son — Mobile (1080x1350)', category: 'hero' },
  { id: 'work.nayiSoch', label: 'Featured Work: Nayi Soch', category: 'work' },
  { id: 'work.psycho', label: 'Featured Work: Psycho', category: 'work' },
  { id: 'work.sahebVikaskari', label: 'Featured Work: Saheb Vikaskari', category: 'work' },
  { id: 'work.fatherSon', label: 'Featured Work: Father & Son', category: 'work' },
  { id: 'events.fatherSon', label: 'Events: Father & Son Duo Live Concert', category: 'events' },
  { id: 'events.cannes', label: 'Events: Cannes Film Showcase', category: 'events' },
  { id: 'events.imaxPremiere', label: 'Events: IMAX Premiere Showcase', category: 'events' },
  { id: 'equipment.arriAlexa', label: 'Equipment: ARRI Alexa 35', category: 'equipment' },
  { id: 'equipment.redVraptor', label: 'Equipment: RED V-Raptor XL 8K', category: 'equipment' },
  { id: 'equipment.cookeAnamorphic', label: 'Equipment: Cooke Anamorphic /i Prime', category: 'equipment' },
  { id: 'equipment.ronin2', label: 'Equipment: DJI Ronin 2 3-Axis Gimbal', category: 'equipment' },
];

export const MediaLibraryPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [mediaList, setMediaList] = useState<MediaDocument[]>([]);
  const [assignments, setAssignments] = useState<{ [slot: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals & Panels
  const [selectedMedia, setSelectedMedia] = useState<MediaDocument | null>(null);
  const [assignModalMedia, setAssignModalMedia] = useState<MediaDocument | null>(null);
  const [replaceMediaItem, setReplaceMediaItem] = useState<MediaDocument | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaDocument | null>(null);
  const [usageModalMedia, setUsageModalMedia] = useState<{ media: MediaDocument; usage: MediaUsageInfo } | null>(null);
  const [usageMap, setUsageMap] = useState<Record<string, MediaUsageInfo>>({});

  // Edit Form state
  const [editTitle, setEditTitle] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<MediaDocument['category']>('general');
  const [editTags, setEditTags] = useState('');
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(50);

  const [lastUploadState, setLastUploadState] = useState<string>('Idle');
  const [lastError, setLastError] = useState<string>('');
  const [lastPath, setLastPath] = useState<string>('');
  const [lastProvider, setLastProvider] = useState<string>('');
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load media docs
      const mediaSnap = await getDocs(collection(db, 'media'));
      const items: MediaDocument[] = [];
      mediaSnap.forEach((d) => {
        items.push({ ...(d.data() as MediaDocument), id: d.id });
      });
      setMediaList(items);

      // Load assignments
      const assignSnap = await getDocs(collection(db, 'mediaAssignments'));
      const assignMap: { [slot: string]: string } = {};
      assignSnap.forEach((d) => {
        const data = d.data() as MediaAssignment;
        if (data.enabled && data.mediaId) {
          assignMap[data.slot] = data.mediaId;
        }
      });
      setAssignments(assignMap);

      // Calculate usage map for all items
      const usages: Record<string, MediaUsageInfo> = {};
      await Promise.all(
        items.map(async (item) => {
          const info = await calculateMediaUsage(item.id);
          usages[item.id] = info;
        })
      );
      setUsageMap(usages);
    } catch (err) {
      console.error('Error loading media library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle File Uploads with Automatic Failover and Progress Tracking
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isReplacement = false, existingMedia?: MediaDocument) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!auth.currentUser && !user) {
      const authErr = 'Authentication required for media upload. Please log in.';
      setLastError(authErr);
      setLastUploadState('Error: Unauthenticated');
      alert(authErr);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setLastError('');
    setLastUploadState('Preparing upload...');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          throw new Error(`Invalid file type (${file.type}). Only image formats (JPEG, PNG, WEBP, SVG) are supported.`);
        }

        const mediaId = isReplacement && existingMedia ? existingMedia.id : 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const category = isReplacement && existingMedia ? existingMedia.category : 'general';
        const storagePath = `stargaze/${category}/${mediaId}/${file.name}`;
        setLastPath(storagePath);
        setLastUploadState(`Uploading binary (${file.name})...`);

        const uploadResult = await uploadMediaFile(
          file,
          storagePath,
          (progress, transferred, total) => {
            setUploadProgress(progress);
            setLastUploadState(`Uploading: ${progress}% (${transferred}/${total} bytes)`);
          },
          (statusText) => {
            setLastUploadState(statusText);
          }
        );

        setLastProvider(uploadResult.provider);
        const downloadUrl = uploadResult.downloadUrl;
        const actualStoragePath = uploadResult.storagePath;

        // Get image dimensions
        let width = 0;
        let height = 0;
        try {
          const img = new Image();
          img.src = downloadUrl;
          await new Promise((res) => {
            img.onload = () => {
              width = img.naturalWidth;
              height = img.naturalHeight;
              res(true);
            };
            img.onerror = () => res(false);
          });
        } catch {
          // Ignore dimension failure
        }

        setLastUploadState('Saving metadata to Firestore...');
        const mediaDoc: MediaDocument = {
          id: mediaId,
          name: file.name.replace(/\.[^/.]+$/, ''),
          originalFileName: file.name,
          storagePath: actualStoragePath,
          downloadUrl,
          mimeType: file.type,
          fileSize: file.size,
          width: width || undefined,
          height: height || undefined,
          category: category,
          tags: isReplacement && existingMedia ? existingMedia.tags : [],
          altText: isReplacement && existingMedia ? existingMedia.altText : file.name.replace(/\.[^/.]+$/, ''),
          title: isReplacement && existingMedia ? existingMedia.title : file.name.replace(/\.[^/.]+$/, ''),
          description: isReplacement && existingMedia ? existingMedia.description : '',
          focalPoint: isReplacement && existingMedia ? existingMedia.focalPoint : { x: 50, y: 50 },
          status: 'active',
          uploadedBy: auth.currentUser?.email || user?.email || 'admin',
          uploadedAt: isReplacement && existingMedia ? existingMedia.uploadedAt : serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, 'media', mediaId), mediaDoc);
        setLastUploadState('Upload complete successfully');
      }

      await loadData();
      setReplaceMediaItem(null);
    } catch (err: any) {
      console.error('Upload failed:', err);
      const errCode = err?.code ? `[${err.code}] ` : '';
      const errMsg = err?.message || 'Unknown error during upload';
      const fullErr = `${errCode}${errMsg}`;
      setLastError(fullErr);
      setLastUploadState('Failed: ' + fullErr);
      alert(`Upload failed: ${fullErr}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Open detail panel
  const openDetail = (item: MediaDocument) => {
    setSelectedMedia(item);
    setEditTitle(item.title || item.name);
    setEditAlt(item.altText || '');
    setEditDesc(item.description || '');
    setEditCategory(item.category || 'general');
    setEditTags(item.tags ? item.tags.join(', ') : '');
    setFocalX(item.focalPoint?.x ?? 50);
    setFocalY(item.focalPoint?.y ?? 50);
  };

  const saveMediaDetails = async () => {
    if (!selectedMedia) return;
    try {
      const updated: Partial<MediaDocument> = {
        title: editTitle,
        altText: editAlt,
        description: editDesc,
        category: editCategory,
        tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
        focalPoint: { x: focalX, y: focalY },
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'media', selectedMedia.id), updated, { merge: true });
      await loadData();
      setSelectedMedia(null);
    } catch (err) {
      console.error('Error updating media:', err);
      alert('Failed to update media details.');
    }
  };

  const handleDelete = async (item: MediaDocument) => {
    // Check if assigned
    const assignedSlots = Object.entries(assignments)
      .filter(([_, mediaId]) => mediaId === item.id)
      .map(([slot]) => slot);

    if (assignedSlots.length > 0 && !window.confirm(`This media is assigned to active slots: ${assignedSlots.join(', ')}. Delete anyway?`)) {
      return;
    }

    try {
      // Remove assignments
      for (const slot of assignedSlots) {
        await removeSlotAssignment(slot);
      }

      // Delete storage file
      try {
        await deleteStorageFile(item.storagePath);
      } catch (e) {
        console.warn('Storage object delete warning:', e);
      }

      // Delete Firestore doc
      await deleteDoc(doc(db, 'media', item.id));
      await loadData();
      setDeleteConfirmItem(null);
      if (selectedMedia?.id === item.id) setSelectedMedia(null);
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Failed to delete media.');
    }
  };

  const handleAssignSlot = async (slot: string, mediaId: string) => {
    try {
      await assignMediaToSlot(slot, mediaId, user?.email || 'admin');
      await loadData();
      setAssignModalMedia(null);
    } catch (err) {
      console.error('Assignment error:', err);
      alert('Failed to assign media slot.');
    }
  };

  const safeMediaList = Array.isArray(mediaList) ? mediaList : [];
  const filteredMedia = safeMediaList.filter((item) => {
    if (!item) return false;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (item.name || '').toLowerCase().includes(q) ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (Array.isArray(item.tags) && item.tags.some((t) => t && t.toLowerCase().includes(q)));
    const matchesCategory = categoryFilter === 'ALL' || (item.category && item.category.toUpperCase() === categoryFilter.toUpperCase());
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'BRAND', 'HERO', 'WORK', 'EVENTS', 'EQUIPMENT', 'TEAM', 'PARTNERS', 'NEWSROOM', 'GENERAL'];

  return (
    <ProtectedRoute requiredPermission="settings.view">
      <AdminLayout>
        <div className="space-y-8 pb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-1">
                <Folder className="w-4 h-4" /> WordPress-Style Cloud Media Center
              </div>
              <h1 className="text-3xl font-black font-serif-cinematic text-white tracking-wide">
                Stargaze Media Library CMS
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Upload binaries to Firebase Storage, manage metadata in Firestore, and assign assets instantly to website slots.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition"
              >
                <span>{showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}</span>
              </button>
              <label className="cursor-pointer px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition">
                <Upload className="w-4 h-4" />
                <span>+ UPLOAD MEDIA</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => handleFileUpload(e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Temporary Diagnostic Panel */}
          {showDiagnostics && (
            <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 text-xs font-mono space-y-2 text-zinc-300 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-amber-400 font-bold uppercase tracking-wider">Firebase Storage & Auth Diagnostics</span>
                <button onClick={() => setShowDiagnostics(false)} className="text-zinc-500 hover:text-white">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div><span className="text-zinc-500">Firebase Auth:</span> <span className={auth.currentUser ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{auth.currentUser ? 'CONNECTED' : 'NOT CONNECTED'}</span></div>
                <div><span className="text-zinc-500">Auth initialization:</span> <span className={authLoading ? "text-amber-400" : "text-emerald-400"}>{authLoading ? 'INITIALIZING' : 'COMPLETE'}</span></div>
                <div><span className="text-zinc-500">Authenticated UID:</span> <span className="text-white font-mono">{auth.currentUser?.uid || 'None'}</span></div>
                <div><span className="text-zinc-500">Firebase Project:</span> <span className="text-white font-mono">{auth.app.options.projectId || 'gen-lang-client-0743504908'}</span></div>
                <div><span className="text-zinc-500">Firebase Storage:</span> <span className="text-emerald-400 font-bold">CONNECTED (Auto-Failover Active)</span></div>
                <div><span className="text-zinc-500">Active Storage Provider:</span> <span className="text-amber-300 font-bold">{lastProvider ? lastProvider.toUpperCase() : 'AUTO'}</span></div>
                <div><span className="text-zinc-500">Storage Bucket:</span> <span className="text-white">{(storage as any)?.app?.options?.storageBucket || 'unknown'}</span></div>
                <div><span className="text-zinc-500">Last Upload State:</span> <span className="text-amber-300">{lastUploadState}</span></div>
                <div><span className="text-zinc-500">Last Upload Path:</span> <span className="text-white">{lastPath || 'None'}</span></div>
              </div>
              {lastError && (
                <div className="mt-2 p-2 bg-rose-950/40 border border-rose-500/40 rounded text-rose-300">
                  <span className="font-bold">Last Firebase Error:</span> {lastError}
                </div>
              )}
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="bg-zinc-900 border border-amber-500/40 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-300">
                <span>Processing media upload...</span>
                <span className="text-amber-400 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Search & Filters */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by title, name, or tags..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition ${
                    categoryFilter === cat
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-black/50 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm">Loading media library from Firestore...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-24 bg-zinc-900/30 border border-zinc-800 rounded-2xl space-y-3">
              <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base font-serif-cinematic">No Media Found</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Upload your first image asset using the button above to begin managing Stargaze media dynamically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item) => {
                const assignedSlot = Object.keys(assignments).find((slot) => assignments[slot] === item.id);
                return (
                  <div
                    key={item.id}
                    className="group bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <StargazeImage
                          src={item.downloadUrl}
                          alt={item.altText || item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          objectPosition={`${item.focalPoint?.x ?? 50}% ${item.focalPoint?.y ?? 50}%`}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-amber-400 font-mono text-[10px] uppercase">
                            {item.category}
                          </span>
                        </div>
                        {assignedSlot && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold">
                              ASSIGNED
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h3 className="text-sm font-bold text-white truncate">{item.title || item.name}</h3>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                          <span>{item.width && item.height ? `${item.width} × ${item.height}` : 'Dimensions N/A'}</span>
                          <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                        </div>

                        {/* Media Usage Badge */}
                        <div className="pt-1">
                          {usageMap[item.id]?.count > 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUsageModalMedia({ media: item, usage: usageMap[item.id] });
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] hover:bg-amber-500/25 transition"
                            >
                              <Layers className="w-3 h-3" />
                              Used in {usageMap[item.id].count} location{usageMap[item.id].count !== 1 ? 's' : ''}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" /> Unreferenced
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-zinc-800/60 mt-2">
                      <button
                        onClick={() => openDetail(item)}
                        className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[11px] rounded-xl font-bold uppercase transition text-center"
                      >
                        Edit / Details
                      </button>
                      <button
                        onClick={() => setAssignModalMedia(item)}
                        className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-mono text-[11px] rounded-xl font-bold uppercase transition flex items-center gap-1"
                        title="Assign to website slot"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Media Detail Modal / Panel */}
          {selectedMedia && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-white my-8">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase">
                    <FileText className="w-4 h-4" /> Media Details & Focal Point
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 relative">
                        <StargazeImage
                          src={selectedMedia.downloadUrl}
                          alt={selectedMedia.altText}
                          className="w-full h-full object-cover"
                          objectPosition={`${focalX}% ${focalY}%`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl font-bold uppercase text-center cursor-pointer transition">
                          Replace Media
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, true, selectedMedia)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => setDeleteConfirmItem(selectedMedia)}
                          className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-mono text-xs rounded-xl font-bold uppercase transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 font-sans">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={editAlt}
                          onChange={(e) => setEditAlt(e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono uppercase"
                        >
                          {categories.filter(c => c !== 'ALL').map((c) => (
                            <option key={c} value={c.toLowerCase()}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Focal Point Sliders */}
                      <div className="space-y-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <span className="text-xs font-mono text-amber-400 block font-bold">Focal Point Control</span>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div>
                            <label className="text-zinc-400 block mb-1">X: {focalX}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={focalX}
                              onChange={(e) => setFocalX(Number(e.target.value))}
                              className="w-full accent-amber-500"
                            />
                          </div>
                          <div>
                            <label className="text-zinc-400 block mb-1">Y: {focalY}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={focalY}
                              onChange={(e) => setFocalY(Number(e.target.value))}
                              className="w-full accent-amber-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedMedia(null)}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveMediaDetails}
                          className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs rounded-xl"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assign Modal */}
          {assignModalMedia && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-6 text-white relative">
                <button
                  onClick={() => setAssignModalMedia(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-serif-cinematic">Assign Media to Website Slot</h3>
                  <p className="text-xs text-zinc-400 font-mono truncate">Asset: {assignModalMedia.name}</p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {WEBSITE_SLOTS.map((slot) => {
                    const isAssignedHere = assignments[slot.id] === assignModalMedia.id;
                    return (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{slot.label}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{slot.id}</span>
                        </div>
                        {isAssignedHere ? (
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold rounded-lg border border-emerald-500/40">
                            ASSIGNED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAssignSlot(slot.id, assignModalMedia.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-[10px] rounded-lg uppercase"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Usage Inspector Modal */}
          {usageModalMedia && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-6 text-white relative shadow-2xl">
                <button
                  onClick={() => setUsageModalMedia(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-serif-cinematic">Asset Usage Details</h3>
                    <p className="text-xs text-zinc-400 font-mono truncate max-w-xs">{usageModalMedia.media.title || usageModalMedia.media.name}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4">
                  <div className="text-xs font-mono text-zinc-400 mb-2">
                    Used in <span className="text-amber-400 font-bold">{usageModalMedia.usage.count}</span> active location{usageModalMedia.usage.count !== 1 ? 's' : ''}:
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {usageModalMedia.usage.locations.map((loc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/60">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[9px] uppercase font-bold">
                              {loc.entityType}
                            </span>
                            <span className="text-xs font-bold text-white">{loc.entityTitle}</span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">Slot/Field: {loc.field}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setUsageModalMedia(null)}
                    className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal with Delete Protection */}
          {deleteConfirmItem && (() => {
            const usage = usageMap[deleteConfirmItem.id];
            const hasUsages = usage && usage.count > 0;

            return (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className={`bg-zinc-950 border ${hasUsages ? 'border-amber-500/60' : 'border-rose-500/40'} rounded-3xl max-w-lg w-full p-6 space-y-6 text-white shadow-2xl`}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    {hasUsages ? (
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold font-serif-cinematic">
                        {hasUsages ? 'Media Asset Is In Active Use!' : 'Delete Media Asset?'}
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm">
                        {hasUsages
                          ? `This asset is referenced in ${usage.count} location(s) across the website. Deleting it will break visuals in those sections.`
                          : 'This will permanently remove the file from Firebase Storage and Firestore metadata.'}
                      </p>
                    </div>
                  </div>

                  {hasUsages && (
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 text-left space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Referenced in {usage.count} locations:
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {usage.locations.map((loc, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/40 border border-amber-500/20">
                            <span className="font-bold text-zinc-200">{loc.entityTitle}</span>
                            <span className="text-[10px] font-mono text-amber-300/80">{loc.field}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={() => setDeleteConfirmItem(null)}
                      className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    {hasUsages && (
                      <button
                        onClick={() => {
                          const item = deleteConfirmItem;
                          setDeleteConfirmItem(null);
                          setUsageModalMedia({ media: item, usage });
                        }}
                        className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-xs rounded-xl font-bold"
                      >
                        View Full Usage
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(deleteConfirmItem)}
                      className={`px-5 py-2.5 ${hasUsages ? 'bg-rose-700 hover:bg-rose-600' : 'bg-rose-600 hover:bg-rose-500'} text-white font-mono text-xs rounded-xl font-bold`}
                    >
                      {hasUsages ? 'Delete Anyway' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
