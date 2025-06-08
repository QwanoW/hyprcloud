import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import SharedLayout from '@/layouts/shared/layout';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { router } from '@inertiajs/react';

interface PasswordPageProps {
    token: string;
    error?: string;
}

export default function PasswordPage({ token, error }: PasswordPageProps) {
    const { t } = useLaravelReactI18n();
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post(`/shared/${token}`, {
            password
        }, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    return (
        <SharedLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{t('shared.password_required')}</CardTitle>
                        <CardDescription>
                            {t('shared.password_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('shared.password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('shared.enter_password')}
                                    required
                                    autoFocus
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting || !password.trim()}
                            >
                                {isSubmitting ? t('shared.accessing') : t('shared.access_file')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SharedLayout>
    );
}