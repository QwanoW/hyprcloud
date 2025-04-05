import { formatFileSizeParts, FormattedFileSizeParts } from "@/lib/utils";
import { useLaravelReactI18n } from "laravel-react-i18n";

export function useFormatFileSize(fileSize: number) {
    const { t, currentLocale } = useLaravelReactI18n();

    const locale = currentLocale();
    const { value, unitKey } = formatFileSizeParts(fileSize, locale);
    const translatedUnit = t(unitKey);
    const displaySize = `${value} ${translatedUnit}`;
    
    return displaySize;
}