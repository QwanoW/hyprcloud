import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getFormattedPrice, getLocalizedField } from '@/lib/utils';
import { Plan } from '@/types';
import { Link } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

export function PlanCard({ plan }: { plan: Plan }) {
    const { t, currentLocale } = useLaravelReactI18n();
    const locale = currentLocale();

    return (
        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle>{getLocalizedField(plan, 'name', locale)}</CardTitle>
                <div className="mt-4">
                    <span className="text-4xl font-bold">{getFormattedPrice(plan, 'monthly', locale)}</span>
                    <span className="text-muted-foreground ml-1">{t('home.pricing_month_suffix')}</span>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature) => (
                        <li className="flex items-center gap-2">
                            <Check className="text-primary h-5 w-5" />
                            <span>{getLocalizedField(feature, 'name', locale)}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={route('payment.index', { billingCycle: 'monthly', planId: plan.id })}>{t('home.pricing_button_get_started')}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
