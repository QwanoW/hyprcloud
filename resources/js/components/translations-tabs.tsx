import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function TranslationsToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  const { currentLocale, setLocale, getLocales } = useLaravelReactI18n();
  
  const locales = getLocales();
  const activeLocale = currentLocale();

  return (
    <div
      className={cn(
        'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
        className
      )}
      {...props}
    >
      {locales.map(locale => (
        <button
          key={locale}
          onClick={() => setLocale(locale)}
          className={cn(
            'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
            activeLocale === locale
              ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
          )}
        >
          <span className="ml-1.5 text-sm">{locale.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
