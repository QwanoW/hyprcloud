import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, PartyPopper, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manage plan', href: '/manage-plan' },
    { title: 'Payment', href: '/payment' },
    { title: 'Success', href: '/payment/success' },
];

export default function PaymentSuccess() {
    const [countdown, setCountdown] = useState(10);
    const { auth } = usePage<SharedData>().props;
    const currentPlan = auth.user.plan;

    useEffect(() => {
        if (countdown <= 0) {
            router.visit('/dashboard');
        }
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Successful" />
            <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl">
                    <Card className="border shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Payment Successful!</CardTitle>
                            <CardDescription className="text-base">
                                Your payment has been processed and your plan has been updated
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="px-6 py-4">
                            <Alert className="flex items-start gap-3 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/30">
                                <PartyPopper className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                                <div>
                                    <AlertTitle className="font-medium text-blue-800 dark:text-blue-200">
                                        Welcome to the {currentPlan.en_name} Plan
                                    </AlertTitle>
                                    <AlertDescription className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                        You now have access to all {currentPlan.en_name} features. Thank you for your subscription!
                                    </AlertDescription>
                                </div>
                            </Alert>
                            
                            <div className="mt-8 flex flex-col items-center">
                                <Badge 
                                    variant="outline"
                                    className="mb-4 border-2 border-primary/20 bg-primary/10 px-6 py-3 text-base font-medium text-primary dark:border-primary/30 dark:bg-primary/20"
                                >
                                    Your Current Plan: {currentPlan.en_name}
                                </Badge>
                                
                                <div className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                                    {currentPlan.en_description}
                                </div>
                            </div>
                        </CardContent>
                        
                        <CardFooter className="flex flex-col items-center border-t p-6 space-y-4 dark:border-gray-700">
                            <div className="w-full space-y-2">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Redirecting to dashboard in {countdown} seconds</span>
                                    </div>
                                    <span>{countdown} / 10</span>
                                </div>
                                <Progress value={(countdown / 10) * 100} className="h-2" />
                            </div>
                            
                            <Button size="lg" className="mt-4 w-full sm:w-auto">
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    Go to Dashboard Now
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}