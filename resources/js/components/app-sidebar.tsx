import { NavFooter } from '@/components/nav-footer';
import { NavItems } from '@/components/nav-items';
import { NavUser } from '@/components/nav-user';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, ChartSpline, Folder, LayoutGrid, Image, Trash } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'All content',
        url: '/dashboard',
        icon: LayoutGrid,
    },    {
        title: 'Photos',
        url: '/photos',
        icon: Image,
    },    {
        title: 'Trash',
        url: '/trash',
        icon: Trash,
    },
    {
        title: 'Analytics',
        url: '/analytics',
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

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavItems label="Main" items={mainNavItems} />
                <Separator className="my-2" />
                <NavItems label="Collections" items={collectionNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
