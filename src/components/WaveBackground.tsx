import React from 'react';

export const WaveBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#f8fbff]">
      {/* Top subtle blue ambient glow */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1200px] h-[550px] rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(186, 230, 253, 0.45) 0%, rgba(219, 234, 254, 0.25) 45%, rgba(248, 251, 255, 0) 75%)'
        }}
      />

      {/* Floating subtle hexagonal motifs */}
      <div className="absolute top-16 left-[10%] opacity-20 text-blue-500 animate-float-slow">
        <svg width="44" height="50" viewBox="0 0 48 56" fill="none">
          <polygon points="24,2 46,15 46,41 24,54 2,41 2,15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
      </div>

      <div className="absolute top-28 right-[12%] opacity-20 text-sky-400">
        <svg width="56" height="64" viewBox="0 0 48 56" fill="none">
          <polygon points="24,2 46,15 46,41 24,54 2,41 2,15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute bottom-48 left-[8%] opacity-15 text-blue-600">
        <svg width="34" height="40" viewBox="0 0 48 56" fill="none">
          <polygon points="24,2 46,15 46,41 24,54 2,41 2,15" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="absolute bottom-56 right-[9%] opacity-15 text-sky-500">
        <svg width="40" height="46" viewBox="0 0 48 56" fill="none">
          <polygon points="24,2 46,15 46,41 24,54 2,41 2,15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
        </svg>
      </div>

      {/* Elegant bottom light blue subtle wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none select-none">
        <svg
          className="relative block w-full h-44 sm:h-60 md:h-72 opacity-60"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wave Layer 1 */}
          <path
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,280L1392,280C1344,280,1248,280,1152,280C1056,280,960,280,864,280C768,280,672,280,576,280C480,280,384,280,288,280C192,280,96,280,48,280L0,280Z"
            fill="url(#wave-grad-1)"
          />
          {/* Wave Layer 2 */}
          <path
            d="M0,170L48,158C96,146,192,122,288,134C384,146,480,192,576,204C672,216,768,192,864,176C960,160,1056,150,1152,156C1248,162,1344,186,1392,198L1440,210L1440,280L1392,280C1344,280,1248,280,1152,280C1056,280,960,280,864,280C768,280,672,280,576,280C480,280,384,280,288,280C192,280,96,280,48,280L0,280Z"
            fill="url(#wave-grad-2)"
            fillOpacity="0.55"
          />
          <defs>
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#bfdbfe" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
