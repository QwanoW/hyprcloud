import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Homelayout from '@/layouts/home/layout';
import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { useState } from 'react';

export default function CreateTestimonial() {
    const { t } = useLaravelReactI18n();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name_en: '',
        position_en: '',
        testimonial_en: '',
        photo: null as File | null,
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('photo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('testimonials.store'), {
            onSuccess: () => {
                reset('name_en', 'position_en', 'testimonial_en', 'photo');
                setPhotoPreview(null);
            },
        });
    };

    return (
        <Homelayout>
            <Head title={t('testimonials.page_title')} />
            <div className="container mx-auto py-12">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t('testimonials.form_title')}</CardTitle>
                        <CardDescription>{t('testimonials.form_description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name_en">{t('testimonials.name')}</Label>
                                <Input
                                    id="name_en"
                                    value={data.name_en}
                                    onChange={(e) => setData('name_en', e.target.value)}
                                    required
                                />
                                {errors.name_en && (
                                    <p className="text-sm text-red-500">{errors.name_en}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position_en">{t('testimonials.position')}</Label>
                                <Input
                                    id="position_en"
                                    value={data.position_en}
                                    onChange={(e) => setData('position_en', e.target.value)}
                                    required
                                />
                                {errors.position_en && (
                                    <p className="text-sm text-red-500">{errors.position_en}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="testimonial_en">{t('testimonials.testimonial')}</Label>
                                <Textarea
                                    id="testimonial_en"
                                    value={data.testimonial_en}
                                    onChange={(e) => setData('testimonial_en', e.target.value)}
                                    rows={5}
                                    required
                                />
                                {errors.testimonial_en && (
                                    <p className="text-sm text-red-500">{errors.testimonial_en}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="photo">{t('testimonials.photo')}</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                                {errors.photo && (
                                    <p className="text-sm text-red-500">{errors.photo}</p>
                                )}
                                {photoPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {t('testimonials.submit')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Homelayout>
    );
}