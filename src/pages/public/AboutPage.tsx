import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { Sparkles, Users, ArrowRight, Shield, Award, Film, CheckCircle2 } from 'lucide-react';
import { getMediaForSlot } from '../../lib/mediaResolver';
import { getTeamMembers, getSiteContent } from '../../lib/cmsService';
import { StargazeImage } from '../../components/common/StargazeImage';
import { TeamMember, SiteContentConfig } from '../../types';

export const AboutPage: React.FC = () => {
  const [studioMedia, setStudioMedia] = useState<{ url: string; focalPoint?: { x: number; y: number } }>({
    url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80',
  });
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContentConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAboutData() {
      // Load slot media
      let res = await getMediaForSlot('about.studio');
      if (!res.url) {
        res = await getMediaForSlot('work.sahebVikaskari');
      }
      if (isMounted && res.url) {
        setStudioMedia({ url: res.url, focalPoint: res.focalPoint });
      }

      // Load dynamic team
      try {
        const teamData = await getTeamMembers();
        if (isMounted && teamData.length > 0) {
          setTeam(teamData.filter((m) => m.status === 'PUBLISHED'));
        }
      } catch (err) {
        console.warn('Error loading CMS team:', err);
      }

      // Load dynamic site content
      try {
        const contentData = await getSiteContent();
        if (isMounted) {
          setSiteContent(contentData);
        }
      } catch (err) {
        console.warn('Error loading site content:', err);
      }
    }

    loadAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#D97706] selection:text-white">
      <PublicHeader />

      {/* Hero Header */}
      <section className="pt-32 pb-24 bg-[#F8F9FA] border-b border-zinc-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#B45309] font-mono text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            ABOUT STARGAZE MEDIA
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-serif-cinematic tracking-tight uppercase text-zinc-900">
            WE CREATE WHAT THE WORLD WATCHES
          </h1>

          <p className="text-zinc-600 max-w-3xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            {siteContent?.aboutStudioText ||
              'Stargaze Media is a premier global entertainment studio operating across film production, post-production, optical equipment rental, worldwide distribution, and immersive brand experiences.'}
          </p>
        </div>
      </section>

      {/* Narrative Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {/* ORIGIN & VISION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest">
              01 // ORIGIN & VISION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-cinematic text-zinc-900 leading-tight">
              {siteContent?.aboutStudioTitle || 'CRAFTING CINEMA ON A GLOBAL CANVAS'}
            </h2>
            <p className="text-zinc-600 font-sans leading-relaxed text-sm sm:text-base">
              Founded with a mission to unite visionary storytelling with cutting-edge cinema technology, Stargaze Media has grown into a major entertainment power, serving as a benchmark for scale, creative independence, and technical perfection.
            </p>
            {siteContent?.aboutStudioQuote && (
              <blockquote className="p-4 rounded-2xl bg-amber-50/70 border-l-4 border-[#D97706] text-zinc-800 italic text-sm">
                &ldquo;{siteContent.aboutStudioQuote}&rdquo;
                {siteContent.aboutStudioQuoteAuthor && (
                  <span className="block not-italic text-xs font-mono text-[#B45309] font-bold mt-1">
                    — {siteContent.aboutStudioQuoteAuthor}
                  </span>
                )}
              </blockquote>
            )}
            <p className="text-zinc-600 font-sans leading-relaxed text-sm">
              Our studio handles every phase of the filmmaking lifecycle—from packaging original scripts to delivering IMAX 70mm prints and licensing theatrical rights across 120+ international markets.
            </p>
          </div>

          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xl">
            <StargazeImage
              src={studioMedia.url}
              alt="Stargaze Studios"
              focalPoint={studioMedia.focalPoint}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* INFRASTRUCTURE NUMBERS */}
        <div className="p-10 rounded-3xl bg-[#F8F9FA] border border-zinc-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-md">
          {(siteContent?.stats && siteContent.stats.length > 0 ? siteContent.stats : [
            { value: '4', label: 'SOUNDSTAGES (50K SQFT)' },
            { value: '120+', label: 'DISTRIBUTION TERRITORIES' },
            { value: '250+', label: 'ARRI & SONY CINE RIGS' },
            { value: '$150M', label: 'ANNUAL PRODUCTION SLATE' },
          ]).map((stat, idx) => (
            <div key={idx}>
              <span className="text-4xl sm:text-5xl font-black font-serif-cinematic text-[#D97706] block mb-2">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-zinc-600 font-bold uppercase tracking-widest">
                {stat.label}
              </span>
              {stat.helper && (
                <span className="block text-[11px] text-zinc-500 mt-1">{stat.helper}</span>
              )}
            </div>
          ))}
        </div>

        {/* LEADERSHIP & PEOPLE (Dynamic from CMS) */}
        <div className="space-y-8">
          <div className="border-b border-zinc-200 pb-6">
            <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-widest block mb-2">
              02 // EXECUTIVE LEADERSHIP
            </span>
            <h2 className="text-3xl font-bold font-serif-cinematic text-zinc-900 uppercase">
              STUDIO BOARD & LEADERSHIP
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((person) => (
              <div key={person.id} className="p-6 rounded-2xl bg-[#F8F9FA] border border-zinc-200 space-y-4 hover:border-amber-400 hover:shadow-lg transition">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 relative">
                  {person.photoUrl ? (
                    <StargazeImage
                      src={person.photoUrl}
                      alt={person.name}
                      focalPoint={person.focalPoint}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <Users className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-md border border-zinc-200 text-[10px] font-mono text-[#B45309] font-bold uppercase">
                      {person.department}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif-cinematic text-zinc-900">{person.name}</h3>
                  <span className="text-xs font-mono text-[#B45309] font-bold uppercase tracking-wider block">
                    {person.role}
                  </span>
                  <p className="text-xs text-zinc-600 leading-relaxed font-sans pt-1">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4 shadow-lg">
          <h3 className="text-3xl font-bold font-serif-cinematic text-zinc-900">READY TO COLLABORATE WITH STARGAZE?</h3>
          <p className="text-sm text-zinc-600 max-w-xl mx-auto">
            Whether you require camera equipment rental, post-production, or co-production funding, our team is ready.
          </p>
          <a
            href="/enquiry"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-mono font-bold text-xs uppercase tracking-widest transition shadow-md shadow-amber-600/20"
          >
            START A PROJECT <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
