import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Loader2, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { TFile } from '@/types';
import { FileItem } from './file-manage/file-item';

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

    // Track input width for popover sizing
    useEffect(() => {
        if (inputRef.current) {
            const updateWidth = () => {
                if (inputRef.current) {
                    setInputWidth(inputRef.current.getBoundingClientRect().width);
                }
            };
            
            // Set initial width
            updateWidth();
            
            // Update on resize
            window.addEventListener('resize', updateWidth);
            return () => window.removeEventListener('resize', updateWidth);
        }
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setOpen(false);
            return;
        }

        setIsLoading(true);
        const debounceTimeout = setTimeout(() => {
            searchFiles();
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery]);

    const searchFiles = async () => {
        try {
            const response = await axios.post<{files: TFile[]}>(route('files.search'), {
                q: searchQuery
            });
            setSearchResults(response.data.files);
            setIsLoading(false);
            setOpen(response.data.files.length > 0);
        } catch (error) {
            console.error('Error searching files:', error);
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div ref={inputRef} className="relative w-full max-w-md">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search files..."
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
                        <span>No files found</span>
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="border-t pt-1 pb-0.5 px-2 text-xs text-muted-foreground">
                        {searchResults.length} {searchResults.length === 1 ? 'file' : 'files'} found
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}