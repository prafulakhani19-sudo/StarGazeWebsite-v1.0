import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { HeroSlider } from '../../components/public/HeroSlider';
import { CustomCursor } from '../../components/public/CustomCursor';
import { AvantGardeMarquee } from '../../components/public/AvantGardeMarquee';
import { AvantGardeShowreel } from '../../components/public/AvantGardeShowreel';
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
import { Film, Camera, Sparkles, ArrowRight, Calendar, Play, ChevronRight, CheckCircle2, Globe, Award, Newspaper, ArrowUpRight, UserCheck, Flame, Sliders } from 'lucide-react';

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
    <div className="min-h-screen bg-[#08080A] text-[#F5F5F2] font-sans selection:bg-[#FFB800] selection:text-black relative">
      <CustomCursor />
      <PublicHeader />

      {/* 01 CINEMATIC BANNER HERO SLIDER */}
      <HeroSlider />

      {/* 02 AVANT-GARDE STUDIO MARQUEE */}
      <AvantGardeMarquee />

      {/* 03 HIGH-ENERGY SHOWREEL & STUDIO METRICS */}
      <AvantGardeShowreel />

      {/* 04 EDITORIAL BRAND MANIFESTO */}
      <section className="py-28 bg-[#08080A] border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/25 text-[#FFB800] text-xs font-mono-studio tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[ 02 // STUDIO MANIFESTO ]</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-grotesk text-white leading-[1.1] uppercase tracking-tight">
            “CINEMA IS NOT MERELY ENTERTAINMENT; IT IS THE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-200 to-[#FF5500]">
              HIGH-ENERGY ARCHITECTURE
            </span>{' '}
            OF HUMAN EMOTION.”
          </h2>
          <p className="text-zinc-300 font-sans text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            From IMAX feature co-productions and anamorphic optical rentals to Cannes premiere galas and digital rights licensing, Stargaze Media delivers the cutting-edge creative engine for global audiences.
          </p>
        </div>
      </section>

      {/* 05 STARGAZE UNIVERSE (3D SPATIAL WORLDS) */}
      <StargazeUniverse3D />

      {/* 06 FEATURED WORK / CINEMA SLATE */}
      <section id="slate" className="py-28 bg-[#08080A] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-2">
              <span className="text-[#FFB800] text-xs font-mono-studio tracking-[0.25em] uppercase block">
                [ 04 // EDITORIAL SLATE ]
              </span>
              <h2 className="text-4xl sm:text-6xl font-black font-grotesk text-white uppercase tracking-tight">
                SELECTED PRODUCTIONS
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5 font-mono-studio text-xs">
              {['ALL', 'SCI-FI', 'DRAMA', 'DOCUMENTARY'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                    projectCategory === cat
                      ? 'bg-[#FFB800] text-black border-[#FFB800] font-extrabold shadow-lg shadow-[#FFB800]/25'
                      : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-white hover:border-white/25'
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
                className="group relative bg-[#101014] border border-white/[0.08] rounded-3xl overflow-hidden hover:border-[#FFB800]/50 transition-all duration-500 cursor-pointer flex flex-col justify-between hover:shadow-2xl hover:shadow-[#FFB800]/10 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <StargazeImage
                    src={project.posterUrl}
                    alt={project.title}
                    focalPoint={project.focalPoint}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 bg-[#FFB800] text-black font-mono-studio text-[11px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
                    {project.genre.split('/')[0]}
                  </span>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/50 backdrop-blur-xs">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FFB800] to-amber-200 flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition duration-300">
                      <Play className="w-7 h-7 fill-black translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono-studio text-zinc-400">
                    <span>DIR. {project.director.toUpperCase()}</span>
                    <span className="text-[#FFB800] font-bold">[ {project.releaseYear} ]</span>
                  </div>
                  
                  <h3 className="text-2xl font-black font-grotesk text-white group-hover:text-[#FFB800] transition duration-300 tracking-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-xs text-zinc-300 font-sans line-clamp-2 leading-relaxed font-light">
                    {project.synopsis}
                  </p>

                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-studio text-zinc-400">
                    <span className="text-zinc-500">FORMAT: 4K DCI</span>
                    <span className="text-white group-hover:text-[#FFB800] flex items-center gap-1 font-bold transition">
                      CASE STUDY <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 PRODUCTION TIMELINE */}
      <ProductionTimeline />

      {/* 08 POST-PRODUCTION TECHNICAL SUITE */}
      <PostProductionSuite />

      {/* 09 EQUIPMENT RENTAL SHOWCASE */}
      <section className="py-28 bg-[#08080A] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-2">
              <span className="text-[#FFB800] text-xs font-mono-studio tracking-[0.25em] uppercase block">
                [ 07 // OPTICAL ASSETS & VAULT ]
              </span>
              <h2 className="text-4xl sm:text-6xl font-black font-grotesk text-white uppercase tracking-tight">
                CAMERA & CINEMA RENTAL
              </h2>
            </div>
            <a
              href="/equipment"
              className="text-xs font-mono-studio font-extrabold tracking-wider text-[#FFB800] hover:text-amber-300 flex items-center gap-1 uppercase"
            >
              BROWSE MASTER INVENTORY <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publishedEquipment.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedEquipment(item)}
                data-cursor="EXPLORE"
                className="bg-[#101014] border border-white/[0.08] rounded-3xl p-6 hover:border-[#FFB800]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-zinc-900 border border-white/5 relative group">
                    <StargazeImage src={item.imageUrl} alt={item.name} focalPoint={item.focalPoint} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <span className="text-[10px] font-mono-studio uppercase tracking-widest text-[#FFB800] block mb-1">
                    [ {item.category} ]
                  </span>
                  <h4 className="text-base font-black font-grotesk text-white mb-2">{item.name}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">{item.specs}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono-studio">
                  <span className="text-[#FFB800] font-bold text-sm">${item.dailyRate}<span className="text-zinc-500 text-xs font-normal">/day</span></span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                      item.availability === 'AVAILABLE'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
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

      {/* 10 DISTRIBUTION CATALOGUE */}
      <section className="py-28 bg-[#08080A] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-2">
              <span className="text-[#FFB800] text-xs font-mono-studio tracking-[0.25em] uppercase block">
                [ 08 // GLOBAL SYNDICATION & RIGHTS ]
              </span>
              <h2 className="text-4xl sm:text-6xl font-black font-grotesk text-white uppercase tracking-tight">
                DISTRIBUTION PORTFOLIO
              </h2>
            </div>
            <a
              href="/distribution"
              className="text-xs font-mono-studio font-extrabold tracking-wider text-[#FFB800] hover:text-amber-300 flex items-center gap-1 uppercase"
            >
              EXPLORE TERRITORIES <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedDistribution.map((dist) => (
              <div
                key={dist.id}
                className="bg-[#101014] border border-white/[0.08] rounded-3xl p-7 flex flex-col sm:flex-row gap-6 hover:border-[#FFB800]/40 transition-all duration-300"
              >
                <div className="w-full sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 bg-zinc-900">
                  <StargazeImage src={dist.posterUrl} alt={dist.title} focalPoint={dist.focalPoint} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="px-3 py-1 rounded-lg bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 font-mono-studio text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
                      {dist.type} // RIGHTS OPEN
                    </span>
                    <h3 className="text-2xl font-black font-grotesk text-white">{dist.title}</h3>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-2.5 font-light">{dist.synopsis}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/[0.08] text-xs font-mono-studio">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Globe className="w-4 h-4 text-[#FFB800]" />
                      <span>Territories: {dist.territories.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                      <span>Rights: {dist.rightsAvailable.join(' • ')}</span>
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
        <section className="py-24 bg-[#0A0A0E] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
              <div className="space-y-1">
                <span className="text-[#FFB800] text-xs font-mono-studio tracking-widest uppercase block">
                  [ STRATEGIC CO-PRODUCERS & GUILDS ]
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-grotesk text-white uppercase">
                  INDUSTRY ALLIANCES
                </h2>
              </div>
              <p className="text-xs font-mono-studio text-zinc-400 max-w-md">
                Governmental, festival, and international studio partners powering Stargaze cinema.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-black/60 border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-[#FFB800]/50 transition group"
                >
                  <div className="h-16 w-full flex items-center justify-center">
                    {partner.logoUrl ? (
                      <StargazeImage
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-12 max-w-[85%] object-contain filter grayscale group-hover:grayscale-0 transition duration-300"
                      />
                    ) : (
                      <span className="text-xs font-mono-studio font-bold text-[#FFB800] uppercase tracking-wider">
                        {partner.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase group-hover:text-[#FFB800] transition">
                      {partner.name}
                    </h4>
                    <span className="text-[10px] font-mono-studio text-zinc-500 uppercase block mt-0.5">
                      {partner.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11 PREMIERES & EXPERIENCES */}
      <section className="py-28 bg-[#08080A] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-2">
              <span className="text-[#FFB800] text-xs font-mono-studio tracking-[0.25em] uppercase block">
                [ 09 // LIVE ACTIVATIONS & GALAS ]
              </span>
              <h2 className="text-4xl sm:text-6xl font-black font-grotesk text-white uppercase tracking-tight">
                PREMIERES & LIVE
              </h2>
            </div>
            <a
              href="/events"
              className="text-xs font-mono-studio font-extrabold tracking-wider text-[#FFB800] hover:text-amber-300 flex items-center gap-1 uppercase"
            >
              ALL SESSIONS <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedEvents.map((evt) => (
              <div key={evt.id} className="group relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#101014] aspect-[16/9] hover:border-[#FFB800]/40 transition-all duration-500">
                <StargazeImage src={evt.imageUrl} alt={evt.title} focalPoint={evt.focalPoint} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-8 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-mono-studio text-[#FFB800]">
                    <span className="px-3 py-1 rounded-md bg-[#FFB800] text-black font-extrabold uppercase">{evt.category}</span>
                    <span>{evt.eventDate} • {evt.location}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-grotesk text-white">{evt.title}</h3>
                  <p className="text-xs text-zinc-300 font-sans line-clamp-2 font-light">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 NEWSROOM / EDITORIAL JOURNAL */}
      <section className="py-28 bg-[#08080A] border-t border-white/[0.08] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
            <div className="space-y-2">
              <span className="text-[#FFB800] text-xs font-mono-studio tracking-[0.25em] uppercase block">
                [ 10 // DISPATCHES & CRITIQUE ]
              </span>
              <h2 className="text-4xl sm:text-6xl font-black font-grotesk text-white uppercase tracking-tight">
                STUDIO JOURNAL
              </h2>
            </div>
            <a
              href="/news"
              className="text-xs font-mono-studio font-extrabold tracking-wider text-[#FFB800] hover:text-amber-300 flex items-center gap-1 uppercase"
            >
              READ FULL JOURNAL <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedNews.map((article) => (
              <a
                key={article.id}
                href="/news"
                className="p-8 rounded-3xl bg-[#101014] border border-white/[0.08] hover:border-[#FFB800]/40 transition-all duration-300 space-y-4 block group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono-studio text-[#FFB800]">
                  <span>[ {article.category} ]</span>
                  <span>{article.publishDate}</span>
                </div>
                <h3 className="text-2xl font-black font-grotesk text-white group-hover:text-[#FFB800] transition duration-300">
                  {article.title}
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2 font-light">
                  {article.summary}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-mono-studio text-zinc-400 group-hover:text-white transition">
                  <span>READ DISPATCH</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FFB800]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 13 HIGH-ENERGY COMMISSION CTA */}
      <section className="py-32 bg-gradient-to-b from-[#08080A] via-[#101014] to-black border-t border-white/10 text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FFB800]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] font-mono-studio text-xs uppercase tracking-[0.25em]">
            <Flame className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>[ 11 // NEXT PRODUCTION CYCLE ]</span>
          </span>
          
          <h2 className="text-4xl sm:text-7xl font-black font-grotesk text-white uppercase leading-[1.05] tracking-tight">
            LET’S CREATE SOMETHING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-amber-200 to-[#FF5500]">
              UNFORGETTABLE
            </span>
          </h2>
          
          <p className="text-zinc-300 max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            From feature films and high-impact commercial campaigns to anamorphic optical packages and global distribution rights.
          </p>
          
          <div className="pt-4">
            <a
              href="/enquiry"
              data-cursor="COMMISSION"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FFB800] to-[#FFC72C] hover:from-[#FFC72C] hover:to-[#FFB800] text-black font-mono-studio font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-[#FFB800]/30 hover:scale-105"
            >
              COMMISSION A PROJECT <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
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

