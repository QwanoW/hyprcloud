#!/bin/sh
set -e

# Создаем файл базы данных в папке storage, если его нет
if [ ! -f /var/www/html/storage/database.sqlite ]; then
    echo "Creating database.sqlite..."
    touch /var/www/html/storage/database.sqlite
    # Убеждаемся, что права правильные (www-data)
    chown www-data:www-data /var/www/html/storage/database.sqlite
fi

php artisan optimize:clear

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link

echo "Running migrations..."
php artisan migrate --force

exec "$@"
