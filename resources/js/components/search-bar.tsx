import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar() {
    return (
        <div className="relative">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search files..." className="pl-9" />
        </div>
    );
}
