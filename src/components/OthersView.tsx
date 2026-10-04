import React, { useState } from 'react';
import { UploaderSettings } from '../types';
import { 
  Settings, 
  Key, 
  Terminal, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface OthersViewProps {
  settings: UploaderSettings;
  onUpdateSettings: (newSettings: Partial<UploaderSettings>) => void;
  showToast: (msg: string) => void;
}

export const OthersView: React.FC<OthersViewProps> = ({
  settings,
  onUpdateSettings,
  showToast,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(settings.apiToken);
    setCopiedToken(true);
    showToast('API Token berhasil disalin!');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const curlCommand = `curl -X POST https://hex-uploader.io/api/v1/upload \\
  -H "Authorization: Bearer ${settings.apiToken}" \\
  -F "file=@foto-anda.png" \\
  -F "prefix=${settings.hexPrefix}"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    showToast('Perintah cURL disalin ke clipboard!');
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleGenerateNewToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = 'hex_live_';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onUpdateSettings({ apiToken: token });
    showToast('API Token baru berhasil dibuat!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan & Alat Lainnya
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kustomisasi format URL, kompresi gambar, kebijakan penyimpanan, dan integrasi API Hex-Uploader.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Pengaturan URL & Slug Hex */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-sky-100 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 text-blue-600">
            <div className="p-2 rounded-xl bg-blue-50">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Prefix Hex & Tautan URL</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kustomisasi Prefix Slug URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.hexPrefix}
                  onChange={(e) => onUpdateSettings({ hexPrefix: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  placeholder="hex_"
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono text-slate-800"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Contoh hasil: <span className="font-mono text-blue-600">https://hex-uploader.io/f/{settings.hexPrefix}7a8b9c.png</span>
              </p>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Masa Retensi File
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'permanent', label: 'Permanen' },
                  { id: '30days', label: '30 Hari' },
                  { id: '7days', label: '7 Hari' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUpdateSettings({ retention: item.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      settings.retention === item.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Optimasi & Kompresi Gambar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-sky-100 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 text-sky-600">
            <div className="p-2 rounded-xl bg-sky-50">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Optimasi & Kompresi</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-800">Auto-Optimasi Ukuran</div>
                <div className="text-[11px] text-slate-500">Otomatis kompresi tanpa mengurangi kejernihan visual.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoOptimize}
                  onChange={(e) => onUpdateSettings({ autoOptimize: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Kualitas Kompresi</span>
                <span className="font-mono text-blue-600">{settings.quality}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={settings.quality}
                onChange={(e) => onUpdateSettings({ quality: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Hemat Kuota (50%)</span>
                <span>Standar (85%)</span>
                <span>Maksimum (100%)</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-800 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <span>Format output tetap mempertahankan metadata asli format gambar Anda.</span>
            </div>
          </div>
        </div>

        {/* 3. Akses API Developer */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-sky-100 p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-blue-700">
              <div className="p-2 rounded-xl bg-blue-50">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Akses API Developer</h3>
                <p className="text-xs text-slate-500">Gunakan API token ini untuk mengunggah otomatis melalui skrip atau terminal.</p>
              </div>
            </div>

            <button
              onClick={handleGenerateNewToken}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerasi Token</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Token display */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kunci Akses API (Secret Token)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-xs sm:text-sm bg-slate-900 text-slate-200 px-4 py-2.5 rounded-xl truncate select-all">
                  {settings.apiToken}
                </div>
                <button
                  onClick={handleCopyToken}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* cURL example */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contoh Integrasi cURL Command Line</span>
                </label>
                <button
                  onClick={handleCopyCurl}
                  className="text-xs text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {copiedCurl ? 'Tersalin!' : 'Salin Perintah'}
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-sky-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                {curlCommand}
              </pre>
            </div>
          </div>
        </div>

        {/* 4. Format & Spesifikasi Dukungan */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-sky-100 p-6 shadow-sm md:col-span-2">
          <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Spesifikasi File & Format yang Didukung</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Hex-Uploader mendukung berbagai format standar modern untuk keperluan web, desain grafis, dan fotografi.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { format: 'JPG / JPEG', desc: 'Foto kamera & web', mime: 'image/jpeg' },
              { format: 'PNG', desc: 'Transparansi alfa tinggi', mime: 'image/png' },
              { format: 'WEBP', desc: 'Format web masa kini', mime: 'image/webp' },
              { format: 'GIF', desc: 'Animasi & gambar dinamis', mime: 'image/gif' },
              { format: 'TIFF', desc: 'Presisi tinggi fotografi', mime: 'image/tiff' },
            ].map((f) => (
              <div key={f.format} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="font-bold font-mono text-xs text-blue-700 mb-0.5">{f.format}</div>
                <div className="text-[11px] text-slate-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
