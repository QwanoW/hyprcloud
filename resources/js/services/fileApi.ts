import axios from 'axios';
import { SharedLink, TFile } from '@/types';

export interface FileResponse {
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
    collection_id?: number;
    folder_id?: number;
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

  // Upload files
  uploadFiles: async (files: File[], collectionId?: number, parentFolderId?: number): Promise<FileUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    
    if (collectionId) {
      formData.append('collection_id', collectionId.toString());
    }
    
    if (parentFolderId) {
      formData.append('parent_folder_id', parentFolderId.toString());
    }

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
    trash?: boolean;
    file?: File;
  }): Promise<FileUpdateResponse> => {
    const formData = new FormData();
    
    if (data.name !== undefined) formData.append('name', data.name);
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

  // Shared links
  createSharedLink: async (data: {
    file_id: number;
    password?: string;
    expires_at?: string;
    allow_download?: boolean;
  }) => {
    const response = await axios.post('/api/shared-links', data);
    return response.data;
  },

  updateSharedLink: async (id: number, data: {
    password?: string;
    expires_at?: string;
    allow_download?: boolean;
    is_active?: boolean;
  }) => {
    const response = await axios.put(`/api/shared-links/${id}`, data);
    return response.data;
  },

  deleteSharedLink: async (id: number) => {
    const response = await axios.delete(`/api/shared-links/${id}`);
    return response.data;
  },

  getFileSharedLinks: async (fileId: number) => {
    const response = await axios.get<{shared_links: SharedLink[]}>(`/api/files/${fileId}/shared-links`);
    return response.data.shared_links;
  },

  getUserSharedLinks: async () => {
    const response = await axios.get('/api/user/shared-links');
    return response.data.shared_links;
  },
};