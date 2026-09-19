import React, { useState, useEffect } from 'react';
import { 
  Sliders, Save, Sparkles, CheckCircle2, RotateCcw, 
  Smartphone, Tablet, Monitor, ChevronDown, Palette, 
  Layout, Eye, Layers, Type, Code, Shield, ExternalLink,
  ArrowRight
} from 'lucide-react';
import { ThemeCustomizerSettings, NavigationMenu } from '../../types';
import { 
  getThemeCustomizerSettings, saveThemeCustomizerSettings, 
  getNavigationMenus 
} from '../../lib/cmsService';
import { INITIAL_THEME_CUSTOMIZER } from '../../data/initialCmsData';
import { StargazeHorizontalLogo } from '../../components/common/StargazeHorizontalLogo';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';

export const CustomizerAdminPage: React.FC = () => {
  const [settings, setSettings] = useState<ThemeCustomizerSettings>(INITIAL_THEME_CUSTOMIZER);
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Accordion open states
  const [openSection, setOpenSection] = useState<string | null>('header');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [fetchedSettings, fetchedMenus] = await Promise.all([
          getThemeCustomizerSettings(),
          getNavigationMenus(),
        ]);
        setSettings(fetchedSettings);
        setMenus(fetchedMenus);
      } catch (err) {
        console.error('Failed to load customizer:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const updateHeader = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      header: { ...prev.header, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateFooter = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateTheme = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveThemeCustomizerSettings(settings);
      setFeedback('Theme customizations saved and published live!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Error saving customizer:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all customizer adjustments to default theme styling?')) {
      setSettings(INITIAL_THEME_CUSTOMIZER);
    }
  };

  const primaryHeaderMenu = menus.find((m) => m.location === 'header_primary');

  if (loading) {
    return (
      <ProtectedRoute requiredPermission="customizer.view">
        <div className="p-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center min-h-screen bg-zinc-950">
          <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-3" />
          Loading Live WordPress Customizer...
        </div>
      </ProtectedRoute>
    );
  }

  const previewWidthClass = 
    deviceMode === 'tablet' ? 'max-w-[768px]' :
    deviceMode === 'mobile' ? 'max-w-[420px]' :
    'w-full';

  return (
    <ProtectedRoute requiredPermission="customizer.view">
      <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* ========================================================= */}
      {/* TOP BAR */}
      {/* ========================================================= */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase font-mono tracking-tight text-white">
              LIVE THEME CUSTOMIZER
            </h1>
            <p className="text-[10px] font-mono text-zinc-400">
              WordPress-style Header, Footer, and Global Styling
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            title="Desktop View"
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'desktop' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            title="Tablet View"
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'tablet' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            title="Mobile View"
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'mobile' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefaults}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Reset to Theme Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isSaving ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish Customizer</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* WORKSPACE: LEFT DRAWER ACCORDION / RIGHT LIVE PREVIEW */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT CUSTOMIZER DRAWER */}
        <div className="w-80 md:w-96 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full shrink-0 overflow-y-auto divide-y divide-zinc-800 text-xs">
          {/* ========================================== */}
          {/* 1. HEADER BUILDER */}
          {/* ========================================== */}
          <div>
            <button
              onClick={() => toggleSection('header')}
              className="w-full p-4 flex items-center justify-between font-mono font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Layout className="w-4 h-4 text-amber-400" />
                <span>Header Builder</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'header' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'header' && (
              <div className="p-4 bg-zinc-950/50 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Header Layout</label>
                  <select
                    value={settings.header.layout}
                    onChange={(e) => updateHeader('layout', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  >
                    <option value="standard">Standard Left Logo + Right Menu</option>
                    <option value="centered_logo">Centered Cinema Logo</option>
                    <option value="minimal_split">Minimal Split Navigation</option>
                    <option value="floating_bar">Floating Glass Capsule</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400 uppercase mb-1">
                    <span>Logo Height</span>
                    <span>{settings.header.logoHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min={32}
                    max={72}
                    value={settings.header.logoHeight}
                    onChange={(e) => updateHeader('logoHeight', parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Sticky Navigation</span>
                    <input
                      type="checkbox"
                      checked={settings.header.sticky}
                      onChange={(e) => updateHeader('sticky', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Backdrop Blur Glassmorphism</span>
                    <input
                      type="checkbox"
                      checked={settings.header.glassmorphism}
                      onChange={(e) => updateHeader('glassmorphism', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Show Primary Action CTA</span>
                    <input
                      type="checkbox"
                      checked={settings.header.showPrimaryCta}
                      onChange={(e) => updateHeader('showPrimaryCta', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Show Explore Scenes Button</span>
                    <input
                      type="checkbox"
                      checked={settings.header.showExploreButton}
                      onChange={(e) => updateHeader('showExploreButton', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                </div>

                {settings.header.showPrimaryCta && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">CTA Text</label>
                      <input
                        type="text"
                        value={settings.header.primaryCtaText}
                        onChange={(e) => updateHeader('primaryCtaText', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">CTA Link</label>
                      <input
                        type="text"
                        value={settings.header.primaryCtaLink}
                        onChange={(e) => updateHeader('primaryCtaLink', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* 2. FOOTER BUILDER */}
          {/* ========================================== */}
          <div>
            <button
              onClick={() => toggleSection('footer')}
              className="w-full p-4 flex items-center justify-between font-mono font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Layout className="w-4 h-4 text-amber-400" />
                <span>Footer Builder</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'footer' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'footer' && (
              <div className="p-4 bg-zinc-950/50 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Footer Layout</label>
                  <select
                    value={settings.footer.layout}
                    onChange={(e) => updateFooter('layout', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  >
                    <option value="columns_4">4 Columns (Studio, Links, Newsletter, Social)</option>
                    <option value="columns_3">3 Columns Balanced</option>
                    <option value="minimal">Minimal Centered Footer</option>
                    <option value="cinema_slate">Cinema Slate Billboard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.footer.tagline}
                    onChange={(e) => updateFooter('tagline', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Copyright Line</label>
                  <input
                    type="text"
                    value={settings.footer.copyrightText}
                    onChange={(e) => updateFooter('copyrightText', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Show Newsletter Box</span>
                    <input
                      type="checkbox"
                      checked={settings.footer.showNewsletter}
                      onChange={(e) => updateFooter('showNewsletter', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Show Social Media Links</span>
                    <input
                      type="checkbox"
                      checked={settings.footer.showSocialIcons}
                      onChange={(e) => updateFooter('showSocialIcons', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Show Back to Top Button</span>
                    <input
                      type="checkbox"
                      checked={settings.footer.showBackToTop}
                      onChange={(e) => updateFooter('showBackToTop', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* 3. GLOBAL THEME & ACCENTS */}
          {/* ========================================== */}
          <div>
            <button
              onClick={() => toggleSection('theme')}
              className="w-full p-4 flex items-center justify-between font-mono font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Colors & Typography</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'theme' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'theme' && (
              <div className="p-4 bg-zinc-950/50 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-2">Accent Color Palette</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'amber', name: 'Amber Gold', hex: '#d97706' },
                      { id: 'crimson', name: 'Crimson Slate', hex: '#dc2626' },
                      { id: 'emerald', name: 'Emerald Indie', hex: '#059669' },
                      { id: 'sapphire', name: 'Sapphire 4K', hex: '#2563eb' },
                      { id: 'gold', name: 'Royal Gold', hex: '#eab308' },
                      { id: 'monochrome', name: 'Film Noir', hex: '#ffffff' },
                    ].map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => {
                          updateTheme('accentColorPreset', pal.id);
                          updateTheme('customAccentHex', pal.hex);
                        }}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                          settings.theme.accentColorPreset === pal.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: pal.hex }} />
                        <span className="text-[10px] font-mono text-zinc-300 font-bold">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Corner Radius Style</label>
                  <select
                    value={settings.theme.borderRadiusPreset}
                    onChange={(e) => updateTheme('borderRadiusPreset', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  >
                    <option value="none">Sharp Cinema (0px)</option>
                    <option value="sm">Subtle (4px)</option>
                    <option value="md">Medium (8px)</option>
                    <option value="lg">Modern (16px)</option>
                    <option value="xl">Capsule (24px)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Custom Cinema Cursor</span>
                    <input
                      type="checkbox"
                      checked={settings.theme.enableCustomCursor}
                      onChange={(e) => updateTheme('enableCustomCursor', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Smooth Scene Transitions</span>
                    <input
                      type="checkbox"
                      checked={settings.theme.enableSmoothTransitions}
                      onChange={(e) => updateTheme('enableSmoothTransitions', e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* 4. CUSTOM CSS & SCRIPTS */}
          {/* ========================================== */}
          <div>
            <button
              onClick={() => toggleSection('custom_code')}
              className="w-full p-4 flex items-center justify-between font-mono font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2.5">
                <Code className="w-4 h-4 text-amber-400" />
                <span>Custom CSS Code</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'custom_code' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'custom_code' && (
              <div className="p-4 bg-zinc-950/50 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Custom CSS Stylesheet</label>
                  <textarea
                    rows={6}
                    value={settings.customCss || ''}
                    onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                    placeholder="/* Custom CSS overrides */ .header-brand { ... }"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT LIVE PREVIEW CANVAS */}
        {/* ========================================================= */}
        <div className="flex-1 bg-zinc-950/90 p-4 sm:p-8 overflow-y-auto flex flex-col items-center">
          <div className={`transition-all duration-300 ${previewWidthClass} w-full bg-white text-zinc-900 min-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-zinc-800 flex flex-col justify-between`}>
            {/* LIVE HEADER PREVIEW */}
            <header className={`w-full py-4 px-6 border-b border-zinc-200 flex items-center justify-between ${
              settings.header.layout === 'centered_logo' ? 'flex-col gap-4' : ''
            }`}>
              <div className="flex items-center gap-6">
                <div style={{ height: `${settings.header.logoHeight}px` }} className="flex items-center">
                  <StargazeHorizontalLogo height={settings.header.logoHeight} />
                </div>

                {settings.header.layout !== 'centered_logo' && primaryHeaderMenu && (
                  <nav className="hidden md:flex items-center gap-4 text-xs font-mono font-bold tracking-wider text-zinc-600">
                    {primaryHeaderMenu.items.slice(0, 5).map((item) => (
                      <span key={item.id} className="hover:text-amber-600 transition cursor-pointer">
                        {item.label}
                      </span>
                    ))}
                  </nav>
                )}
              </div>

              <div className="flex items-center gap-3">
                {settings.header.showExploreButton && (
                  <button className="px-4 py-2 rounded-xl bg-zinc-100 border border-zinc-300 text-zinc-800 font-mono text-xs font-bold uppercase">
                    {settings.header.exploreButtonText}
                  </button>
                )}
                {settings.header.showPrimaryCta && (
                  <button 
                    className="px-4 py-2 rounded-xl text-black font-mono text-xs font-bold uppercase shadow-md flex items-center gap-1.5"
                    style={{ backgroundColor: settings.theme.customAccentHex || '#d97706' }}
                  >
                    <span>{settings.header.primaryCtaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </header>

            {/* DEMO PAGE CONTENT IN PREVIEW */}
            <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-zinc-50/50">
              <span className="text-xs font-mono tracking-widest text-amber-600 uppercase font-bold mb-2">
                LIVE INTERACTIVE PREVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display tracking-tight text-zinc-950 max-w-xl mb-4">
                Real-Time Customizer Experience
              </h2>
              <p className="text-sm text-zinc-600 max-w-md font-light leading-relaxed mb-6">
                Adjust typography, sticky navigation, header layouts, accent palette, and footer options in the sidebar. Changes reflect instantaneously.
              </p>
              <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm text-xs font-mono text-zinc-500 max-w-sm">
                Active Theme Accent: <span className="font-bold text-zinc-900 uppercase">{settings.theme.accentColorPreset} ({settings.theme.customAccentHex})</span>
              </div>
            </div>

            {/* LIVE FOOTER PREVIEW */}
            <footer className="w-full bg-zinc-950 text-zinc-400 p-8 border-t border-zinc-800">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
                <div>
                  <div className="h-8 mb-3 flex items-center">
                    <StargazeHorizontalLogo height={32} />
                  </div>
                  <p className="text-zinc-500 font-light">{settings.footer.tagline}</p>
                </div>

                <div>
                  <h4 className="font-mono text-white font-bold uppercase mb-3">Quick Navigation</h4>
                  <ul className="space-y-2 text-zinc-400 font-mono text-[11px]">
                    <li>Film Slate</li>
                    <li>Camera Rental</li>
                    <li>Distribution</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-white font-bold uppercase mb-3">Studio Desk</h4>
                  <ul className="space-y-2 text-zinc-400 font-mono text-[11px]">
                    <li>About Stargaze</li>
                    <li>Sound Stages</li>
                    <li>Business Enquiry</li>
                  </ul>
                </div>

                {settings.footer.showNewsletter && (
                  <div>
                    <h4 className="font-mono text-white font-bold uppercase mb-2">
                      {settings.footer.newsletterHeading}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mb-3">{settings.footer.newsletterSubtext}</p>
                    <div className="flex gap-1">
                      <input
                        type="email"
                        placeholder="email@studio.com"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                      />
                      <button 
                        className="px-3 py-1.5 rounded-lg text-black font-bold text-xs"
                        style={{ backgroundColor: settings.theme.customAccentHex || '#d97706' }}
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="max-w-6xl mx-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
                <span>{settings.footer.copyrightText}</span>
                <span>Powered by Stargaze Customizer Engine</span>
              </div>
            </footer>
          </div>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
