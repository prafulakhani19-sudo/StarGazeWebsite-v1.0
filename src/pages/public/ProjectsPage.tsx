import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { INITIAL_PROJECTS } from '../../data/mockData';
import { ProjectItem } from '../../types';
import { resolveProjectMedia } from '../../lib/mediaResolver';
import { getProjects } from '../../lib/cmsService';
import { Film } from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const cmsData = await getProjects();
        const base = cmsData && cmsData.length > 0 ? cmsData : INITIAL_PROJECTS;
        const resolved = await Promise.all(base.map(resolveProjectMedia));
        if (isMounted) setProjects(resolved);
      } catch (err) {
        console.warn('Error loading projects, using defaults:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedProjects = projects.filter((p) => p.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#D97706] selection:text-white">
      <PublicHeader />
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-zinc-200 pb-8">
          <div className="inline-flex items-center gap-2 text-[#B45309] font-mono text-xs font-bold tracking-widest uppercase mb-2">
            <Film className="w-4 h-4 text-[#D97706]" /> FEATURE SLATE & FILMOGRAPHY
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-serif-cinematic text-zinc-900">STARGAZE CINEMA PROJECTS</h1>
          <p className="text-zinc-600 text-sm mt-2 max-w-2xl">
            Explore our portfolio of IMAX sci-fi features, documentaries, and narrative drama co-productions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#F8F9FA] border border-zinc-200 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] relative overflow-hidden bg-zinc-100">
                  <StargazeImage
                    src={project.posterUrl}
                    alt={project.title}
                    focalPoint={project.focalPoint}
                    fallbackTitle={project.title}
                    category={project.genre}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-[#D97706] text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded uppercase shadow-sm">
                    {project.genre}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif-cinematic text-zinc-900 mb-2">{project.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-4">{project.synopsis}</p>
                </div>
              </div>
              <div className="p-6 pt-0 font-mono text-xs text-zinc-500 flex justify-between border-t border-zinc-200 pt-4 mt-2">
                <span>Director: <strong className="text-zinc-700">{project.director}</strong></span>
                <span className="font-bold text-[#B45309]">{project.releaseYear}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
