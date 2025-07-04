import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Link } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms_accepted: boolean;
};

export default function Register() {
    const { t } = useLaravelReactI18n();
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title={t('auth.register_title')} description={t('auth.register_description')}>
            <Head title={t('auth.register_meta_title')} />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('auth.register_label_name')}</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register_placeholder_name')}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('auth.register_label_email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register_placeholder_email')}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('auth.register_label_password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register_placeholder_password')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">{t('auth.register_label_confirm_password')}</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register_placeholder_confirm_password')}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-start space-x-2 mt-2">
                        <Checkbox
                            id="terms"
                            required
                            tabIndex={5}
                            checked={data.terms_accepted}
                            onCheckedChange={(checked) => 
                                setData('terms_accepted', checked as boolean)
                            }
                            disabled={processing}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms"
                                className="text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {t('auth.register_label_terms_prefix')}{' '}
                                <Link 
                                    href="/pages/terms-of-service" 
                                    className="text-primary hover:underline"
                                >
                                    {t('auth.register_terms_link')}
                                </Link>
                                {' '}{t('auth.register_label_terms_and')}{' '}
                                <Link 
                                    href="/pages/privacy-policy" 
                                    className="text-primary hover:underline"
                                >
                                    {t('auth.register_privacy_link')}
                                </Link>
                            </label>
                            <InputError message={errors.terms_accepted} />
                        </div>
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('auth.register_button')}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    {t('auth.register_already_registered')}{' '}
                    <TextLink href={route('login')} tabIndex={7}>
                        {t('auth.register_sign_in')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}