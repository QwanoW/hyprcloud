import { Footer } from '@/components/home/footer';
import { Header } from '@/components/home/header';
import { PropsWithChildren } from 'react';

export default function Homelayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
