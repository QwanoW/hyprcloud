import { Button } from '@/components/ui/button';
import { FileIcon } from '@/components/file-manage/file-icon';
import { TFile, FileType } from '@/types';
import { Download } from 'lucide-react';
import SharedLayout from '@/layouts/shared/layout';
import { useLaravelReactI18n } from 'laravel-react-i18n'; // Import the hook
import { useFormatFileSize } from '@/hooks/file-manage/use-format-file-size';

interface SharedPageProps {
    file: TFile;
}

export default function SharedPage({ file }: SharedPageProps) {
    const { t, currentLocale } = useLaravelReactI18n(); // Get the translation function
    const updatedAt = new Date(file.updated_at);
    const locale = currentLocale();

    const handleDownload = () => {
        window.open(file.url, '_blank');
    };

    const renderPreview = () => {
        switch (file.type) {
            case FileType.Image:
                return (
                    <div className="w-full flex justify-center p-6 bg-background/40 backdrop-blur-sm">
                        <img
                            src={file.url}
                            // Alt text typically uses the filename, which is dynamic
                            alt={file.name}
                            className="max-h-[500px] object-contain rounded-lg shadow-md ring-1 ring-accent/20"
                        />
                    </div>
                );
            case FileType.Video:
                return (
                    <div className="w-full p-6 bg-background/40 backdrop-blur-sm">
                        <video
                            src={file.url}
                            controls
                            className="w-full max-h-[500px] object-contain rounded-lg shadow-md ring-1 ring-accent/20"
                            // Consider adding a title attribute if needed, potentially using file.name
                        />
                    </div>
                );
            case FileType.Audio:
                return (
                    <div className="w-full p-8 bg-background/40 backdrop-blur-sm flex flex-col items-center">
                        <div className="w-24 h-24 mb-4 text-primary">
                            <FileIcon file={file} />
                        </div>
                        <audio
                            src={file.url}
                            controls
                            className="w-full ring-1 ring-accent/20 rounded-md"
                             // Consider adding a title attribute if needed
                        />
                    </div>
                );
            default:
                return (
                    <div className="w-full p-8 bg-background/40 backdrop-blur-sm flex justify-center">
                        <div className="w-32 h-32 text-primary">
                            <FileIcon file={file} />
                        </div>
                        {/* Optionally add text like "Preview not available" using t() if desired */}
                    </div>
                );
        }
    };

    return (
        <SharedLayout>
            <div className="flex flex-col">
                {renderPreview()}
                <div className="p-6 border-t border-accent/10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="overflow-hidden">
                            {/* File name is dynamic data */}
                            <h1 className="font-mono text-xl font-semibold mb-2 truncate text-foreground" title={file.name}>
                                {file.name}
                            </h1>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                                {/* File size is formatted dynamically */}
                                <span className="inline-flex items-center bg-accent/10 px-2 py-1 rounded-md">
                                    {useFormatFileSize(file.size)}
                                </span>
                                {/* Date uses translation key for the prefix */}
                                <span className="inline-flex items-center bg-accent/10 px-2 py-1 rounded-md">
                                    {t('shared.details_updated_on')} {updatedAt.toLocaleDateString(locale)}
                                </span>
                                {/* Time is formatted dynamically */}
                                <span className="inline-flex items-center bg-accent/10 px-2 py-1 rounded-md">
                                    {updatedAt.toLocaleTimeString(locale)}
                                </span>
                            </div>
                        </div>
                        <Button
                            onClick={handleDownload}
                            className="flex-shrink-0 bg-primary hover:bg-primary/90 transition-all"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t('shared.button_download')}
                        </Button>
                    </div>
                </div>
            </div>
        </SharedLayout>
    );
}