import axios from 'axios';
import { TFile } from '@/types';

interface FileResponse {
  data: TFile[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

interface FileUploadResponse {
  message: string;
  files: TFile[];
}

interface FileUpdateResponse {
  message: string;
  file: TFile;
}

interface FileActionResponse {
  message: string;
}

interface SearchResponse {
  data: TFile[];
}

interface DownloadZipResponse {
  download_url: string;
}

export const fileApi = {
  // Unified method to get files with different filters
  getFiles: async (params?: {
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: string;
    type?: 'all' | 'gallery' | 'trash';
  }): Promise<FileResponse> => {
    const { type = 'all', ...otherParams } = params || {};
    
    let endpoint = '/api/files';
    if (type === 'gallery') {
      endpoint = '/api/files/gallery';
    } else if (type === 'trash') {
      endpoint = '/api/files/trash';
    }
    
    const response = await axios.get(endpoint, { params: otherParams });
    return response.data;
  },

  // Legacy methods for backward compatibility (deprecated)
  getGalleryFiles: async (params?: {
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: string;
  }): Promise<FileResponse> => {
    return fileApi.getFiles({ ...params, type: 'gallery' });
  },

  getTrashFiles: async (params?: {
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: string;
  }): Promise<FileResponse> => {
    return fileApi.getFiles({ ...params, type: 'trash' });
  },

  // Upload files
  uploadFiles: async (files: File[]): Promise<FileUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });

    const response = await axios.post('/api/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update file
  updateFile: async (id: number, data: {
    name?: string;
    shared?: boolean;
    trash?: boolean;
    file?: File;
  }): Promise<FileUpdateResponse> => {
    const formData = new FormData();
    
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.shared !== undefined) formData.append('shared', data.shared.toString());
    if (data.trash !== undefined) formData.append('trash', data.trash.toString());
    if (data.file) formData.append('file', data.file);

    // Add _method for Laravel to handle PUT request with FormData
    formData.append('_method', 'PUT');

    const response = await axios.post(`/api/files/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete single file
  deleteFile: async (id: number): Promise<FileActionResponse> => {
    const response = await axios.delete(`/api/files/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkDelete: async (ids: number[]): Promise<FileActionResponse> => {
    const response = await axios.post('/api/files/bulk-delete', { ids });
    return response.data;
  },

  bulkDeletePermanently: async (ids: number[]): Promise<FileActionResponse> => {
    const response = await axios.post('/api/files/bulk-delete-permanently', { ids });
    return response.data;
  },

  bulkRestore: async (ids: number[]): Promise<FileActionResponse> => {
    const response = await axios.post('/api/files/bulk-restore', { ids });
    return response.data;
  },

  // Search files
  searchFiles: async (query: string): Promise<SearchResponse> => {
    const response = await axios.post('/api/files/search', { q: query });
    return response.data;
  },

  // Download zip
  downloadZip: async (ids: number[]): Promise<DownloadZipResponse> => {
    const response = await axios.post('/api/files/download-zip', { ids });
    return response.data;
  },
};