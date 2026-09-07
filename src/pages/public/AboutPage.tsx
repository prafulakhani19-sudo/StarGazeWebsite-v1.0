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
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F0] font-sans selection:bg-[#E5C158] selection:text-black">
      <PublicHeader />

      {/* Hero Header */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-zinc-900 to-[#0A0A0C] border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/30 text-[#E5C158] font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#E5C158]" />
            ABOUT STARGAZE MEDIA
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-serif-cinematic tracking-tight uppercase text-white">
            WE CREATE WHAT THE WORLD WATCHES
          </h1>

          <p className="text-zinc-300 max-w-3xl mx-auto text-base sm:text-lg font-light leading-relaxed">
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
            <span className="text-xs font-mono text-[#E5C158] uppercase tracking-widest">
              01 // ORIGIN & VISION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-cinematic text-white leading-tight">
              {siteContent?.aboutStudioTitle || 'CRAFTING CINEMA ON A GLOBAL CANVAS'}
            </h2>
            <p className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
              Founded with a mission to unite visionary storytelling with cutting-edge cinema technology, Stargaze Media has grown into a major entertainment power, serving as a benchmark for scale, creative independence, and technical perfection.
            </p>
            {siteContent?.aboutStudioQuote && (
              <blockquote className="p-4 rounded-2xl bg-zinc-950/80 border-l-4 border-[#E5C158] text-zinc-200 italic text-sm">
                &ldquo;{siteContent.aboutStudioQuote}&rdquo;
                {siteContent.aboutStudioQuoteAuthor && (
                  <span className="block not-italic text-xs font-mono text-[#E5C158] mt-1">
                    — {siteContent.aboutStudioQuoteAuthor}
                  </span>
                )}
              </blockquote>
            )}
            <p className="text-zinc-400 font-sans leading-relaxed text-sm">
              Our studio handles every phase of the filmmaking lifecycle—from packaging original scripts to delivering IMAX 70mm prints and licensing theatrical rights across 120+ international markets.
            </p>
          </div>

          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
            <StargazeImage
              src={studioMedia.url}
              alt="Stargaze Studios"
              focalPoint={studioMedia.focalPoint}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* INFRASTRUCTURE NUMBERS */}
        <div className="p-10 rounded-3xl bg-zinc-950 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {(siteContent?.stats && siteContent.stats.length > 0 ? siteContent.stats : [
            { value: '4', label: 'SOUNDSTAGES (50K SQFT)' },
            { value: '120+', label: 'DISTRIBUTION TERRITORIES' },
            { value: '250+', label: 'ARRI & SONY CINE RIGS' },
            { value: '$150M', label: 'ANNUAL PRODUCTION SLATE' },
          ]).map((stat, idx) => (
            <div key={idx}>
              <span className="text-4xl sm:text-5xl font-black font-serif-cinematic text-[#E5C158] block mb-2">
                {stat.value}
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
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
          <div className="border-b border-white/10 pb-6">
            <span className="text-xs font-mono text-[#E5C158] uppercase tracking-widest block mb-2">
              02 // EXECUTIVE LEADERSHIP
            </span>
            <h2 className="text-3xl font-bold font-serif-cinematic text-white uppercase">
              STUDIO BOARD & LEADERSHIP
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((person) => (
              <div key={person.id} className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-4 hover:border-[#E5C158]/40 transition">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black border border-zinc-800 relative">
                  {person.photoUrl ? (
                    <StargazeImage
                      src={person.photoUrl}
                      alt={person.name}
                      focalPoint={person.focalPoint}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Users className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#E5C158] uppercase">
                      {person.department}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-serif-cinematic text-white">{person.name}</h3>
                  <span className="text-xs font-mono text-[#E5C158] uppercase tracking-wider block">
                    {person.role}
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-1">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-zinc-900 to-[#0A0A0C] border border-[#E5C158]/30 text-center space-y-4">
          <h3 className="text-3xl font-bold font-serif-cinematic text-white">READY TO COLLABORATE WITH STARGAZE?</h3>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            Whether you require camera equipment rental, post-production, or co-production funding, our team is ready.
          </p>
          <a
            href="/enquiry"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-mono font-bold text-xs uppercase tracking-widest transition shadow-xl shadow-[#E5C158]/20"
          >
            START A PROJECT <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
