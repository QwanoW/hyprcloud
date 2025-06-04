import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData, type BreadcrumbItem, Plan } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, PartyPopper, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { getLocalizedField } from '@/lib/utils';

export default function PaymentSuccess() {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();
    const [countdown, setCountdown] = useState(10);
    const { auth } = usePage<SharedData>().props;
    const currentPlan = auth.user.plan as Plan;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('payment.success_breadcrumb_manage_plan'), href: '/manage-plan' },
        { title: t('payment.success_breadcrumb_success'), href: '/payment/success' },
    ];

    useEffect(() => {
        if (countdown <= 0) {
            router.visit('/dashboard');
        }
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const planName = getLocalizedField(currentPlan, 'name', locale);
    const planDescription = getLocalizedField(currentPlan, 'description', locale);

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('payment.success_meta_title')} />
            <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl">
                    <Card className="border shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold">{t('payment.success_card_title')}</CardTitle>
                            <CardDescription className="text-base">
                                {t('payment.success_card_description')}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 py-4">
                            <Alert className="flex items-start gap-3 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/30">
                                <PartyPopper className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                                <div>
                                    <AlertTitle className="font-medium text-blue-800 dark:text-blue-200">
                                        {t('payment.success_alert_title', { planName: planName })}
                                    </AlertTitle>
                                    <AlertDescription className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                        {t('payment.success_alert_description', { planName: planName })}
                                    </AlertDescription>
                                </div>
                            </Alert>

                            <div className="mt-8 flex flex-col items-center">
                                <Badge
                                    variant="outline"
                                    className="mb-4 border-2 border-primary/20 bg-primary/10 px-6 py-3 text-base font-medium text-primary dark:border-primary/30 dark:bg-primary/20"
                                >
                                    {t('payment.success_current_plan_badge', { planName: planName })}
                                </Badge>

                                <div className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                                    {planDescription}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col items-center border-t p-6 space-y-4 dark:border-gray-700">
                            <div className="w-full space-y-2">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{t('payment.success_redirect_text', { countdown: countdown })}</span> 
                                    </div>
                                    <span>{t('payment.success_redirect_progress_label', { countdown: countdown })}</span> 
                                </div>
                                <Progress value={(10 - countdown) * 10} className="h-2" />
                            </div>

                            <Button size="lg" className="mt-4 w-full sm:w-auto" asChild>
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    {t('payment.success_button_dashboard_now')}
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}