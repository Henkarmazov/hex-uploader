import React, { useState, useMemo } from 'react';
import { UploadedFile } from '../types';
import { formatBytes } from '../utils/helpers';
import { 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  Download, 
  ExternalLink, 
  FileText, 
  Filter,
  DownloadCloud,
  RefreshCw,
  Plus
} from 'lucide-react';

interface LogFilesViewProps {
  files: UploadedFile[];
  onDeleteFile: (id: string) => void;
  onClearAll: () => void;
  onPreviewImage: (file: UploadedFile) => void;
  onNavigateUpload: () => void;
  showToast: (msg: string) => void;
}

export const LogFilesView: React.FC<LogFilesViewProps> = ({
  files,
  onDeleteFile,
  onClearAll,
  onPreviewImage,
  onNavigateUpload,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.hexHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.url.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFormat = selectedFormat === 'ALL' || f.format === selectedFormat;
      return matchesSearch && matchesFormat;
    });
  }, [files, searchQuery, selectedFormat]);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('URL berhasil disalin!');
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(files, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hex-uploader-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Log file berhasil diekspor ke JSON!');
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", file.dataUrl);
    downloadAnchor.setAttribute("download", file.name);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Mengunduh "${file.name}"`);
  };

  const formats = ['ALL', 'JPG', 'PNG', 'WEBP', 'GIF', 'TIFF'];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Log Files
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Riwayat unggahan berkas gambar dan tautan URL yang telah dibuat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {files.length > 0 && (
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4 text-blue-600" />
              <span>Ekspor JSON</span>
            </button>
          )}

          <button
            onClick={onNavigateUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Baru</span>
          </button>
        </div>
      </div>

      {/* Search and Format Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-sky-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau hex hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Format tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Format:</span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFormat === fmt
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {fmt === 'ALL' ? 'Semua' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Files List / Table */}
      {filteredFiles.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-sky-100 p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <FileText className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {searchQuery ? 'Tidak ada file yang cocok' : 'Belum ada file yang diunggah'}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            {searchQuery 
              ? `Pencarian "${searchQuery}" tidak menemukan hasil. Coba kata kunci lain.` 
              : 'Unggah gambar pertama Anda untuk melihat riwayat log dan tautan CDN di sini.'}
          </p>
          <button
            onClick={onNavigateUpload}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Unggah Foto</span>
          </button>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-sky-100 shadow-[0_10px_35px_rgba(28,57,142,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Gambar & Nama File</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4 text-right">Ukuran</th>
                  <th className="py-3.5 px-4">Hex Hash</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Waktu</th>
                  <th className="py-3.5 px-4">URL CDN</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* Thumbnail & File Name */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => onPreviewImage(file)}
                          className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 cursor-pointer relative group/img shadow-xs"
                        >
                          <img
                            src={file.dataUrl}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="min-w-0 max-w-[180px] sm:max-w-[240px]">
                          <div 
                            onClick={() => onPreviewImage(file)}
                            className="font-semibold text-slate-900 truncate hover:text-blue-600 transition-colors cursor-pointer"
                            title={file.name}
                          >
                            {file.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {file.dimensions ? `${file.dimensions.width}×${file.dimensions.height}px` : 'Raster'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Format Badge */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-sky-100/70 text-sky-800 border border-sky-200/50">
                        {file.format}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums text-slate-600">
                      {formatBytes(file.size)}
                    </td>

                    {/* Hex Hash */}
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-600 font-medium">
                      #{file.hexHash}
                    </td>

                    {/* Upload Time */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500">
                      {file.uploadedAt}
                    </td>

                    {/* CDN URL */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 max-w-[150px] sm:max-w-[190px]">
                        <span className="font-mono text-xs text-slate-600 truncate select-all">
                          {file.url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(file.id, file.url)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                          title="Salin URL"
                        >
                          {copiedId === file.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onPreviewImage(file)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Pratinjau"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Unduh File"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="py-3.5 px-6 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Menampilkan <span className="font-semibold text-slate-700">{filteredFiles.length}</span> dari{' '}
              <span className="font-semibold text-slate-700">{files.length}</span> file
            </span>

            {files.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer hover:underline"
              >
                Hapus Semua Riwayat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
