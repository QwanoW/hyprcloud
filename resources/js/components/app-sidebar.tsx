import { NavItems } from '@/components/nav-items';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { RolesEnum, SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { ChartSpline, Folder, Image, LayoutGrid, Trash } from 'lucide-react';
import AppLogo from './app-logo';
import { Button } from './ui/button';

export function AppSidebar() {
    const { t } = useLaravelReactI18n();
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: t('breadcrumb.dashboard'),
            url: '/dashboard',
            icon: LayoutGrid,
            only: ['files', 'pagination'],
        },
        {
            title: t('breadcrumb.gallery'),
            url: '/dashboard/gallery',
            icon: Image,
            only: ['files', 'pagination'],
        },
        {
            title: t('breadcrumb.trash'),
            url: '/dashboard/trash',
            icon: Trash,
            only: ['files', 'pagination'],
        },
        {
            title: t('breadcrumb.analytics'),
            url: '/dashboard/analytics',
            icon: ChartSpline,
        },
    ];

    const collectionNavItems: NavItem[] = [
        {
            title: 'Collection 1',
            url: '/dashboard/collections/1',
            icon: Folder,
        },
        {
            title: 'Collection 2',
            url: '/dashboard/collections/2',
            icon: Folder,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
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
                <NavItems label={t('components.sidebar_nav_label_collections')} items={collectionNavItems} />
            </SidebarContent>

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
