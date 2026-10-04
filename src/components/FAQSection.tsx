import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'format',
    question: 'Format gambar apa saja yang didukung?',
    answer:
      'Hex-Uploader mendukung berkas gambar berformat JPG, JPEG, PNG, WEBP, GIF, dan TIFF dengan batas maksimal ukuran berkas hingga 32 MB.',
  },
  {
    id: 'permanence',
    question: 'Apakah tautan gambar yang dihasilkan bersifat permanen?',
    answer:
      'Ya, tautan langsung (Direct CDN URL) yang dihasilkan dapat diakses secara permanen kapan saja tanpa tanggal kedaluwarsa.',
  },
  {
    id: 'sharing',
    question: 'Bagaimana cara membagikan gambar yang sudah diunggah?',
    answer:
      'Setelah proses unggah selesai, cukup klik tombol "Salin" untuk menyalin tautan gambar ke clipboard Anda, atau klik ikon "Kode QR" untuk memindainya langsung dari ponsel atau perangkat lain.',
  },
  {
    id: 'security',
    question: 'Apakah gambar yang diunggah aman dan terjaga privasinya?',
    answer:
      'Setiap gambar diproses melalui transmisi aman dan diberikan ID heksadesimal unik. Hanya pihak yang memiliki tautan spesifik tersebut yang dapat mengakses berkas gambar Anda.',
  },
  {
    id: 'limits',
    question: 'Apakah ada batasan jumlah unggahan per hari?',
    answer:
      'Tidak ada batasan harian. Anda dapat mengunggah gambar sebanyak yang diperlukan secara instan dan tanpa biaya.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full mt-10">
      {/* FAQ Header */}
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shrink-0">
          <HelpCircle className="w-4 h-4 stroke-[2.2]" />
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">
          Pertanyaan Umum (FAQ)
        </h3>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {FAQS.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white/90 border-blue-200 shadow-sm'
                  : 'bg-white/70 hover:bg-white/85 border-white/90 shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  {faq.question}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? 'rotate-180 bg-blue-50 text-blue-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-4.5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="pt-2 border-t border-slate-100 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
