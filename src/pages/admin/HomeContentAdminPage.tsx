import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getSiteContent, saveSiteContent, saveCmsDocument } from '../../lib/cmsService';
import { SiteContentConfig } from '../../types';
import { 
  Globe, Check, RefreshCw, Layers, Phone, Mail, MapPin, 
  Sparkles, Sliders, Hash 
} from 'lucide-react';

export const HomeContentAdminPage: React.FC = () => {
  const [content, setContent] = useState<SiteContentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSiteContent();
        setContent(data);
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
      const updatedPayload = {
        ...content,
        updatedAt: new Date().toISOString(),
      };
      await saveSiteContent(updatedPayload);
      await saveCmsDocument('siteContent', 'homepage', updatedPayload, 'UPDATE_HOMEPAGE_CONTENT');
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
    if (!content) return;
    const stats = [...content.stats];
    stats[index] = { ...stats[index], [field]: val };
    setContent({ ...content, stats });
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

  return (
    <ProtectedRoute requiredPermission="settings.view">
      <AdminLayout>
        <form onSubmit={handleSave} className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
                <Globe className="w-4 h-4" /> RECEPTIVE PORTAL CMS
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">HOMEPAGE CONTENT</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Edit studio narratives, key metrics, quotes, and primary contact coordinates displayed on the public site.
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

          {/* Section 1: Studio Narrative & Philosophy */}
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
                  value={content.aboutStudioTitle}
                  onChange={(e) => setContent({ ...content, aboutStudioTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">About Section Body Text</label>
                <textarea
                  rows={4}
                  value={content.aboutStudioText}
                  onChange={(e) => setContent({ ...content, aboutStudioText: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Featured Studio Quote / Tagline</label>
                  <input
                    type="text"
                    value={content.aboutStudioQuote}
                    onChange={(e) => setContent({ ...content, aboutStudioQuote: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Quote Attribution</label>
                  <input
                    type="text"
                    value={content.aboutStudioQuoteAuthor}
                    onChange={(e) => setContent({ ...content, aboutStudioQuoteAuthor: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Key Milestones & Metrics */}
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
              {content.stats.map((stat, idx) => (
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

          {/* Section 3: Primary Coordinates */}
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
                  value={content.contactEmail}
                  onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Production Desk Phone</label>
                <input
                  type="text"
                  value={content.contactPhone}
                  onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Studio Address / Facility</label>
                <input
                  type="text"
                  value={content.contactAddress}
                  onChange={(e) => setContent({ ...content, contactAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </form>
      </AdminLayout>
    </ProtectedRoute>
  );
};
