import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { MediaDocument } from '../../lib/mediaResolver';
import { uploadMediaFile } from '../../lib/storageService';
import { 
  Search, X, Check, Upload, Image as ImageIcon, Sparkles, Filter, 
  RefreshCw, CheckCircle2, AlertCircle, Crosshair 
} from 'lucide-react';
import { StargazeImage } from '../common/StargazeImage';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: { mediaId: string; url: string; focalPoint?: { x: number; y: number } }) => void;
  title?: string;
  selectedMediaId?: string;
  categoryFilterDefault?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  selectedMediaId,
  categoryFilterDefault = 'ALL',
}) => {
  const [mediaList, setMediaList] = useState<MediaDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(categoryFilterDefault);
  const [highlightedMedia, setHighlightedMedia] = useState<MediaDocument | null>(null);

  // Uploading directly from picker
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadMedia = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'media'));
      const items: MediaDocument[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as MediaDocument[];
      setMediaList(items);

      if (selectedMediaId) {
        const found = items.find((m) => m.id === selectedMediaId);
        if (found) setHighlightedMedia(found);
      }
    } catch (err) {
      console.error('Error fetching media for picker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['ALL', 'hero', 'work', 'films', 'events', 'equipment', 'team', 'partners', 'newsroom', 'general'];

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch = 
      (m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.originalFileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.altText || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = categoryFilter === 'ALL' || m.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError('');

    try {
      const mediaId = 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const category = categoryFilter !== 'ALL' ? categoryFilter : 'general';
      const storagePath = `stargaze/${category}/${mediaId}/${file.name}`;

      const uploadResult = await uploadMediaFile(file, storagePath);

      const mediaDoc: any = {
        id: mediaId,
        name: file.name.replace(/\.[^/.]+$/, ''),
        originalFileName: file.name,
        storagePath: uploadResult.storagePath,
        downloadUrl: uploadResult.downloadUrl,
        mimeType: file.type,
        fileSize: file.size,
        category: category,
        tags: [],
        altText: file.name.replace(/\.[^/.]+$/, ''),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: 'Uploaded via Media Picker',
        focalPoint: { x: 50, y: 50 },
        status: 'active',
        uploadedBy: auth.currentUser?.email || 'admin',
        uploadedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'media', mediaId), mediaDoc);
      await loadMedia();
      onSelect({
        mediaId: mediaId,
        url: uploadResult.downloadUrl,
        focalPoint: { x: 50, y: 50 },
      });
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (highlightedMedia) {
      onSelect({
        mediaId: highlightedMedia.id,
        url: highlightedMedia.downloadUrl,
        focalPoint: highlightedMedia.focalPoint || { x: 50, y: 50 },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5C158]/20 border border-[#E5C158]/40 flex items-center justify-center text-[#E5C158]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase">{title}</h2>
              <p className="text-[11px] text-zinc-400">Select an approved asset from the Stargaze Media Library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Categories, Quick Upload */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-zinc-950/40 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex items-center gap-2 w-full md:w-80">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, filename, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E5C158]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider transition shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#E5C158] text-black font-bold'
                    : 'bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono cursor-pointer transition shrink-0">
            <Upload className="w-3.5 h-3.5 text-[#E5C158]" />
            <span>{isUploading ? 'Uploading...' : 'Quick Upload'}</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
          </label>
        </div>

        {uploadError && (
          <div className="px-6 py-2 bg-red-950/50 border-b border-red-800/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Media Grid & Preview Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#E5C158]" />
                <span className="text-xs font-mono">Loading media catalog...</span>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                <ImageIcon className="w-10 h-10 opacity-40 text-zinc-600" />
                <span className="text-sm font-bold text-zinc-400">No media assets found</span>
                <span className="text-xs text-zinc-600">Try adjusting search or upload a new file</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((media) => {
                  const isSelected = highlightedMedia?.id === media.id;
                  return (
                    <div
                      key={media.id}
                      onClick={() => setHighlightedMedia(media)}
                      onDoubleClick={() => {
                        setHighlightedMedia(media);
                        onSelect({
                          mediaId: media.id,
                          url: media.downloadUrl,
                          focalPoint: media.focalPoint || { x: 50, y: 50 },
                        });
                        onClose();
                      }}
                      className={`group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-[#E5C158] ring-2 ring-[#E5C158]/30 shadow-lg scale-[1.02]'
                          : 'border-zinc-800/80 bg-zinc-950 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={media.downloadUrl}
                        alt={media.title || media.originalFileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#E5C158] text-black flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[11px] font-semibold text-white truncate drop-shadow">
                          {media.title || media.originalFileName}
                        </p>
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-0.5">
                          <span className="uppercase text-[#E5C158]">{media.category}</span>
                          <span>{media.width ? `${media.width}×${media.height}` : `${Math.round((media.fileSize || 0)/1024)} KB`}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Preview */}
          {highlightedMedia && (
            <div className="w-72 border-l border-zinc-800 bg-zinc-950/80 p-5 shrink-0 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 relative">
                  <StargazeImage
                    src={highlightedMedia.downloadUrl}
                    alt={highlightedMedia.title}
                    focalPoint={highlightedMedia.focalPoint}
                    className="w-full h-full object-cover"
                  />
                  {highlightedMedia.focalPoint && (
                    <div 
                      className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-[#E5C158] rounded-full pointer-events-none shadow"
                      style={{
                        left: `${highlightedMedia.focalPoint.x}%`,
                        top: `${highlightedMedia.focalPoint.y}%`,
                      }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white break-words">
                    {highlightedMedia.title || highlightedMedia.originalFileName}
                  </h3>
                  <div className="space-y-1 text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ID:</span>
                      <span className="truncate max-w-[120px] text-zinc-300">{highlightedMedia.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Category:</span>
                      <span className="text-[#E5C158] uppercase">{highlightedMedia.category}</span>
                    </div>
                    {highlightedMedia.width && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Dimensions:</span>
                        <span>{highlightedMedia.width} × {highlightedMedia.height}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Size:</span>
                      <span>{Math.round((highlightedMedia.fileSize || 0) / 1024)} KB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Focal Point:</span>
                      <span className="text-amber-400 flex items-center gap-1">
                        <Crosshair className="w-3 h-3" />
                        {highlightedMedia.focalPoint ? `${highlightedMedia.focalPoint.x}%, ${highlightedMedia.focalPoint.y}%` : 'Center'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80">
                <button
                  onClick={handleConfirm}
                  className="w-full py-2.5 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-bold font-mono text-xs uppercase transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Use Selected Asset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-zinc-500 font-mono">
            {filteredMedia.length} asset{filteredMedia.length !== 1 ? 's' : ''} available
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!highlightedMedia}
              className="px-5 py-1.5 rounded-lg bg-[#E5C158] hover:bg-[#F0CE68] disabled:opacity-40 text-black font-bold text-xs font-mono uppercase transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Select Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
