import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export enum RolesEnum {
    Admin = 'admin',
    User = 'user',
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: RolesEnum[];
}

// TODO: change type
export interface File {
    name: string;
    size: number;
    type: string;
    path: string;
    user_id: number;
    trash: boolean;
    shared: boolean;
    created_at: string;
    updated_at: string;
}
