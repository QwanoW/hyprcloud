import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n'; // Импортируем хук
import { Cloud, Menu } from 'lucide-react';
import { useState } from 'react';
import AppearanceToggleDropdown from '../appearance-dropdown';
import TranslationsToggleDropdown from '../translations-dropdown';
import { Button } from '../ui/button';

export function Header() {
    const { t } = useLaravelReactI18n(); // Получаем функцию t
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-background sticky top-0 z-40 border-b">
            <div className="container mx-auto flex h-16 items-center justify-between py-4">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <Cloud className="text-primary h-6 w-6" />
                        <span className="text-xl font-bold">Hyprcloud</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-6 md:flex">
                    <nav className="flex items-center gap-6">
                        <Link href={'/#features'} className="hover:text-primary text-sm font-medium">
                            {t('home.nav_features')}
                        </Link>
                        <Link href={'/#testimonials'} className="hover:text-primary text-sm font-medium">
                            {t('home.nav_testimonials')}
                        </Link>
                        <Link href={'/#pricing'} className="hover:text-primary text-sm font-medium">
                            {t('home.nav_pricing')}
                        </Link>
                        {/* Ссылка Contact была в коде, добавляем ключ */}
                        {/* <Link href={'/#contact'} className="hover:text-primary text-sm font-medium">
                            {t('header.nav_contact')}
                        </Link> */}
                    </nav>
                    {auth.user ? (
                        // Logged in view
                        <Button asChild>
                            <Link href="/dashboard">{t('home.button_dashboard')}</Link>
                        </Button>
                    ) : (
                        // Guest view
                        <Button asChild>
                            <Link href="/login">{t('home.button_try_free')}</Link>
                        </Button>
                    )}
                    <AppearanceToggleDropdown />
                    <TranslationsToggleDropdown />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="flex items-center md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={t('home.aria_toggle_mobile_menu')} // Aria label для доступности
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="container mx-auto py-4 pb-6 md:hidden">
                    <nav className="flex flex-col gap-4">
                        <Link href={'/#features'} className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                            {t('home.nav_features')}
                        </Link>
                        <Link href={'/#testimonials'} className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                            {t('home.nav_testimonials')}
                        </Link>
                        <Link href={'/#pricing'} className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                            {t('home.nav_pricing')}
                        </Link>
                        {auth.user ? (
                            // Logged in view
                            <Button asChild onClick={() => setMobileMenuOpen(false)}>
                                <Link href="/dashboard">{t('home.button_dashboard')}</Link>
                            </Button>
                        ) : (
                            // Guest view
                            <Button asChild onClick={() => setMobileMenuOpen(false)}>
                                <Link href="/login">{t('home.button_try_free')}</Link>
                            </Button>
                        )}
                        {/* Дропдауны можно оставить как есть или обернуть, если внутри них есть текст */}
                        <AppearanceToggleDropdown />
                        <TranslationsToggleDropdown />
                    </nav>
                </div>
            )}
        </header>
    );
}
