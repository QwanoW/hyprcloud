import { NavItems } from '@/components/nav-items';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { collectionApi } from '@/services/collectionApi';
import { RolesEnum, SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ChartSpline, Image, LayoutGrid, Plus, Trash, Share2, Search, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';
import { CreateCollectionModal } from './file-manage/create-collection-modal';
import { Button } from './ui/button';

export function AppSidebar() {
    const { t } = useLaravelReactI18n();
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: t('breadcrumb.all-files'),
            url: '/dashboard/files',
            icon: LayoutGrid,
        },
        {
            title: t('breadcrumb.gallery'),
            url: '/dashboard/gallery',
            icon: Image,
        },
        {
            title: t('breadcrumb.shared'),
            url: '/dashboard/shared',
            icon: Share2,
        },
        {
            title: t('breadcrumb.trash'),
            url: '/dashboard/trash',
            icon: Trash,
        },
    ];
    const othersNavItems: NavItem[] = [
        {
            title: t('breadcrumb.search'),
            url: '/dashboard/search',
            icon: Search,
        },
        {
            title: t('breadcrumb.analytics'),
            url: '/dashboard/analytics',
            icon: ChartSpline,
        },
        {
            title: t('breadcrumb.help'),
            url: '/dashboard/help',
            icon: HelpCircle,
        },
    ];

    const [showCreateCollection, setShowCreateCollection] = useState(false);

    // Fetch recent collections for sidebar
    const { data: collectionsData } = useQuery({
        queryKey: ['collections-recent'],
        queryFn: () => collectionApi.getRecentCollections(),
    });

    const collectionNavItems: NavItem[] =
        collectionsData?.data?.map((collection) => ({
            title: collection.name,
            url: `/dashboard/collections/${collection.id}`,
            icon: collection.icon,
        })) || [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator className="my-2" />
            <SidebarContent>
                <NavItems label={t('components.sidebar_nav_label_main')} items={mainNavItems} />
                <Separator className="my-2" />
                <NavItems label={t('breadcrumb.others')} items={othersNavItems} />
                <Separator className="my-2" />
                <div>
                    <div className='px-2 flex justify-between items-center'>
                        <SidebarGroupLabel>{t('components.sidebar_nav_label_collections')}</SidebarGroupLabel>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowCreateCollection(true)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <NavItems items={collectionNavItems} />
                </div>
            </SidebarContent>

            <CreateCollectionModal open={showCreateCollection} onOpenChange={setShowCreateCollection} />

            <SidebarFooter>
                <NavUser />
                {user.roles.includes(RolesEnum.Admin) && (
                    <Button asChild>
                        <a href="/admin">{t('components.sidebar_footer_admin_label')}</a>
                    </Button>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
