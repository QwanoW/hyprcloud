# Hyprcloud
**Secure and easy file storage.**

![Preview](preview.gif)

## Features ✨

* **File Management**: Upload, rename, move, and delete files.
* **Collections**: Group related files into collections.
* **Sharing**: Share files via secure links.
* **Trash**: Recover deleted files from the trash bin.

## Local Setup 🛠️

```bash
composer install
bun install
cp .env.example .env
php artisan key:generate
docker compose -f compose.dev.yml up -d
bun run dev
```
