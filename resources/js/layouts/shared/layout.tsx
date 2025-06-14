import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import TranslationsToggleDropdown from '@/components/translations-dropdown';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { PropsWithChildren } from 'react';

export default function SharedLayout({ children }: PropsWithChildren) {
    const {t} = useLaravelReactI18n();

    return (
        <div className="from-background to-card flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
            {/* Fixed top-right controls */}
            <div className="bg-background/80 border-border/50 fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border p-2 shadow-lg backdrop-blur-md">
                <TranslationsToggleDropdown />
                <AppearanceToggleDropdown />
            </div>
            <div className="w-full max-w-3xl">
                <Link href="/dashboard">
                    <div className="mb-8 flex items-center justify-center">
                        <div className="bg-primary/10 rounded-full p-2">
                            <AppLogoIcon className="h-10 w-auto" />
                        </div>
                        <h1 className="text-foreground ml-3 text-2xl font-bold">Hyprcloud</h1>
                    </div>
                </Link>
                <Card className="border-accent/10 bg-card/95 w-full border-2 shadow-xl backdrop-blur-sm">
                    <CardContent className="overflow-hidden rounded-lg p-0">{children}</CardContent>
                </Card>
                <div className="text-muted-foreground mt-6 text-center text-sm">
                    {t('home.copyright', { year: new Date().getFullYear()})}
                </div>
            </div>
        </div>
    );
}
