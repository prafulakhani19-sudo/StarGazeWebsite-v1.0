import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  danger?: boolean;
  loading?: boolean;
  roleChange?: { currentRole: string; newRole: string };
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  danger = false,
  loading = false,
  roleChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              danger
                ? 'bg-red-950 text-red-400 border border-red-800/50'
                : 'bg-amber-950 text-amber-400 border border-amber-800/50'
            }`}
          >
            {danger ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-mono">{title}</h3>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mb-4">{description}</p>

        {roleChange && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 mb-6 flex items-center justify-around font-mono text-xs">
            <div className="text-center">
              <span className="text-[10px] text-zinc-500 uppercase block">Current Role</span>
              <span className="text-amber-400 font-bold">{roleChange.currentRole}</span>
            </div>
            <span className="text-zinc-600">→</span>
            <div className="text-center">
              <span className="text-[10px] text-zinc-500 uppercase block">New Role</span>
              <span className="text-emerald-400 font-bold">{roleChange.newRole}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 font-bold text-xs uppercase tracking-wider rounded-xl transition ${
              danger
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
