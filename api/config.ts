import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Hanya menerima metode GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      error: `Metode ${req.method} tidak diizinkan. Gunakan GET.`,
    });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  const hasImgbbKey = Boolean(apiKey && apiKey !== 'MY_IMGBB_API_KEY' && apiKey.trim().length > 0);

  return res.status(200).json({
    success: true,
    hasImgbbKey,
    provider: 'ImgBB API v1',
    maxFileSizeMb: 32,
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'TIFF'],
  });
}
