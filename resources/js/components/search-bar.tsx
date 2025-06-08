import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Loader2, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { FileItem } from '@/components/file-manage/file-item';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useFileSearchQuery } from '@/hooks/file-manage/use-files-query';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export function SearchBar() {
    const { t, tChoice } = useLaravelReactI18n();
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);
    
    const debouncedQuery = useDebouncedValue(searchQuery, 300);
    
    const {
        data: searchResponse,
        isLoading,
        error
    } = useFileSearchQuery(debouncedQuery, debouncedQuery.trim().length > 0);
    
    const searchResults = useMemo(() => searchResponse || [], [searchResponse]);

    useEffect(() => {
        if (inputRef.current) {
            const updateWidth = () => {
                if (inputRef.current) {
                    setInputWidth(inputRef.current.getBoundingClientRect().width);
                }
            };
            updateWidth();
            window.addEventListener('resize', updateWidth);
            return () => window.removeEventListener('resize', updateWidth);
        }
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setOpen(false);
            return;
        }
        
        if (searchResults.length > 0) {
            setOpen(true);
        } else if (!isLoading && debouncedQuery.trim().length > 0) {
            setOpen(true);
        }
    }, [searchResults, isLoading, searchQuery, debouncedQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    if (error) {
        console.error('Error searching files:', error);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div ref={inputRef} className="relative w-full max-w-md">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder={t('components.search_placeholder')}
                        className="pl-9 pr-8"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    {isLoading && (
                        <Loader2 className="absolute top-2.5 right-2.5 h-4 w-4 animate-spin text-gray-500" />
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="p-1"
                align="start"
                style={{ width: inputWidth ? `${inputWidth}px` : 'auto' }}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                {searchResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto py-1">
                        <div className="flex flex-col">
                            {searchResults.map((file) => (
                                <FileItem
                                    file={file}
                                    variant="search"
                                    key={file.id}
                                    className="mb-0.5"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                            {isLoading 
                                ? t('components.search_loading') 
                                : t('components.search_no_results')
                            }
                        </span>
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="border-t pt-1 pb-0.5 px-2 text-xs text-muted-foreground">
                        {tChoice('components.search_results_count', searchResults.length, { count: searchResults.length })}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}