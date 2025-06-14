import axios from 'axios';
import { FileType } from '@/types';

export interface FileManagerItem {
  id: number;
  name: string;
  type: FileType;
  size: number;
  path: string;
  url: string;
  user_id: number;
  collection_id?: number;
  parent_folder_id?: number;
  shared: boolean;
  shared_url: string | null;
  trash: boolean;
  created_at: string;
  updated_at: string;
  children?: FileManagerItem[];
}

export interface FileManagerCreateFolderRequest {
  name: string;
  collection_id?: string;
  parent_folder_id?: string;
}

export interface FileManagerIndexParams {
  collection_id?: number | null;
  parent_folder_id?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  type?: 'all' | 'gallery' | 'trash' | 'shared';
}

export interface FileManagerIndexResponse {
  data: FileManagerItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const fileManagerApi = {
  index: async (params: FileManagerIndexParams = {}): Promise<FileManagerIndexResponse> => {
    const response = await axios.get('/api/file-manager', { params });
    return response.data;
  },

  getTree: async (): Promise<FileManagerItem[]> => {
    const response = await axios.get('/api/file-manager/tree');
    return response.data;
  },

  createFolder: async (data: FileManagerCreateFolderRequest): Promise<FileManagerItem> => {
    const response = await axios.post('/api/file-manager/folders', data);
    return response.data;
  },

  move: async (id: number, data: { parent_folder_id?: number; collection_id?: number | null }): Promise<FileManagerItem> => {
    const response = await axios.put(`/api/file-manager/${id}/move`, data);
    return response.data;
  },

  updateName: async (id: number, data: { name: string }): Promise<FileManagerItem> => {
    const response = await axios.put(`/api/file-manager/${id}/name`, data);
    return response.data;
  },

  destroy: async (id: number): Promise<void> => {
    await axios.delete(`/api/file-manager/${id}`);
  },

  search: async (query: string): Promise<{data: FileManagerItem[]}> => {
    const response = await axios.get('/api/files/search', { params: { q: query } });
    return response.data;
  },
};