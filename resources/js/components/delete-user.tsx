import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeleteUser() {
    const { t } = useLaravelReactI18n();
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall
                title={t('components.delete_user_heading_title')}
                description={t('components.delete_user_heading_description')}
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">{t('components.delete_user_alert_title')}</p>
                    <p className="text-sm">{t('components.delete_user_alert_description')}</p>
                </div>

                <Dialog onOpenChange={(open) => !open && closeModal()}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">{t('components.delete_user_button_trigger')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>{t('components.delete_user_dialog_title')}</DialogTitle>
                        <DialogDescription>
                            {t('components.delete_user_dialog_description')}
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deleteUser}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    {t('components.delete_user_label_password')}
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={t('components.delete_user_placeholder_password')}
                                    autoComplete="current-password"
                                    required
                                />

                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="gap-2 sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" onClick={closeModal}>
                                        {t('components.delete_user_dialog_cancel')}
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} type="submit">
                                    {t('components.delete_user_dialog_confirm')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}