import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getBrandSettings, saveBrandSettings, saveCmsDocument } from '../../lib/cmsService';
import { assignMediaToSlot } from '../../lib/mediaResolver';
import { BrandSettings } from '../../types';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { 
  Sparkles, Check, RefreshCw, Image as ImageIcon, Sliders, 
  Palette, Building2, Globe 
} from 'lucide-react';

export const BrandSettingsAdminPage: React.FC = () => {
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'primary' | 'light' | 'dark' | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getBrandSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching brand settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updatedPayload = {
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      await saveBrandSettings(updatedPayload);
      await saveCmsDocument('brandSettings', 'global', updatedPayload, 'UPDATE_BRAND_SETTINGS');
      
      if (settings.primaryLogoMediaId) {
        await assignMediaToSlot('brand.logo', settings.primaryLogoMediaId);
      }
      
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving brand settings:', err);
      alert('Failed to save brand settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <ProtectedRoute requiredPermission="settings.view">
        <AdminLayout>
          <div className="text-center py-20 text-zinc-500 font-mono text-sm flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Loading Studio Brand Settings...</span>
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
                <Sparkles className="w-4 h-4" /> STUDIO VISUAL IDENTITY
              </div>
              <h1 className="text-3xl font-extrabold text-white uppercase font-mono">BRAND & LOGO CMS</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Configure official Stargaze logos, brand nomenclature, legal entity name, and cinematic styling.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 font-mono transition shadow-lg shadow-amber-500/10"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{savedSuccess ? 'Settings Saved!' : 'Save Brand Settings'}</span>
            </button>
          </div>

          {/* Identity Information */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Studio Nomenclature</h2>
                <p className="text-xs text-zinc-400">Public studio identity and legal credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Display Studio Name *</label>
                <input
                  type="text"
                  required
                  value={settings.studioName}
                  onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Legal Registered Entity</label>
                <input
                  type="text"
                  value={settings.legalEntity}
                  onChange={(e) => setSettings({ ...settings, legalEntity: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Official Studio Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Official Brand Logos */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white uppercase font-mono">Brand Logo Assets</h2>
                <p className="text-xs text-zinc-400">Managed through Firebase Media Library with instant preview</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Logo */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">Primary Studio Logo</span>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('primary')}
                    className="text-[10px] font-mono text-amber-400 hover:underline"
                  >
                    Select Asset
                  </button>
                </div>
                <div className="h-24 bg-black/60 border border-zinc-800 rounded-xl flex items-center justify-center p-3">
                  {settings.primaryLogoUrl ? (
                    <StargazeImage
                      src={settings.primaryLogoUrl}
                      alt="Primary Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-zinc-600 font-mono">No Logo Set</span>
                  )}
                </div>
                <input
                  type="text"
                  value={settings.primaryLogoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, primaryLogoUrl: e.target.value })}
                  placeholder="URL or select from library..."
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-300"
                />
              </div>

              {/* Light Mode Logo */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">Light Mode Logo</span>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('light')}
                    className="text-[10px] font-mono text-amber-400 hover:underline"
                  >
                    Select Asset
                  </button>
                </div>
                <div className="h-24 bg-zinc-200 border border-zinc-300 rounded-xl flex items-center justify-center p-3">
                  {settings.lightLogoUrl ? (
                    <StargazeImage
                      src={settings.lightLogoUrl}
                      alt="Light Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">No Logo Set</span>
                  )}
                </div>
                <input
                  type="text"
                  value={settings.lightLogoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, lightLogoUrl: e.target.value })}
                  placeholder="URL or select from library..."
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-300"
                />
              </div>

              {/* Dark / Gold Variant */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">Dark / Gold Variant</span>
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('dark')}
                    className="text-[10px] font-mono text-amber-400 hover:underline"
                  >
                    Select Asset
                  </button>
                </div>
                <div className="h-24 bg-black border border-zinc-800 rounded-xl flex items-center justify-center p-3">
                  {settings.darkLogoUrl ? (
                    <StargazeImage
                      src={settings.darkLogoUrl}
                      alt="Dark Variant"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-zinc-600 font-mono">No Logo Set</span>
                  )}
                </div>
                <input
                  type="text"
                  value={settings.darkLogoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, darkLogoUrl: e.target.value })}
                  placeholder="URL or select from library..."
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-300"
                />
              </div>
            </div>
          </div>

          {/* Media Picker Modal */}
          {mediaPickerTarget && (
            <MediaPickerModal
              isOpen={true}
              onClose={() => setMediaPickerTarget(null)}
              categoryFilterDefault="general"
              onSelect={({ mediaId, url }) => {
                if (mediaPickerTarget === 'primary') {
                  setSettings((prev) => prev ? { ...prev, primaryLogoMediaId: mediaId, primaryLogoUrl: url } : null);
                } else if (mediaPickerTarget === 'light') {
                  setSettings((prev) => prev ? { ...prev, lightLogoUrl: url } : null);
                } else if (mediaPickerTarget === 'dark') {
                  setSettings((prev) => prev ? { ...prev, darkLogoUrl: url } : null);
                }
                setMediaPickerTarget(null);
              }}
            />
          )}
        </form>
      </AdminLayout>
    </ProtectedRoute>
  );
};
