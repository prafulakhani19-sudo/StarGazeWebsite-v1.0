import React, { useState, useEffect } from 'react';
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
import { ProjectItem, EquipmentItem, EventItem, DistributionTitle, NewsArticle, PartnerItem, SiteContentConfig } from '../../types';
import { resolveProjectMedia, resolveEquipmentMedia, resolveEventMedia, resolveDistributionMedia, resolveNewsMedia } from '../../lib/mediaResolver';
import { getProjects, getEquipment, getEvents, getDistribution, getNewsArticles, getPartners, getSiteContent } from '../../lib/cmsService';
import { Film, Camera, Sparkles, ArrowRight, Calendar, Play, ChevronRight, CheckCircle2, Globe, Award, Newspaper, ArrowUpRight, UserCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [projectCategory, setProjectCategory] = useState<string>('ALL');

  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [distribution, setDistribution] = useState<DistributionTitle[]>(INITIAL_DISTRIBUTION);
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContentConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAllContent() {
      // 1. Projects
      try {
        const cmsProjects = await getProjects();
        const baseProjects = cmsProjects && cmsProjects.length > 0 ? cmsProjects : INITIAL_PROJECTS;
        const resolved = await Promise.all(baseProjects.map(resolveProjectMedia));
        if (isMounted) setProjects(resolved);
      } catch (err) {
        console.warn('Error loading projects, using defaults:', err);
      }

      // 2. Equipment
      try {
        const cmsEq = await getEquipment();
        const baseEq = cmsEq && cmsEq.length > 0 ? cmsEq : INITIAL_EQUIPMENT;
        const resolved = await Promise.all(baseEq.map(resolveEquipmentMedia));
        if (isMounted) setEquipment(resolved);
      } catch (err) {
        console.warn('Error loading equipment:', err);
      }

      // 3. Events
      try {
        const cmsEvents = await getEvents();
        const baseEvents = cmsEvents && cmsEvents.length > 0 ? cmsEvents : INITIAL_EVENTS;
        const resolved = await Promise.all(baseEvents.map(resolveEventMedia));
        if (isMounted) setEvents(resolved);
      } catch (err) {
        console.warn('Error loading events:', err);
      }

      // 4. Distribution
      try {
        const cmsDist = await getDistribution();
        const baseDist = cmsDist && cmsDist.length > 0 ? cmsDist : INITIAL_DISTRIBUTION;
        const resolved = await Promise.all(baseDist.map(resolveDistributionMedia));
        if (isMounted) setDistribution(resolved);
      } catch (err) {
        console.warn('Error loading distribution:', err);
      }

      // 5. News
      try {
        const cmsNews = await getNewsArticles();
        const baseNews = cmsNews && cmsNews.length > 0 ? cmsNews : INITIAL_NEWS;
        const resolved = await Promise.all(baseNews.map(resolveNewsMedia));
        if (isMounted) setNews(resolved);
      } catch (err) {
        console.warn('Error loading news:', err);
      }

      // 6. Partners
      try {
        const cmsPartners = await getPartners();
        if (isMounted && cmsPartners) setPartners(cmsPartners.filter(p => p.status === 'PUBLISHED'));
      } catch (err) {
        console.warn('Error loading partners:', err);
      }

      // 7. Site Content / Narrative
      try {
        const content = await getSiteContent();
        if (isMounted && content) setSiteContent(content);
      } catch (err) {
        console.warn('Error loading site content:', err);
      }
    }

    loadAllContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const publishedProjects = projects.filter((p) => p.status === 'PUBLISHED');
  const publishedEquipment = equipment.filter((e) => e.status === 'PUBLISHED');
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED');
  const publishedNews = news.filter((n) => n.status === 'PUBLISHED');
  const publishedDistribution = distribution.filter((d) => d.status === 'PUBLISHED');

  const filteredProjects = projectCategory === 'ALL'
    ? publishedProjects
    : publishedProjects.filter((p) => p.genre.toUpperCase().includes(projectCategory.toUpperCase()));

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#18181B] font-sans selection:bg-[#D97706] selection:text-white relative">
      <CustomCursor />
      <PublicHeader />

      {/* 01 CINEMATIC BANNER HERO SLIDER */}
      <HeroSlider />

      {/* 02 BRAND STATEMENT */}
      <section className="py-24 bg-white border-b border-zinc-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest block">
            02 // BRAND STATEMENT
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-cinematic text-zinc-900 leading-tight">
            “CINEMA IS NOT MERELY ENTERTAINMENT; IT IS THE ARCHITECTURE OF HUMAN EMOTION AND GLOBAL CULTURE.”
          </h2>
          <p className="text-zinc-600 font-sans text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            From IMAX feature co-productions and anamorphic optical rentals to Cannes premiere galas and digital rights licensing, Stargaze Media provides the technical and artistic backbone for modern entertainment.
          </p>
        </div>
      </section>

      {/* 03 STARGAZE UNIVERSE (3D SPATIAL WORLDS) */}
      <StargazeUniverse3D />

      {/* 04 FEATURED WORK / CINEMA SLATE */}
      <section id="slate" className="py-24 bg-[#F8F9FA] border-t border-zinc-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
                04 // FEATURED WORK
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
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
                      ? 'bg-[#D97706] text-white border-[#D97706] font-bold shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-amber-400 hover:text-zinc-900'
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
                className="group relative bg-white border border-zinc-200/90 rounded-2xl overflow-hidden hover:border-[#D97706] hover:shadow-xl transition duration-500 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-zinc-100">
                  <StargazeImage
                    src={project.posterUrl}
                    alt={project.title}
                    focalPoint={project.focalPoint}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-[#D97706] text-white font-mono text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider shadow-xs">
                    {project.genre.split('/')[0]}
                  </span>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40">
                    <div className="w-14 h-14 rounded-full bg-[#D97706] flex items-center justify-center text-white shadow-xl">
                      <Play className="w-6 h-6 fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold font-serif-cinematic text-zinc-900 group-hover:text-[#D97706] transition">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-600 font-sans line-clamp-2 leading-relaxed">
                    {project.synopsis}
                  </p>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                    <span>Director: {project.director}</span>
                    <span className="text-[#B45309] font-bold">{project.releaseYear}</span>
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
      <section className="py-24 bg-[#F8F9FA] border-t border-zinc-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
                07 // HARDWARE & OPTICS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
                CAMERA & DOP RENTAL DIVISION
              </h2>
            </div>
            <a
              href="/equipment"
              className="text-xs font-mono font-bold tracking-wider text-[#B45309] hover:text-[#D97706] flex items-center gap-1"
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
                className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-[#D97706] hover:shadow-lg transition duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-zinc-100 border border-zinc-100">
                    <StargazeImage src={item.imageUrl} alt={item.name} focalPoint={item.focalPoint} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#B45309] block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold font-serif-cinematic text-zinc-900 mb-2">{item.name}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-4 line-clamp-2">{item.specs}</p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#B45309] font-bold">${item.dailyRate}/day</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.availability === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-zinc-100 text-zinc-600'
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
      <section className="py-24 bg-white border-t border-zinc-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
                08 // GLOBAL LICENSING
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
                DISTRIBUTION CATALOGUE
              </h2>
            </div>
            <a
              href="/distribution"
              className="text-xs font-mono font-bold tracking-wider text-[#B45309] hover:text-[#D97706] flex items-center gap-1"
            >
              VIEW FULL CATALOGUE <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedDistribution.map((dist) => (
              <div
                key={dist.id}
                className="bg-[#F8F9FA] border border-zinc-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:border-[#D97706]/60 hover:shadow-md transition"
              >
                <div className="w-full sm:w-44 aspect-[3/4] rounded-xl overflow-hidden shrink-0 bg-zinc-200">
                  <StargazeImage src={dist.posterUrl} alt={dist.title} focalPoint={dist.focalPoint} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-[#B45309] border border-amber-500/30 font-mono text-[10px] font-bold uppercase tracking-wider inline-block mb-2">
                      {dist.type} // RIGHTS AVAILABLE
                    </span>
                    <h3 className="text-xl font-bold font-serif-cinematic text-zinc-900">{dist.title}</h3>
                    <p className="text-xs text-zinc-600 font-sans leading-relaxed mt-2">{dist.synopsis}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-zinc-200 text-xs font-mono">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <Globe className="w-4 h-4 text-[#D97706]" />
                      <span>Territories: <strong className="text-zinc-900">{dist.territories.join(', ')}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700">
                      <CheckCircle2 className="w-4 h-4 text-[#D97706]" />
                      <span>Rights: <strong className="text-zinc-900">{dist.rightsAvailable.join(' • ')}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY ALLIANCES & PARTNERS (Dynamic CMS) */}
      {partners.length > 0 && (
        <section className="py-20 bg-zinc-50 border-t border-zinc-200/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
              <div>
                <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
                  INDUSTRY COLLABORATORS & ALLIANCES
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-serif-cinematic text-zinc-900 uppercase">
                  CO-PRODUCERS & PARTNERS
                </h2>
              </div>
              <p className="text-xs font-mono text-zinc-500 max-w-md">
                Institutional, governmental, and production alliances powering Stargaze cinema.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#D97706] hover:shadow-md transition group"
                >
                  <div className="h-16 w-full flex items-center justify-center">
                    {partner.logoUrl ? (
                      <StargazeImage
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-12 max-w-[85%] object-contain filter grayscale group-hover:grayscale-0 transition duration-300"
                      />
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#B45309] uppercase tracking-wider">
                        {partner.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase group-hover:text-[#D97706] transition">
                      {partner.name}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mt-0.5">
                      {partner.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 09 EXPERIENCES */}
      <section className="py-24 bg-white border-t border-zinc-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
                09 // LIVE ACTIVATIONS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
                PREMIERES & EXPERIENCES
              </h2>
            </div>
            <a
              href="/events"
              className="text-xs font-mono font-bold tracking-wider text-[#B45309] hover:text-[#D97706] flex items-center gap-1"
            >
              ALL EXPERIENCES <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedEvents.map((evt) => (
              <div key={evt.id} className="group relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-900 aspect-[16/9] shadow-md">
                <StargazeImage src={evt.imageUrl} alt={evt.title} focalPoint={evt.focalPoint} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
                  <div className="flex items-center gap-3 text-xs font-mono text-amber-300">
                    <span className="px-2.5 py-1 rounded bg-[#D97706] text-white font-bold uppercase shadow-xs">{evt.category}</span>
                    <span>{evt.eventDate} • {evt.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-serif-cinematic text-white">{evt.title}</h3>
                  <p className="text-xs text-zinc-200 font-sans line-clamp-2">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 NEWSROOM */}
      <section className="py-24 bg-[#F8F9FA] border-t border-zinc-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-6 gap-4">
            <div>
              <span className="text-[#B45309] text-xs font-mono font-bold tracking-widest uppercase block mb-2">
                10 // PRESS & ANNOUNCEMENTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-serif-cinematic text-zinc-900 uppercase">
                STARGAZE NEWSROOM
              </h2>
            </div>
            <a
              href="/news"
              className="text-xs font-mono font-bold tracking-wider text-[#B45309] hover:text-[#D97706] flex items-center gap-1"
            >
              READ ALL INSIGHTS <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedNews.map((news) => (
              <a
                key={news.id}
                href="/news"
                className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-[#D97706] hover:shadow-md transition space-y-3 block"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#B45309] font-bold">
                  <span>{news.category}</span>
                  <span>{news.publishDate}</span>
                </div>
                <h3 className="text-xl font-bold font-serif-cinematic text-zinc-900 hover:text-[#D97706] transition">
                  {news.title}
                </h3>
                <p className="text-xs text-zinc-600 font-sans leading-relaxed line-clamp-2">
                  {news.summary}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 11 FINAL CTA */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50/40 border-t border-zinc-200 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest block">
            11 // INITIATE COLLABORATION
          </span>
          <h2 className="text-4xl sm:text-6xl font-black font-serif-cinematic text-zinc-900 uppercase leading-tight">
            LET’S MAKE SOMETHING<br />
            <span className="text-[#D97706]">WORTH WATCHING</span>
          </h2>
          <p className="text-zinc-600 max-w-xl mx-auto text-base">
            From co-productions and equipment rental to post-production and global distribution licensing.
          </p>
          <div className="pt-4">
            <a
              href="/enquiry"
              data-cursor="ENQUIRE"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-mono font-bold text-sm uppercase tracking-widest transition shadow-xl shadow-amber-600/25 hover:scale-105"
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
