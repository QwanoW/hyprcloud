import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';
import SharedLayout from '@/layouts/shared/layout';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';

interface PasswordPageProps {
    token: string;
}

export default function PasswordPage({ token }: PasswordPageProps) {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/shared/${token}`);
    };

    return (
        <SharedLayout>
            <Head title={t('shared.password')} />
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
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('shared.password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={t('shared.enter_password')}
                                    className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.password} />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={processing || !data.password.trim()}
                            >
                                {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {processing ? t('shared.accessing') : t('shared.access_file')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SharedLayout>
    );
}