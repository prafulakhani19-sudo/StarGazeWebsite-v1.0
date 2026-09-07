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
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PublicHeader />
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-zinc-900 pb-8">
          <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-2">
            <Film className="w-4 h-4" /> FEATURE SLATE & FILMOGRAPHY
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-mono">STARGAZE CINEMA PROJECTS</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
            Explore our portfolio of IMAX sci-fi features, documentaries, and narrative drama co-productions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] relative overflow-hidden bg-zinc-950">
                  <StargazeImage
                    src={project.posterUrl}
                    alt={project.title}
                    focalPoint={project.focalPoint}
                    fallbackTitle={project.title}
                    category={project.genre}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-amber-500 text-black font-mono text-[10px] font-bold px-2.5 py-1 rounded uppercase">
                    {project.genre}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{project.synopsis}</p>
                </div>
              </div>
              <div className="p-6 pt-0 font-mono text-xs text-zinc-500 flex justify-between border-t border-zinc-800/60 mt-4">
                <span>Director: {project.director}</span>
                <span>{project.releaseYear}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
