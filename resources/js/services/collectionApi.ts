import axios from 'axios';

export interface Collection {
  id: number;
  name: string;
  icon: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  files_count?: number;
  folders_count?: number;
}

export interface CollectionResponse {
  data: Collection[];
}

export interface CollectionCreateRequest {
  name: string;
  icon: string;
}

export interface CollectionUpdateRequest {
  name: string;
  icon?: string;
}

export const collectionApi = {
  // Get all collections for the authenticated user
  getCollections: async (): Promise<CollectionResponse> => {
    const response = await axios.get('/api/collections');
    return response.data;
  },

  // Get recent collections for sidebar
  getRecentCollections: async (): Promise<CollectionResponse> => {
    const response = await axios.get('/api/collections-recent');
    return response.data;
  },

  // Get a specific collection with its files and folders
  getCollection: async (id: number): Promise<Collection> => {
    const response = await axios.get(`/api/collections/${id}`);
    return response.data;
  },

  // Create a new collection
  createCollection: async (data: CollectionCreateRequest): Promise<Collection> => {
    const response = await axios.post('/api/collections', data);
    return response.data;
  },

  // Update a collection
  updateCollection: async (id: number, data: CollectionUpdateRequest): Promise<Collection> => {
    const response = await axios.put(`/api/collections/${id}`, data);
    return response.data;
  },

  // Delete a collection
  deleteCollection: async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`/api/collections/${id}`);
    return response.data;
  },
};