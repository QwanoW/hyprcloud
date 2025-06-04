import { PlanCard } from '@/components/home/plan-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Homelayout from '@/layouts/home/layout';
import { getLocalizedField } from '@/lib/utils';
import { Plan, Testimonial } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Cloud, Lock, Search, Share2 } from 'lucide-react';

export default function Home({ plans, testimonials }: { plans: Plan[]; testimonials: Testimonial[] }) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    return (
        <Homelayout>
            <Head title={t('home.meta_title')} />
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="container mx-auto flex flex-col items-center text-center">
                    {/* Background Elements */}
                    <div className="from-background to-background/50 absolute inset-0 -z-10 bg-gradient-to-b" />
                    <div className="from-primary/20 via-background to-background absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

                    {/* Decorative Elements */}
                    <div className="bg-primary/5 absolute top-1/4 left-0 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" aria-hidden="true" />
                    <div className="bg-primary/10 absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 rounded-full blur-3xl" aria-hidden="true" />

                    {/* Grid Pattern */}
                    <div
                        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.02]"
                        aria-hidden="true"
                    />

                    {/* Floating Shapes */}
                    <div className="bg-primary/10 absolute top-[20%] left-[15%] h-16 w-16 animate-pulse rounded md:h-24 md:w-24" aria-hidden="true" />
                    <div
                        className="bg-primary/20 absolute right-[15%] bottom-[20%] h-10 w-10 animate-pulse rounded-full delay-700 md:h-16 md:w-16"
                        aria-hidden="true"
                    />
                    <div
                        className="bg-primary/10 absolute bottom-[10%] left-[10%] h-8 w-8 animate-pulse rounded-full delay-1000 md:h-12 md:w-12"
                        aria-hidden="true"
                    />
                    <div
                        className="bg-primary/5 absolute top-[10%] right-[20%] h-12 w-12 animate-pulse rounded-lg delay-300 md:h-20 md:w-20"
                        aria-hidden="true"
                    />

                    {/* Diagonal Lines */}
                    <div
                        className="via-primary/20 absolute top-[5%] left-[20%] hidden h-[300px] w-[1px] rotate-[30deg] bg-gradient-to-b from-transparent to-transparent md:block"
                        aria-hidden="true"
                    />
                    <div
                        className="via-primary/10 absolute right-[20%] bottom-[5%] hidden h-[200px] w-[1px] rotate-[-30deg] bg-gradient-to-b from-transparent to-transparent md:block"
                        aria-hidden="true"
                    />

                    {/* Заменяем текст ключами */}
                    <h1 className="relative z-10 max-w-3xl text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        {t('home.hero_title')}
                    </h1>

                    <p className="text-muted-foreground relative z-10 mt-6 max-w-[600px] md:text-xl">{t('home.hero_description')}</p>

                    <div className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row">
                        <Button asChild size="lg" className="text-base">
                            <Link href="dashboard">{t('home.hero_button_try')}</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-base">
                            <Link href="#features">{t('home.hero_button_learn')}</Link>
                        </Button>
                    </div>

                    {/* Commented out section - no changes needed */}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-muted/50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('home.features_title')}</h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">{t('home.features_description')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {/* Card 1 */}
                        <Card className="bg-background">
                            <CardHeader>
                                <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                    <Cloud className="text-primary h-8 w-8" />
                                </div>
                                <CardTitle>{t('home.features_card1_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('home.features_card1_description')}</p>
                            </CardContent>
                        </Card>

                        {/* Card 2 */}
                        <Card className="bg-background">
                            <CardHeader>
                                <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                    <Search className="text-primary h-8 w-8" />
                                </div>
                                <CardTitle>{t('home.features_card2_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('home.features_card2_description')}</p>
                            </CardContent>
                        </Card>

                        {/* Card 3 */}
                        <Card className="bg-background">
                            <CardHeader>
                                <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                    <Share2 className="text-primary h-8 w-8" />
                                </div>
                                <CardTitle>{t('home.features_card3_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('home.features_card3_description')}</p>
                            </CardContent>
                        </Card>

                        {/* Card 4 */}
                        <Card className="bg-background">
                            <CardHeader>
                                <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                    <Lock className="text-primary h-8 w-8" />
                                </div>
                                <CardTitle>{t('home.features_card4_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t('home.features_card4_description')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20">
                <div className="container mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('home.testimonials_title')}</h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">{t('home.testimonials_description')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
                        {testimonials && testimonials.length > 0 ? (
                            testimonials.map((testimonial) => {
                                // Получаем инициалы из имени
                                const initials = getLocalizedField(testimonial, 'name', locale)
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .toUpperCase();

                                return (
                                    <Card key={testimonial.id}>
                                        <CardHeader>
                                            <div className="flex items-center gap-4">
                                                {testimonial.photo ? (
                                                    <img
                                                        src={`/storage/${testimonial.photo}`}
                                                        alt={getLocalizedField(testimonial, 'name', locale)}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                                        <span className="text-primary font-bold">{initials}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <CardTitle className="text-lg">{getLocalizedField(testimonial, 'name', locale)}</CardTitle>
                                                    <CardDescription>{getLocalizedField(testimonial, 'position', locale)}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{getLocalizedField(testimonial, 'testimonial', locale)}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            // Если нет отзывов, показываем статические из локализации
                            <>
                                {/* Testimonial 1 */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                                <span className="text-primary font-bold">JD</span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{t('home.testimonials_card1_name')}</CardTitle>
                                                <CardDescription>{t('home.testimonials_card1_role')}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{t('home.testimonials_card1_quote')}</p>
                                    </CardContent>
                                </Card>

                                {/* Testimonial 2 */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                                <span className="text-primary font-bold">MS</span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{t('home.testimonials_card2_name')}</CardTitle>
                                                <CardDescription>{t('home.testimonials_card2_role')}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{t('home.testimonials_card2_quote')}</p>
                                    </CardContent>
                                </Card>

                                {/* Testimonial 3 */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                                <span className="text-primary font-bold">AT</span>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{t('home.testimonials_card3_name')}</CardTitle>
                                                <CardDescription>{t('home.testimonials_card3_role')}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{t('home.testimonials_card3_quote')}</p>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="bg-muted/50 py-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('home.pricing_title')}</h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">{t('home.pricing_description')}</p>
                    </div>

                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20">
                <div className="container mx-auto">
                    <div className="bg-primary/5 mx-auto max-w-4xl rounded-2xl p-8 text-center md:p-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t('home.cta_title')}</h2>
                        <p className="text-muted-foreground mx-auto mt-4 max-w-[600px] text-xl">{t('home.cta_description')}</p>
                        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                            <Button size="lg" className="text-base">
                                {t('home.cta_button_start')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Homelayout>
    );
}
