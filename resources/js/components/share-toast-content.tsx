import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useLaravelReactI18n } from 'laravel-react-i18n';

export const ShareToastContent = ({ link }: { link: string }) => {
    const { t } = useLaravelReactI18n();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };

    return (
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-accent-foreground">{t('components.share_toast_title')}</p>
          <a
            href={link}
            className="text-sm text-blue-600 hover:text-blue-800 truncate block max-w-[250px]"
            target="_blank"
            rel="noopener noreferrer"
            title={link}
          >
            {link.length > 40 ? `${link.slice(0, 30)}...${link.slice(-10)}` : link}
          </a>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          aria-label={t('components.share_toast_copy_aria_label')}
        >
          <Copy className={`w-4 h-4 ${isCopied ? 'opacity-0' : 'opacity-100'} transition-opacity`} />
          <Check className={`w-4 h-4 absolute top-2 left-2 ${isCopied ? 'opacity-100' : 'opacity-0'} text-green-600 transition-opacity`} />
        </button>
      </div>
    );
  };