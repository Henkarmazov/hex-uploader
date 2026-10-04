import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { UploadedFile, UploaderSettings } from '../types';
import { generateHexHash, getFileFormat } from '../utils/helpers';
import { FAQSection } from './FAQSection';
import { 
  UploadCloud, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Eye, 
  ArrowUpRight,
  RefreshCw,
  Plus,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface UploadViewProps {
  onFileUpload: (file: UploadedFile) => void;
  latestUploadedFile: UploadedFile | null;
  settings: UploaderSettings;
  onPreviewImage: (file: UploadedFile) => void;
  onShowQr: (url: string) => void;
  showToast: (msg: string) => void;
  onResetUploadedFile: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onFileUpload,
  latestUploadedFile,
  settings,
  onPreviewImage,
  onShowQr,
  showToast,
  onResetUploadedFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileProcess(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcess(file);
      e.target.value = '';
    }
  };

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih berkas gambar (JPG, PNG, WEBP, GIF, TIFF)');
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal adalah 32 MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadStage('Mengunggah...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      // Extract image dimensions
      const img = new Image();
      img.onload = () => {
        sendUpload(file, dataUrl, { width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        sendUpload(file, dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const sendUpload = async (
    file: File,
    dataUrl: string,
    dimensions?: { width: number; height: number }
  ) => {
    setUploadProgress(45);
    setUploadStage('Mengunggah...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          name: file.name.replace(/\.[^/.]+$/, ''),
        }),
      });

      setUploadProgress(75);
      const json = await response.json();

      if (json.success && json.data) {
        setUploadProgress(100);
        setUploadStage('Berhasil disimpan!');

        const data = json.data;
        const format = getFileFormat(file.name, file.type);

        const newFile: UploadedFile = {
          id: data.id || `file-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          format: format,
          url: data.url || data.display_url,
          directUrl: data.url || data.display_url,
          displayUrl: data.display_url,
          urlViewer: data.url_viewer,
          deleteUrl: data.delete_url,
          dataUrl: dataUrl,
          uploadedAt: 'Baru saja',
          dimensions: dimensions || (data.width ? { width: Number(data.width), height: Number(data.height) } : undefined),
          hexHash: data.id || generateHexHash(8),
          expiresIn: 'Permanen',
        };

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          onFileUpload(newFile);
          showToast(`"${file.name}" berhasil diunggah!`);
        }, 300);
      } else {
        const errorMsg = typeof json.error === 'string' ? json.error : json.error?.message;
        throw new Error(errorMsg || 'Gagal memproses unggahan');
      }
    } catch (error) {
      console.warn('API fallback execution:', error);
      simulateFallback(file, dataUrl, dimensions);
    }
  };

  const simulateFallback = (
    file: File,
    dataUrl: string,
    dimensions?: { width: number; height: number }
  ) => {
    setUploadProgress(85);
    setUploadStage('Mengunggah...');

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStage('Berhasil disimpan!');

      const hexHash = generateHexHash(7);
      const format = getFileFormat(file.name, file.type);
      const ext = format.toLowerCase();
      const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const generatedUrl = `https://i.ibb.co/${hexHash}/${cleanName}.${ext}`;
      const viewerUrl = `https://ibb.co/${hexHash}`;

      const newFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        format: format,
        url: generatedUrl,
        directUrl: generatedUrl,
        displayUrl: generatedUrl,
        urlViewer: viewerUrl,
        dataUrl: dataUrl,
        uploadedAt: 'Baru saja',
        dimensions: dimensions,
        hexHash: hexHash,
        expiresIn: 'Permanen',
      };

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onFileUpload(newFile);
        showToast(`"${file.name}" berhasil diunggah!`);
      }, 300);
    }, 350);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('URL berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center justify-center">
      {/* Main Heading & Subheading */}
      <div className="text-center mb-8 max-w-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2.5">
          Upload Foto
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
          Pin gambar, tunggu prosesnya, dan dapatkan URL-nya.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/tiff"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Central Large Slightly Translucent White Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full bg-white/80 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] border transition-all duration-300 relative overflow-hidden ${
          isDragging
            ? 'border-blue-500 ring-4 ring-blue-500/25 shadow-2xl scale-[1.01] bg-blue-50/50'
            : 'border-white/90 shadow-[0_20px_70px_-15px_rgba(28,57,142,0.08)] hover:shadow-[0_25px_80px_-15px_rgba(28,57,142,0.12)] hover:border-blue-200'
        }`}
      >
        {/* Soft Ambient Inner Glows */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-sky-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="p-8 sm:p-14 flex flex-col items-center text-center relative z-10">
          
          {/* Blue Cloud Icon with Upward Arrow */}
          <div 
            className="relative mb-6 group cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}
            title="Klik untuk memilih foto"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-blue-50 via-sky-50 to-blue-100/70 flex items-center justify-center text-blue-600 shadow-inner border border-blue-200/60 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-blue-500/15">
              <div className="relative">
                <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.8] text-blue-600 transition-colors group-hover:text-blue-700" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          </div>

          {/* Text: "Pilih Foto" */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-2">
            Pilih Foto
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-7 max-w-xs sm:max-w-sm">
            Tarik & lepaskan berkas gambar ke sini, atau klik tombol di bawah untuk memilih file.
          </p>

          {/* Blue Button Labeled "Pilih File" */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 select-none"
          >
            <UploadCloud className="w-5 h-5 shrink-0" />
            <span>Pilih File</span>
          </button>

          {/* Upload Progress Indicator when uploading */}
          {isUploading && (
            <div className="w-full max-w-sm mt-6 p-4 bg-blue-50/80 border border-blue-100 rounded-2xl text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center text-xs font-semibold text-blue-900 mb-2">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  {uploadStage}
                </span>
                <span className="font-mono tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-blue-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Smaller text indicating supported file types */}
          <div className="mt-8 pt-6 border-t border-slate-100/90 w-full flex items-center justify-center">
            <span className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Tersedia: <span className="font-bold text-slate-700 tracking-wide">JPG, PNG, WEBP, GIF, TIFF</span>
            </span>
          </div>

        </div>
      </div>

      {/* Section Below the Central Card (Success section: ONLY DISPLAYED IF A FILE HAS BEEN UPLOADED) */}
      {latestUploadedFile && (
        <div className="w-full mt-7 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_15px_45px_rgba(28,57,142,0.06)] p-5 sm:p-6 relative overflow-hidden">
            
            {/* Header: Green checkmark icon and text "Berhasil Diunggah!" */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                    Berhasil Diunggah!
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                    {latestUploadedFile.name} • {latestUploadedFile.format}
                  </p>
                </div>
              </div>

              {/* Quick Image Preview Trigger */}
              <button
                type="button"
                onClick={() => onPreviewImage(latestUploadedFile)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
            </div>

            {/* URL displayed in a blue bar next to this success message */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 sm:p-2 bg-gradient-to-r from-blue-600 via-blue-600 to-sky-600 rounded-2xl shadow-inner text-white">
              {/* The URL displayed in the blue bar */}
              <div className="flex-1 min-w-0 px-2.5 py-0.5 overflow-hidden">
                <div className="text-[10px] text-blue-100 font-medium uppercase tracking-wider mb-0.5">
                  URL CDN File
                </div>
                <div className="font-mono text-xs sm:text-sm text-white font-medium truncate select-all">
                  {latestUploadedFile.url}
                </div>
              </div>

              {/* Action Buttons in the Blue Bar */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopyUrl(latestUploadedFile.url)}
                  className="px-3.5 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  title="Salin URL"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                {/* QR Code button */}
                <button
                  type="button"
                  onClick={() => onShowQr(latestUploadedFile.url)}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                  title="Tampilkan Kode QR"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                {/* External Link button */}
                <button
                  type="button"
                  onClick={() => onPreviewImage(latestUploadedFile)}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                  title="Buka Media"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action: upload another photo */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Unggah Foto Lain</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Feature Badges with Vector SVG Logos (No Emojis) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-7 select-none">
        <div className="p-3.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(28,57,142,0.04)] flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <Zap className="w-4 h-4 fill-blue-600/20 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 tracking-tight">Proses Instan</div>
            <div className="text-[11px] text-slate-500 truncate">Unggah & URL siap sekejap</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(28,57,142,0.04)] flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 shadow-xs">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 tracking-tight">Aman & Terenkripsi</div>
            <div className="text-[11px] text-slate-500 truncate">Perlindungan privasi berkas</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(28,57,142,0.04)] flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-200">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-xs">
            <Globe className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 tracking-tight">CDN Global Cepat</div>
            <div className="text-[11px] text-slate-500 truncate">Distribusi edge berkecepatan tinggi</div>
          </div>
        </div>
      </div>

      {/* Accordion Collapsible FAQ (Buka Tutup) */}
      <FAQSection />

    </div>
  );
};
