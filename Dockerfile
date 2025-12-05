# --- Stage 1: Build Frontend (Bun) ---
FROM oven/bun:1-alpine AS frontend_build
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# --- Stage 2: Base PHP ---
FROM php:8.4-fpm-alpine AS base

RUN apk add --no-cache \
    bash \
    git \
    curl \
    unzip \
    zip \
    icu-libs \
    libzip \
    libpng \
    libjpeg-turbo \
    freetype \
    libavif \
    libwebp \
    libxpm \
    libgomp

RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    linux-headers

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions gd intl zip pdo_mysql bcmath exif pcntl

RUN apk del .build-deps

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html

# --- Stage 3: Development ---
FROM base AS dev

COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN addgroup -g 1000 laravel && adduser -G laravel -g laravel -s /bin/sh -D laravel -u 1000
USER laravel

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]

# --- Stage 4: Production ---
FROM base AS prod

COPY ./docker/php/php.production.ini /usr/local/etc/php/conf.d/production.ini
COPY . .
COPY --from=frontend_build /app/public/build /var/www/html/public/build
RUN rm -rf .git && \
    composer install --no-dev --optimize-autoloader --no-scripts
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER www-data

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
