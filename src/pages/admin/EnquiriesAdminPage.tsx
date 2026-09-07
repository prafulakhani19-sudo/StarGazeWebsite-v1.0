import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { EnquiryItem } from '../../types';
import { Mail, CheckCircle2 } from 'lucide-react';

export const EnquiriesAdminPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const snap = await getDocs(collection(db, 'enquiries'));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as EnquiryItem[];
        setEnquiries(list);
      } catch (err) {
        console.warn('Fallback sample enquiries:', err);
        setEnquiries([
          {
            id: 'enq-1',
            name: 'Robert Chen (Apex Pictures)',
            email: 'rchen@apexpictures.com',
            type: 'Rental',
            subject: 'ARRI ALEXA 35 3-Week Rental Request',
            message: 'Inquiring about camera package availability for feature shoot in September.',
            status: 'NEW',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'enq-2',
            name: 'Elena Rostova (Global Cinema)',
            email: 'elena@globalcinema.fr',
            type: 'Distribution',
            subject: 'ASTRA International Rights Acquisition',
            message: 'We are interested in acquiring European theatrical distribution rights for Astra.',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <ProtectedRoute requiredPermission="enquiries.view">
      <AdminLayout>
        <div className="space-y-6 font-sans">
          <div className="border-b border-zinc-900 pb-6">
            <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
              <Mail className="w-4 h-4" /> COMMUNICATIONS
            </div>
            <h1 className="text-3xl font-extrabold text-white uppercase font-mono">STUDIO ENQUIRIES</h1>
            <p className="text-xs text-zinc-400 mt-1">View and respond to incoming camera rentals, distribution inquiries, and studio bookings.</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-zinc-500 font-mono text-xs">Loading studio enquiries...</div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-mono text-xs">No pending enquiries in queue.</div>
            ) : (
              enquiries.map((e) => (
                <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div>
                      <span className="text-xs font-bold text-white">{e.name}</span>
                      <span className="text-[11px] text-zinc-400 font-mono block sm:inline sm:ml-2">({e.email})</span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold rounded uppercase w-fit">
                      {e.type} Category
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-200">{e.subject}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{e.message}</p>
                  <div className="text-[10px] font-mono text-zinc-500 pt-2 flex justify-between">
                    <span>Received: {new Date(e.createdAt).toLocaleString()}</span>
                    <span className="text-emerald-400 font-bold">Status: {e.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
