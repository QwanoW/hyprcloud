import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Check, Cloud, Lock, Menu, Search, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <Head title="Welcome" />
            <header className="bg-background sticky top-0 z-40 border-b">
                <div className="container mx-auto flex h-16 items-center justify-between py-4">
                    <div className="flex items-center gap-2">
                        <Cloud className="text-primary h-6 w-6" />
                        <span className="text-xl font-bold">Hyprcloud</span>
                    </div>

                    <div className="hidden items-center gap-6 md:flex">
                        <nav className="flex items-center gap-6">
                            <Link href="#features" className="hover:text-primary text-sm font-medium">
                                Features
                            </Link>
                            <Link href="#testimonials" className="hover:text-primary text-sm font-medium">
                                Testimonials
                            </Link>
                            <Link href="#pricing" className="hover:text-primary text-sm font-medium">
                                Pricing
                            </Link>
                            <Link href="#contact" className="hover:text-primary text-sm font-medium">
                                Contact
                            </Link>
                        </nav>
                        {auth.user ? (
                            // Logged in view
                            <Button asChild>
                                <Link href="dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            // Guest view
                            <>
                                <Button asChild>
                                    <Link href="login">Try it free</Link>
                                </Button>
                                <AppearanceToggleDropdown />
                            </>
                        )}
                    </div>

                    <button className="flex items-center md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="container mx-auto py-4 pb-6 md:hidden">
                        <nav className="flex flex-col gap-4">
                            <Link href="#features" className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Features
                            </Link>
                            <Link href="#testimonials" className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Testimonials
                            </Link>
                            <Link href="#pricing" className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Pricing
                            </Link>
                            <Link href="#contact" className="hover:text-primary text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                                Contact
                            </Link>
                            {auth.user ? (
                                // Logged in view
                                <Button asChild>
                                    <Link href="dashboard">Dashboard</Link>
                                </Button>
                            ) : (
                                // Guest view
                                <>
                                    <Button asChild>
                                        <Link href="login">Try it free</Link>
                                    </Button>
                                    <AppearanceToggleDropdown />
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 md:py-32">
                    <div className="container mx-auto flex flex-col items-center text-center">
                        {/* Background Elements */}
                        <div className="from-background to-background/50 absolute inset-0 -z-10 bg-gradient-to-b" />
                        <div className="from-primary/20 via-background to-background absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

                        {/* Decorative Elements */}
                        <div className="bg-primary/5 absolute top-1/4 left-0 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" aria-hidden="true" />
                        <div className="bg-primary/10 absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 rounded-full blur-3xl" aria-hidden="true" />

                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.02]"
                            aria-hidden="true"
                        />

                        {/* Floating Shapes */}
                        <div
                            className="bg-primary/10 absolute top-[20%] left-[15%] h-16 w-16 animate-pulse rounded md:h-24 md:w-24"
                            aria-hidden="true"
                        />
                        <div
                            className="bg-primary/20 absolute right-[15%] bottom-[20%] h-10 w-10 animate-pulse rounded-full delay-700 md:h-16 md:w-16"
                            aria-hidden="true"
                        />
                        <div
                            className="bg-primary/10 absolute bottom-[10%] left-[10%] h-8 w-8 animate-pulse rounded-full delay-1000 md:h-12 md:w-12"
                            aria-hidden="true"
                        />
                        <div
                            className="bg-primary/5 absolute top-[10%] right-[20%] h-12 w-12 animate-pulse rounded-lg delay-300 md:h-20 md:w-20"
                            aria-hidden="true"
                        />

                        {/* Diagonal Lines */}
                        <div
                            className="via-primary/20 absolute top-[5%] left-[20%] hidden h-[300px] w-[1px] rotate-[30deg] bg-gradient-to-b from-transparent to-transparent md:block"
                            aria-hidden="true"
                        />
                        <div
                            className="via-primary/10 absolute right-[20%] bottom-[5%] hidden h-[200px] w-[1px] rotate-[-30deg] bg-gradient-to-b from-transparent to-transparent md:block"
                            aria-hidden="true"
                        />

                        <h1 className="relative z-10 max-w-3xl text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                            Your Files, Securely Stored in the Cloud
                        </h1>

                        <p className="text-muted-foreground relative z-10 mt-6 max-w-[600px] md:text-xl">
                            Experience seamless file management with Hyprcloud. Secure uploads, intelligent organization, and effortless sharing — all
                            in one platform.
                        </p>

                        <div className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="text-base">
                                Get Started Free
                            </Button>
                            <Button size="lg" variant="outline" className="text-base">
                                Learn More
                            </Button>
                        </div>

                        {/*<div className="mt-16 relative w-full max-w-4xl z-10">*/}
                        {/*    /!* Decorative elements around the image *!/*/}
                        {/*    <div*/}
                        {/*        className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary/30 rounded-tl-lg"*/}
                        {/*        aria-hidden="true"*/}
                        {/*    />*/}
                        {/*    <div*/}
                        {/*        className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary/30 rounded-br-lg"*/}
                        {/*        aria-hidden="true"*/}
                        {/*    />*/}

                        {/*    <div className="relative">*/}
                        {/*        <div*/}
                        {/*            className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-xl blur opacity-30"*/}
                        {/*            aria-hidden="true"*/}
                        {/*        />*/}
                        {/*        <img*/}
                        {/*            src="https://placehold.co/1200x600"*/}
                        {/*            alt="Hyprcloud dashboard preview"*/}
                        {/*            className="relative rounded-lg border shadow-xl"*/}
                        {/*        />*/}
                        {/*    </div>*/}

                        {/*    /!* Floating dots *!/*/}
                        {/*    <div className="absolute -right-8 top-1/4 flex gap-1.5" aria-hidden="true">*/}
                        {/*        <div className="h-2 w-2 rounded-full bg-primary/40" />*/}
                        {/*        <div className="h-2 w-2 rounded-full bg-primary/60" />*/}
                        {/*        <div className="h-2 w-2 rounded-full bg-primary/80" />*/}
                        {/*    </div>*/}
                        {/*    <div className="absolute -left-8 bottom-1/4 flex gap-1.5" aria-hidden="true">*/}
                        {/*        <div className="h-2 w-2 rounded-full bg-primary/80" />*/}
                        {/*        <div className="h-2 w-2 rounded-full bg-primary/60" />*/}
                        {/*        <div className="h-2 w-2 rounded-full bg-primary/40" />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-muted/50 py-20">
                    <div className="container mx-auto">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features for Your Files</h2>
                            <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">
                                Everything you need to store, organize, and share your files securely
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-background">
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                        <Cloud className="text-primary h-8 w-8" />
                                    </div>
                                    <CardTitle>Seamless Uploads</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Effortlessly upload files of any size with our MinIO integration for lightning-fast transfers.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background">
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                        <Search className="text-primary h-8 w-8" />
                                    </div>
                                    <CardTitle>Intelligent Organization</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Find any file instantly with our powerful search and automatic file categorization system.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background">
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                        <Share2 className="text-primary h-8 w-8" />
                                    </div>
                                    <CardTitle>Secure Sharing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Share files with anyone using secure links with customizable permissions and expiration dates.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-background">
                                <CardHeader>
                                    <div className="bg-primary/10 mb-4 h-12 w-12 rounded-lg p-2">
                                        <Lock className="text-primary h-8 w-8" />
                                    </div>
                                    <CardTitle>Reliable Backup</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Rest easy knowing your data is protected with automatic backups and enterprise-grade security.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20">
                    <div className="container mx-auto">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trusted by Thousands</h2>
                            <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">
                                See what our customers have to say about Hyprcloud
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                            <span className="text-primary font-bold">JD</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Jane Doe</CardTitle>
                                            <CardDescription>Marketing Director</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "Hyprcloud has transformed how our team collaborates. The secure sharing features have made it so much easier
                                        to work with clients across the globe."
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                            <span className="text-primary font-bold">MS</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Michael Smith</CardTitle>
                                            <CardDescription>Software Engineer</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "The speed and reliability of Hyprcloud is unmatched. I can upload large files in seconds, and the search
                                        functionality helps me find anything instantly."
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                                            <span className="text-primary font-bold">AT</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Alex Thompson</CardTitle>
                                            <CardDescription>Small Business Owner</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        "As a small business, data security is crucial for us. Hyprcloud gives us enterprise-level protection at a
                                        price we can afford. It's been a game-changer."
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="bg-muted/50 py-20">
                    <div className="container mx-auto">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
                            <p className="text-muted-foreground mx-auto mt-4 max-w-[700px] text-xl">Choose the plan that works for you</p>
                        </div>

                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">$9</span>
                                        <span className="text-muted-foreground ml-1">/month</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>100GB storage</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>10GB file upload limit</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Basic sharing features</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Email support</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Get Started</Button>
                                </CardFooter>
                            </Card>

                            <Card className="border-primary">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Pro</CardTitle>
                                        <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">Popular</span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">$19</span>
                                        <span className="text-muted-foreground ml-1">/month</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>1TB storage</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>50GB file upload limit</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Advanced sharing & permissions</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Priority support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>File versioning</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Get Started</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Enterprise</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">$49</span>
                                        <span className="text-muted-foreground ml-1">/month</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>5TB storage</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Unlimited file upload size</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Advanced security controls</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>24/7 dedicated support</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Custom integration options</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="text-primary h-5 w-5" />
                                            <span>Admin dashboard</span>
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full">Contact Sales</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto">
                        <div className="bg-primary/5 mx-auto max-w-4xl rounded-2xl p-8 text-center md:p-12">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
                            <p className="text-muted-foreground mx-auto mt-4 max-w-[600px] text-xl">
                                Join thousands of satisfied customers who trust Hyprcloud with their important files. Try it free for 14 days.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                <Button size="lg" className="text-base">
                                    Start Your Free Trial
                                </Button>
                                <Button size="lg" variant="outline" className="text-base">
                                    Schedule a Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-muted/30 border-t py-12">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Cloud className="text-primary h-6 w-6" />
                                <span className="text-xl font-bold">Hyprcloud</span>
                            </div>
                            <p className="text-muted-foreground text-sm">Secure cloud storage for individuals and businesses of all sizes.</p>
                            <div className="mt-4 flex gap-4">
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-twitter"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-facebook"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-linkedin"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect width="4" height="12" x="2" y="9" />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 font-medium">Product</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Security
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Integrations
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 font-medium">Resources</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Support Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Status
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-4 font-medium">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
                        <p>© {new Date().getFullYear()} Hyprcloud. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
