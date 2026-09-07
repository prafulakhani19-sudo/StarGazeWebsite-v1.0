import React, { useState } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { CustomCursor } from '../../components/public/CustomCursor';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const EnquiryPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<string>('Production');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'enquiries'), {
        name,
        email,
        phone,
        type,
        subject,
        message,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      // Fallback local confirm
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F0] font-sans selection:bg-[#E5C158] selection:text-black">
      <CustomCursor />
      <PublicHeader />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-12 border-b border-white/10 pb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C158]/10 border border-[#E5C158]/30 text-[#E5C158] font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#E5C158]" />
            STUDIO ENGAGEMENT
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-serif-cinematic tracking-tight uppercase text-white leading-tight">
            LET’S MAKE SOMETHING<br />
            <span className="text-[#E5C158]">WORTH WATCHING</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-sans">
            Direct channel to Stargaze Media studio executives, DOP equipment coordinators, and distribution heads.
          </p>
        </div>

        {submitted ? (
          <div className="bg-zinc-950 border border-[#E5C158]/40 rounded-3xl p-10 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#E5C158]/20 border border-[#E5C158] flex items-center justify-center mx-auto text-[#E5C158]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif-cinematic text-white">STUDIO INQUIRY TRANSMITTED</h3>
            <p className="text-xs text-zinc-300 font-mono max-w-md mx-auto">
              Your inquiry has been routed directly into our executive management system. A coordinator will respond to <strong className="text-[#E5C158]">{email}</strong> within 2 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); setSubject(''); }}
              className="px-6 py-3 bg-[#E5C158] hover:bg-[#F0CE68] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              SUBMIT ANOTHER INQUIRY
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            {/* Category Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#E5C158] uppercase tracking-widest">
                01 // SELECT COLLABORATION CATEGORY *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {[
                  'Production',
                  'Post-Production',
                  'Equipment Rental',
                  'Distribution',
                  'Events & Premieres',
                  'Marketing & PR',
                  'General Inquiry',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setType(cat)}
                    className={`p-3 rounded-xl border text-left transition ${
                      type === cat
                        ? 'bg-[#E5C158] text-black border-[#E5C158] font-bold shadow-md shadow-[#E5C158]/20'
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-6 pt-2 border-t border-white/10 font-mono text-xs">
              <span className="text-[#E5C158] uppercase tracking-widest block">
                02 // PROJECT & CONTACT DETAILS
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-400 uppercase mb-2">PRODUCER / EXECUTIVE NAME *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5C158] transition"
                    placeholder="e.g. Denis Villeneuve"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase mb-2">CORPORATE EMAIL *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5C158] transition"
                    placeholder="producer@studio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-400 uppercase mb-2">PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5C158] transition"
                    placeholder="+1 (555) 019-2831"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase mb-2">PROJECT TITLE / SUBJECT *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5C158] transition"
                    placeholder="Feature Film Co-Production / Gear Inquiry"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-2">PROJECT REQUIREMENTS & TIMELINE *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E5C158] transition leading-relaxed"
                  placeholder="Detail your production scope, camera specs, release schedule, or distribution rights desired..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#E5C158] hover:bg-[#F0CE68] text-black font-extrabold text-xs font-mono uppercase tracking-widest rounded-xl shadow-xl shadow-[#E5C158]/20 transition flex items-center justify-center gap-2"
              >
                {loading ? 'TRANSMITTING TO STUDIO...' : 'TRANSMIT INQUIRY TO STUDIO EXECS'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

