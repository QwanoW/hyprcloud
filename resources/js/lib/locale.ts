import { localeApi } from "@/services/localeApi";

export const changeLocale = (locale: string) => {
    localStorage.setItem('locale', locale);
    localeApi.setLocale(locale);
}