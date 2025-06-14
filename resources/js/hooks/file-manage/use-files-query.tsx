import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fileManagerApi } from '@/services/fileManagerApi';
import { TFile } from '@/types';
import { useMemo, useState } from 'react';
type FileType = 'all' | 'gallery' | 'trash' | 'shared';

interface UseFilesOptions {
  page?: number;
  per_page?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  enabled?: boolean;
  type?: FileType;
  collection_id?: number;
  folder_id?: number;
}

interface UseInfiniteFilesOptions {
  per_page?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  enabled?: boolean;
  type?: FileType;
  collection_id?: number;
  folder_id?: number;
}

// Unified hook for regular paginated files
export function useFilesQuery(options: UseFilesOptions = {}) {
  const { page = 1, per_page = 20, sort = 'date', direction = 'desc', enabled = true, type = 'all', collection_id, folder_id } = options;

  return useQuery({
    queryKey: ['files', type, { page, per_page, sort, direction, collection_id, folder_id }],
    queryFn: () => fileManagerApi.index({ page, per_page, sort_by: sort, sort_direction: direction, collection_id, parent_folder_id: folder_id, type }),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Unified hook for infinite scroll files
export function useInfiniteFilesQuery(options: UseInfiniteFilesOptions = {}) {
  const { per_page = 20, sort = 'date', direction = 'desc', enabled = true, type = 'all', collection_id, folder_id } = options;

  return useInfiniteQuery({
    queryKey: ['files', type, 'infinite', { per_page, sort, direction, collection_id, folder_id }],
    queryFn: ({ pageParam = 1 }) => 
      fileManagerApi.index({ page: pageParam, per_page, sort_by: sort, sort_direction: direction, collection_id, parent_folder_id: folder_id, type }),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook for file search
export function useFileSearchQuery(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['files', 'search', query],
    queryFn: async () => {
      const response = await fileManagerApi.search(query);
      return response.data; // Assuming the actual file list is nested under 'data'
    },
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
}

// Utility hook to get all files from infinite query with memoization
export function useAllFilesFromInfinite(infiniteQuery: ReturnType<typeof useInfiniteFilesQuery>) {
  return useMemo(() => {
    const allFiles: TFile[] = [];
    
    if (infiniteQuery.data) {
      infiniteQuery.data.pages.forEach(page => {
        allFiles.push(...page.data);
      });
    }
    
    return allFiles;
  }, [infiniteQuery.data]);
}

// Hook for managing sort state
export function useFilesSort() {
  const [sortOptions, setSortOptions] = useState({
    sort: 'date',
    direction: 'desc' as 'asc' | 'desc'
  });

  const updateSort = (sort: string) => {
    setSortOptions(prev => ({
      sort,
      direction: prev.sort === sort && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return {
    sortOptions,
    updateSort
  };
}