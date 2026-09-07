import React from 'react';
import { X, Play, Calendar, Film, Star, Award, ChevronRight } from 'lucide-react';
import { ProjectItem } from '../../types';
import { StargazeImage } from '../common/StargazeImage';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-zinc-950 border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden relative shadow-2xl text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black border border-white/20 text-zinc-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop & Trailer Trigger */}
        <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
          <StargazeImage
            src={project.posterUrl}
            alt={project.title}
            fallbackTitle={project.title}
            category={project.genre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Central Play Button */}
          {project.trailerUrl && (
            <a
              href={project.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="PLAY"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 rounded-full bg-[#E5C158] flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition duration-300">
                <Play className="w-8 h-8 fill-black translate-x-0.5" />
              </div>
            </a>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded bg-[#E5C158] text-black font-mono text-[10px] font-extrabold tracking-widest uppercase mb-2 inline-block">
                {project.genre}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-white leading-tight">
                {project.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">DIRECTOR</span>
              <span className="text-[#E5C158] font-bold">{project.director}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">RELEASE YEAR</span>
              <span className="text-white font-bold">{project.releaseYear}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">FORMAT</span>
              <span className="text-white font-bold">IMAX 70mm / 8K RAW</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">DISTRIBUTION</span>
              <span className="text-white font-bold">Stargaze Worldwide</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-[#E5C158] uppercase tracking-widest">
              NARRATIVE SYNOPSIS
            </h3>
            <p className="text-zinc-300 font-sans text-base leading-relaxed">
              {project.synopsis}
            </p>
          </div>

          {/* Key Production Credits */}
          <div className="space-y-3 border-t border-white/10 pt-6">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              PRODUCTION CREW & SPECS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Cinematographer (DOP):</span>
                <span className="text-white font-bold">Alexander Vance, ASC</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Camera System:</span>
                <span className="text-white font-bold">ARRI ALEXA 35 / Cooke Anamorphic</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">VFX Supervisor:</span>
                <span className="text-white font-bold">Stargaze Digital VFX Studio</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Sound Master:</span>
                <span className="text-white font-bold">Dolby Atmos 7.1.4 Master</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
            {project.trailerUrl && (
              <a
                href={project.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-black" /> WATCH OFFICIAL TRAILER
              </a>
            )}
            <a
              href="/enquiry"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
            >
              LICENSING & DISTRIBUTION INQUIRY <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
