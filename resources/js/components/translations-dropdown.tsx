import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { changeLocale } from '@/lib/locale';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { Check, Globe } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function TranslationsToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  const { currentLocale, setLocale, getLocales, loading } = useLaravelReactI18n();

  if (loading) return null;

  const locales = getLocales();

  const getLocaleLabel = (locale: string) => {
    switch (locale) {
      case 'en':
        return 'English';
      case 'ru':
        return 'Русский';
      default:
        return locale;
    }
  };

  const onChange = (locale: string) => {
    setLocale(locale);
    changeLocale(locale);
  }

  return (
    <div className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {locales.map((locale) => (
            <DropdownMenuItem key={locale} onClick={() => onChange(locale)}>
              <span className="flex items-center gap-2">
                {getLocaleLabel(locale)}
                {currentLocale() === locale && <Check className="h-5 w-5" />}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
