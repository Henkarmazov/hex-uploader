export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  format: 'JPG' | 'PNG' | 'WEBP' | 'GIF' | 'TIFF' | 'OTHER';
  url: string;
  directUrl: string;
  displayUrl?: string;
  urlViewer?: string;
  deleteUrl?: string;
  dataUrl: string;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
  hexHash: string;
  expiresIn?: string;
}

export type InputMode = 'file' | 'camera' | 'url';
export type TabType = 'upload' | 'logs' | 'others';

export interface UploaderSettings {
  hexPrefix: string;
  autoOptimize: boolean;
  quality: number;
  retention: 'permanent' | '7days' | '30days';
  apiToken: string;
}
