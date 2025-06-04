import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

interface FileSortProps {
  sortOptions: {
    sort: string;
    direction: 'asc' | 'desc';
  };
  onSortChange: (sort: string) => void;
}

export function FileSort({ sortOptions, onSortChange }: FileSortProps) {
  const { t } = useLaravelReactI18n();

  const sortOptionsList = [
    { value: 'date', label: t('file_manage.sort_option_date') },
    { value: 'alphabet', label: t('file_manage.sort_option_alphabetical') },
    { value: 'size', label: t('file_manage.sort_option_size') }
  ];

  const getCurrentSortLabel = () => {
    const current = sortOptionsList.find(option => option.value === sortOptions.sort);
    return current ? current.label : t('file_manage.sort_option_date');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{t('file_manage.sort_label')}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {getCurrentSortLabel()}
            {sortOptions.direction === 'asc'
              ? <ChevronUp className="h-4 w-4" />
              : <ChevronDown className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {sortOptionsList.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="flex items-center justify-between"
              onClick={() => onSortChange(option.value)}
            >
              <span>{option.label}</span>
              {(sortOptions.sort === option.value) ? (
                sortOptions.direction === 'asc' ?
                <ChevronUp className="h-4 w-4 text-primary" /> :
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-transparent" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}