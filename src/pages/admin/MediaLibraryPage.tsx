import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { db, storage, auth } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { MediaItem } from '../../types';
import { Film, Upload, Search, Trash2, Check, Copy, Eye, X, Image as ImageIcon, Sparkles, Filter, AlertCircle } from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mediaName, setMediaName] = useState('');
  const [mediaCategory, setMediaCategory] = useState<MediaItem['category']>('HERO');
  const [mediaProject, setMediaProject] = useState<MediaItem['project']>('STARGAZE');
  const [altText, setAltText] = useState('');

  // Detail Modal State
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Fetch Media
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'media'));
      const items: MediaItem[] = [];
      querySnapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as MediaItem);
      });
      // Sort by newest
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setMediaList(items);
    } catch (err: any) {
      console.error('Error fetching media:', err);
      // Fallback empty if collection doesn't exist yet
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMediaName(file.name.replace(/\.[^/.]+$/, ''));
      setAltText(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("STARGAZE: CONFIRM UPLOAD CLICKED");

    console.log("STARGAZE: validating file");
    if (!selectedFile) {
      console.warn("STARGAZE: validation failed - no file selected");
      setErrorMsg('Please select a file to upload.');
      return;
    }
    console.log("STARGAZE: file validation passed");

    console.log("STARGAZE: checking authentication");
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("STARGAZE: auth.currentUser is null, checking localStorage fallback");
      const savedUser = localStorage.getItem('stargaze_auth_user');
      if (!savedUser) {
        console.warn("STARGAZE: authentication failed - no session found");
        setErrorMsg('Your admin session has expired. Please sign in again.');
        return;
      }
      console.log("STARGAZE: authenticated user found via session storage fallback");
    } else {
      console.log("STARGAZE: authenticated user found:", currentUser.email);
    }

    try {
      setUploading(true);
      setErrorMsg('');
      setUploadProgress(0);

      console.log("STARGAZE: preparing storage reference");
      const timestamp = Date.now();
      const safeName = selectedFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const storagePath = `stargaze/${mediaCategory.toLowerCase()}/${timestamp}_${safeName}`;
      const storageRef = ref(storage, storagePath);
      console.log("STARGAZE: storage reference created:", storagePath);

      console.log("STARGAZE: starting Firebase Storage upload");
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Safety timeout: if upload takes longer than 60 seconds without completing
      const uploadTimeout = setTimeout(() => {
        try {
          uploadTask.cancel();
        } catch (e) {
          // ignore cancel error
        }
        setUploading(false);
        setErrorMsg('Upload timed out or stalled. Please check Firebase Storage rules or network connection.');
      }, 60000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`STARGAZE: upload progress ${progress}%`);
          setUploadProgress(progress);
        },
        (error) => {
          clearTimeout(uploadTimeout);
          console.error('STARGAZE: Firebase Storage Upload error:', error);
          let errDetail = error.message || error.code || 'Unknown error';
          if (error.code === 'storage/unauthorized') {
            errDetail = 'Unauthorized. Please check your Firebase Storage security rules or admin login session.';
          }
          setErrorMsg(`Upload failed (${error.code || 'storage/error'}): ${errDetail}`);
          setUploading(false);
        },
        async () => {
          clearTimeout(uploadTimeout);
          console.log("STARGAZE: upload complete");
          try {
            console.log("STARGAZE: obtaining download URL");
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("STARGAZE: download URL obtained:", downloadUrl);

            // Get image dimensions if possible
            let width = 1920;
            let height = 1080;
            if (previewUrl) {
              const img = new Image();
              img.src = previewUrl;
              await new Promise((resolve) => {
                img.onload = () => {
                  width = img.naturalWidth;
                  height = img.naturalHeight;
                  resolve(true);
                };
                img.onerror = () => resolve(true);
              });
            }

            const currentUserEmail = auth.currentUser?.email || JSON.parse(localStorage.getItem('stargaze_auth_user') || '{}').email || 'admin';

            const newMediaRecord: Omit<MediaItem, 'id'> = {
              name: mediaName || selectedFile.name,
              originalFileName: selectedFile.name,
              storagePath,
              downloadUrl,
              category: mediaCategory,
              project: mediaProject,
              mimeType: selectedFile.type,
              fileSize: selectedFile.size,
              width,
              height,
              altText: altText || mediaName,
              desktopUrl: mediaCategory === 'HERO' ? downloadUrl : undefined,
              active: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              uploadedBy: currentUserEmail,
            };

            console.log("STARGAZE: writing Firestore record");
            await addDoc(collection(db, 'media'), newMediaRecord);
            console.log("STARGAZE: upload successful");

            setSuccessMsg('Upload successful! Media recorded in Firestore & Storage.');
            setUploading(false);
            setShowUploadModal(false);
            setSelectedFile(null);
            setPreviewUrl('');
            setMediaName('');
            fetchMedia();

            setTimeout(() => setSuccessMsg(''), 5000);
          } catch (completeErr: any) {
            console.error('STARGAZE: Error post-upload processing:', completeErr);
            setErrorMsg(`Failed to record media: ${completeErr.message}`);
            setUploading(false);
          }
        }
      );
    } catch (err: any) {
      console.error('STARGAZE: Upload exception:', err);
      setErrorMsg(err.message || 'Failed to upload media.');
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      // Delete from Storage if path exists
      if (item.storagePath) {
        try {
          const storageRef = ref(storage, item.storagePath);
          await deleteObject(storageRef);
        } catch (storageErr) {
          console.warn('Could not delete file from storage bucket:', storageErr);
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, 'media', item.id));
      setSuccessMsg('Media deleted successfully.');
      fetchMedia();
      setSelectedMedia(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Error deleting media:', err);
      alert('Failed to delete media record: ' + err.message);
    }
  };

  const handleToggleActive = async (item: MediaItem) => {
    try {
      await updateDoc(doc(db, 'media', item.id), {
        active: !item.active,
        updatedAt: new Date().toISOString(),
      });
      fetchMedia();
    } catch (err: any) {
      console.error('Error toggling active status:', err);
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.altText?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesProject = projectFilter === 'ALL' || item.project === projectFilter;
    return matchesSearch && matchesCategory && matchesProject;
  });

  return (
    <ProtectedRoute requiredPermission="media.view">
      <AdminLayout>
        <div className="space-y-6 font-sans text-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <ImageIcon className="w-4 h-4" /> PRODUCTION ASSET PIPELINE
              </div>
              <h1 className="text-3xl font-extrabold uppercase font-mono tracking-tight">MEDIA LIBRARY & STORAGE</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Upload real client artwork, banners, and hero assets to Firebase Storage & Firestore.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/10 transition"
            >
              <Upload className="w-4 h-4" /> Upload New Media
            </button>
          </div>

          {/* Success / Error Banners */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by title or alt text..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Filter className="w-3.5 h-3.5 text-amber-500" /> Category:
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Categories</option>
                <option value="HERO">HERO</option>
                <option value="WORK">WORK</option>
                <option value="FILMS">FILMS</option>
                <option value="EVENTS">EVENTS</option>
                <option value="EQUIPMENT">EQUIPMENT</option>
                <option value="TEAM">TEAM</option>
                <option value="PARTNERS">PARTNERS</option>
                <option value="NEWSROOM">NEWSROOM</option>
                <option value="GENERAL">GENERAL</option>
              </select>

              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Projects</option>
                <option value="NAYI SOCH">NAYI SOCH</option>
                <option value="PSYCHO">PSYCHO</option>
                <option value="SAHEB VIKAS KARI">SAHEB VIKAS KARI</option>
                <option value="FATHER & SON DUO">FATHER & SON DUO</option>
                <option value="EVENTS">EVENTS</option>
                <option value="STARGAZE">STARGAZE</option>
              </select>
            </div>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div className="py-24 text-center text-zinc-500 font-mono text-xs">Loading media library from Firestore...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="py-24 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-white font-mono uppercase">No Media Assets Found</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Upload client artwork, hero banners, or production photos to populate the Firebase storage pipeline.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-amber-500 text-black font-bold text-xs uppercase rounded-xl inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Upload First Asset
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="aspect-[16/9] relative bg-zinc-950 overflow-hidden">
                      <img
                        src={item.downloadUrl}
                        alt={item.altText || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-400 font-mono text-[9px] font-bold border border-amber-500/30">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-zinc-300 font-mono text-[9px] border border-white/10">
                          {item.project}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedMedia(item)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                      >
                        <span className="px-3 py-1.5 rounded-lg bg-black/80 border border-white/20 text-xs font-mono flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-amber-400" /> View Details
                        </span>
                      </button>
                    </div>

                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-bold text-white font-serif-cinematic truncate">{item.name}</h4>
                      <p className="text-[10px] font-mono text-zinc-400 truncate">
                        {item.originalFileName || 'Uploaded file'} {item.width && item.height ? `(${item.width}×${item.height})` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                        item.active
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.active ? 'Active' : 'Inactive'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.downloadUrl);
                          alert('Download URL copied to clipboard!');
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                        title="Copy Firebase URL"
                      >
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition"
                        title="Delete Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* UPLOAD MODAL */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <span className="text-amber-500 font-mono text-xs tracking-widest uppercase block mb-1">
                    STORAGE UPLOAD PIPELINE
                  </span>
                  <h3 className="text-xl font-bold font-mono uppercase text-white">Upload Stargaze Asset</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Files are securely stored in Firebase Storage and indexed in Firestore.</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  {/* Drag and Drop / File Input */}
                  <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-zinc-900/30 transition relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {previewUrl ? (
                      <div className="space-y-3">
                        <div className="w-32 h-20 rounded-lg overflow-hidden mx-auto bg-black border border-zinc-700">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-mono text-amber-400 block truncate">{selectedFile?.name}</span>
                        <span className="text-[10px] text-zinc-500 block">Click or drag to replace file</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-white">Click to upload or drag & drop</h4>
                        <p className="text-xs text-zinc-400 font-mono">JPG, PNG, WEBP (Supports 1920×1080, 1600×500, 1080×1350)</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Asset Name</label>
                      <input
                        type="text"
                        required
                        value={mediaName}
                        onChange={(e) => setMediaName(e.target.value)}
                        placeholder="e.g. Nayi Soch Hero Cinematic"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
                      <select
                        value={mediaCategory}
                        onChange={(e) => setMediaCategory(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      >
                        <option value="HERO">HERO</option>
                        <option value="WORK">WORK</option>
                        <option value="FILMS">FILMS</option>
                        <option value="EVENTS">EVENTS</option>
                        <option value="EQUIPMENT">EQUIPMENT</option>
                        <option value="TEAM">TEAM</option>
                        <option value="PARTNERS">PARTNERS</option>
                        <option value="NEWSROOM">NEWSROOM</option>
                        <option value="GENERAL">GENERAL</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Project Tag</label>
                      <select
                        value={mediaProject}
                        onChange={(e) => setMediaProject(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      >
                        <option value="NAYI SOCH">NAYI SOCH</option>
                        <option value="PSYCHO">PSYCHO</option>
                        <option value="SAHEB VIKAS KARI">SAHEB VIKAS KARI</option>
                        <option value="FATHER & SON DUO">FATHER & SON DUO</option>
                        <option value="EVENTS">EVENTS</option>
                        <option value="STARGAZE">STARGAZE</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Alt Text (Accessibility)</label>
                      <input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Describe image for screen readers"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-mono text-zinc-400">
                        <span>Uploading to Firebase Storage...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-bold hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Confirm Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DETAIL MODAL */}
          {selectedMedia && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full overflow-hidden relative shadow-2xl">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="aspect-[16/9] bg-black relative">
                  <img
                    src={selectedMedia.downloadUrl}
                    alt={selectedMedia.altText}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[10px] uppercase font-bold">
                        {selectedMedia.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono text-[10px] uppercase">
                        {selectedMedia.project}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif-cinematic text-white">{selectedMedia.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 font-mono text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Dimensions</span>
                      <span className="text-white font-bold">{selectedMedia.width || '—'} × {selectedMedia.height || '—'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">File Size</span>
                      <span className="text-white font-bold">{(selectedMedia.fileSize / 1024).toFixed(1)} KB</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Format</span>
                      <span className="text-white font-bold uppercase">{selectedMedia.mimeType?.split('/')[1] || 'IMAGE'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Storage Path</span>
                      <span className="text-white font-bold truncate block" title={selectedMedia.storagePath}>{selectedMedia.storagePath}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Firebase Storage Download URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={selectedMedia.downloadUrl}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMedia.downloadUrl);
                          alert('URL copied!');
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono rounded-xl shrink-0"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-zinc-900">
                    <button
                      onClick={() => handleDelete(selectedMedia)}
                      className="px-4 py-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 text-xs font-bold flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Asset
                    </button>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="px-5 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700"
                    >
                      Close
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
