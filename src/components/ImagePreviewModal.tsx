import React, { useState } from 'react';
import { UploadedFile } from '../types';
import { formatBytes } from '../utils/helpers';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Code, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface ImagePreviewModalProps {
  file: UploadedFile | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  file,
  onClose,
  showToast,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!file) return null;

  const handleCopy = (text: string, type: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`${label} disalin!`);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = file.dataUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Mengunduh "${file.name}"`);
  };

  const htmlSnippet = `<img src="${file.url}" alt="${file.name}" />`;
  const markdownSnippet = `![${file.name}](${file.url})`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl border border-sky-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="min-w-0 pr-4">
            <h3 className="text-base font-bold text-slate-900 truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {file.format} • {formatBytes(file.size)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Image Preview Area */}
        <div className="flex-1 bg-slate-950/95 flex items-center justify-center p-6 min-h-[280px] max-h-[460px] overflow-hidden relative">
          <img
            src={file.dataUrl}
            alt={file.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg select-none"
            referrerPolicy="no-referrer"
          />
          {file.dimensions && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
              {file.dimensions.width} × {file.dimensions.height} px
            </div>
          )}
        </div>

        {/* Modal Footer: Quick Links & Embed Snippets */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-4">
          {/* CDN URL Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-slate-200 px-3.5 py-2 rounded-xl font-mono text-xs sm:text-sm text-slate-700 truncate select-all">
              {file.url}
            </div>
            <button
              onClick={() => handleCopy(file.url, 'url', 'URL CDN')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedType === 'url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedType === 'url' ? 'Tersalin' : 'Salin URL'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Unduh Berkas Asli"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Code Snippets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* HTML */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tag HTML</span>
                <span className="font-mono text-slate-700 text-[11px] truncate block">{htmlSnippet}</span>
              </div>
              <button
                onClick={() => handleCopy(htmlSnippet, 'html', 'Kode HTML')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer shrink-0"
              >
                {copiedType === 'html' ? 'Tersalin' : 'Salin'}
              </button>
            </div>

            {/* Markdown */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Markdown</span>
                <span className="font-mono text-slate-700 text-[11px] truncate block">{markdownSnippet}</span>
              </div>
              <button
                onClick={() => handleCopy(markdownSnippet, 'markdown', 'Kode Markdown')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer shrink-0"
              >
                {copiedType === 'markdown' ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
