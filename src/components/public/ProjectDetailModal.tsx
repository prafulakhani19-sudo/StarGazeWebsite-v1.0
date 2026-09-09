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
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-4xl w-full overflow-hidden relative shadow-2xl text-zinc-900 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/40 text-white transition shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop & Trailer Trigger */}
        <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
          <StargazeImage
            src={project.posterUrl}
            alt={project.title}
            focalPoint={project.focalPoint}
            fallbackTitle={project.title}
            category={project.genre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Central Play Button */}
          {project.trailerUrl && (
            <a
              href={project.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="PLAY"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition duration-300">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            </a>
          )}

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded bg-[#D97706] text-white font-mono text-[10px] font-extrabold tracking-widest uppercase mb-2 inline-block shadow-sm">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">DIRECTOR</span>
              <span className="text-[#B45309] font-bold">{project.director}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">RELEASE YEAR</span>
              <span className="text-zinc-900 font-bold">{project.releaseYear}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">FORMAT</span>
              <span className="text-zinc-900 font-bold">IMAX 70mm / 8K RAW</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] font-bold uppercase">DISTRIBUTION</span>
              <span className="text-zinc-900 font-bold">Stargaze Worldwide</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest">
              NARRATIVE SYNOPSIS
            </h3>
            <p className="text-zinc-700 font-sans text-base leading-relaxed">
              {project.synopsis}
            </p>
          </div>

          {/* Key Production Credits */}
          <div className="space-y-3 border-t border-zinc-200 pt-6">
            <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
              PRODUCTION CREW & SPECS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500">Cinematographer (DOP):</span>
                <span className="text-zinc-900 font-bold">Alexander Vance, ASC</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500">Camera System:</span>
                <span className="text-zinc-900 font-bold">ARRI ALEXA 35 / Cooke Anamorphic</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500">VFX Supervisor:</span>
                <span className="text-zinc-900 font-bold">Stargaze Digital VFX Studio</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500">Sound Master:</span>
                <span className="text-zinc-900 font-bold">Dolby Atmos 7.1.4 Master</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-200">
            {project.trailerUrl && (
              <a
                href={project.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-amber-600/20"
              >
                <Play className="w-4 h-4 fill-white" /> WATCH OFFICIAL TRAILER
              </a>
            )}
            <a
              href="/enquiry"
              className="px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
            >
              LICENSING & DISTRIBUTION INQUIRY <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
