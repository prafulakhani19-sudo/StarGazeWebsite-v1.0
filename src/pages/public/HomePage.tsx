import React, { useState } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { HeroSlider } from '../../components/public/HeroSlider';
import { CustomCursor } from '../../components/public/CustomCursor';
import { StargazeUniverse3D } from '../../components/public/StargazeUniverse3D';
import { ProductionTimeline } from '../../components/public/ProductionTimeline';
import { PostProductionSuite } from '../../components/public/PostProductionSuite';
import { ProjectDetailModal } from '../../components/public/ProjectDetailModal';
import { EquipmentDetailModal } from '../../components/public/EquipmentDetailModal';
import { StargazeImage } from '../../components/common/StargazeImage';
import { INITIAL_PROJECTS, INITIAL_EQUIPMENT, INITIAL_EVENTS, INITIAL_NEWS, INITIAL_DISTRIBUTION } from '../../data/mockData';
import { ProjectItem, EquipmentItem } from '../../types';
import { Film, Camera, Sparkles, ArrowRight, Calendar, Play, ChevronRight, CheckCircle2, Globe, Award, Newspaper, ArrowUpRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [projectCategory, setProjectCategory] = useState<string>('ALL');

  const publishedProjects = INITIAL_PROJECTS.filter((p) => p.status === 'PUBLISHED');
  const publishedEquipment = INITIAL_EQUIPMENT.filter((e) => e.status === 'PUBLISHED');
  const publishedEvents = INITIAL_EVENTS.filter((e) => e.status === 'PUBLISHED');
  const publishedNews = INITIAL_NEWS.filter((n) => n.status === 'PUBLISHED');
  const publishedDistribution = INITIAL_DISTRIBUTION.filter((d) => d.status === 'PUBLISHED');

  const filteredProjects = projectCategory === 'ALL'
    ? publishedProjects
    : publishedProjects.filter((p) => p.genre.toUpperCase().includes(projectCategory.toUpperCase()));

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F0] font-sans selection:bg-[#E5C158] selection:text-black relative">
      <CustomCursor />
      <PublicHeader />

      {/* 01 CINEMATIC BANNER HERO SLIDER */}
      <HeroSlider />

      {/* 02 BRAND STATEMENT */}
      <section className="py-24 bg-[#0A0A0C] border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono text-[#E5C158] uppercase tracking-widest block">
            02 // BRAND STATEMENT
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-cinematic text-white leading-tight">
            “CINEMA IS NOT MERELY ENTERTAINMENT; IT IS THE ARCHITECTURE OF HUMAN EMOTION AND GLOBAL CULTURE.”
          </h2>
          <p className="text-zinc-400 font-sans text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            From IMAX feature co-productions and anamorphic optical rentals to Cannes premiere galas and digital rights licensing, Stargaze Media provides the technical and artistic backbone for modern entertainment.
          </p>
        </div>
      </section>

      {/* 03 STARGAZE UNIVERSE (3D SPATIAL WORLDS) */}
      <StargazeUniverse3D />

      {/* 04 FEATURED WORK / CINEMA SLATE */}
      <section id="slate" className="py-24 bg-[#0A0A0C] border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-[#E5C158] text-xs font-mono tracking-widest uppercase block mb-2">
                04 // FEATURED WORK
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-white uppercase">
                FEATURED FILM SLATE
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {['ALL', 'SCI-FI', 'DRAMA', 'DOCUMENTARY'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full border transition ${
                    projectCategory === cat
                      ? 'bg-[#E5C158] text-black border-[#E5C158] font-bold'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Slate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                data-cursor="PLAY"
                className="group relative bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden hover:border-[#E5C158]/50 transition duration-500 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <StargazeImage
                    src={project.posterUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-[#E5C158] text-black font-mono text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                    {project.genre.split('/')[0]}
                  </span>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40">
                    <div className="w-14 h-14 rounded-full bg-[#E5C158] flex items-center justify-center text-black shadow-xl">
                      <Play className="w-6 h-6 fill-black translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold font-serif-cinematic text-white group-hover:text-[#E5C158] transition">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {project.synopsis}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Director: {project.director}</span>
                    <span className="text-[#E5C158] font-bold">{project.releaseYear}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 PRODUCTION TIMELINE */}
      <ProductionTimeline />

      {/* 06 POST-PRODUCTION TECHNICAL SUITE */}
      <PostProductionSuite />

      {/* 07 EQUIPMENT RENTAL SHOWCASE */}
      <section className="py-24 bg-[#0A0A0C] border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-[#E5C158] text-xs font-mono tracking-widest uppercase block mb-2">
                07 // HARDWARE & OPTICS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-white uppercase">
                CAMERA & DOP RENTAL DIVISION
              </h2>
            </div>
            <a
              href="/equipment"
              className="text-xs font-mono font-bold tracking-wider text-[#E5C158] hover:text-[#F0CE68] flex items-center gap-1"
            >
              BROWSE CATALOGUE <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedEquipment.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedEquipment(item)}
                data-cursor="EXPLORE"
                className="bg-zinc-950 border border-white/10 rounded-2xl p-5 hover:border-[#E5C158]/50 transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-zinc-900 border border-white/5">
                    <StargazeImage src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C158] block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold font-serif-cinematic text-white mb-2">{item.name}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">{item.specs}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#E5C158] font-bold">${item.dailyRate}/day</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.availability === 'AVAILABLE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {item.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 DISTRIBUTION CATALOGUE */}
      <section className="py-24 bg-[#0A0A0C] border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-[#E5C158] text-xs font-mono tracking-widest uppercase block mb-2">
                08 // GLOBAL LICENSING
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-white uppercase">
                DISTRIBUTION CATALOGUE
              </h2>
            </div>
            <a
              href="/distribution"
              className="text-xs font-mono font-bold tracking-wider text-[#E5C158] hover:text-[#F0CE68] flex items-center gap-1"
            >
              VIEW FULL CATALOGUE <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedDistribution.map((dist) => (
              <div
                key={dist.id}
                className="bg-zinc-950 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:border-[#E5C158]/40 transition"
              >
                <div className="w-full sm:w-44 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                  <StargazeImage src={dist.posterUrl} alt={dist.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/30 font-mono text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                      {dist.type} // RIGHTS AVAILABLE
                    </span>
                    <h3 className="text-xl font-bold font-serif-cinematic text-white">{dist.title}</h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-2">{dist.synopsis}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Globe className="w-4 h-4 text-[#E5C158]" />
                      <span>Territories: {dist.territories.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-[#E5C158]" />
                      <span>Rights: {dist.rightsAvailable.join(' • ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 EXPERIENCES */}
      <section className="py-24 bg-[#0A0A0C] border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-[#E5C158] text-xs font-mono tracking-widest uppercase block mb-2">
                09 // LIVE ACTIVATIONS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-white uppercase">
                PREMIERES & EXPERIENCES
              </h2>
            </div>
            <a
              href="/events"
              className="text-xs font-mono font-bold tracking-wider text-[#E5C158] hover:text-[#F0CE68] flex items-center gap-1"
            >
              ALL EXPERIENCES <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedEvents.map((evt) => (
              <div key={evt.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[16/9]">
                <StargazeImage src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#E5C158]">
                    <span className="px-2.5 py-1 rounded bg-[#E5C158] text-black font-bold uppercase">{evt.category}</span>
                    <span>{evt.eventDate} • {evt.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif-cinematic text-white">{evt.title}</h3>
                  <p className="text-xs text-zinc-300 font-sans line-clamp-2">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 NEWSROOM */}
      <section className="py-24 bg-[#0A0A0C] border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-[#E5C158] text-xs font-mono tracking-widest uppercase block mb-2">
                10 // PRESS & ANNOUNCEMENTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-white uppercase">
                STARGAZE NEWSROOM
              </h2>
            </div>
            <a
              href="/news"
              className="text-xs font-mono font-bold tracking-wider text-[#E5C158] hover:text-[#F0CE68] flex items-center gap-1"
            >
              READ ALL INSIGHTS <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedNews.map((news) => (
              <a
                key={news.id}
                href="/news"
                className="p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-[#E5C158]/40 transition space-y-3 block"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#E5C158]">
                  <span>{news.category}</span>
                  <span>{news.publishDate}</span>
                </div>
                <h3 className="text-xl font-bold font-serif-cinematic text-white hover:text-[#E5C158] transition">
                  {news.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                  {news.summary}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 11 FINAL CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0C] to-zinc-900 border-t border-white/10 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono text-[#E5C158] uppercase tracking-widest block">
            11 // INITIATE COLLABORATION
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-serif-cinematic text-white uppercase leading-tight">
            LET’S MAKE SOMETHING<br />
            <span className="text-[#E5C158]">WORTH WATCHING</span>
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto text-base">
            From co-productions and equipment rental to post-production and global distribution licensing.
          </p>
          <div className="pt-4">
            <a
              href="/enquiry"
              data-cursor="ENQUIRE"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-mono font-bold text-sm uppercase tracking-widest transition shadow-2xl shadow-[#E5C158]/30"
            >
              START A PROJECT <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <EquipmentDetailModal
        item={selectedEquipment}
        onClose={() => setSelectedEquipment(null)}
      />

      <PublicFooter />
    </div>
  );
};
