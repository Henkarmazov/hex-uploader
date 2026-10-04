import { UploadedFile } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function generateHexHash(length = 10): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function getFileFormat(filename: string, mimeType: string): UploadedFile['format'] {
  const ext = filename.split('.').pop()?.toUpperCase() || '';
  if (ext === 'JPG' || ext === 'JPEG' || mimeType.includes('jpeg')) return 'JPG';
  if (ext === 'PNG' || mimeType.includes('png')) return 'PNG';
  if (ext === 'WEBP' || mimeType.includes('webp')) return 'WEBP';
  if (ext === 'GIF' || mimeType.includes('gif')) return 'GIF';
  if (ext === 'TIFF' || ext === 'TIF' || mimeType.includes('tiff')) return 'TIFF';
  return 'OTHER';
}

// Generates an inline SVG data URL for a placeholder geometric image with gradient
export function createSvgPlaceholder(name: string, format: string, bgColor1 = '#3b82f6', bgColor2 = '#0284c7'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor1}" />
        <stop offset="100%" stop-color="${bgColor2}" />
      </linearGradient>
      <pattern id="hex" width="40" height="69.282" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
        <path d="M 40 0 L 20 11.547 L 0 0 L 0 23.094 L 20 34.641 L 40 23.094 Z M 0 34.641 L 20 46.188 L 0 57.735 L 0 80.829 L 20 92.376 L 40 80.829 L 40 57.735 L 20 46.188 Z" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <rect width="100%" height="100%" fill="url(#hex)" />
    <circle cx="400" cy="220" r="70" fill="rgba(255,255,255,0.15)" />
    <polygon points="400,165 445,190 445,245 400,270 355,245 355,190" fill="none" stroke="#ffffff" stroke-width="4" />
    <text x="400" y="225" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">HEX</text>
    <text x="400" y="340" font-family="system-ui, sans-serif" font-size="26" font-weight="700" fill="#ffffff" text-anchor="middle">${name}</text>
    <text x="400" y="380" font-family="system-ui, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)" text-anchor="middle">Hex-Uploader Verified • ${format} • 1920 × 1080</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_SEED_FILES: UploadedFile[] = [
  {
    id: 'seed-1',
    name: 'pemandangan-gunung-bromo.webp',
    size: 482910,
    type: 'image/webp',
    format: 'WEBP',
    url: 'https://hex-uploader.io/f/hex_7c2b9a4f.webp',
    directUrl: 'https://hex-uploader.io/f/hex_7c2b9a4f.webp',
    dataUrl: createSvgPlaceholder('Pemandangan Gunung Bromo', 'WEBP', '#0284c7', '#0369a1'),
    uploadedAt: 'Hari ini, 10:24',
    dimensions: { width: 1920, height: 1080 },
    hexHash: '7c2b9a4f',
    expiresIn: 'Permanen',
  },
  {
    id: 'seed-2',
    name: 'banner-promo-ramadan.png',
    size: 1240320,
    type: 'image/png',
    format: 'PNG',
    url: 'https://hex-uploader.io/f/hex_e15d83b0.png',
    directUrl: 'https://hex-uploader.io/f/hex_e15d83b0.png',
    dataUrl: createSvgPlaceholder('Banner Promo Ramadan', 'PNG', '#2563eb', '#1d4ed8'),
    uploadedAt: 'Kemarin, 16:45',
    dimensions: { width: 1200, height: 630 },
    hexHash: 'e15d83b0',
    expiresIn: 'Permanen',
  },
  {
    id: 'seed-3',
    name: 'avatar-profil-pengguna.jpg',
    size: 215400,
    type: 'image/jpeg',
    format: 'JPG',
    url: 'https://hex-uploader.io/f/hex_90af442c.jpg',
    directUrl: 'https://hex-uploader.io/f/hex_90af442c.jpg',
    dataUrl: createSvgPlaceholder('Avatar Profil Pengguna', 'JPG', '#0ea5e9', '#0284c7'),
    uploadedAt: '25 Sep 2026',
    dimensions: { width: 800, height: 800 },
    hexHash: '90af442c',
    expiresIn: 'Permanen',
  },
];
