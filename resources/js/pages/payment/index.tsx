import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Plan } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BanknoteIcon, Calendar, Check, ChevronsUp, CreditCardIcon, HelpCircle, Info, Lock, ShieldCheck } from 'lucide-react';
import { FormEvent } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { getFormattedPrice, getLocalizedField } from '@/lib/utils';

export default function Payment({ plan: inputPlan, billingCycle }: { plan: Plan; billingCycle: "monthly" | "yearly" }) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    const planName = getLocalizedField(inputPlan, 'name', locale);
    const planDescription = getLocalizedField(inputPlan, 'description', locale);


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('payment.breadcrumb_manage_plan'),
            href: '/manage-plan',
        },
        {
            title: t('payment.breadcrumb_payment'),
            href: '/payment',
        },
    ];

    const paymentMethods = [
        { id: 'card', name: t('payment.paid_method_option_card'), icon: <CreditCardIcon className="h-5 w-5" /> },
        { id: 'sbp', name: t('payment.paid_method_option_sbp'), icon: <BanknoteIcon className="h-5 w-5" /> },
    ];


    const { data, setData, post, processing, errors } = useForm({
        planId: inputPlan.id,
        billingCycle: billingCycle,
        payment_method: 'card',
        card_number: '',
        card_expiry: '',
        card_cvv: '',
        card_holder: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/mock-payment', {
            preserveScroll: true,
        });
    };

    const isYearly = data.billingCycle === 'yearly';
    const isFree = inputPlan.monthly_usd_price === 0;

    const price = isYearly ? inputPlan.yearly_usd_price : inputPlan.monthly_usd_price;

    const monthlyCostForYear = inputPlan.monthly_usd_price * 12;
    const yearlySavings = monthlyCostForYear - inputPlan.yearly_usd_price;
    const savingsPercentage = monthlyCostForYear > 0 ? Math.round((yearlySavings / monthlyCostForYear) * 100) : 0;

    const billingCycleText = isYearly ? t('payment.billing_cycle_annual') : t('payment.billing_cycle_monthly');
    const billingSuffixText = isYearly ? t('payment.billing_suffix_year') : t('payment.billing_suffix_month');
    const billingFrequencyText = isYearly ? t('payment.billing_frequency_yearly') : t('payment.billing_frequency_monthly');


    return (
        <TooltipProvider>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('payment.meta_title')} />
                <div className="flex flex-col space-y-6 p-4">
                    <HeadingSmall
                        title={t('payment.heading_title')}
                        description={t('payment.heading_description', { planName: planName, billingCycle: billingCycleText })}
                    />

                    {!isFree ? (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="space-y-6 lg:col-span-2">
                                <Card>
                                    <CardHeader className={`flex flex-row items-center justify-between rounded-t-lg`}>
                                        <div>
                                            <CardTitle>{t('payment.paid_summary_card_title', { planName: planName })}</CardTitle>
                                            <CardDescription>{isYearly ? t('payment.paid_summary_card_desc_annual') : t('payment.paid_summary_card_desc_monthly')}</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-white/50">
                                            {getFormattedPrice(inputPlan, billingCycle, locale)}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex flex-col space-y-3">
                                            <div className="text-muted-foreground text-sm">{t('payment.paid_summary_card_features_title')}</div>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {inputPlan.features
                                                    .filter(feature => feature.included)
                                                    .map((feature) => (
                                                        <div key={feature.id} className="flex items-center gap-2">
                                                            <Check className="text-primary h-4 w-4" />
                                                            <span className="text-sm">{getLocalizedField(feature, 'name', locale)}</span>
                                                            {Boolean(feature.popular) && (
                                                                <Badge variant="outline" className="ml-2 bg-blue-100 dark:bg-blue-700 text-xs">
                                                                    {t('payment.paid_summary_card_feature_popular')}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50">
                                        <div className="text-sm">
                                            <Link href="/manage-plan" className="text-primary hover:underline">
                                                {t('payment.paid_summary_card_change_plan_link')}
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Lock className="h-5 w-5" />
                                            {t('payment.paid_method_card_title')}
                                        </CardTitle>
                                        <CardDescription>{t('payment.paid_method_card_description')}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <input type="hidden" name="planId" value={data.planId} />
                                            <input type="hidden" name="billingCycle" value={data.billingCycle} />

                                            <div className="space-y-4">
                                                <RadioGroup
                                                    value={data.payment_method}
                                                    onValueChange={(value) => setData('payment_method', value)}
                                                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                >
                                                    {paymentMethods.map((method) => (
                                                        <div
                                                            key={method.id}
                                                            className={`flex items-center space-x-2 rounded-md border p-3 ${data.payment_method === method.id ? 'border-primary bg-primary/5' : 'border-muted'}`}
                                                        >
                                                            <RadioGroupItem value={method.id} id={method.id} />
                                                            <Label htmlFor={method.id} className="flex w-full cursor-pointer items-center gap-2">
                                                                {method.icon}
                                                                {method.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                                <InputError message={errors.payment_method} />
                                            </div>

                                            {data.payment_method === 'card' && (
                                                <div className="border-muted space-y-6 border-t pt-2">
                                                    <div className="pt-4">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="card_holder">{t('payment.paid_method_card_holder_label')}</Label>
                                                            <Input
                                                                id="card_holder"
                                                                name="card_holder"
                                                                placeholder={t('payment.paid_method_card_holder_placeholder')}
                                                                value={data.card_holder}
                                                                onChange={(e) => setData('card_holder', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={errors.card_holder} />
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="card_number">{t('payment.paid_method_card_number_label')}</Label>
                                                            <div className="flex gap-1">
                                                                <img src="/images/card-logos/visa.svg" alt={t('payment.alt_visa_card')} className="h-5" />
                                                                <img src="/images/card-logos/mastercard.svg" alt={t('payment.alt_mastercard_card')} className="h-5" />
                                                                <img src="/images/card-logos/mir.png" alt={t('payment.alt_mir_card')} className="h-5" />
                                                            </div>
                                                        </div>
                                                        <Input
                                                            id="card_number"
                                                            name="card_number"
                                                            placeholder={t('payment.paid_method_card_number_placeholder')}
                                                            value={data.card_number}
                                                            onChange={(e) => setData('card_number', e.target.value)}
                                                            required
                                                        />
                                                        <InputError message={errors.card_number} />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                        <div className="grid gap-3">
                                                            <div className="flex items-center gap-1">
                                                                <Label htmlFor="card_expiry">{t('payment.paid_method_card_expiry_label')}</Label>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="text-xs">{t('payment.paid_method_card_expiry_tooltip')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                            <Input
                                                                id="card_expiry"
                                                                name="card_expiry"
                                                                placeholder={t('payment.paid_method_card_expiry_placeholder')}
                                                                value={data.card_expiry}
                                                                onChange={(e) => setData('card_expiry', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={errors.card_expiry} />
                                                        </div>

                                                        <div className="grid gap-3">
                                                            <div className="flex items-center gap-1">
                                                                <Label htmlFor="card_cvv">{t('payment.paid_method_card_cvv_label')}</Label>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="text-xs">{t('payment.paid_method_card_cvv_tooltip')}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                            <Input
                                                                id="card_cvv"
                                                                name="card_cvv"
                                                                placeholder={t('payment.paid_method_card_cvv_placeholder')}
                                                                value={data.card_cvv}
                                                                onChange={(e) => setData('card_cvv', e.target.value)}
                                                                required
                                                            />
                                                            <InputError message={errors.card_cvv} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {data.payment_method === 'sbp' && (
                                                <div className="space-y-4 pt-4">
                                                    <Alert>
                                                        <Info className="h-4 w-4" />
                                                        <AlertTitle>{t('payment.paid_method_sbp_alert_title')}</AlertTitle>
                                                        <AlertDescription>
                                                            {t('payment.paid_method_sbp_alert_description')}
                                                        </AlertDescription>
                                                    </Alert>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-between">
                                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                    <ShieldCheck className="h-5 w-5 text-green-500" />
                                                    <span>{t('payment.paid_method_secure_notice')}</span>
                                                </div>
                                                <Button type="submit" className="w-full px-8 sm:w-auto" size="lg" disabled={processing}>
                                                    {processing ? t('payment.paid_method_button_processing') : t('payment.paid_method_button_pay', { price: price, billingSuffix: billingSuffixText })}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="space-y-6">
                                    <Card className="sticky top-6 border shadow-sm">
                                        <CardHeader className="border-b pb-3">
                                            <CardTitle className="text-xl">{t('payment.paid_order_summary_title')}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex items-center justify-between pb-4">
                                                    <div>
                                                        <h3 className="font-medium">{t('payment.paid_order_summary_plan_label', { planName: planName })}</h3>
                                                        <p className="text-muted-foreground text-sm">
                                                            {getFormattedPrice(inputPlan, billingCycle, locale)}
                                                        </p>
                                                    </div>
                                                    <span className="font-medium">
                                                    {getFormattedPrice(inputPlan, billingCycle, locale)}
                                                    </span>
                                                </div>

                                                {isYearly && yearlySavings > 0 && (
                                                    <div className="flex items-center justify-between pb-4 text-sm text-green-600">
                                                        <span>{t('payment.paid_order_summary_discount_label', { percentage: savingsPercentage })}</span>
                                                        <span>-{getFormattedPrice({...inputPlan, yearly_usd_price: inputPlan.yearly_usd_price / 100 * savingsPercentage, yearly_rub_price: inputPlan.yearly_rub_price / 100 * savingsPercentage}, billingCycle, locale)}</span>
                                                    </div>
                                                )}
                                                <Separator />

                                                <div className="flex items-center justify-between pt-2">
                                                    <span className="font-semibold">{t('payment.paid_order_summary_total_label')}</span>
                                                    <span className="text-xl font-bold">
                                                        ${price}
                                                        {billingSuffixText}
                                                    </span>
                                                </div>

                                                <div className="text-muted-foreground pt-2 text-xs">
                                                    {t('payment.paid_order_summary_agreement_prefix')}
                                                    <a href="#" className="text-primary hover:underline">
                                                        {t('payment.paid_order_summary_terms_link_text')}
                                                    </a>
                                                    {t('payment.paid_order_summary_agreement_suffix', { billingFrequency: billingFrequencyText })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base">{t('payment.paid_billing_info_title')}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-muted-foreground h-4 w-4" />
                                                    <span>{t('payment.paid_billing_info_first_charge')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ChevronsUp className="text-muted-foreground h-4 w-4" />
                                                    <span>{t('payment.paid_billing_info_anytime')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Info className="text-muted-foreground h-4 w-4" />
                                                    <span>{t('payment.paid_billing_info_guarantee')}</span>
                                                </div>
                                                <div className="text-muted-foreground mt-4 text-xs">
                                                    {t('payment.paid_billing_info_help_prefix')}
                                                    <a href="#" className="text-primary hover:underline">
                                                        {t('payment.paid_billing_info_support_link_text')}
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader className="rounded-t-lg">
                                        <CardTitle>{t('payment.free_card_title')}</CardTitle>
                                        <CardDescription>{planDescription}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-6">
                                            <div className="bg-muted/30 rounded-md p-4">
                                                <h3 className="mb-2 font-medium">{t('payment.free_card_included_title')}</h3>
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {inputPlan.features
                                                        .filter(feature => feature.included)
                                                        .map((feature) => (
                                                            <div key={feature.id} className="flex items-center gap-2">
                                                                <Check className="text-primary h-4 w-4" />
                                                                <span className="text-sm">{getLocalizedField(feature, 'name', locale)}</span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>

                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertTitle>{t('payment.free_card_alert_title')}</AlertTitle>
                                                <AlertDescription>
                                                    {t('payment.free_card_alert_description')}
                                                </AlertDescription>
                                            </Alert>

                                            <div className="flex flex-col gap-4 sm:flex-row">
                                                <Button
                                                    onClick={handleSubmit}
                                                    className="w-full px-8 sm:w-auto"
                                                    size="lg"
                                                    disabled={processing}
                                                >
                                                    {processing ? t('payment.free_card_button_processing') : t('payment.free_card_button_activate')}
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link href="/manage-plan">{t('payment.free_card_button_view_plans')}</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-1">
                                <Card className="border-muted border shadow-sm">
                                    <CardHeader className="border-b pb-3">
                                        <CardTitle className="text-xl">{t('payment.free_order_summary_title')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex flex-col space-y-4">
                                            <div className="border-muted flex items-center justify-between border-b pb-4">
                                                <div>
                                                    <h3 className="font-medium">{t('payment.free_order_summary_plan_label', { planName: planName })}</h3>
                                                    <p className="text-muted-foreground text-sm">{t('payment.free_order_summary_fee_label')}</p>
                                                </div>
                                                <span className="font-medium">${inputPlan.monthly_usd_price}{t('payment.billing_suffix_month')}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <span className="font-semibold">{t('payment.free_order_summary_total_label')}</span>
                                                <span className="text-xl font-bold">${inputPlan.monthly_usd_price}{t('payment.billing_suffix_month')}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-center text-sm">
                        <Lock className="h-4 w-4" />
                        <span>{t('payment.footer_security_notice')}</span>
                    </div>
                </div>
            </AppLayout>
        </TooltipProvider>
    );
}