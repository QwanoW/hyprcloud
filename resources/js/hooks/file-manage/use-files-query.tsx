import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fileApi } from '@/services/fileApi';
import { TFile } from '@/types';
import { useMemo, useState } from 'react';

type FileType = 'all' | 'gallery' | 'trash';

interface UseFilesOptions {
  page?: number;
  per_page?: number;
  sort?: string;
  direction?: string;
  enabled?: boolean;
  type?: FileType;
}

interface UseInfiniteFilesOptions {
  per_page?: number;
  sort?: string;
  direction?: string;
  enabled?: boolean;
  type?: FileType;
}

// Unified hook for regular paginated files
export function useFilesQuery(options: UseFilesOptions = {}) {
  const { page = 1, per_page = 20, sort = 'date', direction = 'desc', enabled = true, type = 'all' } = options;

  return useQuery({
    queryKey: ['files', type, { page, per_page, sort, direction }],
    queryFn: () => fileApi.getFiles({ page, per_page, sort, direction, type }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Unified hook for infinite scroll files
export function useInfiniteFilesQuery(options: UseInfiniteFilesOptions = {}) {
  const { per_page = 20, sort = 'date', direction = 'desc', enabled = true, type = 'all' } = options;

  return useInfiniteQuery({
    queryKey: ['files', type, 'infinite', { per_page, sort, direction }],
    queryFn: ({ pageParam = 1 }) => 
      fileApi.getFiles({ page: pageParam, per_page, sort, direction, type }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Legacy hooks for backward compatibility (deprecated - use useFilesQuery and useInfiniteFilesQuery with type parameter)
export function useGalleryQuery(options: UseFilesOptions = {}) {
  return useFilesQuery({ ...options, type: 'gallery' });
}

export function useInfiniteGalleryQuery(options: UseInfiniteFilesOptions = {}) {
  return useInfiniteFilesQuery({ ...options, type: 'gallery' });
}

export function useTrashQuery(options: UseFilesOptions = {}) {
  return useFilesQuery({ ...options, type: 'trash' });
}

export function useInfiniteTrashQuery(options: UseInfiniteFilesOptions = {}) {
  return useInfiniteFilesQuery({ ...options, type: 'trash' });
}

// Hook for file search
export function useFileSearchQuery(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['files', 'search', query],
    queryFn: () => fileApi.searchFiles(query),
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