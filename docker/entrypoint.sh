#!/bin/sh
set -e

if [ ! -f /var/www/html/storage/database.sqlite ]; then
    echo "Creating database.sqlite..."
    touch /var/www/html/storage/database.sqlite
    chown www-data:www-data /var/www/html/storage/database.sqlite
fi

chown -R www-data:www-data /var/www/html/storage

echo "Running migrations..."
php artisan migrate --force

echo "Clearing and caching configuration..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

exec "$@"
