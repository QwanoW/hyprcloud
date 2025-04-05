import { PropsWithChildren } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AppLogoIcon from '@/components/app-logo-icon';

export default function SharedLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-card">
            <div className="w-full max-w-3xl">
                <div className="flex justify-center items-center mb-8">
                    <div className="p-2 rounded-full bg-primary/10">
                        <AppLogoIcon className="h-10 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold ml-3 text-foreground">Hyprcloud</h1>
                </div>
                <Card className="w-full shadow-xl border-2 border-accent/10 backdrop-blur-sm bg-card/95">
                    <CardContent className="p-0 overflow-hidden rounded-lg">
                        {children}
                    </CardContent>
                </Card>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Hyprcloud • All rights reserved
                </div>
            </div>
        </div>
    );
}