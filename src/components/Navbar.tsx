import React from 'react';
import { TabType } from '../types';
import { UploadCloud, FileText, Settings, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  fileCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, fileCount }) => {
  return (
    <header className="w-full pt-6 pb-4 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Top: Small blue hexagon logo with 'Hex-Uploader' text */}
        <div className="flex items-center gap-2.5 mb-5 cursor-pointer group" onClick={() => onTabChange('upload')}>
          {/* Blue Hexagon Logo */}
          <div className="relative w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
            <svg viewBox="0 0 36 40" className="w-9 h-9 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 2L33.5885 11V29L18 38L2.41154 29V11L18 2Z"
                fill="url(#hex-blue-grad)"
                stroke="#1d4ed8"
                strokeWidth="1.5"
              />
              <path
                d="M18 8L28.3923 14V26L18 32L7.6077 26V14L18 8Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.8"
              />
              <defs>
                <linearGradient id="hex-blue-grad" x1="2" y1="2" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-extrabold text-white tracking-wider">H</span>
            </div>
          </div>

          {/* Hex-Uploader Text */}
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center">
            Hex<span className="text-blue-600">-Uploader</span>
          </span>
        </div>

        {/* Navigation links: "Upload", "Log Files", and "Others" */}
        <nav className="flex items-center justify-center gap-1 sm:gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-sky-100 shadow-[0_2px_12px_rgba(37,99,235,0.05)]">
          <button
            onClick={() => onTabChange('upload')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload</span>
          </button>

          <button
            onClick={() => onTabChange('logs')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Log Files</span>
            {fileCount > 0 && (
              <span
                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-mono tabular-nums ${
                  activeTab === 'logs'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {fileCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('others')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'others'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Others</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
