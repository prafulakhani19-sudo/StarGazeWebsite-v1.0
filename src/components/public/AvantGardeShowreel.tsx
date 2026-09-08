import React, { useState } from 'react';
import { Play, Sparkles, Volume2, VolumeX, Clapperboard, Eye, Film, Layers, Award, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AvantGardeShowreel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const stats = [
    { label: 'GLOBAL THEATRICAL VIEWS', value: '150M+', detail: 'OTT & Cinema Footprint' },
    { label: 'FESTIVAL LAURELS', value: '18+', detail: 'Cannes, DPIFF, Lift-Off' },
    { label: 'OPTICAL ASSET VAULT', value: '$2.5M+', detail: 'Cooke, ARRI, RED Helium' },
    { label: 'SOUND STAGES & SUITES', value: '4 HUBS', detail: 'Dolby Atmos & DaVinci HDR' },
  ];

  return (
    <section className="relative py-28 bg-[#08080A] border-y border-white/[0.08] px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Avant-Garde background mesh glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FFB800]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5500]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/10 pb-8 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-[11px] font-mono-studio uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VOL. 2026 // FLAGSHIP REEL</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black font-grotesk text-white uppercase tracking-tight leading-[1.05]">
              THE ARCHITECTURE OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-200 to-[#FF5500]">
                VISUAL MOMENTUM
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-xs font-mono-studio text-zinc-400 space-y-1">
              <div>MASTER FORMAT: 8K MONTEREY DCI</div>
              <div>COLOR PIPELINE: ACES 1.3 / HDR1000</div>
            </div>
            <a
              href="/enquiry"
              data-cursor="COMMISSION"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-[#FFB800] text-white hover:text-black font-mono-studio text-xs font-bold uppercase tracking-wider transition duration-300 border border-white/15 hover:border-[#FFB800]"
            >
              COMMISSION REEL <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* High-Energy Showreel Stage */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[16/9] sm:aspect-[21/9] shadow-2xl group">
          {/* Background Motion Video Simulation */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=80"
              alt="Stargaze Studio Showreel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 filter contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#08080A_95%)]" />
          </div>

          {/* Interactive Top Bar / Timecode Overlay */}
          <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20 font-mono-studio text-xs">
            <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold">REC // 00:04:28:12</span>
              <span className="text-zinc-500">|</span>
              <span className="text-[#FFB800]">24.000 FPS</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white transition"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFB800]" />}
              </button>
            </div>
          </div>

          {/* Center Play Beacon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="absolute -inset-4 bg-[#FFB800]/30 rounded-full blur-xl animate-pulse" />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#FFB800] to-amber-200 flex items-center justify-center text-black shadow-2xl pointer-events-auto cursor-pointer"
                aria-label="Play Studio Showreel"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-1" />
              </button>
            </div>
            <span className="mt-4 font-mono-studio text-xs font-bold tracking-[0.3em] text-white/90 uppercase drop-shadow-md">
              EXPERIENCE THE 4K SHOWREEL
            </span>
          </div>

          {/* Bottom Live Audio Waveform & Format Stamps */}
          <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-20 font-mono-studio text-[11px] text-zinc-300">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
              <span className="text-[#FFB800] mr-2">AUDIO DYNAMICS:</span>
              {[40, 65, 30, 85, 95, 50, 70, 45, 90, 60, 30, 75, 100, 80, 45, 60, 85].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#FFB800] rounded-full transition-all duration-300"
                  style={{ height: `${h * 0.2}px` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-black/70 border border-white/10 text-white font-bold">
                ASPECT 2.39:1
              </span>
              <span className="px-2.5 py-1 rounded bg-[#FFB800]/20 border border-[#FFB800]/40 text-[#FFB800] font-bold">
                DOLBY VISION
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Studio Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-[#FFB800]/40 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800]/5 rounded-full blur-2xl group-hover:bg-[#FFB800]/15 transition duration-500" />
              <div className="text-[10px] font-mono-studio uppercase tracking-widest text-[#FFB800] mb-2">
                // 0{idx + 1} METRIC
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-grotesk text-white group-hover:text-[#FFB800] transition duration-300">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-zinc-200 mt-1 uppercase font-mono-studio">
                {stat.label}
              </div>
              <div className="text-[11px] text-zinc-400 mt-2">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
