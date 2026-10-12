#!/bin/sh
set -eu

cd /var/www/html

mkdir -p \
  storage/app/private \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

if [ -z "${APP_KEY:-}" ]; then
  key_file=storage/app/.app_key
  if [ ! -s "$key_file" ]; then
    php -r "echo 'base64:'.base64_encode(random_bytes(32));" > "$key_file"
    chown www-data:www-data "$key_file"
  fi
  export APP_KEY="$(cat "$key_file")"
fi

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
ready=0
i=0
while [ "$i" -lt 60 ]; do
  if php -r '
    try {
      new PDO(
        "mysql:host=".getenv("DB_HOST").";port=".getenv("DB_PORT").";dbname=".getenv("DB_DATABASE"),
        getenv("DB_USERNAME"),
        getenv("DB_PASSWORD")
      );
      exit(0);
    } catch (Throwable $e) {
      exit(1);
    }
  '; then
    ready=1
    break
  fi
  i=$((i + 1))
  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "MySQL did not become ready in time." >&2
  exit 1
fi

php artisan migrate --force

if [ "${SEED_DATABASE:-true}" = "true" ]; then
  php artisan db:seed --force
fi

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
