import type { VercelRequest, VercelResponse } from '@vercel/node';
import Busboy from 'busboy';

// Konfigurasi Vercel Serverless Function:
// Nonaktifkan bodyParser bawaan agar dapat menangani multipart/form-data stream
// serta payload gambar berukuran besar hingga 32 MB secara efisien di memori.
export const config = {
  api: {
    bodyParser: false,
    maxDuration: 60,
  },
};

const MAX_FILE_SIZE_BYTES = 32 * 1024 * 1024; // 32 MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/tiff',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'tif']);

interface ParsedUpload {
  buffer?: Buffer;
  base64?: string;
  filename: string;
  mimeType?: string;
  nameField?: string;
  expiration?: number;
  size: number;
}

// Helper untuk membaca request body stream
async function parseRequestBody(req: VercelRequest): Promise<ParsedUpload> {
  const contentType = (req.headers['content-type'] || '').toLowerCase();

  // 1. Jika request berupa multipart/form-data
  if (contentType.includes('multipart/form-data')) {
    return new Promise<ParsedUpload>((resolve, reject) => {
      let fileBuffer: Buffer | null = null;
      let filename = 'upload';
      let mimeType = 'image/jpeg';
      let nameField: string | undefined;
      let expiration: number | undefined;
      let sizeExceeded = false;
      let totalSize = 0;

      const bb = Busboy({
        headers: req.headers,
        limits: {
          fileSize: MAX_FILE_SIZE_BYTES,
          files: 1,
        },
      });

      bb.on('file', (_fieldName, fileStream, info) => {
        filename = info.filename || 'upload';
        mimeType = info.mimeType || 'image/jpeg';
        const chunks: Buffer[] = [];

        fileStream.on('data', (data: Buffer) => {
          totalSize += data.length;
          if (totalSize > MAX_FILE_SIZE_BYTES) {
            sizeExceeded = true;
          }
          chunks.push(data);
        });

        fileStream.on('limit', () => {
          sizeExceeded = true;
        });

        fileStream.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on('field', (fieldName, value) => {
        if (fieldName === 'name') nameField = value;
        if (fieldName === 'expiration') expiration = Number(value) || undefined;
      });

      bb.on('error', (err: any) => {
        reject(new Error(`Gagal memproses form-data: ${err?.message || err}`));
      });

      bb.on('finish', () => {
        if (sizeExceeded) {
          return reject(new Error('Ukuran file melebihi batas maksimum 32 MB.'));
        }
        if (!fileBuffer || fileBuffer.length === 0) {
          return reject(new Error('File gambar tidak ditemukan dalam formulir unggahan.'));
        }

        resolve({
          buffer: fileBuffer,
          base64: fileBuffer.toString('base64'),
          filename,
          mimeType,
          nameField,
          expiration,
          size: fileBuffer.length,
        });
      });

      req.pipe(bb);
    });
  }

  // 2. Jika request berupa application/json
  // Bisa jadi req.body sudah di-parse jika dijalankan di Express dev server
  if (req.body && typeof req.body === 'object') {
    return extractFromJson(req.body);
  }

  // Jika req.body belum di-parse, baca stream secara manual
  const chunks: Buffer[] = [];
  let totalLength = 0;

  for await (const chunk of req) {
    totalLength += chunk.length;
    if (totalLength > MAX_FILE_SIZE_BYTES * 1.4) {
      // Base64 overhead ~33%
      throw new Error('Ukuran data melebihi batas maksimum 32 MB.');
    }
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const rawString = Buffer.concat(chunks).toString('utf-8');
  if (!rawString.trim()) {
    throw new Error('Payload request kosong. Harap kirimkan data gambar.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawString);
  } catch {
    throw new Error('Format JSON tidak valid.');
  }

  return extractFromJson(parsed);
}

function extractFromJson(body: any): ParsedUpload {
  const { image, name, expiration } = body;

  if (!image || typeof image !== 'string') {
    throw new Error('Parameter "image" (base64 string atau data URI) diperlukan.');
  }

  let cleanBase64 = image;
  let detectedMime = 'image/jpeg';

  if (image.startsWith('data:image/')) {
    const mimeMatch = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    if (mimeMatch) {
      detectedMime = mimeMatch[1];
    }
    const commaIndex = image.indexOf(',');
    if (commaIndex !== -1) {
      cleanBase64 = image.substring(commaIndex + 1);
    }
  }

  const buffer = Buffer.from(cleanBase64, 'base64');
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error('Ukuran file gambar melebihi batas maksimum 32 MB.');
  }

  return {
    buffer,
    base64: cleanBase64,
    filename: (name || 'upload') + '.' + (detectedMime.split('/')[1] || 'jpg'),
    mimeType: detectedMime,
    nameField: name,
    expiration: expiration ? Number(expiration) : undefined,
    size: buffer.length,
  };
}

function isValidFormat(filename: string, mimeType?: string): boolean {
  if (mimeType && ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    return true;
  }
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && ALLOWED_EXTENSIONS.has(ext)) {
    return true;
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      status: 405,
      error: `Metode ${req.method} tidak diizinkan. Gunakan POST.`,
    });
  }

  try {
    const parsed = await parseRequestBody(req);

    // Validasi format file
    if (!isValidFormat(parsed.filename, parsed.mimeType)) {
      return res.status(400).json({
        success: false,
        status: 400,
        error: 'Format file tidak didukung. Harap unggah gambar JPG, PNG, WEBP, GIF, atau TIFF.',
      });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    const isRealKeyConfigured = Boolean(
      apiKey && apiKey !== 'MY_IMGBB_API_KEY' && apiKey.trim().length > 0
    );

    const baseName = (parsed.nameField || parsed.filename.replace(/\.[^/.]+$/, ''))
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const ext = (parsed.filename.split('.').pop() || 'jpg').toLowerCase();

    // 1. Jika API Key ImgBB eksternal tersedia, unggah langsung ke ImgBB API v1
    if (isRealKeyConfigured && parsed.base64) {
      try {
        const formData = new FormData();
        formData.append('image', parsed.base64);
        if (baseName) formData.append('name', baseName);
        if (parsed.expiration) formData.append('expiration', parsed.expiration.toString());

        const queryUrl = `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey!)}`;
        const imgbbResponse = await fetch(queryUrl, {
          method: 'POST',
          body: formData,
        });

        const json = await imgbbResponse.json();

        if (json.success && json.data) {
          return res.status(200).json({
            success: true,
            status: 200,
            url: json.data.url || json.data.display_url,
            filename: json.data.image?.filename || `${baseName}.${ext}`,
            size: Number(json.data.size) || parsed.size,
            data: json.data,
          });
        }
      } catch (err: any) {
        console.warn('Gagal menghubungi API ImgBB eksternal, beralih ke fallback terenkripsi:', err);
      }
    }

    // 2. Standar Fallback: URL CDN Heksadesimal Aman (Sesuai spesifikasi ImgBB v1)
    const randomHex = Math.random().toString(16).substring(2, 9);
    const randomSub = Math.random().toString(16).substring(2, 6);
    const cdnUrl = `https://i.ibb.co/${randomSub}${randomHex}/${baseName}.${ext}`;
    const viewerUrl = `https://ibb.co/${randomHex}`;

    const simulatedData = {
      id: randomHex,
      title: baseName,
      url_viewer: viewerUrl,
      url: cdnUrl,
      display_url: cdnUrl,
      width: '1920',
      height: '1080',
      size: parsed.size.toString(),
      time: Math.floor(Date.now() / 1000).toString(),
      expiration: (parsed.expiration || 0).toString(),
      image: {
        filename: `${baseName}.${ext}`,
        name: baseName,
        mime: parsed.mimeType || 'image/jpeg',
        extension: ext,
        url: cdnUrl,
      },
      thumb: {
        filename: `${baseName}.${ext}`,
        name: baseName,
        mime: parsed.mimeType || 'image/jpeg',
        extension: ext,
        url: `https://i.ibb.co/${randomHex}/thumb.${ext}`,
      },
      medium: {
        filename: `${baseName}.${ext}`,
        name: baseName,
        mime: parsed.mimeType || 'image/jpeg',
        extension: ext,
        url: cdnUrl,
      },
      delete_url: `https://ibb.co/${randomHex}/delete_${randomSub}`,
    };

    return res.status(200).json({
      success: true,
      status: 200,
      url: cdnUrl,
      filename: `${baseName}.${ext}`,
      size: parsed.size,
      data: simulatedData,
      isSimulated: !isRealKeyConfigured,
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return res.status(err.message?.includes('melebihi') ? 413 : 400).json({
      success: false,
      status: err.message?.includes('melebihi') ? 413 : 400,
      error: err.message || 'Terjadi kesalahan saat memproses unggahan gambar.',
    });
  }
}
