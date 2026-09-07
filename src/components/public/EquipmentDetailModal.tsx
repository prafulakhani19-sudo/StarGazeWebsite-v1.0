import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { EquipmentItem } from '../../types';

interface EquipmentDetailModalProps {
  item: EquipmentItem | null;
  onClose: () => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({ item, onClose }) => {
  const [requestedDays, setRequestedDays] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', startDate: '' });

  if (!item) return null;

  const totalEstimate = item.dailyRate * requestedDays;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-zinc-950 border border-[#E5C158]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Image & Specs */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#E5C158] uppercase tracking-widest block mb-1">
                  CATEGORY // {item.category}
                </span>
                <h3 className="text-xl font-bold font-serif-cinematic text-white">{item.name}</h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-2">{item.specs}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">DAILY RATE:</span>
                  <span className="text-[#E5C158] font-bold">${item.dailyRate} / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">AVAILABILITY:</span>
                  <span
                    className={`font-bold ${
                      item.availability === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {item.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Rental Request Form */}
            <div className="md:col-span-6 space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h4 className="text-lg font-bold font-serif-cinematic text-white">RENTAL INQUIRY FORM</h4>
                <p className="text-xs text-zinc-400 font-mono">Reserve package for your upcoming shoot</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">PRODUCER / DOP NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-[#E5C158] outline-none"
                    placeholder="e.g. Christopher Nolan"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-[#E5C158] outline-none"
                    placeholder="producer@studio.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">RENTAL DAYS</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={requestedDays}
                      onChange={(e) => setRequestedDays(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-[#E5C158] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">START DATE</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:border-[#E5C158] outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#E5C158]/10 border border-[#E5C158]/30 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">ESTIMATED RENTAL COST:</span>
                  <span className="text-lg font-bold text-[#E5C158]">${totalEstimate} USD</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#E5C158] hover:bg-[#F0CE68] text-black font-bold uppercase tracking-wider transition shadow-lg shadow-[#E5C158]/20 flex items-center justify-center gap-2"
                >
                  CONFIRM RENTAL INQUIRY <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E5C158]/20 border border-[#E5C158] flex items-center justify-center mx-auto text-[#E5C158]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif-cinematic text-white">RENTAL REQUEST TRANSMITTED</h3>
            <p className="text-zinc-300 font-sans text-sm max-w-md mx-auto">
              Our Camera Department coordinator will verify lens mounts, insurance requirements, and contact <strong className="text-[#E5C158]">{formData.email}</strong> within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white font-bold uppercase tracking-wider"
            >
              RETURN TO CATALOGUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
