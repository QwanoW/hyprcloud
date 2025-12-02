import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import i18n from 'laravel-react-i18n/vite';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        i18n(),
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 10240,
            brotliOptions: {
                level: 11,
            },
            deleteOriginFile: false,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
