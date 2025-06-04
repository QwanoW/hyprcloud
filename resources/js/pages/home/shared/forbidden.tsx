import { Button } from '@/components/ui/button';
import SharedLayout from '@/layouts/shared/layout';
import { Link } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n'; // Import the hook

export default function ForbiddenPage() {
    const { t } = useLaravelReactI18n(); // Get the translation function

    return (
        <SharedLayout>
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="rounded-full bg-destructive/10 p-6 mb-6 backdrop-blur-sm">
                    <Lock className="h-12 w-12 text-destructive" />
                </div>
                {/* Use translation key for the title */}
                <h1 className="text-2xl font-bold mb-2 text-foreground">{t('shared.title')}</h1>
                {/* Use translation key for the description */}
                <p className="text-muted-foreground mb-8 max-w-md">
                    {t('shared.description')}
                </p>
                <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-all">
                    <Link href="/">
                        {/* Use translation key for the button text */}
                        {t('shared.button_go_home')}
                    </Link>
                </Button>
            </div>
        </SharedLayout>
    );
}