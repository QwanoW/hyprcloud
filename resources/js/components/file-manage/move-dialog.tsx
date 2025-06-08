import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronDown, Folder, Archive as CollectionIcon } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useQuery } from '@tanstack/react-query';
import { collectionApi } from '@/services/collectionApi';
import { fileManagerApi, FileManagerItem } from '@/services/fileManagerApi';
import { FileType } from '@/types';
import { cn } from '@/lib/utils';

interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedItems: FileManagerItem[];
  onMove: (targetCollectionId?: number, targetFolderId?: number) => void;
  currentCollectionId?: number;
  currentFolderId?: number;
}

interface TreeNode {
  id: number;
  name: string;
  type: 'collection' | 'folder';
  collectionId?: number;
  parentFolderId?: number;
  children?: TreeNode[];
  expanded?: boolean;
  disabled?: boolean;
}

export const MoveDialog = ({
  open,
  onClose,
  selectedItems,
  onMove,
  currentCollectionId,
  currentFolderId
}: MoveDialogProps) => {
  const { t } = useLaravelReactI18n();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedTarget, setSelectedTarget] = useState<{ collectionId?: number; folderId?: number } | null>(null);
  const [loadingFolders, setLoadingFolders] = useState<Set<string>>(new Set());
  const [folderCache, setFolderCache] = useState<Map<string, FileManagerItem[]>>(new Map());

  // Get all collections
  const { data: collectionsData } = useQuery({
    queryKey: ['collections'],
    queryFn: collectionApi.getCollections,
    enabled: open
  });

  // Get root folders for each collection (excluding trashed)
  const { data: rootFoldersData } = useQuery({
    queryKey: ['root-folders'],
    queryFn: async () => {
      if (!collectionsData?.data) return [];
      
      const promises = collectionsData.data.map(async (collection) => {
        const response = await fileManagerApi.index({
          collection_id: collection.id,
          parent_folder_id: undefined,
          type: 'all'
        });
        return {
          collectionId: collection.id,
          folders: response.data.filter(item => item.type === FileType.Folder && !item.trash)
        };
      });
      
      return Promise.all(promises);
    },
    enabled: open && !!collectionsData?.data
  });

  // Get standalone folders (folders not in any collection, excluding trashed)
  const { data: standaloneFoldersData } = useQuery({
    queryKey: ['standalone-folders'],
    queryFn: async () => {
      const response = await fileManagerApi.index({
        parent_folder_id: undefined,
        type: 'all'
      });
      return response.data.filter(item => item.type === FileType.Folder && !item.trash && !item.collection_id);
    },
    enabled: open
  });

  // Check if an item should be disabled (can't move to itself or its children)
  const isItemDisabled = (item: TreeNode): boolean => {
    // If moving folders, disable the folder itself and its potential children
    const selectedFolderIds = selectedItems
      .filter(item => item.type === FileType.Folder)
      .map(item => item.id);
    
    if (item.type === 'folder' && selectedFolderIds.includes(item.id)) {
      return true;
    }
    
    // If we're in the same location, disable it
    if (item.type === 'collection' && item.id === currentCollectionId && !currentFolderId) {
      return true;
    }
    
    if (item.type === 'folder' && item.id === currentFolderId) {
      return true;
    }
    
    return false;
  };

  // Load subfolders for a folder
  const loadSubfolders = async (collectionId: number | undefined, folderId: number) => {
    const cacheKey = collectionId ? `${collectionId}-${folderId}` : `standalone-${folderId}`;
    
    if (folderCache.has(cacheKey)) {
      return folderCache.get(cacheKey) || [];
    }
    
    setLoadingFolders(prev => new Set(prev).add(cacheKey));
    
    try {
      const response = await fileManagerApi.index({
        collection_id: collectionId,
        parent_folder_id: folderId,
        type: 'all'
      });
      
      const folders = response.data.filter(item => item.type === FileType.Folder && !item.trash);
      setFolderCache(prev => new Map(prev).set(cacheKey, folders));
      
      return folders;
    } finally {
      setLoadingFolders(prev => {
        const newSet = new Set(prev);
        newSet.delete(cacheKey);
        return newSet;
      });
    }
  };

  // Toggle folder expansion
  const toggleExpansion = async (nodeKey: string, collectionId: number | undefined, folderId?: number) => {
    if (folderId) {
      await loadSubfolders(collectionId, folderId);
    }
    
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeKey)) {
        newSet.delete(nodeKey);
      } else {
        newSet.add(nodeKey);
      }
      return newSet;
    });
  };

  // Render folder tree recursively
  const renderFolderTree = (folders: FileManagerItem[], collectionId: number | undefined, level: number = 0): React.ReactNode => {
    return folders.map(folder => {
      const nodeKey = collectionId ? `${collectionId}-${folder.id}` : `standalone-${folder.id}`;
      const isExpanded = expandedNodes.has(nodeKey);
      const isLoading = loadingFolders.has(nodeKey);
      const isDisabled = isItemDisabled({ id: folder.id, name: folder.name, type: 'folder', collectionId });
      const subfolders = folderCache.get(nodeKey) || [];
      
      return (
        <div key={folder.id} className={cn('select-none', level > 0 && 'ml-4')}>
          <div
            className={cn(
              'flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800',
              isDisabled && 'opacity-50 cursor-not-allowed',
              selectedTarget?.folderId === folder.id && selectedTarget?.collectionId === collectionId && 'bg-blue-100 dark:bg-blue-900'
            )}
            onClick={() => {
              if (isDisabled) return;
              setSelectedTarget({ collectionId, folderId: folder.id });
            }}
          >
            <div
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  toggleExpansion(nodeKey, collectionId, folder.id);
                }
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              ) : isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
            <Folder className="w-4 h-4" />
            <span className="text-sm">{folder.name}</span>
          </div>
          
          {isExpanded && subfolders.length > 0 && (
            <div className="ml-2">
              {renderFolderTree(subfolders, collectionId, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Render standalone folders
  const renderStandaloneFolders = () => {
    if (!standaloneFoldersData || standaloneFoldersData.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
          {t('file_manage.folders')}
        </div>
        {renderFolderTree(standaloneFoldersData, undefined)}
      </div>
    );
  };

  // Render collections with their folders
  const renderCollections = () => {
    if (!collectionsData?.data || !rootFoldersData) return null;
    
    return (
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
          {t('file_manage.collections')}
        </div>
        {collectionsData.data.map(collection => {
          const collectionFolders = rootFoldersData.find(rf => rf.collectionId === collection.id)?.folders || [];
          const nodeKey = `collection-${collection.id}`;
          const isExpanded = expandedNodes.has(nodeKey);
          const isDisabled = isItemDisabled({ id: collection.id, name: collection.name, type: 'collection' });
          
          return (
            <div key={collection.id} className="mb-2">
              <div
                className={cn(
                  'flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 font-medium',
                  isDisabled && 'opacity-50 cursor-not-allowed',
                  selectedTarget?.collectionId === collection.id && !selectedTarget?.folderId && 'bg-blue-100 dark:bg-blue-900'
                )}
                onClick={() => {
                  if (isDisabled) return;
                  setSelectedTarget({ collectionId: collection.id });
                }}
              >
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled && collectionFolders.length > 0) {
                      toggleExpansion(nodeKey, collection.id);
                    }
                  }}
                >
                  {collectionFolders.length > 0 && (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )
                  )}
                </div>
                <CollectionIcon className="w-4 h-4" />
                <span className="text-sm">{collection.name}</span>
              </div>
              
              {isExpanded && collectionFolders.length > 0 && (
                <div className="ml-2">
                  {renderFolderTree(collectionFolders, collection.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleMove = () => {
    if (selectedTarget) {
      onMove(selectedTarget.collectionId, selectedTarget.folderId);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTarget(null);
    setExpandedNodes(new Set());
    setFolderCache(new Map());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('file_manage.move_dialog_title')}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-96">
          <div className="space-y-1">
            {renderCollections()}
            {renderStandaloneFolders()}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleMove} 
            disabled={!selectedTarget}
          >
            {t('file_manage.move_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};