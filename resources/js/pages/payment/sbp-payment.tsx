import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Clock, ExternalLink, Info, QrCode, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Head, Link, router, usePoll } from '@inertiajs/react';
import { BreadcrumbItem, Payment, Plan } from '@/types';

const PAYMENT_TIMEOUT_MINUTES = 15;
const QR_CODE_LOADING_DELAY_MS = 1000;
const POLL_INTERVAL_MS = 2000;

interface PaymentSbpProps {
    payment: Payment;
    plan: Omit<Plan, 'features'>;
    qrCodeUrl: string;
}

export default function PaymentSbp({ payment, plan, qrCodeUrl }: PaymentSbpProps) {
    if (payment.status === "paid") {
        router.visit('/payment/success');
    }

    const [isLoading, setIsLoading] = useState(true);
    const [secondsElapsed, setSecondsElapsed] = useState(0);

    usePoll(POLL_INTERVAL_MS);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), QR_CODE_LOADING_DELAY_MS);

        const interval = setInterval(() => {
            setSecondsElapsed((prev) => prev + 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(plan.monthly_usd_price || 0);

    const timeRemaining = Math.max(0, PAYMENT_TIMEOUT_MINUTES * 60 - secondsElapsed);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pay via SBP',
            href: '/payment/sbp',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment via SBP" />

            <div className="flex h-full flex-1 flex-col">
                <div className="bg-muted/20 px-4 py-6">
                    <div className="mx-auto flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-semibold">Payment via SBP</h1>
                            <p className="text-muted-foreground text-sm">{plan.en_description || 'Order payment'}</p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Receipt className="text-muted-foreground h-5 w-5" />
                                <div>
                                    <div className="text-muted-foreground text-xs">Order No.</div>
                                    <div className="font-medium">{payment.id}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                <div>
                                    <div className="text-muted-foreground text-xs">Time to pay</div>
                                    <div className="font-medium">
                                        {minutes}:{seconds.toString().padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
                    <div className="mx-auto grid w-full grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="flex flex-col justify-center space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Payment Details</CardTitle>
                                    <CardDescription>Information about your payment</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Amount due:</span>
                                            <span className="text-xl font-bold">{formattedAmount}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Payment method:</span>
                                            <span>Fast Payment System (SBP)</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className="flex items-center">
                                                <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-amber-500"></span>
                                                Waiting for payment
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>Payment Instructions</AlertTitle>
                                <AlertDescription>
                                    <ol className="ml-4 list-decimal space-y-1 pt-2 text-sm">
                                        <li>Scan the QR code with your phone camera</li>
                                        <li>Open a bank app that supports SBP</li>
                                        <li>Confirm the payment in your banking app</li>
                                        <li>Wait for the transaction confirmation</li>
                                    </ol>
                                </AlertDescription>
                            </Alert>

                            <Button className="w-full" variant="default" size="lg" asChild>
                                <Link href={qrCodeUrl}>
                                    <QrCode className="mr-2 h-5 w-5" />
                                    Open for Payment
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center justify-center">
                            <Card className="w-full max-w-md">
                                <CardHeader className="pb-2 text-center">
                                    <CardTitle className="text-lg">Scan the QR Code</CardTitle>
                                    <CardDescription>Use your phone camera or banking app</CardDescription>
                                </CardHeader>

                                <CardContent className="flex justify-center pt-4 pb-8">
                                    {isLoading ? (
                                        <div className="flex h-64 w-64 items-center justify-center">
                                            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="border-muted overflow-hidden rounded-lg border-2 bg-white p-4">
                                            <QRCode
                                                size={240}
                                                value={qrCodeUrl}
                                                viewBox="0 0 256 256"
                                                level="H"
                                                fgColor="#000000"
                                                bgColor="#FFFFFF"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="bg-muted/20 py-6 px-4">
                    <div className="mx-auto flex max-w-6xl items-center justify-center">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                            <span className="text-muted-foreground text-sm">Page will be refreshed automatically after paying</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}