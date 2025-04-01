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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Plan } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BanknoteIcon, Calendar, Check, ChevronsUp, CreditCardIcon, HelpCircle, Info, Lock, ShieldCheck } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage plan',
        href: '/manage-plan',
    },
    {
        title: 'Payment',
        href: '/payment',
    },
];

// Map plan background colors based on plan id or name
const getPlanColor = (plan: Plan): string => {
    const colors: Record<number, string> = {
        1: 'bg-indigo-50', // Free
        2: 'bg-blue-50',   // Basic
        3: 'bg-emerald-50' // Pro
    };

    return colors[plan.id] || 'bg-gray-50';
};

// Payment method details
const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCardIcon className="h-5 w-5" /> },
    { id: 'sbp', name: 'SBP', icon: <BanknoteIcon className="h-5 w-5" /> },
];

export default function Payment({ plan, billingCycle }: { plan: Plan; billingCycle: string }) {
    const { data, setData, post, processing, errors } = useForm({
        planId: plan.id,
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

    // Calculate prices based on billing cycle
    const isYearly = data.billingCycle === 'yearly';
    const isFree = plan.monthly_usd_price === 0;

    // Get price based on billing cycle
    const price = isYearly ? plan.yearly_usd_price : plan.monthly_usd_price;

    // Calculate the annual savings when on yearly plan
    const monthlyCostForYear = plan.monthly_usd_price * 12;
    const yearlySavings = monthlyCostForYear - plan.yearly_usd_price;
    const savingsPercentage = Math.round((yearlySavings / monthlyCostForYear) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment" />
            <div className="flex flex-col space-y-6 p-4">
                <HeadingSmall
                    title="Complete Your Payment"
                    description={`You're upgrading to the ${plan.en_name} Plan with ${isYearly ? 'annual' : 'monthly'} billing`}
                />

                {!isFree ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Plan Summary Card */}
                            <Card>
                                <CardHeader className={`flex flex-row items-center justify-between rounded-t-lg`}>
                                    <div>
                                        <CardTitle>Your Selected Plan: {plan.en_name}</CardTitle>
                                        <CardDescription>{isYearly ? 'Annual subscription' : 'Monthly subscription'}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className="bg-white/50">
                                        {isYearly ? `$${plan.yearly_usd_price}/year` : `$${plan.monthly_usd_price}/month`}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex flex-col space-y-3">
                                        <div className="text-muted-foreground text-sm">Included features:</div>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {plan.features
                                                .filter(feature => feature.included)
                                                .map((feature) => (
                                                    <div key={feature.id} className="flex items-center gap-2">
                                                        <Check className="text-primary h-4 w-4" />
                                                        <span className="text-sm">{feature.en_name}</span>
                                                        {Boolean(feature.popular) && (
                                                            <Badge variant="outline" className="ml-2 bg-blue-100 dark:bg-blue-700 text-xs">
                                                                Popular
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
                                            ← Change plan
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Payment Method Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="h-5 w-5" />
                                        Payment Method
                                    </CardTitle>
                                    <CardDescription>All transactions are secure and encrypted</CardDescription>
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
                                                        <Label htmlFor="card_holder">Card Holder Name</Label>
                                                        <Input
                                                            id="card_holder"
                                                            name="card_holder"
                                                            placeholder="John Doe"
                                                            value={data.card_holder}
                                                            onChange={(e) => setData('card_holder', e.target.value)}
                                                            required
                                                        />
                                                        <InputError message={errors.card_holder} />
                                                    </div>
                                                </div>

                                                <div className="grid gap-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="card_number">Card Number</Label>
                                                        <div className="flex gap-1">
                                                            <img src="/images/card-logos/visa.svg" alt="Visa" className="h-5" />
                                                            <img src="/images/card-logos/mastercard.svg" alt="Mastercard" className="h-5" />
                                                            <img src="/images/card-logos/mir.png" alt="Mir" className="h-5" />
                                                        </div>
                                                    </div>
                                                    <Input
                                                        id="card_number"
                                                        name="card_number"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={data.card_number}
                                                        onChange={(e) => setData('card_number', e.target.value)}
                                                        required
                                                    />
                                                    <InputError message={errors.card_number} />
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                    <div className="grid gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <Label htmlFor="card_expiry">Expiry Date</Label>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Enter the expiration date on your card (MM/YY)</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <Input
                                                            id="card_expiry"
                                                            name="card_expiry"
                                                            placeholder="MM/YY"
                                                            value={data.card_expiry}
                                                            onChange={(e) => setData('card_expiry', e.target.value)}
                                                            required
                                                        />
                                                        <InputError message={errors.card_expiry} />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <div className="flex items-center gap-1">
                                                            <Label htmlFor="card_cvv">Security Code (CVV)</Label>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <HelpCircle className="text-muted-foreground h-4 w-4 cursor-help" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">The 3-digit code on the back of your card</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <Input
                                                            id="card_cvv"
                                                            name="card_cvv"
                                                            placeholder="123"
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
                                                    <AlertTitle>SBP Payment</AlertTitle>
                                                    <AlertDescription>
                                                        You'll receive a QR code to scan with your banking app after submitting.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-between">
                                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                                <span>Your payment information is secure</span>
                                            </div>
                                            <Button type="submit" className="w-full px-8 sm:w-auto" size="lg" disabled={processing}>
                                                {processing ? 'Processing...' : `Pay $${price}${isYearly ? '/year' : '/month'}`}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="space-y-6">
                                {/* Order Summary Card */}
                                <Card className="sticky top-6 border shadow-sm">
                                    <CardHeader className="border-b pb-3">
                                        <CardTitle className="text-xl">Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex items-center justify-between pb-4">
                                                <div>
                                                    <h3 className="font-medium">{plan.en_name} Plan</h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        {isYearly ? 'Annual subscription' : 'Monthly subscription'}
                                                    </p>
                                                </div>
                                                <span className="font-medium">
                                                    ${isYearly ? plan.yearly_usd_price : plan.monthly_usd_price}
                                                    {isYearly ? '/year' : '/month'}
                                                </span>
                                            </div>

                                            {isYearly && yearlySavings > 0 && (
                                                <div className="flex items-center justify-between pb-4 text-sm text-green-600">
                                                    <span>Annual discount ({savingsPercentage}%)</span>
                                                    <span>-${yearlySavings}</span>
                                                </div>
                                            )}
                                            <Separator />

                                            <div className="flex items-center justify-between pt-2">
                                                <span className="font-semibold">Total</span>
                                                <span className="text-xl font-bold">
                                                    ${price}
                                                    {isYearly ? '/year' : '/month'}
                                                </span>
                                            </div>

                                            <div className="text-muted-foreground pt-2 text-xs">
                                                By completing this purchase, you agree to our{' '}
                                                <a href="#" className="text-primary hover:underline">
                                                    Terms of Service
                                                </a>{' '}
                                                and authorize us to charge your payment method on a {isYearly ? 'yearly' : 'monthly'} basis until you
                                                cancel.
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Billing Info Card */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Billing Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-muted-foreground h-4 w-4" />
                                                <span>First billing: Immediately</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ChevronsUp className="text-muted-foreground h-4 w-4" />
                                                <span>You can upgrade or downgrade anytime</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Info className="text-muted-foreground h-4 w-4" />
                                                <span>14-day money-back guarantee</span>
                                            </div>
                                            <div className="text-muted-foreground mt-4 text-xs">
                                                Need help?{' '}
                                                <a href="#" className="text-primary hover:underline">
                                                    Contact our support team
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
                                    <CardTitle>Activate Free Plan</CardTitle>
                                    <CardDescription>{plan.en_description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        <div className="bg-muted/30 rounded-md p-4">
                                            <h3 className="mb-2 font-medium">Included in the Free Plan:</h3>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                {plan.features
                                                    .filter(feature => feature.included)
                                                    .map((feature) => (
                                                        <div key={feature.id} className="flex items-center gap-2">
                                                            <Check className="text-primary h-4 w-4" />
                                                            <span className="text-sm">{feature.en_name}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertTitle>No payment required</AlertTitle>
                                            <AlertDescription>
                                                You can upgrade to a paid plan at any time to access additional features.
                                            </AlertDescription>
                                        </Alert>

                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <Button
                                                onClick={handleSubmit}
                                                className="w-full px-8 sm:w-auto"
                                                size="lg"
                                                disabled={processing}
                                            >
                                                {processing ? 'Processing...' : 'Activate Free Plan'}
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <Link href="/manage-plan">View Other Plans</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="border-muted border shadow-sm">
                                <CardHeader className="border-b pb-3">
                                    <CardTitle className="text-xl">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex flex-col space-y-4">
                                        <div className="border-muted flex items-center justify-between border-b pb-4">
                                            <div>
                                                <h3 className="font-medium">{plan.en_name} Plan</h3>
                                                <p className="text-muted-foreground text-sm">No subscription fee</p>
                                            </div>
                                            <span className="font-medium">${plan.monthly_usd_price}/month</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="font-semibold">Total</span>
                                            <span className="text-xl font-bold">${plan.monthly_usd_price}/month</span>
                                        </div>

                                        {plan.id !== 1 && (
                                            <div className="mt-4 rounded-md bg-blue-50 p-3">
                                                <h4 className="mb-1 text-sm font-medium text-blue-700">Why upgrade to a paid plan?</h4>
                                                <ul className="space-y-1 text-xs text-blue-600">
                                                    {plan.features
                                                        .filter(feature => !feature.included && feature.popular)
                                                        .slice(0, 4)
                                                        .map(feature => (
                                                            <li key={feature.id} className="flex items-center gap-1">
                                                                <Check className="h-3 w-3" />
                                                                <span>{feature.en_name}</span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Security Notice */}
                <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-center text-sm">
                    <Lock className="h-4 w-4" />
                    <span>All payments are secure and encrypted using industry-standard SSL technology</span>
                </div>
            </div>
        </AppLayout>
    );
}
