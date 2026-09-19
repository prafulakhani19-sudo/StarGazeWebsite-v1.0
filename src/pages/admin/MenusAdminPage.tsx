import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, Plus, Trash2, ArrowUp, ArrowDown, 
  Save, Check, ExternalLink, Sparkles, ChevronRight, 
  Layers, Link2, FileText, CheckCircle2, ChevronDown, 
  CornerDownRight, Globe
} from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, CustomPage } from '../../types';
import { getNavigationMenus, saveNavigationMenu, getCustomPages } from '../../lib/cmsService';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';

const SYSTEM_PAGES = [
  { label: 'Feature Films & Slate', url: '/projects' },
  { label: 'Production Capabilities', url: '/capabilities' },
  { label: 'Equipment Rental Floor', url: '/equipment' },
  { label: 'Global Distribution', url: '/distribution' },
  { label: 'Premieres & Experiences', url: '/events' },
  { label: 'Press & Newsroom', url: '/news' },
  { label: 'About Stargaze Media', url: '/about' },
  { label: 'Business Enquiry Desk', url: '/enquiry' },
];

export const MenusAdminPage: React.FC = () => {
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('menu-header-primary');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Left panel accordion state
  const [pagesAccordionOpen, setPagesAccordionOpen] = useState(true);
  const [systemAccordionOpen, setSystemAccordionOpen] = useState(true);
  const [customLinkAccordionOpen, setCustomLinkAccordionOpen] = useState(true);

  // Checkbox selections for batch adding
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [selectedSystemUrls, setSelectedSystemUrls] = useState<string[]>([]);

  // Custom link form
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [customLinkLabel, setCustomLinkLabel] = useState('');
  const [customLinkBadge, setCustomLinkBadge] = useState('');

  // New menu modal state
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuLocation, setNewMenuLocation] = useState<NavigationMenu['location']>('header_primary');

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedMenus, fetchedPages] = await Promise.all([
        getNavigationMenus(),
        getCustomPages(),
      ]);
      setMenus(fetchedMenus);
      setCustomPages(fetchedPages);
      if (fetchedMenus.length > 0 && !selectedMenuId) {
        setSelectedMenuId(fetchedMenus[0].id);
      }
    } catch (err) {
      console.error('Error loading menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeMenu = menus.find((m) => m.id === selectedMenuId) || menus[0];

  const updateActiveMenuItems = (newItems: NavigationMenuItem[]) => {
    if (!activeMenu) return;
    const updated = menus.map((m) =>
      m.id === activeMenu.id ? { ...m, items: newItems, updatedAt: new Date().toISOString() } : m
    );
    setMenus(updated);
  };

  // Add custom pages to menu
  const handleAddCustomPages = () => {
    if (!activeMenu) return;
    const itemsToAdd: NavigationMenuItem[] = selectedPageIds
      .map((pageId) => {
        const page = customPages.find((p) => p.id === pageId);
        if (!page) return null;
        return {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          label: page.title,
          type: 'page' as const,
          url: `/p/${page.slug}`,
          target: '_self' as const,
        };
      })
      .filter(Boolean) as NavigationMenuItem[];

    updateActiveMenuItems([...activeMenu.items, ...itemsToAdd]);
    setSelectedPageIds([]);
    showToast('Added custom pages to menu!');
  };

  // Add system pages to menu
  const handleAddSystemPages = () => {
    if (!activeMenu) return;
    const itemsToAdd: NavigationMenuItem[] = selectedSystemUrls
      .map((url) => {
        const sys = SYSTEM_PAGES.find((s) => s.url === url);
        if (!sys) return null;
        return {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          label: sys.label.toUpperCase(),
          type: 'system' as const,
          url: sys.url,
          target: '_self' as const,
        };
      })
      .filter(Boolean) as NavigationMenuItem[];

    updateActiveMenuItems([...activeMenu.items, ...itemsToAdd]);
    setSelectedSystemUrls([]);
    showToast('Added system routes to menu!');
  };

  // Add custom URL
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMenu || !customLinkUrl.trim() || !customLinkLabel.trim()) return;

    const newItem: NavigationMenuItem = {
      id: `item-${Date.now()}`,
      label: customLinkLabel.trim(),
      type: 'custom',
      url: customLinkUrl.trim(),
      badge: customLinkBadge.trim() || undefined,
      target: '_self',
    };

    updateActiveMenuItems([...activeMenu.items, newItem]);
    setCustomLinkUrl('');
    setCustomLinkLabel('');
    setCustomLinkBadge('');
    showToast('Added custom link to menu!');
  };

  // Reordering
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!activeMenu) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeMenu.items.length) return;
    const updated = [...activeMenu.items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateActiveMenuItems(updated);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeMenu) return;
    const updated = activeMenu.items.filter((item) => item.id !== itemId);
    updateActiveMenuItems(updated);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<NavigationMenuItem>) => {
    if (!activeMenu) return;
    const updated = activeMenu.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item));
    updateActiveMenuItems(updated);
  };

  const handleSaveMenu = async () => {
    if (!activeMenu) return;
    try {
      setIsSaving(true);
      await saveNavigationMenu(activeMenu.id, activeMenu);
      showToast('Menu saved and updated live!');
    } catch (err) {
      console.error('Save menu error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim()) return;
    const id = `menu-${Date.now()}`;
    const newMenu: NavigationMenu = {
      id,
      name: newMenuName.trim(),
      location: newMenuLocation,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveNavigationMenu(id, newMenu);
      setMenus([...menus, newMenu]);
      setSelectedMenuId(id);
      setCreateMenuOpen(false);
      setNewMenuName('');
      showToast('New menu created!');
    } catch (err) {
      console.error('Create menu error:', err);
    }
  };

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  if (loading) {
    return (
      <ProtectedRoute requiredPermission="menus.view">
        <AdminLayout>
          <div className="p-12 text-center text-zinc-500 font-mono text-xs flex flex-col items-center justify-center">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            Loading Navigation Menus...
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission="menus.view">
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-100 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            WORDPRESS STYLE NAVIGATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-display tracking-tight text-white">
            Navigation Menus
          </h1>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Build, nest, and assign site navigation bars, dropdowns, and footer link columns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateMenuOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-mono text-xs font-bold uppercase transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Menu</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* MENU SELECTOR BAR */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-mono text-zinc-400 uppercase font-bold shrink-0">
            Select a Menu to edit:
          </label>
          <select
            value={selectedMenuId}
            onChange={(e) => setSelectedMenuId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
          >
            {menus.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.location})
              </option>
            ))}
          </select>
        </div>

        {activeMenu && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-400">
              Location: <span className="text-amber-400 font-bold uppercase">{activeMenu.location}</span>
            </span>
            <button
              onClick={handleSaveMenu}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {isSaving ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Menu</span>
            </button>
          </div>
        )}
      </div>

      {/* DUAL COLUMN: LEFT ACCORDION (ADD ITEMS) / RIGHT (MENU TREE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Add Menu Items */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold block">
            ADD MENU ITEMS
          </span>

          {/* 1. CUSTOM PAGES */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setPagesAccordionOpen(!pagesAccordionOpen)}
              className="w-full p-4 flex items-center justify-between font-mono text-xs font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Custom Pages ({customPages.length})</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${pagesAccordionOpen ? 'rotate-180' : ''}`} />
            </button>

            {pagesAccordionOpen && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {customPages.map((page) => (
                    <label
                      key={page.id}
                      className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPageIds.includes(page.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPageIds([...selectedPageIds, page.id]);
                          } else {
                            setSelectedPageIds(selectedPageIds.filter((id) => id !== page.id));
                          }
                        }}
                        className="rounded accent-amber-500"
                      />
                      <span className="truncate">{page.title}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleAddCustomPages}
                  disabled={selectedPageIds.length === 0}
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-amber-400 font-mono text-xs font-bold uppercase transition"
                >
                  + Add to Menu
                </button>
              </div>
            )}
          </div>

          {/* 2. SYSTEM ROUTES */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setSystemAccordionOpen(!systemAccordionOpen)}
              className="w-full p-4 flex items-center justify-between font-mono text-xs font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>System Slates & Pages</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${systemAccordionOpen ? 'rotate-180' : ''}`} />
            </button>

            {systemAccordionOpen && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {SYSTEM_PAGES.map((sys) => (
                    <label
                      key={sys.url}
                      className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSystemUrls.includes(sys.url)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSystemUrls([...selectedSystemUrls, sys.url]);
                          } else {
                            setSelectedSystemUrls(selectedSystemUrls.filter((u) => u !== sys.url));
                          }
                        }}
                        className="rounded accent-amber-500"
                      />
                      <span className="truncate">{sys.label}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleAddSystemPages}
                  disabled={selectedSystemUrls.length === 0}
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-amber-400 font-mono text-xs font-bold uppercase transition"
                >
                  + Add to Menu
                </button>
              </div>
            )}
          </div>

          {/* 3. CUSTOM LINKS */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setCustomLinkAccordionOpen(!customLinkAccordionOpen)}
              className="w-full p-4 flex items-center justify-between font-mono text-xs font-bold text-white uppercase hover:bg-zinc-800/50 transition"
            >
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-amber-400" />
                <span>Custom Links & Badges</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${customLinkAccordionOpen ? 'rotate-180' : ''}`} />
            </button>

            {customLinkAccordionOpen && (
              <form onSubmit={handleAddCustomLink} className="p-4 border-t border-zinc-800 bg-zinc-950/40 space-y-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">URL / Path</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /custom-url"
                    value={customLinkUrl}
                    onChange={(e) => setCustomLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Link Text</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVAL HUB"
                    value={customLinkLabel}
                    onChange={(e) => setCustomLinkLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. NEW, 4K, LIVE"
                    value={customLinkBadge}
                    onChange={(e) => setCustomLinkBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono text-xs font-bold uppercase transition"
                >
                  + Add Custom Link
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Menu Structure / Tree Editor */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
              MENU STRUCTURE ({activeMenu?.items?.length || 0} ITEMS)
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Arrange items in your desired display order.
            </span>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-3">
            {!activeMenu || activeMenu.items.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 font-mono text-xs">
                This menu has no items. Add items using the panels on the left.
              </div>
            ) : (
              activeMenu.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-zinc-500">#{idx + 1}</span>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateItem(item.id, { label: e.target.value })}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold font-mono text-xs focus:border-amber-500 focus:outline-none"
                      />
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveItem(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveItem(idx, 'down')}
                        disabled={idx === activeMenu.items.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        title="Remove from Menu"
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-900 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">Target URL</span>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUpdateItem(item.id, { url: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">Badge Tag</span>
                      <input
                        type="text"
                        placeholder="e.g. NEW"
                        value={item.badge || ''}
                        onChange={(e) => handleUpdateItem(item.id, { badge: e.target.value })}
                        className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">Open In</span>
                      <select
                        value={item.target || '_self'}
                        onChange={(e) => handleUpdateItem(item.id, { target: e.target.value as any })}
                        className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs"
                      >
                        <option value="_self">Same Window (_self)</option>
                        <option value="_blank">New Tab (_blank)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* MENU SETTINGS / LOCATION */}
          {activeMenu && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                MENU SETTINGS & DISPLAY LOCATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Menu Name</label>
                  <input
                    type="text"
                    value={activeMenu.name}
                    onChange={(e) => {
                      const updated = menus.map((m) =>
                        m.id === activeMenu.id ? { ...m, name: e.target.value } : m
                      );
                      setMenus(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">Theme Location</label>
                  <select
                    value={activeMenu.location}
                    onChange={(e) => {
                      const loc = e.target.value as NavigationMenu['location'];
                      const updated = menus.map((m) =>
                        m.id === activeMenu.id ? { ...m, location: loc } : m
                      );
                      setMenus(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="header_primary">Primary Header Navigation</option>
                    <option value="header_secondary">Secondary Top Bar</option>
                    <option value="mobile_overlay">Mobile Fullscreen Overlay</option>
                    <option value="footer_col_1">Footer Column 1 (Quick Links)</option>
                    <option value="footer_col_2">Footer Column 2 (Studio / Company)</option>
                    <option value="footer_col_3">Footer Column 3 (Legal / Resources)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE MENU MODAL */}
      {createMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold uppercase font-display text-white mb-1">
              Create New Navigation Menu
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-light">
              Name your menu and select its target location in the theme.
            </p>

            <form onSubmit={handleCreateMenu} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Menu Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Footer Secondary Links"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  Theme Location
                </label>
                <select
                  value={newMenuLocation}
                  onChange={(e) => setNewMenuLocation(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono"
                >
                  <option value="header_primary">Primary Header</option>
                  <option value="mobile_overlay">Mobile Overlay</option>
                  <option value="footer_col_1">Footer Column 1</option>
                  <option value="footer_col_2">Footer Column 2</option>
                  <option value="footer_col_3">Footer Column 3</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateMenuOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition"
                >
                  Create Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
