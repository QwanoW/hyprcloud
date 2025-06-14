import { FileIcon } from '@/components/file-manage/file-icon';
import { Button } from '@/components/ui/button';
import { useFormatFileSize } from '@/hooks/file-manage/use-format-file-size';
import SharedLayout from '@/layouts/shared/layout';
import { FileType, TFile } from '@/types';
import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Archive, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SharedPageProps {
    file: TFile;
    sharedLink: {
        allow_download: boolean;
        token: string;
    };
}

export default function SharedPage({ file, sharedLink }: SharedPageProps) {
    const { t, currentLocale } = useLaravelReactI18n(); // Get the translation function
    const updatedAt = new Date(file.updated_at);
    const locale = currentLocale();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!sharedLink.allow_download || isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await fetch(`/shared/${sharedLink.token}/download`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Get filename from Content-Disposition header or use file name
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = file.name;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            // Fallback to window.open if fetch fails
            window.open(`/shared/${sharedLink.token}/download`);
        } finally {
            setIsDownloading(false);
        }
    };

    const renderPreview = () => {
        switch (file.type) {
            case FileType.Image:
                return (
                    <div className="bg-background/40 flex w-full justify-center p-6 backdrop-blur-sm">
                        <img src={file.url} alt={file.name} className="ring-accent/20 max-h-[500px] rounded-lg object-contain shadow-md ring-1" />
                    </div>
                );
            case FileType.Video:
                return (
                    <div className="bg-background/40 w-full p-6 backdrop-blur-sm">
                        <video src={file.url} controls className="ring-accent/20 max-h-[500px] w-full rounded-lg object-contain shadow-md ring-1" />
                    </div>
                );
            case FileType.Audio:
                return (
                    <div className="bg-background/40 flex w-full flex-col items-center p-8 backdrop-blur-sm">
                        <div className="text-primary mb-4 h-24 w-24">
                            <FileIcon file={file} />
                        </div>
                        <audio src={file.url} controls className="ring-accent/20 w-full rounded-md ring-1" />
                    </div>
                );
            case FileType.Folder:
                return (
                    <div className="bg-background/40 flex w-full flex-col items-center p-8 backdrop-blur-sm">
                        <div className="text-primary mb-4 h-32 w-32">
                            <FileIcon file={file} />
                        </div>
                        {file.size > 0 && <p className="text-muted-foreground text-center">{t('shared.folder_preview_text')}</p>}
                    </div>
                );
            default:
                return (
                    <div className="bg-background/40 flex w-full justify-center p-8 backdrop-blur-sm">
                        <div className="text-primary h-32 w-32">
                            <FileIcon file={file} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <SharedLayout>
            <Head title={file.name} />
            <div className="flex flex-col">
                {renderPreview()}
                <div className="border-accent/10 border-t p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="overflow-hidden">
                            {/* File name is dynamic data */}
                            <h1 className="text-foreground mb-2 truncate font-mono text-xl font-semibold" title={file.name}>
                                {file.name}
                            </h1>
                            <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                                {/* File size is formatted dynamically */}
                                <span className="bg-accent/10 inline-flex items-center rounded-md px-2 py-1">{useFormatFileSize(file.size)}</span>
                                {/* Date uses translation key for the prefix */}
                                <span className="bg-accent/10 inline-flex items-center rounded-md px-2 py-1">
                                    {t('shared.details_updated_on')} {updatedAt.toLocaleDateString(locale)}
                                </span>
                                {/* Time is formatted dynamically */}
                                <span className="bg-accent/10 inline-flex items-center rounded-md px-2 py-1">
                                    {updatedAt.toLocaleTimeString(locale)}
                                </span>
                            </div>
                        </div>
                        {sharedLink.allow_download && (
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="bg-primary hover:bg-primary/90 flex-shrink-0 transition-all disabled:opacity-50"
                            >
                                {isDownloading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : file.type === FileType.Folder ? (
                                    <Archive className="mr-2 h-4 w-4" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                {isDownloading
                                    ? t('shared.button_downloading')
                                    : file.type === FileType.Folder
                                      ? t('shared.button_download_folder')
                                      : t('shared.button_download')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </SharedLayout>
    );
}
