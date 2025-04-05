import AppLogoIcon from '@/components/app-logo-icon';
import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Activity, CreditCard, FileCode, FileText, LayoutDashboard, Package, Settings, Users } from 'lucide-react';

export default function AdminSidebar() {
    const { t } = useLaravelReactI18n();

    return (
        <Sidebar>
            <SidebarHeader className="flex items-center gap-2 px-4 py-2">
                <AppLogoIcon className="h-6 w-auto" />
                <span className="font-semibold">Hyprcloud Admin</span>
            </SidebarHeader>
            <SidebarContent className="px-2 py-2">
                <SidebarMenu>
                    <SidebarMenuItem key="dashboard">
                        <SidebarMenuButton asChild>
                            <Link href="/admin">
                                <LayoutDashboard />
                                <span>{t('admin.dashboard')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <Separator className="my-4" />

                <SidebarGroup>
                    <SidebarGroupLabel>{t('admin.management')}</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem key="users">
                            <SidebarMenuButton asChild>
                                <Link href="/admin/users">
                                    <Users />
                                    <span>{t('admin.users')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem key="user-activities">
                            <SidebarMenuButton asChild>
                                <Link href="/admin/user-activities">
                                    <Activity />
                                    <span>{t('admin.user_activities')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem key="files">
                            <SidebarMenuButton asChild>
                                <Link href="/admin/files">
                                    <FileText />
                                    <span>{t('admin.files')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem key="plans">
                            <SidebarMenuButton asChild>
                                <Link href="/admin/plans">
                                    <Package />
                                    <span>{t('admin.plans')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem key="payments">
                            <SidebarMenuButton asChild>
                                <Link href="/admin/payments">
                                    <CreditCard />
                                    <span>{t('admin.payments')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem key="pages">
                            <SidebarMenuButton asChild>
                                <Link href="/admin/pages">
                                    <FileCode />
                                    <span>{t('admin.pages')}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <Separator className="my-4" />

                <SidebarMenu>
                    <SidebarMenuItem key="settings">
                        <SidebarMenuButton asChild>
                            <Link href="/admin/settings">
                                <Settings />
                                <span>{t('admin.settings')}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="text-muted-foreground px-4 py-2 text-xs">&copy; {new Date().getFullYear()} Hyprcloud</SidebarFooter>
        </Sidebar>
    );
}
