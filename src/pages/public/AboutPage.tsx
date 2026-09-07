import React from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { Sparkles, ShieldCheck, Film, Award, Globe, Users, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
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
            Stargaze Media is a premier global entertainment studio operating across film production, post-production, optical equipment rental, worldwide distribution, and immersive brand experiences.
          </p>
        </div>
      </section>

      {/* Narrative Sections: ORIGIN, VISION, INFRASTRUCTURE, APPROACH */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {/* ORIGIN & VISION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-[#E5C158] uppercase tracking-widest">
              01 // ORIGIN & VISION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-cinematic text-white leading-tight">
              CRAFTING CINEMA ON A GLOBAL CANVAS
            </h2>
            <p className="text-zinc-300 font-sans leading-relaxed text-sm sm:text-base">
              Founded with a mission to unite visionary storytelling with cutting-edge cinema technology, Stargaze Media has grown into a major entertainment power, serving as a benchmark for scale, creative independence, and technical perfection.
            </p>
            <p className="text-zinc-400 font-sans leading-relaxed text-sm">
              Our studio handles every phase of the filmmaking lifecycle—from packaging original scripts to delivering IMAX 70mm prints and licensing theatrical rights across 120+ international markets.
            </p>
          </div>

          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80"
              alt="Stargaze Studios"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* INFRASTRUCTURE NUMBERS */}
        <div className="p-10 rounded-3xl bg-zinc-950 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-4xl sm:text-5xl font-black font-serif-cinematic text-[#E5C158] block mb-2">
              4
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              SOUNDSTAGES (50K SQFT)
            </span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-black font-serif-cinematic text-[#E5C158] block mb-2">
              120+
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              DISTRIBUTION TERRITORIES
            </span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-black font-serif-cinematic text-[#E5C158] block mb-2">
              250+
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              ARRI & SONY CINE RIGS
            </span>
          </div>
          <div>
            <span className="text-4xl sm:text-5xl font-black font-serif-cinematic text-[#E5C158] block mb-2">
              $150M
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              ANNUAL PRODUCTION SLATE
            </span>
          </div>
        </div>

        {/* LEADERSHIP & PEOPLE */}
        <div className="space-y-8">
          <div className="border-b border-white/10 pb-6">
            <span className="text-xs font-mono text-[#E5C158] uppercase tracking-widest block mb-2">
              02 // EXECUTIVE LEADERSHIP
            </span>
            <h2 className="text-3xl font-bold font-serif-cinematic text-white uppercase">
              STUDIO BOARD & MASTERS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: 'Vikram Malhotra', role: 'Head of Film & Global Production', bio: 'Veteran producer behind 20+ theatrical blockbusters and international IMAX co-productions.' },
              { name: 'Dr. Ananya Roy', role: 'Head of VFX & Post Architecture', bio: 'Former ILM visual effects supervisor leading 8K color pipeline and Unreal Engine pre-vis.' },
              { name: 'Kabir Verma', role: 'Director of Camera & Equipment Rental', bio: 'Master DOP overseeing optical lens customization and ARRI camera package deployments.' },
            ].map((person, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#E5C158]/20 border border-[#E5C158] flex items-center justify-center text-[#E5C158] font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-serif-cinematic text-white">{person.name}</h3>
                <span className="text-xs font-mono text-[#E5C158] uppercase tracking-wider block">{person.role}</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{person.bio}</p>
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
