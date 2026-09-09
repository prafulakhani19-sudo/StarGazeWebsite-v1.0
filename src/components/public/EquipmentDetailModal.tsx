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
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl text-zinc-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Image & Specs */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#B45309] font-bold uppercase tracking-widest block mb-1">
                  CATEGORY // {item.category}
                </span>
                <h3 className="text-xl font-bold font-serif-cinematic text-zinc-900">{item.name}</h3>
                <p className="text-xs text-zinc-600 font-sans leading-relaxed mt-2">{item.specs}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">DAILY RATE:</span>
                  <span className="text-[#B45309] font-bold">${item.dailyRate} / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">AVAILABILITY:</span>
                  <span
                    className={`font-bold ${
                      item.availability === 'AVAILABLE' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {item.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Rental Request Form */}
            <div className="md:col-span-6 space-y-4">
              <div className="border-b border-zinc-200 pb-3">
                <h4 className="text-lg font-bold font-serif-cinematic text-zinc-900">RENTAL INQUIRY FORM</h4>
                <p className="text-xs text-zinc-500 font-mono">Reserve package for your upcoming shoot</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">PRODUCER / DOP NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition"
                    placeholder="e.g. Christopher Nolan"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition"
                    placeholder="producer@studio.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">RENTAL DAYS</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={requestedDays}
                      onChange={(e) => setRequestedDays(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1">START DATE</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
                  <span className="text-zinc-700 font-medium">ESTIMATED RENTAL COST:</span>
                  <span className="text-lg font-bold text-[#B45309]">${totalEstimate} USD</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold uppercase tracking-wider transition shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
                >
                  CONFIRM RENTAL INQUIRY <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif-cinematic text-zinc-900">RENTAL REQUEST TRANSMITTED</h3>
            <p className="text-zinc-600 font-sans text-sm max-w-md mx-auto">
              Our Camera Department coordinator will verify lens mounts, insurance requirements, and contact <strong className="text-[#B45309]">{formData.email}</strong> within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-mono text-zinc-800 font-bold uppercase tracking-wider transition"
            >
              RETURN TO CATALOGUE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
