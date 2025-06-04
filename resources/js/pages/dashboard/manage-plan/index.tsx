import { Head, router, usePage } from '@inertiajs/react';
import { Check, Info, X } from 'lucide-react';
import { useState } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { getFormattedPrice, getLocalizedField } from '@/lib/utils';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, Plan, type SharedData } from '@/types';

import DashboardLayout from '@/layouts/dashboard/layout';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function ManagePlan({ plans }: { plans: Plan[] }) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();
    const { auth } = usePage<SharedData>().props;
    const currentPlanId = auth.user.plan.id;
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('manage_plan.breadcrumb_title'),
            href: '/manage-plan',
        },
    ];

    const getFeatureGroupLabel = (groupKey: string): string => {
        return t(`manage_plan.feature_group_${groupKey}`);
    };

    const handleSelectPlan = (planId: number) => {
        if (planId !== currentPlanId) {
            router.visit('/payment', {
                data: { planId, billingCycle },
                method: 'get',
            });
        }
    };

    const getFeatureGroups = () => {
        const groups = new Set<string>();
        plans.forEach((plan) => {
            plan.features.forEach((feature) => {
                if (feature.group) {
                    groups.add(feature.group);
                }
            });
        });
        return Array.from(groups);
    };

    const featureGroups = getFeatureGroups();

    const getPlanFeatureByGroup = (planId: number, group: string) => {
        const plan = plans.find((p) => p.id === planId);
        if (!plan) return null;
        return plan.features.find((f) => f.group === group);
    };

    const savingsPercentage = 20;

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('manage_plan.meta_title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-col gap-2">
                    <HeadingSmall title={t('manage_plan.heading_title')} />
                    <p className="text-muted-foreground max-w-2xl">
                        {t('manage_plan.heading_description')}
                    </p>
                </div>

                <div className="mx-auto flex items-center justify-center gap-4 rounded-lg border border-primary-foreground p-4">
                    <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {t('manage_plan.billing_monthly')}
                    </span>
                    <Switch checked={billingCycle === 'yearly'} onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')} />
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-primary' : 'text-muted-foreground'}`}>
                            {t('manage_plan.billing_annual')}
                        </span>
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
                            {t('manage_plan.billing_save_badge', { percentage: savingsPercentage })}
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue="cards" className="w-full">
                    <TabsList className="mx-auto mb-6">
                        <TabsTrigger value="cards">{t('manage_plan.tab_cards')}</TabsTrigger>
                        <TabsTrigger value="comparison">{t('manage_plan.tab_comparison')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cards">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {plans.map((plan) => {
                                const planName = getLocalizedField(plan, 'name', locale);
                                const planDescription = getLocalizedField(plan, 'description', locale);
                                const formattedPrice = getFormattedPrice(plan, billingCycle, locale); // Get formatted price
                                return (
                                    <Card
                                        key={plan.id}
                                        className={`relative flex flex-col justify-between ${plan.popular ? 'border-primary shadow-md' : ''}`}
                                    >
                                        {Boolean(plan.popular) && (
                                            <div className="bg-primary absolute -top-3 right-0 left-0 mx-auto w-fit rounded-full px-3 py-1 text-xs font-medium text-accent">
                                                {t('manage_plan.plan_card_popular_badge')}
                                            </div>
                                        )}
                                        <CardHeader className="rounded-t-lg">
                                            <div className="flex items-center gap-2">
                                                {plan.icon}
                                                <CardTitle>{planName}</CardTitle>
                                            </div>
                                            <CardDescription className="mt-2">{planDescription}</CardDescription>
                                            <div className="mt-4">
                                                {/* Use formatted price */}
                                                <span className="text-4xl font-bold">
                                                    {formattedPrice}
                                                </span>
                                                <span className="text-muted-foreground ml-1">
                                                    {billingCycle === 'monthly' ? t('manage_plan.plan_card_billing_month') : t('manage_plan.plan_card_billing_year')}
                                                </span>
                                                {currentPlanId === plan.id && (
                                                    <Badge variant="outline" className="bg-primary/10 ml-2">
                                                        {t('manage_plan.plan_card_current_badge')}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            <div className="mb-3 font-medium">{t('manage_plan.plan_card_features_title')}</div>
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => {
                                                    if (feature.popular && feature.included) {
                                                        const featureName = getLocalizedField(feature, 'name', locale);
                                                        return (
                                                            <li key={index} className="flex items-start gap-2">
                                                                <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                                                                <span>{featureName}</span>
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </ul>
                                        </CardContent>
                                        <CardFooter className="pt-2">
                                            <Button
                                                className="w-full"
                                                variant={plan.popular ? 'default' : 'outline'}
                                                disabled={currentPlanId === plan.id}
                                                onClick={() => handleSelectPlan(plan.id)}
                                            >
                                                {currentPlanId === plan.id ? t('manage_plan.plan_card_button_current') : t('manage_plan.plan_card_button_start')}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="comparison">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('manage_plan.comparison_title')}</CardTitle>
                                <CardDescription>{t('manage_plan.comparison_description')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="px-4 py-4 text-left">{t('manage_plan.comparison_header_feature')}</th>
                                                {plans.map((plan) => {
                                                    const planName = getLocalizedField(plan, 'name', locale);
                                                    const formattedPrice = getFormattedPrice(plan, billingCycle, locale); // Get formatted price
                                                    return (
                                                        <th key={plan.id} className="px-6 py-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-lg font-medium">{planName}</span>
                                                                {/* Use formatted price and short suffix */}
                                                                <span className="text-muted-foreground text-sm">
                                                                    {formattedPrice}
                                                                    {billingCycle === 'monthly' ? t('manage_plan.comparison_billing_month_short') : t('manage_plan.comparison_billing_year_short')}
                                                                </span>
                                                            </div>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {featureGroups.map((group, index) => {
                                                const groupLabel = getFeatureGroupLabel(group);
                                                return (
                                                    <tr key={index} className="border-b">
                                                        <td className="px-4 py-4 font-medium">{groupLabel}</td>
                                                        {plans.map((plan) => {
                                                            const feature = getPlanFeatureByGroup(plan.id, group);
                                                            const featureName = feature ? getLocalizedField(feature, 'name', locale) : '';
                                                            return (
                                                                <td key={`${plan.id}-${group}`} className="px-6 py-4 text-center">
                                                                    {feature && feature.included ? (
                                                                        <div className="flex flex-col items-center">
                                                                            <Check className="mx-auto mb-1 h-5 w-5 text-green-500" />
                                                                            <span className="text-sm">{featureName}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <X className="mx-auto h-5 w-5 text-gray-300" />
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center gap-4">
                                {plans.map((plan) => {
                                    const planName = getLocalizedField(plan, 'name', locale);
                                    return (
                                        <Button
                                            key={plan.id}
                                            variant={plan.id === currentPlanId ? 'default' : 'outline'}
                                            disabled={currentPlanId === plan.id}
                                            onClick={() => handleSelectPlan(plan.id)}
                                        >
                                            {currentPlanId === plan.id ? t('manage_plan.comparison_footer_button_current', {planName: planName}) : t('manage_plan.comparison_footer_button_choose', {planName: planName})}
                                        </Button>
                                    );
                                })}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-6">
                    <h3 className="mb-4 text-xl font-semibold">{t('manage_plan.faq_title')}</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('manage_plan.faq_q1_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    {t('manage_plan.faq_q1_answer')}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('manage_plan.faq_q2_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    {t('manage_plan.faq_q2_answer')}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('manage_plan.faq_q3_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    {t('manage_plan.faq_q3_answer')}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">{t('manage_plan.faq_q4_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    {t('manage_plan.faq_q4_answer')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>{t('manage_plan.help_alert_title')}</AlertTitle>
                    <AlertDescription>
                        {t('manage_plan.help_alert_description')}
                        <Button variant="link" className="h-auto p-0 font-normal">
                            {t('manage_plan.help_alert_contact_button')}
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        </DashboardLayout>
    );
}