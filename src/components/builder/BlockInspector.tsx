import React, { useState } from 'react';
import { 
  Settings2, Palette, Sliders, Trash2, Copy, 
  Image as ImageIcon, Plus, X, ArrowUp, ArrowDown,
  Layers, Eye, Layout, Type
} from 'lucide-react';
import { PageBlock, PageBlockType } from '../../types';
import { MediaPickerModal } from '../admin/MediaPickerModal';

interface BlockInspectorProps {
  block: PageBlock;
  onChange: (updatedBlock: PageBlock) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClose: () => void;
}

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  block,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string>('');

  const updateSetting = (key: string, value: any) => {
    onChange({
      ...block,
      settings: {
        ...block.settings,
        [key]: value,
      },
    });
  };

  const updateStyle = (key: string, value: any) => {
    onChange({
      ...block,
      styles: {
        ...block.styles,
        [key]: value,
      },
    });
  };

  const handleMediaSelect = (mediaItem: any) => {
    if (mediaTargetField.startsWith('styles.')) {
      const field = mediaTargetField.replace('styles.', '');
      updateStyle(field, mediaItem.downloadUrl);
    } else {
      updateSetting(mediaTargetField, mediaItem.downloadUrl);
    }
    setMediaPickerOpen(false);
  };

  const openMediaPicker = (field: string) => {
    setMediaTargetField(field);
    setMediaPickerOpen(true);
  };

  return (
    <div className="w-80 md:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shrink-0 z-20 text-zinc-200">
      {/* HEADER */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
            ELEMENTOR INSPECTOR
          </span>
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            {block.type.replace('_', ' ')} SECTION
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Move Section Up"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Move Section Down"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            title="Duplicate Section"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Section"
            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close Inspector"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/30 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === 'content'
              ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" /> CONTENT
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === 'style'
              ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> STYLE
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === 'advanced'
              ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> ADVANCED
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* ========================================= */}
        {/* TAB 1: CONTENT */}
        {/* ========================================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* 1. HERO BLOCK CONTROLS */}
            {block.type === 'hero' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={block.settings.eyebrow || ''}
                    onChange={(e) => updateSetting('eyebrow', e.target.value)}
                    placeholder="e.g. EXCLUSIVE CINEMA ACCESS"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Headline</label>
                  <input
                    type="text"
                    value={block.settings.heading || ''}
                    onChange={(e) => updateSetting('heading', e.target.value)}
                    placeholder="Main Title"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Subheading / Description</label>
                  <textarea
                    rows={3}
                    value={block.settings.subheading || ''}
                    onChange={(e) => updateSetting('subheading', e.target.value)}
                    placeholder="Subtitle narrative..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Pill Badge</label>
                  <input
                    type="text"
                    value={block.settings.badge || ''}
                    onChange={(e) => updateSetting('badge', e.target.value)}
                    placeholder="e.g. 4K DOLBY ATMOS // LIMITED PASS"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Primary CTA Label</label>
                    <input
                      type="text"
                      value={block.settings.primaryBtnText || ''}
                      onChange={(e) => updateSetting('primaryBtnText', e.target.value)}
                      placeholder="Start Project"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      value={block.settings.primaryBtnLink || ''}
                      onChange={(e) => updateSetting('primaryBtnLink', e.target.value)}
                      placeholder="/enquiry"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Secondary CTA Label</label>
                    <input
                      type="text"
                      value={block.settings.secondaryBtnText || ''}
                      onChange={(e) => updateSetting('secondaryBtnText', e.target.value)}
                      placeholder="Explore Slate"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Secondary CTA Link</label>
                    <input
                      type="text"
                      value={block.settings.secondaryBtnLink || ''}
                      onChange={(e) => updateSetting('secondaryBtnLink', e.target.value)}
                      placeholder="/projects"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Text Alignment</label>
                  <select
                    value={block.settings.align || 'center'}
                    onChange={(e) => updateSetting('align', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </>
            )}

            {/* 2. HEADING BLOCK CONTROLS */}
            {block.type === 'heading' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Eyebrow</label>
                  <input
                    type="text"
                    value={block.settings.eyebrow || ''}
                    onChange={(e) => updateSetting('eyebrow', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Heading</label>
                  <input
                    type="text"
                    value={block.settings.heading || ''}
                    onChange={(e) => updateSetting('heading', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Subheading</label>
                  <textarea
                    rows={2}
                    value={block.settings.subheading || ''}
                    onChange={(e) => updateSetting('subheading', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Show Gold Divider Line</label>
                  <input
                    type="checkbox"
                    checked={block.settings.showDivider ?? true}
                    onChange={(e) => updateSetting('showDivider', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                </div>
              </>
            )}

            {/* 3. RICH TEXT BLOCK */}
            {block.type === 'rich_text' && (
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Article Body / Markdown Text</label>
                <textarea
                  rows={8}
                  value={block.settings.content || ''}
                  onChange={(e) => updateSetting('content', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs leading-relaxed"
                />
              </div>
            )}

            {/* 4. IMAGE BANNER */}
            {block.type === 'image_banner' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={block.settings.imageUrl || ''}
                      onChange={(e) => updateSetting('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                    />
                    <button
                      onClick={() => openMediaPicker('imageUrl')}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 shrink-0"
                      title="Select from Media Library"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Aspect Ratio</label>
                  <select
                    value={block.settings.aspectRatio || '16:9'}
                    onChange={(e) => updateSetting('aspectRatio', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value="16:9">16:9 Widescreen Cinema</option>
                    <option value="9:16">9:16 Vertical Portrait Reel</option>
                    <option value="4:3">4:3 Classic Academy</option>
                    <option value="1:1">1:1 Square</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Caption Banner</label>
                  <input
                    type="text"
                    value={block.settings.caption || ''}
                    onChange={(e) => updateSetting('caption', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </>
            )}

            {/* 5. VIDEO REEL */}
            {block.type === 'video_player' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Video Embed URL (YouTube/Vimeo)</label>
                  <input
                    type="text"
                    value={block.settings.videoEmbedUrl || ''}
                    onChange={(e) => updateSetting('videoEmbedUrl', e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Custom Poster Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={block.settings.posterUrl || ''}
                      onChange={(e) => updateSetting('posterUrl', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                    />
                    <button
                      onClick={() => openMediaPicker('posterUrl')}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 shrink-0"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Video Title</label>
                  <input
                    type="text"
                    value={block.settings.videoTitle || ''}
                    onChange={(e) => updateSetting('videoTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </>
            )}

            {/* 6. FEATURE CARDS */}
            {block.type === 'feature_cards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Grid Columns</label>
                  <select
                    value={block.settings.columns || 3}
                    onChange={(e) => updateSetting('columns', parseInt(e.target.value, 10))}
                    className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-white"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>

                <div className="border-t border-zinc-800 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">Feature Cards</span>
                    <button
                      onClick={() => {
                        const existing = block.settings.cards || [];
                        updateSetting('cards', [
                          ...existing,
                          { title: 'New Capability', description: 'Describe studio offering...', badge: 'SERVICE', icon: 'Sparkles', linkText: 'Learn More', linkUrl: '#' }
                        ]);
                      }}
                      className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Card
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(block.settings.cards || []).map((card: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Card #{idx + 1}</span>
                          <button
                            onClick={() => {
                              const updated = [...(block.settings.cards || [])];
                              updated.splice(idx, 1);
                              updateSetting('cards', updated);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={card.title || ''}
                          onChange={(e) => {
                            const updated = [...(block.settings.cards || [])];
                            updated[idx].title = e.target.value;
                            updateSetting('cards', updated);
                          }}
                          placeholder="Card Title"
                          className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white"
                        />
                        <textarea
                          rows={2}
                          value={card.description || ''}
                          onChange={(e) => {
                            const updated = [...(block.settings.cards || [])];
                            updated[idx].description = e.target.value;
                            updateSetting('cards', updated);
                          }}
                          placeholder="Card Description"
                          className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={card.badge || ''}
                            onChange={(e) => {
                              const updated = [...(block.settings.cards || [])];
                              updated[idx].badge = e.target.value;
                              updateSetting('cards', updated);
                            }}
                            placeholder="Badge (e.g. 4K)"
                            className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white"
                          />
                          <select
                            value={card.icon || 'Sparkles'}
                            onChange={(e) => {
                              const updated = [...(block.settings.cards || [])];
                              updated[idx].icon = e.target.value;
                              updateSetting('cards', updated);
                            }}
                            className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white"
                          >
                            <option value="Film">Film</option>
                            <option value="Camera">Camera</option>
                            <option value="Sliders">Sliders / Post</option>
                            <option value="Globe">Globe</option>
                            <option value="Shield">Shield</option>
                            <option value="Star">Star</option>
                            <option value="Sparkles">Sparkles</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. FAQ ACCORDION */}
            {block.type === 'faq_accordion' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Heading</label>
                  <input
                    type="text"
                    value={block.settings.heading || ''}
                    onChange={(e) => updateSetting('heading', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">Q&A Questions</span>
                  <button
                    onClick={() => {
                      const existing = block.settings.items || [];
                      updateSetting('items', [
                        ...existing,
                        { question: 'New Question?', answer: 'Answer description...' }
                      ]);
                    }}
                    className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold"
                  >
                    + Add Q&A
                  </button>
                </div>
                <div className="space-y-3">
                  {(block.settings.items || []).map((faq: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Question #{idx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = [...(block.settings.items || [])];
                            updated.splice(idx, 1);
                            updateSetting('items', updated);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question || ''}
                        onChange={(e) => {
                          const updated = [...(block.settings.items || [])];
                          updated[idx].question = e.target.value;
                          updateSetting('items', updated);
                        }}
                        placeholder="Question"
                        className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer || ''}
                        onChange={(e) => {
                          const updated = [...(block.settings.items || [])];
                          updated[idx].answer = e.target.value;
                          updateSetting('items', updated);
                        }}
                        placeholder="Answer"
                        className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. TESTIMONIAL QUOTE */}
            {block.type === 'testimonial_quote' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Quote Statement</label>
                  <textarea
                    rows={4}
                    value={block.settings.quote || ''}
                    onChange={(e) => updateSetting('quote', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    value={block.settings.author || ''}
                    onChange={(e) => updateSetting('author', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Author Title / Affiliation</label>
                  <input
                    type="text"
                    value={block.settings.authorTitle || ''}
                    onChange={(e) => updateSetting('authorTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </>
            )}

            {/* 9. SPACER */}
            {block.type === 'spacer_divider' && (
              <>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Height (Pixels)</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={block.settings.height || 48}
                    onChange={(e) => updateSetting('height', parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="text-[11px] font-mono text-zinc-400 uppercase">Show Filmstrip Divider Line</label>
                  <input
                    type="checkbox"
                    checked={block.settings.showLine ?? false}
                    onChange={(e) => updateSetting('showLine', e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                </div>
              </>
            )}

            {/* 10. CUSTOM HTML */}
            {block.type === 'custom_html' && (
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Raw HTML / Embed Code</label>
                <textarea
                  rows={8}
                  value={block.settings.rawHtml || ''}
                  onChange={(e) => updateSetting('rawHtml', e.target.value)}
                  placeholder="<div>...</div>"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: STYLE */}
        {/* ========================================= */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={block.styles?.backgroundColor || '#09090b'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={block.styles?.backgroundColor || ''}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  placeholder="#09090b or transparent"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={block.styles?.textColor || '#ffffff'}
                  onChange={(e) => updateStyle('textColor', e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={block.styles?.textColor || ''}
                  onChange={(e) => updateStyle('textColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Background Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={block.styles?.backgroundImageUrl || ''}
                  onChange={(e) => updateStyle('backgroundImageUrl', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                />
                <button
                  onClick={() => openMediaPicker('styles.backgroundImageUrl')}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 shrink-0"
                  title="Choose from Media Library"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {block.styles?.backgroundImageUrl && (
              <div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400 uppercase mb-1">
                  <span>Dark Overlay Opacity</span>
                  <span>{block.styles?.backgroundOverlayOpacity ?? 70}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={block.styles?.backgroundOverlayOpacity ?? 70}
                  onChange={(e) => updateStyle('backgroundOverlayOpacity', parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}

            <div className="border-t border-zinc-800 pt-3">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-2">Spacing & Padding</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono">Padding Top (px)</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={block.styles?.paddingTop ?? 48}
                    onChange={(e) => updateStyle('paddingTop', parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-mono">Padding Bottom (px)</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={block.styles?.paddingBottom ?? 48}
                    onChange={(e) => updateStyle('paddingBottom', parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: ADVANCED */}
        {/* ========================================= */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Container Max Width</label>
              <select
                value={block.styles?.containerWidth || 'standard'}
                onChange={(e) => updateStyle('containerWidth', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white"
              >
                <option value="narrow">Narrow (896px - Focused Text)</option>
                <option value="standard">Standard (1152px - Recommended)</option>
                <option value="wide">Wide (1280px - Cinema Spread)</option>
                <option value="full">Full Width (100% Bleed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Custom CSS Class Names</label>
              <input
                type="text"
                value={block.styles?.customClasses || ''}
                onChange={(e) => updateStyle('customClasses', e.target.value)}
                placeholder="e.g. shadow-2xl backdrop-blur-md"
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
              />
            </div>

            <div className="border-t border-zinc-800 pt-3 space-y-2">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">Responsive Visibility</label>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Hide on Mobile devices</span>
                <input
                  type="checkbox"
                  checked={block.styles?.hideOnMobile ?? false}
                  onChange={(e) => updateStyle('hideOnMobile', e.target.checked)}
                  className="rounded accent-amber-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Hide on Desktop screens</span>
                <input
                  type="checkbox"
                  checked={block.styles?.hideOnDesktop ?? false}
                  onChange={(e) => updateStyle('hideOnDesktop', e.target.checked)}
                  className="rounded accent-amber-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelectMedia={handleMediaSelect}
          title="Select Cinema Asset for Block"
        />
      )}
    </div>
  );
};
