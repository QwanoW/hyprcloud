import { useState, useEffect } from 'react';
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLaravelReactI18n } from 'laravel-react-i18n';

export default function FileSort() {
  const { t } = useLaravelReactI18n();
  const [sortOption, setSortOption] = useState({
    sort: 'date',
    direction: 'desc'
  });

  const sortOptions = [
    { value: 'date', label: t('file_manage.sort_option_date') },
    { value: 'alphabet', label: t('file_manage.sort_option_alphabetical') },
    { value: 'size', label: t('file_manage.sort_option_size') }
  ];

  useEffect(() => {
    const url = new URL(window.location.href);
    const sortParam = url.searchParams.get('sort');
    const directionParam = url.searchParams.get('direction');

    if (sortParam && ['date', 'alphabet', 'size'].includes(sortParam)) {
      setSortOption({
        sort: sortParam,
        direction: directionParam === 'asc' ? 'asc' : 'desc'
      });
    }
  }, []);

  const handleSort = (sort: string) => {
    const direction = (sortOption.sort === sort && sortOption.direction === 'desc') ? 'asc' : 'desc';

    const newSortOption = {
      sort,
      direction
    };

    setSortOption(newSortOption);

    router.reload({
      data: newSortOption,
    });
  };

  const getCurrentSortLabel = () => {
    const current = sortOptions.find(option => option.value === sortOption.sort);
    return current ? current.label : t('file_manage.sort_option_date');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{t('file_manage.sort_label')}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {getCurrentSortLabel()}
            {sortOption.direction === 'asc'
              ? <ChevronUp className="h-4 w-4" />
              : <ChevronDown className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="flex items-center justify-between"
              onClick={() => handleSort(option.value)}
            >
              <span>{option.label}</span>
              {(sortOption.sort === option.value) ? (
                sortOption.direction === 'asc' ?
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