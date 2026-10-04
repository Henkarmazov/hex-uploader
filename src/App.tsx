import React, { useState, useEffect } from 'react';
import { UploadedFile, UploaderSettings } from './types';
import { WaveBackground } from './components/WaveBackground';
import { UploadView } from './components/UploadView';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { QRCodeModal } from './components/QRCodeModal';
import { Toast } from './components/Toast';

const DEFAULT_SETTINGS: UploaderSettings = {
  hexPrefix: 'hex_',
  autoOptimize: true,
  quality: 85,
  retention: 'permanent',
  apiToken: 'hex_live_9a4f2c1d8e37b5a09c2d1e4f6a8b7c3d',
};

export default function App() {
  // Files state with localStorage persistence
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    try {
      const stored = localStorage.getItem('hex_uploader_files');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored files', e);
    }
    return [];
  });

  const [settings] = useState<UploaderSettings>(DEFAULT_SETTINGS);

  // Latest uploaded file: strictly null on load so "Berhasil Diunggah!" is never shown before uploading
  const [latestUploadedFile, setLatestUploadedFile] = useState<UploadedFile | null>(null);

  // Modals & Toast
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hex_uploader_files', JSON.stringify(files));
    } catch (e) {
      console.warn('LocalStorage limit reached', e);
    }
  }, [files]);

  const handleFileUpload = (newFile: UploadedFile) => {
    setFiles((prev) => [newFile, ...prev]);
    setLatestUploadedFile(newFile);
  };

  const handleResetUploadedFile = () => {
    setLatestUploadedFile(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative text-slate-800 selection:bg-blue-500 selection:text-white">
      {/* Background with wave pattern and subtle blue accents */}
      <WaveBackground />

      {/* Top Header: Larger Logo & Brand positioned at the Top-Left Corner */}
      <header className="w-full pt-6 pb-2 px-6 sm:px-10 flex items-center justify-start z-20">
        <div className="flex items-center gap-3.5 cursor-pointer select-none group">
          {/* Hexagon Logo - Larger */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <svg viewBox="0 0 36 40" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 2L33.5885 11V29L18 38L2.41154 29V11L18 2Z"
                fill="url(#hex-blue-brand-header)"
                stroke="#1d4ed8"
                strokeWidth="1.2"
              />
              <path
                d="M18 8L28.3923 14V26L18 32L7.6077 26V14L18 8Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeOpacity="0.85"
              />
              <defs>
                <linearGradient id="hex-blue-brand-header" x1="2" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[14px] sm:text-[16px] font-black text-white tracking-wider">H</span>
            </div>
          </div>

          {/* Hex-Uploader Name - Larger */}
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center">
            Hex<span className="text-blue-600">-Uploader</span>
          </span>
        </div>
      </header>

      {/* Main View Port: Only the File Input & Output */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <UploadView
          onFileUpload={handleFileUpload}
          latestUploadedFile={latestUploadedFile}
          settings={settings}
          onPreviewImage={(f) => setPreviewFile(f)}
          onShowQr={(url) => setQrModalUrl(url)}
          showToast={showToast}
          onResetUploadedFile={handleResetUploadedFile}
        />
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="w-full py-5 text-center text-xs text-slate-400 select-none">
        <div className="max-w-2xl mx-auto px-4 border-t border-slate-200/50 pt-4 flex items-center justify-center">
          <span className="font-semibold text-slate-500 hover:text-slate-700 transition-colors">
            @ 2026 Henkaramazov.
          </span>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <ImagePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        showToast={showToast}
      />

      <QRCodeModal
        url={qrModalUrl}
        onClose={() => setQrModalUrl(null)}
        showToast={showToast}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
