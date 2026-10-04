import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3 max-w-sm backdrop-blur-md">
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        </div>
        <p className="text-xs sm:text-sm font-medium pr-2">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
