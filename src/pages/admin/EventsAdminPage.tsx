import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { 
  getEvents, saveCmsDocument, deleteCmsDocument, reorderCmsDocuments 
} from '../../lib/cmsService';
import { EventItem, ContentStatus } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Calendar, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Check, X, 
  RefreshCw, Image as ImageIcon, AlertCircle, MapPin 
} from 'lucide-react';

export const EventsAdminPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<EventItem | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;
    setSaving(true);

    try {
      const id = editingEvent.id || `evt-${Date.now()}`;
      const payload: EventItem = {
        id,
        title: editingEvent.title || '',
        category: editingEvent.category || 'Festival Premiere',
        location: editingEvent.location || '',
        eventDate: editingEvent.eventDate || new Date().toISOString().split('T')[0],
        description: editingEvent.description || '',
        imageUrl: editingEvent.imageUrl || '',
        imageMediaId: editingEvent.imageMediaId || '',
        status: editingEvent.status || 'PUBLISHED',
        displayOrder: editingEvent.displayOrder ?? (events.length + 1),
        focalPoint: editingEvent.focalPoint || { x: 50, y: 50 },
        updatedAt: new Date().toISOString(),
      };

      await saveCmsDocument('events', id, payload, 'SAVE_EVENT');
      await loadData();
      setEditingEvent(null);
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: EventItem) => {
    try {
      await deleteCmsDocument('events', item.id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const reordered = [...events];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setEvents(reordered);
    await reorderCmsDocuments('events', reordered.map((e) => e.id));
  };

  return (
    <ProtectedRoute requiredPermission="events.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Calendar className="w-4 h-4" /> PREMIERES & EXPERIENCES
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">EVENTS CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Manage film festival showcases, red-carpet galas, and theatrical exhibitions.
              </p>
            </div>

            <button
              onClick={() =>
                setEditingEvent({
                  title: '',
                  category: 'Premiere Gala',
                  location: 'Nagpur / Mumbai',
                  eventDate: new Date().toISOString().split('T')[0],
                  status: 'PUBLISHED',
                  displayOrder: events.length + 1,
                  focalPoint: { x: 50, y: 50 },
                })
              }
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" /> Add New Event
            </button>
          </div>

          {/* Events List */}
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading Events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-white font-bold text-base">No Events Configured</h3>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto">
                Add screening dates and red carpet exhibitions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-center justify-between transition"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Ordering */}
                    <div className="flex flex-col gap-1">
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
                        disabled={idx === events.length - 1}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-40 aspect-[16/9] rounded-xl overflow-hidden bg-black border border-zinc-800 relative shrink-0">
                      {evt.imageUrl ? (
                        <StargazeImage
                          src={evt.imageUrl}
                          alt={evt.title}
                          focalPoint={evt.focalPoint}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                          No Photo
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                          {evt.category}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            evt.status === 'PUBLISHED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white uppercase">{evt.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{evt.description}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mt-1">
                        <span>Date: {evt.eventDate}</span>
                        {evt.location && <span>• Location: {evt.location}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="p-2 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                      title="Edit Event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(evt)}
                      className="p-2 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit / Create Modal */}
          {editingEvent && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 text-white my-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold font-mono uppercase">
                        {editingEvent.id ? 'Edit Event Showcase' : 'Add Event Showcase'}
                      </h2>
                      <p className="text-xs text-zinc-400">Red carpet premiere, festival, or press gala</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      placeholder="e.g. Saheb Vikas Kari World Premiere Gala"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={editingEvent.category || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                        placeholder="e.g. Festival Premiere"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Event Date</label>
                      <input
                        type="text"
                        value={editingEvent.eventDate || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                        placeholder="e.g. 2024-11-15 or Fall 2024"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">Status</label>
                      <select
                        value={editingEvent.status || 'PUBLISHED'}
                        onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as ContentStatus })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Location / Venue</label>
                    <input
                      type="text"
                      value={editingEvent.location || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      placeholder="e.g. Inox Cinema, Central Mall, Nagpur"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Artwork Media Picker */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Event Photography / Still
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
                        {editingEvent.imageUrl ? (
                          <StargazeImage
                            src={editingEvent.imageUrl}
                            alt="Event Still"
                            focalPoint={editingEvent.focalPoint}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                            No Photo
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL or pick from library..."
                        value={editingEvent.imageUrl || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Description / Recap</label>
                    <textarea
                      rows={3}
                      value={editingEvent.description || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      placeholder="Event highlights, attendees, and premiere coverage..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
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
                      <span>Save Event</span>
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
              categoryFilterDefault="events"
              onSelect={({ mediaId, url, focalPoint }) => {
                setEditingEvent((prev) => ({
                  ...prev,
                  imageMediaId: mediaId,
                  imageUrl: url,
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
                  <h3 className="text-xl font-bold">Remove Event?</h3>
                  <p className="text-xs text-zinc-400">
                    This will remove &quot;{deleteConfirm.title}&quot; from the events showcase.
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
