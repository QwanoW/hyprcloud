import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Pagination } from '@/types';
import { WhenVisible } from '@inertiajs/react';

interface InfiniteScrollProps {
    pagination: Pagination;
    only: string[];
}

export function InfiniteScroll({ pagination, only }: InfiniteScrollProps) {
    const whenVisibleParams = {
        data: {
            page: pagination.current_page + 1,
        },
        headers: {
            'partial-load': 'true',
        },
        only,
    };

    if (pagination.current_page < pagination.last_page) {
        return (
            <WhenVisible always={pagination.current_page < pagination.last_page} fallback={<LoadingSpinner type="long" className="mr-2 h-4 w-4 animate-spin" />} params={whenVisibleParams}>
                <div></div>
            </WhenVisible>
        );
    }
}
