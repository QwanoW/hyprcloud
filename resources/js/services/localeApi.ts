import axios from 'axios';

export const localeApi = {
    setLocale: async (locale: string) => {
        const response = await axios.post('/api/locale', { locale: locale });
        return response.data;
    },
};
