import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getSEOSettings, saveSEOSettings, saveCmsDocument } from '../../lib/cmsService';
import { SEOSettings } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Search, Check, RefreshCw, Image as ImageIcon, Share2, 
  Globe, Sparkles, Tag 
} from 'lucide-react';

export const SEOSettingsAdminPage: React.FC = () => {
  const [seo, setSeo] = useState<SEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [keywordsText, setKeywordsText] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSEOSettings();
        setSeo(data);
        setKeywordsText(Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || ''));
      } catch (err) {
        console.error('Error fetching SEO settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const parsedKeywords = keywordsText
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const updatedPayload = {
        ...seo,
        keywords: parsedKeywords,
        updatedAt: new Date().toISOString(),
      };
      await saveSEOSettings(updatedPayload);
      await saveCmsDocument('seoSettings', 'global', updatedPayload, 'UPDATE_SEO_SETTINGS');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving SEO settings:', err);
      alert('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !seo) {
    return (
      <ProtectedRoute requiredPermission="settings.view">
        <AdminLayout>
          <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Loading SEO Settings...</span>
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
                <Search className="w-4 h-4" /> SEARCH ENGINE DISCOVERY
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">SEO & SOCIAL SHARING</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Configure meta descriptions, open graph social share artwork, keyword indexing, and site URL.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{savedSuccess ? 'SEO Saved!' : 'Save SEO Settings'}</span>
            </button>
          </div>

          {/* Search Meta */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Global Meta Tags</h2>
                <p className="text-xs text-zinc-400">Search results title and summary snippets</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Default Page Title *</label>
                  <input
                    type="text"
                    required
                    value={seo.defaultTitle}
                    onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Title Template</label>
                  <input
                    type="text"
                    value={seo.titleTemplate}
                    onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
                    placeholder="%s | STARGAZE MEDIA"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Meta Description (150-160 chars recommended)</label>
                <textarea
                  rows={3}
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="cinema, production house, RED V-Raptor, film studio, Nagpur"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Social Share / Open Graph */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Open Graph Social Card</h2>
                <p className="text-xs text-zinc-400">Preview image shown when sharing links on WhatsApp, LinkedIn, X, and iMessage</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">Social Share Card (1200 × 630px recommended)</span>
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ImageIcon className="w-3 h-3" /> Pick from Media Library
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-48 aspect-[1.91/1] bg-black border border-zinc-800 rounded-xl overflow-hidden shrink-0">
                    {seo.ogImageUrl ? (
                      <StargazeImage
                        src={seo.ogImageUrl}
                        alt="Social Share"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                        No Card Asset
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="URL or select from library..."
                    value={seo.ogImageUrl || ''}
                    onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Production Site URL</label>
                  <input
                    type="text"
                    value={seo.siteUrl}
                    onChange={(e) => setSeo({ ...seo, siteUrl: e.target.value })}
                    placeholder="https://stargazemedia.in"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Twitter / X Handle</label>
                  <input
                    type="text"
                    value={seo.twitterHandle || ''}
                    onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                    placeholder="@StargazeMedia"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Picker Modal */}
          {showMediaPicker && (
            <MediaPickerModal
              isOpen={true}
              onClose={() => setShowMediaPicker(false)}
              categoryFilterDefault="hero"
              onSelect={({ mediaId, url }) => {
                setSeo((prev) => prev ? { ...prev, ogImageMediaId: mediaId, ogImageUrl: url } : null);
                setShowMediaPicker(false);
              }}
            />
          )}
        </form>
      </AdminLayout>
    </ProtectedRoute>
  );
};
