import '../css/app.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';

import { Toaster } from '@/components/ui/sonner';
import { initializeTheme } from '@/hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Hyprcloud';
const queryClient = new QueryClient();

// get locale from local storage or navigator language
const locale = typeof window !== 'undefined'
    ? localStorage.getItem('locale') || navigator.language?.split('-')[0] || 'en'
    : 'en';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const appElement = (
            <LaravelReactI18nProvider locale={locale} fallbackLocale={'en'} files={import.meta.glob('/lang/*.json')}>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                    <Toaster richColors />
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </LaravelReactI18nProvider>
        );

        root.render(appElement);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
