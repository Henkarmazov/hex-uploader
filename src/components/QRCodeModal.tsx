import React, { useState } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  url: string | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  url,
  onClose,
  showToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!url) return null;

  // We can use a reliable QR Code generator SVG endpoint or visual SVG QR matrix
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=1d4ed8&margin=1`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('URL berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl border border-sky-100 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Pindai Kode QR
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Arahkan kamera ponsel Anda untuk membuka langsung URL gambar ini.
        </p>

        {/* QR Code Container */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-block mb-4 shadow-inner">
          <img
            src={qrImageUrl}
            alt="QR Code"
            className="w-48 h-48 rounded-xl object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* URL preview & copy */}
        <div className="bg-slate-100/80 px-3 py-2 rounded-xl text-xs font-mono text-slate-700 truncate select-all mb-4">
          {url}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>URL Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Salin URL Gambar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
