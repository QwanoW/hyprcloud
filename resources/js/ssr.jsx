/* prettier-ignore */
import {
    createInertiaApp
} from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx', {
                eager: true,
            });
            return pages[`./pages/${name}.tsx`];
        },
        // prettier-ignore
        setup: ({ App, props }) => {
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            return (
                <LaravelReactI18nProvider
                    locale={'ru'}
                    fallbackLocale={'en'}
                    files={import.meta.glob('/lang/*.json', { eager: true })}
                >
                    <App {...props} />
                </LaravelReactI18nProvider>
            )
        },
    }),
);
