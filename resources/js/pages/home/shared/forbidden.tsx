import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';
import SharedLayout from '@/layouts/shared/layout';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Link } from '@inertiajs/react';

export default function ForbiddenPage() {
    const { t } = useLaravelReactI18n();

    return (
        <SharedLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-destructive">
                            {t('shared.access_denied')}
                        </CardTitle>
                        <CardDescription>
                            {t('shared.link_not_found_or_expired')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {t('shared.possible_reasons')}
                            </p>
                            <ul className="text-sm text-muted-foreground text-left space-y-1">
                                <li>• {t('shared.link_expired')}</li>
                                <li>• {t('shared.link_deactivated')}</li>
                                <li>• {t('shared.link_invalid')}</li>
                            </ul>
                            <Link href="/">
                                <Button className="w-full mt-6">
                                    <Home className="h-4 w-4 mr-2" />
                                    {t('shared.go_home')}
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SharedLayout>
    );
}