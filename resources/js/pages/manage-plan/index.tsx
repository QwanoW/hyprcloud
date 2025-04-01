import { Head, router, usePage } from '@inertiajs/react';
import { Check, Info, X } from 'lucide-react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, Plan, type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage plan',
        href: '/manage-plan',
    },
];

const featureGroupLabels = {
    storage: 'Storage',
    file_upload: 'File Upload Limit',
    sharing: 'Sharing Capabilities',
    support: 'Support Level',
    exports: 'Export Options',
    versioning: 'File Versioning',
    security: 'Security Level',
    mobile: 'Mobile Access',
    api: 'API Access',
    integrations: 'Integrations',
    team: 'Team Collaboration',
    account_manager: 'Account Management',
} as Record<string, string>;

export default function ManagePlan({ plans }: { plans: Plan[] }) {
    const { auth } = usePage<SharedData>().props;
    const currentPlanId = auth.user.plan.id;
    console.log(auth);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    console.log(currentPlanId)
    const handleSelectPlan = (planId: number) => {
        if (planId !== currentPlanId) {
            router.visit('/payment', {
                data: { planId, billingCycle },
                method: 'get',
            });
        }
    };

    const getFeatureGroups = () => {
        const groups = new Set();
        plans.forEach((plan) => {
            plan.features.forEach((feature) => {
                if (feature.group) {
                    groups.add(feature.group);
                }
            });
        });
        return Array.from(groups) as string[];
    };

    const featureGroups = getFeatureGroups();

    const getPlanFeatureByGroup = (planId: number, group: string) => {
        const plan = plans.find((p) => p.id === planId);
        if (!plan) return null;

        return plan.features.find((f) => f.group === group);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage plan" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex flex-col gap-2">
                    <HeadingSmall title="Choose your perfect plan" />
                    <p className="text-muted-foreground max-w-2xl">
                        Select the plan that best fits your needs. All plans include our core features. Upgrade or downgrade at any time.
                    </p>
                </div>
                {/* Billing cycle toggle */}
                <div className="mx-auto flex items-center justify-center gap-4 rounded-lg border border-primary-foreground p-4">
                    <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground'}`}>
                        Monthly billing
                    </span>
                    <Switch checked={billingCycle === 'yearly'} onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')} />
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-primary' : 'text-muted-foreground'}`}>
                            Annual billing
                        </span>
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
                            Save 20%
                        </Badge>
                    </div>
                </div>

                <Tabs defaultValue="cards" className="w-full">
                    <TabsList className="mx-auto mb-6">
                        <TabsTrigger value="cards">Plan Cards</TabsTrigger>
                        <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cards">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {plans.map((plan) => (
                                <Card
                                    key={plan.id}
                                    className={`relative flex flex-col justify-between ${plan.popular ? 'border-primary shadow-md' : ''}`}
                                >
                                    {Boolean(plan.popular) && (
                                        <div className="bg-primary absolute -top-3 right-0 left-0 mx-auto w-fit rounded-full px-3 py-1 text-xs font-medium text-accent">
                                            Most Popular
                                        </div>
                                    )}
                                    <CardHeader className="rounded-t-lg">
                                        <div className="flex items-center gap-2">
                                            {plan.icon}
                                            <CardTitle>{plan.en_name}</CardTitle>
                                        </div>
                                        <CardDescription className="mt-2">{plan.en_description}</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">
                                                ${billingCycle === 'monthly' ? plan.monthly_usd_price : plan.yearly_usd_price}
                                            </span>
                                            <span className="text-muted-foreground ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                                            {currentPlanId === plan.id && (
                                                <Badge variant="outline" className="bg-primary/10 ml-2">
                                                    Current Plan
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="mb-3 font-medium">Popular features:</div>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, index) => {
                                                if (feature.popular && feature.included) {
                                                    return (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                                                            <span>{feature.en_name}</span>
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
                                            {currentPlanId === plan.id ? 'Current Plan' : 'Get Started'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="comparison">
                        <Card>
                            <CardHeader>
                                <CardTitle>Feature Comparison</CardTitle>
                                <CardDescription>Compare all available features across our plans</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="px-4 py-4 text-left">Feature</th>
                                                {plans.map((plan) => (
                                                    <th key={plan.id} className="px-6 py-4 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-lg font-medium">{plan.en_name}</span>
                                                            <span className="text-muted-foreground text-sm">
                                                                ${billingCycle === 'monthly' ? plan.monthly_usd_price : plan.yearly_usd_price}/
                                                                {billingCycle === 'monthly' ? 'mo' : 'yr'}
                                                            </span>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {featureGroups.map((group, index) => {
                                                const groupLabel = featureGroupLabels[group] || group;
                                                return (
                                                    <tr key={index} className="border-b">
                                                        <td className="px-4 py-4 font-medium">{groupLabel}</td>
                                                        {plans.map((plan) => {
                                                            const feature = getPlanFeatureByGroup(plan.id, group);
                                                            return (
                                                                <td key={`${plan.id}-${group}`} className="px-6 py-4 text-center">
                                                                    {feature && feature.included ? (
                                                                        <div className="flex flex-col items-center">
                                                                            <Check className="mx-auto mb-1 h-5 w-5 text-green-500" />
                                                                            <span className="text-sm">{feature.en_name}</span>
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
                                {plans.map((plan) => (
                                    <Button
                                        key={plan.id}
                                        variant={plan.id === currentPlanId ? 'default' : 'outline'}
                                        disabled={currentPlanId === plan.id}
                                        onClick={() => handleSelectPlan(plan.id)}
                                    >
                                        {currentPlanId === plan.id ? `Current: ${plan.en_name}` : `Choose ${plan.en_name}`}
                                    </Button>
                                ))}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* FAQ Section */}
                <div className="mt-6">
                    <h3 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Can I change my plan later?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, with proration for
                                    billing cycles.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">What happens if I exceed my storage?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    You'll receive notifications as you approach your limit. Once reached, you'll need to upgrade your plan or free up
                                    space to upload new files.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Is there a refund policy?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    Yes, we offer a 14-day money-back guarantee for all paid plans. Contact our support team to process your refund.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">What payment methods do you accept?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">
                                    We accept all major credit cards, PayPal, and for annual plans, we also support bank transfers.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Need help section */}
                <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Need help choosing?</AlertTitle>
                    <AlertDescription>
                        Our team is available to help you find the perfect plan for your needs.
                        <Button variant="link" className="h-auto p-0 font-normal">
                            Contact sales
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        </AppLayout>
    );
}
