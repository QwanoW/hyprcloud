import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RolesEnum, User } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function hasRole(user: User, role: RolesEnum) {
    return user.roles.includes(role);
}
