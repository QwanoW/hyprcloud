import DashboardLayout from '@/layouts/dashboard/layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Upload,
    FolderPlus,
    MousePointer2,
    Share2,
    Trash2,
    Search,
    Download,
    Eye,
    Move,
    Edit,
    Archive,
    RotateCcw,
    Plus,
    Grid3X3,
    Image,
    LayoutGrid,
    BarChart3,
    type LucideIcon
} from 'lucide-react';

interface HelpItem {
    icon: LucideIcon;
    title: string;
    description: string;
    steps?: string[];
}

interface HelpSection {
    title: string;
    description: string;
    items: HelpItem[];
}

export default function Help() {
    const { t } = useLaravelReactI18n();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.help'),
            href: '/dashboard/help',
        }
    ];

    const sections: HelpSection[] = [
        {
            title: t('help.file_management.title'),
            description: t('help.file_management.description'),
            items: [
                {
                    icon: Upload,
                    title: t('help.file_management.upload.title'),
                    description: t('help.file_management.upload.description'),
                    steps: [
                        t('help.file_management.upload.step1'),
                        t('help.file_management.upload.step2'),
                        t('help.file_management.upload.step3')
                    ]
                },
                {
                    icon: MousePointer2,
                    title: t('help.file_management.selection.title'),
                    description: t('help.file_management.selection.description'),
                    steps: [
                        t('help.file_management.selection.step1'),
                        t('help.file_management.selection.step2'),
                        t('help.file_management.selection.step3')
                    ]
                },
                {
                    icon: FolderPlus,
                    title: t('help.file_management.folders.title'),
                    description: t('help.file_management.folders.description'),
                    steps: [
                        t('help.file_management.folders.step1'),
                        t('help.file_management.folders.step2'),
                        t('help.file_management.folders.step3')
                    ]
                }
            ]
        },
        {
            title: t('help.collections.title'),
            description: t('help.collections.description'),
            items: [
                {
                    icon: Plus,
                    title: t('help.collections.create.title'),
                    description: t('help.collections.create.description'),
                    steps: [
                        t('help.collections.create.step1'),
                        t('help.collections.create.step2'),
                        t('help.collections.create.step3')
                    ]
                },
                {
                    icon: Grid3X3,
                    title: t('help.collections.organize.title'),
                    description: t('help.collections.organize.description'),
                    steps: [
                        t('help.collections.organize.step1'),
                        t('help.collections.organize.step2')
                    ]
                }
            ]
        },
        {
            title: t('help.file_actions.title'),
            description: t('help.file_actions.description'),
            items: [
                {
                    icon: Share2,
                    title: t('help.file_actions.sharing.title'),
                    description: t('help.file_actions.sharing.description'),
                    steps: [
                        t('help.file_actions.sharing.step1'),
                        t('help.file_actions.sharing.step2'),
                        t('help.file_actions.sharing.step3')
                    ]
                },
                {
                    icon: Download,
                    title: t('help.file_actions.download.title'),
                    description: t('help.file_actions.download.description'),
                    steps: [
                        t('help.file_actions.download.step1'),
                        t('help.file_actions.download.step2')
                    ]
                },
                {
                    icon: Move,
                    title: t('help.file_actions.move.title'),
                    description: t('help.file_actions.move.description'),
                    steps: [
                        t('help.file_actions.move.step1'),
                        t('help.file_actions.move.step2'),
                        t('help.file_actions.move.step3')
                    ]
                },
                {
                    icon: Edit,
                    title: t('help.file_actions.rename.title'),
                    description: t('help.file_actions.rename.description'),
                    steps: [
                        t('help.file_actions.rename.step1'),
                        t('help.file_actions.rename.step2')
                    ]
                },
                {
                    icon: Trash2,
                    title: t('help.file_actions.delete.title'),
                    description: t('help.file_actions.delete.description'),
                    steps: [
                        t('help.file_actions.delete.step1'),
                        t('help.file_actions.delete.step2')
                    ]
                }
            ]
        },
        {
            title: t('help.navigation.title'),
            description: t('help.navigation.description'),
            items: [
                {
                    icon: LayoutGrid,
                    title: t('help.navigation.all_files.title'),
                    description: t('help.navigation.all_files.description')
                },
                {
                    icon: Image,
                    title: t('help.navigation.gallery.title'),
                    description: t('help.navigation.gallery.description')
                },
                {
                    icon: Share2,
                    title: t('help.navigation.shared.title'),
                    description: t('help.navigation.shared.description')
                },
                {
                    icon: Trash2,
                    title: t('help.navigation.trash.title'),
                    description: t('help.navigation.trash.description')
                },
                {
                    icon: Search,
                    title: t('help.navigation.search.title'),
                    description: t('help.navigation.search.description')
                },
                {
                    icon: BarChart3,
                    title: t('help.navigation.analytics.title'),
                    description: t('help.navigation.analytics.description')
                }
            ]
        },
        {
            title: t('help.advanced.title'),
            description: t('help.advanced.description'),
            items: [
                {
                    icon: Archive,
                    title: t('help.advanced.bulk_download.title'),
                    description: t('help.advanced.bulk_download.description'),
                    steps: [
                        t('help.advanced.bulk_download.step1'),
                        t('help.advanced.bulk_download.step2')
                    ]
                },
                {
                    icon: RotateCcw,
                    title: t('help.advanced.restore.title'),
                    description: t('help.advanced.restore.description'),
                    steps: [
                        t('help.advanced.restore.step1'),
                        t('help.advanced.restore.step2')
                    ]
                },
                {
                    icon: Eye,
                    title: t('help.advanced.preview.title'),
                    description: t('help.advanced.preview.description'),
                    steps: [
                        t('help.advanced.preview.step1'),
                        t('help.advanced.preview.step2')
                    ]
                }
            ]
        }
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title={t('breadcrumb.help')} />
            <div className="container mx-auto p-4 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{t('help.title')}</h1>
                    <p className="text-muted-foreground text-lg">
                        {t('help.description')}
                    </p>
                </div>

                <div className="space-y-8">
                    {sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-4">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                                <p className="text-muted-foreground">{section.description}</p>
                            </div>
                            
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item, itemIndex) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Card key={itemIndex} className="h-full">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                        <IconComponent className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                                    </div>
                                                </div>
                                                <CardDescription className="text-sm">
                                                    {item.description}
                                                </CardDescription>
                                            </CardHeader>
                                            {item.steps && (
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium">{t('help.steps')}:</h4>
                                                        <ol className="space-y-1 text-sm text-muted-foreground">
                                                            {item.steps.map((step: string, stepIndex: number) => (
                                                                <li key={stepIndex} className="flex gap-2">
                                                                    <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                                                        {stepIndex + 1}
                                                                    </Badge>
                                                                    <span>{step}</span>
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                            
                            {sectionIndex < sections.length - 1 && <Separator className="my-8" />}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}