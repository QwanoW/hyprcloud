import axios from 'axios';
import { TFile } from '@/types';

export interface Folder {
  id: number;
  name: string;
  user_id: number;
  collection_id?: number;
  parent_folder_id?: number;
  created_at: string;
  updated_at: string;
  files?: TFile[];
  subfolders?: Folder[];
  all_subfolders?: Folder[];
  collection?: {
    id: number;
    name: string;
    icon: string;
  };
  parent_folder?: {
    id: number;
    name: string;
  };
}

export interface FolderResponse {
  data: Folder[];
}

export interface FolderCreateRequest {
  name: string;
  collection_id?: number;
  parent_folder_id?: number;
}

export interface FolderUpdateRequest {
  name: string;
}

export const folderApi = {
  // Get folders with optional filtering
  getFolders: async (params?: {
    collection_id?: number;
    parent_folder_id?: number;
  }): Promise<FolderResponse> => {
    const response = await axios.get('/api/folders', { params });
    return response.data;
  },

  // Get folder tree for move operations
  getFolderTree: async (): Promise<FolderResponse> => {
    const response = await axios.get('/api/folders/tree');
    return response.data;
  },

  // Get a specific folder with its contents
  getFolder: async (id: number): Promise<Folder> => {
    const response = await axios.get(`/api/folders/${id}`);
    return response.data;
  },

  // Create a new folder
  createFolder: async (data: FolderCreateRequest): Promise<Folder> => {
    const response = await axios.post('/api/folders', data);
    return response.data;
  },

  // Update a folder
  updateFolder: async (id: number, data: FolderUpdateRequest): Promise<Folder> => {
    const response = await axios.put(`/api/folders/${id}`, data);
    return response.data;
  },

  // Delete a folder
  deleteFolder: async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/folders/${id}`);
    return response.data;
  },
};