import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Sparkles, Volume2, Eye, ShieldCheck, Cpu, Layers } from 'lucide-react';

type PostMode = 'VFX' | 'COLOUR' | 'EDIT' | 'SOUND' | 'DUBBING' | 'FOLEY' | 'DCP';

interface ColorFilter {
  id: string;
  name: string;
  css: string;
  desc: string;
}

const COLOR_FILTERS: ColorFilter[] = [
  { id: 'anamorphic', name: 'ANAMORPHIC GOLD', css: 'sepia(30%) contrast(125%) brightness(95%) hue-rotate(-15deg)', desc: 'Warm golden highlight roll-off with rich shadow contrast' },
  { id: 'cyber', name: 'CYBER NOIR', css: 'contrast(140%) saturate(140%) hue-rotate(180deg) brightness(90%)', desc: 'High-contrast cyan and deep magenta shadow grade' },
  { id: 'silver', name: 'SILVER GELATIN (B&W)', css: 'grayscale(100%) contrast(150%) brightness(90%)', desc: 'Tri-X silver nitrate film grain & deep blacks' },
  { id: 'natural', name: 'REC.709 NATURAL', css: 'none', desc: 'Standard uncompressed Rec.709 broadcast reference' }
];

export const PostProductionSuite: React.FC = () => {
  const [activeMode, setActiveMode] = useState<PostMode>('VFX');
  const [activeFilter, setActiveFilter] = useState<ColorFilter>(COLOR_FILTERS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Audio Waveform animation for SOUND mode
  useEffect(() => {
    if (activeMode !== 'SOUND') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#D97706';
      ctx.beginPath();

      const bars = 48;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * barWidth + barWidth / 2;
        const amplitude = Math.sin(phase + i * 0.3) * (height / 3) + Math.cos(phase * 1.5 + i * 0.2) * (height / 4);
        const barHeight = Math.max(8, Math.abs(amplitude));

        ctx.fillStyle = i % 2 === 0 ? '#D97706' : '#F59E0B';
        ctx.fillRect(x - 2, height / 2 - barHeight / 2, 4, barHeight);
      }

      phase += 0.08;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [activeMode]);

  return (
    <section className="py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-200 pb-6 gap-4">
          <div>
            <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
              TECHNICAL SUITE // POST-PRODUCTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
              POST & VISUAL EFFECTS SUITE
            </h2>
          </div>
          <p className="text-zinc-600 font-sans text-xs sm:text-sm max-w-md">
            Interactive control suite. Switch modes to inspect live color LUT grading, wireframe VFX overlays, and acoustic sound waveforms.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(['VFX', 'COLOUR', 'EDIT', 'SOUND', 'DUBBING', 'FOLEY', 'DCP'] as PostMode[]).map((mode) => {
            const isActive = activeMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                data-cursor="VIEW"
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition border ${
                  isActive
                    ? 'bg-[#D97706] text-white border-[#D97706] shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-amber-400 hover:text-zinc-900'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {/* Main Central Interactive Cinema Suite Display */}
        <div className="bg-[#F8F9FA] border border-zinc-200 rounded-3xl p-6 lg:p-10 relative overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live Interactive Preview Screen (Left 8 Cols) */}
            <div className="lg:col-span-8 relative">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-300 relative bg-black shadow-2xl">
                {/* Image under test */}
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
                  alt="Post Suite Preview"
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{
                    filter: activeMode === 'COLOUR' ? activeFilter.css : 'none',
                  }}
                />

                {/* VFX Mode Overlay Wireframe Grid */}
                {activeMode === 'VFX' && (
                  <div className="absolute inset-0 bg-blue-500/10 pointer-events-none flex items-center justify-center">
                    <div className="w-full h-full border-4 border-dashed border-[#F59E0B]/60 flex items-center justify-center relative">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-[#F59E0B]/50" />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-[#F59E0B]/50" />
                      <div className="w-48 h-48 border-2 border-cyan-400 rounded-full animate-ping opacity-40" />
                      <span className="absolute bottom-4 right-4 bg-black/85 text-cyan-300 font-mono text-[10px] px-3 py-1 rounded border border-cyan-500/40">
                        VFX DEPTH PASS // 8K RENDER MESH ACTIVE
                      </span>
                    </div>
                  </div>
                )}

                {/* EDIT Mode Timeline Overlay */}
                {activeMode === 'EDIT' && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-black/90 border-t border-white/20 font-mono text-xs">
                    <div className="flex items-center justify-between mb-2 text-amber-300">
                      <span>TIMELINE TRACK // REEL 04</span>
                      <span>TC: 01:24:59:12</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5 h-6">
                      <div className="bg-amber-600/80 rounded flex items-center justify-center text-[9px] text-white">CUT 01</div>
                      <div className="bg-blue-600/80 rounded flex items-center justify-center text-[9px] text-white">CUT 02</div>
                      <div className="bg-[#D97706] text-white rounded font-bold flex items-center justify-center text-[9px]">ACTIVE SCENE</div>
                      <div className="bg-purple-600/80 rounded flex items-center justify-center text-[9px] text-white">CUT 04</div>
                      <div className="bg-emerald-600/80 rounded flex items-center justify-center text-[9px] text-white">CUT 05</div>
                      <div className="bg-zinc-700/80 rounded flex items-center justify-center text-[9px] text-white">CUT 06</div>
                    </div>
                  </div>
                )}

                {/* SOUND Mode Waveform Canvas Overlay */}
                {activeMode === 'SOUND' && (
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 space-y-4">
                    <span className="text-xs font-mono text-amber-400 font-bold tracking-widest uppercase">
                      DOLBY ATMOS 7.1.4 SURROUND ACOUSTIC MONITOR
                    </span>
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={120}
                      className="w-full max-w-lg h-32 rounded-xl bg-black/90 border border-amber-500/40"
                    />
                    <div className="flex items-center gap-6 font-mono text-xs text-zinc-300">
                      <span>L: -3.2 dB</span>
                      <span>C: -0.1 dB</span>
                      <span>R: -3.4 dB</span>
                      <span>LFE: -6.0 dB</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mode Controls & Description (Right 4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest block">
                  MODULE // {activeMode}
                </span>
                <h3 className="text-2xl font-bold font-serif-cinematic text-zinc-900">
                  {activeMode === 'VFX' && 'PHOTOREALISTIC VFX & COMPOSITING'}
                  {activeMode === 'COLOUR' && 'DOLBY VISION 8K COLOR GRADING'}
                  {activeMode === 'EDIT' && 'NON-LINEAR EDITING & CONFORM'}
                  {activeMode === 'SOUND' && 'DOLBY ATMOS SOUND DESIGN & MIX'}
                  {activeMode === 'DUBBING' && 'MULTI-LANGUAGE ADR & DUBBING'}
                  {activeMode === 'FOLEY' && 'CUSTOM ACOUSTIC FOLEY RECORDING'}
                  {activeMode === 'DCP' && 'DCP MASTERING & DCI COMPLIANCE'}
                </h3>
              </div>

              {/* COLOUR LUT Selector if Colour Mode */}
              {activeMode === 'COLOUR' && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest block">
                    SELECT COLOR LUT PRESET:
                  </span>
                  <div className="space-y-2">
                    {COLOR_FILTERS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFilter(f)}
                        className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition ${
                          activeFilter.id === f.id
                            ? 'bg-amber-50 border-[#D97706] text-zinc-900 shadow-xs'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <div className="font-bold text-[#B45309]">{f.name}</div>
                        <div className="text-[10px] text-zinc-500">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Specs */}
              <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-2 font-mono text-xs shadow-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>RESOLUTION:</span>
                  <span className="text-zinc-900 font-bold">8K DCI (8192 x 4320)</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>BIT DEPTH:</span>
                  <span className="text-zinc-900 font-bold">16-bit float / ACES 1.3</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>AUDIO CERT:</span>
                  <span className="text-zinc-900 font-bold">Dolby Atmos Premier</span>
                </div>
              </div>

              <div>
                <a
                  href="/enquiry"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D97706] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#B45309] transition shadow-md shadow-amber-600/20"
                >
                  BOOK POST SUITE
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
