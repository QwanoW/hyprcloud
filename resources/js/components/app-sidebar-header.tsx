import { Breadcrumbs } from '@/components/breadcrumbs';
// import { SearchBar } from '@/components/search-bar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
// import { NotificationButton } from '@/components/notification-button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header
            // className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
            className="border-sidebar-border/50 flex h-32 md:h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear"
        >
            {/* <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 justify-between"> */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {/* <SearchBar />
                <div className="hidden md:block md:ml-auto">
                    <NotificationButton />
                </div> */}
            {/* </div> */}
        </header>
    );
}
