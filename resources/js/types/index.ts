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
    only?: string[];
}

export interface SharedData {
    name: string;
    csrf_token: string;
    auth: Auth;
    [key: string]: unknown;
}

export enum RolesEnum {
    Admin = 'admin',
    User = 'user',
}

export enum PlansEnum {
    Free = 'free',
    Basic = 'basic',
    Pro = 'pro'
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
    plan: Omit<Plan, 'features'>;
}

export enum FileType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    File = 'file',
    Other = 'other',
}

// changed name because conflicting with native File type
export interface TFile {
    id: number;
    name: string;
    size: number;
    type: FileType;
    path: string;
    url: string;
    user_id: number;
    trash: boolean;
    shared: boolean;
    shared_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Pagination {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface Payment {
    id: number;
    user_id: number;
    plan_id: number;
    payment_method: 'card' | 'sbp';
    billing_cycle: 'monthly' | 'yearly';
    status: 'pending' | 'paid';
    created_at: string;
    updated_at: string;
}

export interface Plan {
    id: number;
    en_name: string;
    ru_name: string;
    en_description: string;
    ru_description: string;
    icon: string;
    monthly_usd_price: number;
    monthly_rub_price: number;
    yearly_usd_price: number;
    yearly_rub_price: number;
    popular: boolean;
    features: PlanFeature[];
    created_at: string;
    updated_at: string;
}

export interface PlanFeature {
    id: number;
    ru_name: string;
    en_name: string;
    popular: boolean;
    included: boolean
    group: string;
    plan_id: number;
    created_at: string;
    updated_at: string;
}

export type OnAction = (action: 'show' | 'share' | 'cancel-share' | 'restore' | 'delete' | 'delete-permanently' | 'download-zip') => void;