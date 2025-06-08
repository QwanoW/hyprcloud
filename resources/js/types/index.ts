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
    icon?: LucideIcon | string | null;
    isActive?: boolean;
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
    storage_used_bytes: number;
    storage_used_gb: number;
    storage_used_mb: number;
    formatted_storage_used: string;
    storage_usage_percentage: number;
    remaining_storage_bytes: number;
    files_count: number;
    storage_stats_updated_at: string | null;
}

export enum FileType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    File = 'file',
    Folder = 'folder',
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

export interface SharedLink {
    id: number;
    file_id: number;
    user_id: number;
    token: string;
    url: string;
    password?: string;
    expires_at?: string;
    allow_download: boolean;
    is_active: boolean;
    access_count: number;
    last_accessed_at?: string;
    password_protected: boolean;
    created_at: string;
    updated_at: string;
}

// Alias for compatibility
export type File = TFile;

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
    name_en: string;
    name_ru: string;
    description_en: string;
    description_ru: string;
    icon: string;
    monthly_usd_price: number;
    monthly_rub_price: number;
    yearly_usd_price: number;
    yearly_rub_price: number;
    popular: boolean;
    features: PlanFeature[];
    created_at: string;
    updated_at: string;
    storage_limit_bytes: number;
    storage_limit_gb: number;
    storage_limit_mb: number;
    formatted_storage_limit: string;
    max_file_size_bytes: number;
    max_files_count: number | null;
    can_share_files: boolean;
    can_configure_sharing: boolean;
    can_download_zip: boolean;
    has_api_access: boolean;
    max_shared_links: number | null;
    shared_link_expiry_days: number | null;
}

export interface PlanFeature {
    id: number;
    name_ru: string;
    name_en: string;
    popular: boolean;
    included: boolean
    group: string;
    plan_id: number;
    created_at: string;
    updated_at: string;
}

export type OnAction = (action: 'show' | 'restore' | 'delete' | 'delete-permanently' | 'download-zip' | 'move' | 'navigate' | 'properties') => void;

export interface Vacancy {
    id: number;
    title_ru: string;
    title_en: string;
    description_ru: string;
    description_en: string;
    requirements_ru: string;
    requirements_en: string;
    location_ru: string;
    location_en: string;
    is_active: boolean;
    published_at: string;
  }

  export interface Testimonial {
    id: number;
    name_en: string;
    name_ru: string;
    position_en: string;
    position_ru: string;
    testimonial_en: string;
    testimonial_ru: string;
    photo?: string;
    show_on_homepage: boolean;
    created_at: string;
    updated_at: string;
  }