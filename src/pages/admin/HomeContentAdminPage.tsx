import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getSiteContent, saveSiteContent, saveCmsDocument } from '../../lib/cmsService';
import { SiteContentConfig, StargazeWorldItem } from '../../types';
import { INITIAL_STARGAZE_WORLDS } from '../../data/initialCmsData';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Globe, Check, RefreshCw, Layers, Phone, Mail, MapPin, 
  Sparkles, Sliders, Hash, Image as ImageIcon, Plus, Trash2,
  Film, Camera, TrendingUp, Clapperboard, Award, Tv, Video,
  ExternalLink, ArrowUpRight
} from 'lucide-react';

const AVAILABLE_ICONS = [
  'Film', 'Sliders', 'Camera', 'Globe', 'Sparkles', 'TrendingUp', 
  'Clapperboard', 'Award', 'Layers', 'Tv', 'Video'
];

export const HomeContentAdminPage: React.FC = () => {
  const [content, setContent] = useState<SiteContentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Media Picker state for Universe worlds
  const [pickingMediaWorldIndex, setPickingMediaWorldIndex] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSiteContent();
        // Ensure universeSection exists
        const formattedData: SiteContentConfig = {
          ...data,
          universeSection: data.universeSection && data.universeSection.worlds && data.universeSection.worlds.length > 0
            ? data.universeSection
            : {
                eyebrow: 'SPATIAL DIRECTORY',
                heading: 'THE STARGAZE UNIVERSE',
                description: 'Six interconnected cinema domains powering entertainment from script to global screens.',
                worlds: INITIAL_STARGAZE_WORLDS,
              },
        };
        setContent(formattedData);
      } catch (err) {
        console.error('Error fetching site content:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updatedPayload: SiteContentConfig = {
        ...content,
      };
      await saveSiteContent(updatedPayload);
      await saveCmsDocument('site_settings', 'content', updatedPayload, 'UPDATE_HOMEPAGE_CONTENT');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving site content:', err);
      alert('Failed to save homepage content');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index: number, field: 'value' | 'label' | 'helper', val: string) => {
    if (!content || !content.stats) return;
    const stats = [...content.stats];
    stats[index] = { ...stats[index], [field]: val };
    setContent({ ...content, stats });
  };

  const updateUniverseHeader = (field: 'eyebrow' | 'heading' | 'description', val: string) => {
    if (!content) return;
    setContent({
      ...content,
      universeSection: {
        eyebrow: content.universeSection?.eyebrow || 'SPATIAL DIRECTORY',
        heading: content.universeSection?.heading || 'THE STARGAZE UNIVERSE',
        description: content.universeSection?.description || '',
        worlds: content.universeSection?.worlds || INITIAL_STARGAZE_WORLDS,
        [field]: val,
      },
    });
  };

  const updateWorld = (index: number, updates: Partial<StargazeWorldItem>) => {
    if (!content || !content.universeSection) return;
    const worlds = [...(content.universeSection.worlds || INITIAL_STARGAZE_WORLDS)];
    worlds[index] = { ...worlds[index], ...updates };
    setContent({
      ...content,
      universeSection: {
        ...content.universeSection,
        worlds,
      },
    });
  };

  const addWorld = () => {
    if (!content) return;
    const currentWorlds = content.universeSection?.worlds || INITIAL_STARGAZE_WORLDS;
    const nextCode = (currentWorlds.length + 1).toString().padStart(2, '0');
    const newWorld: StargazeWorldItem = {
      id: `world-${Date.now()}`,
      code: nextCode,
      name: 'NEW CINEMA DOMAIN',
      tagline: 'SPECIALIZED CINEMA WING',
      desc: 'Provide comprehensive description for this cinematic division.',
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
      iconName: 'Sparkles',
      link: '/projects',
      stats: 'Active Division',
      displayOrder: currentWorlds.length + 1,
      status: 'PUBLISHED',
    };
    setContent({
      ...content,
      universeSection: {
        eyebrow: content.universeSection?.eyebrow || 'SPATIAL DIRECTORY',
        heading: content.universeSection?.heading || 'THE STARGAZE UNIVERSE',
        description: content.universeSection?.description || '',
        worlds: [...currentWorlds, newWorld],
      },
    });
  };

  const removeWorld = (index: number) => {
    if (!content || !content.universeSection) return;
    const worlds = content.universeSection.worlds.filter((_, i) => i !== index);
    setContent({
      ...content,
      universeSection: {
        ...content.universeSection,
        worlds,
      },
    });
  };

  if (loading || !content) {
    return (
      <ProtectedRoute requiredPermission="settings.view">
        <AdminLayout>
          <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Loading Homepage CMS Settings...</span>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  const universeWorlds = content.universeSection?.worlds || INITIAL_STARGAZE_WORLDS;

  return (
    <ProtectedRoute requiredPermission="settings.view">
      <AdminLayout>
        <form onSubmit={handleSave} className="space-y-8 font-sans pb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Globe className="w-4 h-4" /> RECEPTIVE PORTAL CMS
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">HOMEPAGE CONTENT</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Edit the Stargaze Universe domains, images, studio narratives, key metrics, and coordinates.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{savedSuccess ? 'Changes Saved!' : 'Save Homepage Content'}</span>
            </button>
          </div>

          {/* SECTION: THE STARGAZE UNIVERSE (SPATIAL DIRECTORY & 6 CINEMA DOMAINS) */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase font-mono">
                    The Stargaze Universe (Spatial Directory & Cinema Domains)
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Manage the 6 cinema pillar cards, background images, taglines, and destination routes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addWorld}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono text-xs font-bold rounded-lg border border-zinc-700 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Domain Card
              </button>
            </div>

            {/* Section Header Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950/70 p-4 rounded-2xl border border-zinc-800/80">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Section Eyebrow Tag</label>
                <input
                  type="text"
                  value={content.universeSection?.eyebrow || 'SPATIAL DIRECTORY'}
                  onChange={(e) => updateUniverseHeader('eyebrow', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Section Main Heading</label>
                <input
                  type="text"
                  value={content.universeSection?.heading || 'THE STARGAZE UNIVERSE'}
                  onChange={(e) => updateUniverseHeader('heading', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Section Subtitle / Description</label>
                <input
                  type="text"
                  value={content.universeSection?.description || 'Six interconnected cinema domains powering entertainment from script to global screens.'}
                  onChange={(e) => updateUniverseHeader('description', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Cinema Domain Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {universeWorlds.map((world, idx) => (
                <div
                  key={world.id || idx}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 relative group hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        WORLD // {world.code || `0${idx + 1}`}
                      </span>
                      <span className="text-xs font-bold text-white uppercase font-mono">
                        {world.name || `Domain ${idx + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={world.status || 'PUBLISHED'}
                        onChange={(e) => updateWorld(idx, { status: e.target.value as any })}
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded border focus:outline-none ${
                          world.status === 'DRAFT'
                            ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                        }`}
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                      </select>

                      {universeWorlds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWorld(idx)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-900 transition"
                          title="Remove domain card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Visual Preview & Image Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Live Preview Column */}
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">Image Preview</label>
                      <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-zinc-900 border border-zinc-800 flex flex-col justify-between p-3">
                        {world.imageUrl ? (
                          <>
                            <img
                              src={world.imageUrl}
                              alt={world.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="relative z-10 flex justify-between items-center">
                          <span className="text-[9px] font-mono text-amber-400 font-bold">{world.code}</span>
                          <span className="text-[9px] font-mono text-zinc-400">{world.iconName || 'Film'}</span>
                        </div>
                        <div className="relative z-10">
                          <span className="text-[8px] font-mono text-amber-400 uppercase block leading-tight">{world.tagline}</span>
                          <span className="text-xs font-bold text-white uppercase block mt-0.5">{world.name}</span>
                          <span className="text-[8px] text-zinc-400 block mt-1 font-mono">{world.stats}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image URL & Media Library Button */}
                    <div className="sm:col-span-2 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-mono text-zinc-400">Background Image URL</label>
                          <button
                            type="button"
                            onClick={() => setPickingMediaWorldIndex(idx)}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 transition"
                          >
                            <ImageIcon className="w-3 h-3" /> Select from Media Library
                          </button>
                        </div>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={world.imageUrl || ''}
                          onChange={(e) => updateWorld(idx, { imageUrl: e.target.value })}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">Domain Code</label>
                          <input
                            type="text"
                            value={world.code || ''}
                            onChange={(e) => updateWorld(idx, { code: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                            placeholder="01"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-zinc-400 mb-1">Domain Icon</label>
                          <select
                            value={world.iconName || 'Film'}
                            onChange={(e) => updateWorld(idx, { iconName: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                          >
                            {AVAILABLE_ICONS.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">Domain Title (e.g. FILM & SERIES)</label>
                        <input
                          type="text"
                          value={world.name || ''}
                          onChange={(e) => updateWorld(idx, { name: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs font-bold uppercase focus:outline-none focus:border-amber-500"
                          placeholder="FILM & SERIES"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tagline, Description, Metric & Link */}
                  <div className="space-y-3 pt-2 border-t border-zinc-900">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">Tagline (e.g. IMAX & THEATRICAL PRODUCTION)</label>
                      <input
                        type="text"
                        value={world.tagline || ''}
                        onChange={(e) => updateWorld(idx, { tagline: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400 font-mono text-xs uppercase focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">Description Paragraph</label>
                      <textarea
                        rows={2}
                        value={world.desc || ''}
                        onChange={(e) => updateWorld(idx, { desc: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">Key Stats / Metric (e.g. 14 Features In Slate)</label>
                        <input
                          type="text"
                          value={world.stats || ''}
                          onChange={(e) => updateWorld(idx, { stats: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">Destination URL / Route</label>
                        <input
                          type="text"
                          value={world.link || ''}
                          onChange={(e) => updateWorld(idx, { link: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-500"
                          placeholder="/projects"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Studio Narrative & Philosophy */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Studio Narrative & Ethos</h2>
                <p className="text-xs text-zinc-400">Public about section and brand voice</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">About Section Headline</label>
                <input
                  type="text"
                  value={content.aboutStudioTitle || ''}
                  onChange={(e) => setContent({ ...content, aboutStudioTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">About Section Body Text</label>
                <textarea
                  rows={4}
                  value={content.aboutStudioText || ''}
                  onChange={(e) => setContent({ ...content, aboutStudioText: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Featured Studio Quote / Tagline</label>
                  <input
                    type="text"
                    value={content.aboutStudioQuote || ''}
                    onChange={(e) => setContent({ ...content, aboutStudioQuote: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Quote Attribution</label>
                  <input
                    type="text"
                    value={content.aboutStudioQuoteAuthor || ''}
                    onChange={(e) => setContent({ ...content, aboutStudioQuoteAuthor: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Key Milestones & Metrics */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Key Studio Metrics</h2>
                <p className="text-xs text-zinc-400">Headline stat counters shown on public site</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(content.stats || []).map((stat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    Metric 0{idx + 1}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Value (e.g. 100+)</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-amber-400 font-mono text-lg font-extrabold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs uppercase font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-0.5">Helper Note</label>
                    <input
                      type="text"
                      value={stat.helper || ''}
                      onChange={(e) => updateStat(idx, 'helper', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Primary Coordinates */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Contact & Studio Coordinates</h2>
                <p className="text-xs text-zinc-400">Official dispatch channels</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Official Studio Email</label>
                <input
                  type="email"
                  value={content.contactCopy?.email || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactCopy: {
                        introHeading: content.contactCopy?.introHeading || '',
                        introDescription: content.contactCopy?.introDescription || '',
                        officeAddress: content.contactCopy?.officeAddress || '',
                        email: e.target.value,
                        phone: content.contactCopy?.phone || '',
                        workingHours: content.contactCopy?.workingHours || '',
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Production Desk Phone</label>
                <input
                  type="text"
                  value={content.contactCopy?.phone || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactCopy: {
                        introHeading: content.contactCopy?.introHeading || '',
                        introDescription: content.contactCopy?.introDescription || '',
                        officeAddress: content.contactCopy?.officeAddress || '',
                        email: content.contactCopy?.email || '',
                        phone: e.target.value,
                        workingHours: content.contactCopy?.workingHours || '',
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Studio Address / Facility</label>
                <input
                  type="text"
                  value={content.contactCopy?.officeAddress || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contactCopy: {
                        introHeading: content.contactCopy?.introHeading || '',
                        introDescription: content.contactCopy?.introDescription || '',
                        officeAddress: e.target.value,
                        email: content.contactCopy?.email || '',
                        phone: content.contactCopy?.phone || '',
                        workingHours: content.contactCopy?.workingHours || '',
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Media Picker Modal */}
        {pickingMediaWorldIndex !== null && (
          <MediaPickerModal
            isOpen={true}
            onClose={() => setPickingMediaWorldIndex(null)}
            title={`Select Background Image for ${universeWorlds[pickingMediaWorldIndex]?.name || 'Domain'}`}
            onSelect={(selection) => {
              updateWorld(pickingMediaWorldIndex, {
                imageUrl: selection.url,
                imageMediaId: selection.mediaId,
                focalPoint: selection.focalPoint,
              });
              setPickingMediaWorldIndex(null);
            }}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
};
