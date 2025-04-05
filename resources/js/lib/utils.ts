import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plan, RolesEnum, User } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function hasRole(user: User, role: RolesEnum) {
    return user.roles.includes(role);
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            return `${diffMinutes} мин. назад`;
        }
        return `${diffHours} ч. назад`;
    } else if (diffDays < 7) {
        return `${diffDays} д. назад`;
    } else {
        return formatDate(dateString);
    }
};


export interface FormattedFileSizeParts {
    value: string;
    unitKey: string;
}

export function formatFileSizeParts(size: number, locale: string): FormattedFileSizeParts {
    const unitKeys = [
        'file_manage.unit_b',
        'file_manage.unit_kb',
        'file_manage.unit_mb',
        'file_manage.unit_gb',
        'file_manage.unit_tb',
        'file_manage.unit_pb',
    ];
    let unitIndex = 0;
    let sizeInUnit = size;

    if (sizeInUnit === 0) {
        return { value: '0', unitKey: unitKeys[0] };
    }

    while (sizeInUnit >= 1024 && unitIndex < unitKeys.length - 1) {
        sizeInUnit /= 1024;
        unitIndex++;
    }

    let formattingLocale: string;
    switch (locale) {
        case 'en':
            formattingLocale = 'en-US';
            break;
        case 'ru':
            formattingLocale = 'ru-RU';
            break;
        default:
            formattingLocale = locale;
            break;
    }

    const numberFormatOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: unitIndex === 0 ? 0 : 2,
        maximumFractionDigits: unitIndex === 0 ? 0 : 2,
    };

    let formattedNumber: string;
    try {
        formattedNumber = new Intl.NumberFormat(formattingLocale, numberFormatOptions).format(sizeInUnit);
    } catch (error) {
        console.error(`Error formatting file size for locale "${locale}" (using "${formattingLocale}"):`, error);
        formattedNumber = sizeInUnit.toFixed(unitIndex === 0 ? 0 : 2);
    }

    return {
        value: formattedNumber,
        unitKey: unitKeys[unitIndex],
    };
}

export const getLocalizedField = (item: any, fieldPrefix: string, locale: string): string => {
    const localizedKey = `${fieldPrefix}_${locale}`;
    return item?.[localizedKey] || item?.[`${fieldPrefix}_en`] || '';
};

export const getFormattedPrice = (plan: Plan, cycle: 'monthly' | 'yearly', locale: string): string => {
    let price: number;
    let currency: string;
    let priceLocale: string;

    if (locale === 'ru') {
        price = cycle === 'monthly' ? plan.monthly_rub_price : plan.yearly_rub_price;
        currency = 'RUB';
        priceLocale = 'ru-RU';
    } else {
        price = cycle === 'monthly' ? plan.monthly_usd_price : plan.yearly_usd_price;
        currency = 'USD';
        priceLocale = 'en-US';
    }

    try {
        return new Intl.NumberFormat(priceLocale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'USD' ? 2 : 0,
            maximumFractionDigits: currency === 'USD' ? 2 : 0,
        }).format(price);
    } catch (error) {
        console.error("Price formatting error:", error);
        return `${currency === 'RUB' ? '₽' : '$'}${price}`;
    }
};