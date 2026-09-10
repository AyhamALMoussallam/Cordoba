$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$destRoot = Join-Path $root "infinityfree-deploy"
$dest = Join-Path $destRoot "htdocs"
$app = Join-Path $dest "laravel"
$php = "C:\xampp2\php\php.exe"
$mysqlDump = "C:\xampp2\mysql\bin\mysqldump.exe"
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host "Building frontend with base /"
Push-Location $frontend
try {
  npx --yes vite build --base /
  node ./scripts/copy-spa.mjs
} finally {
  Pop-Location
}

Write-Host "Preparing InfinityFree htdocs (index.php at root)"
if (Test-Path $dest) {
  Remove-Item $dest -Recurse -Force
}
New-Item -ItemType Directory -Path $app | Out-Null

$excludeDirs = @("vendor", "node_modules", "tests", ".git", "storage", "public")
Get-ChildItem $backend -Force | Where-Object {
  $_.Name -notin $excludeDirs -and $_.Name -ne ".env"
} | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $app $_.Name) -Recurse -Force
}

$storageDirs = @(
  "storage\app\public",
  "storage\app\private",
  "storage\framework\cache\data",
  "storage\framework\sessions",
  "storage\framework\views",
  "storage\framework\testing",
  "storage\logs"
)
foreach ($rel in $storageDirs) {
  New-Item -ItemType Directory -Path (Join-Path $app $rel) -Force | Out-Null
}

Get-ChildItem (Join-Path $backend "storage") -Recurse -Filter ".gitignore" | ForEach-Object {
  $rel = $_.FullName.Substring((Join-Path $backend "storage").Length).TrimStart("\")
  $targetDir = Join-Path $app "storage\$($rel | Split-Path -Parent)"
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
  Copy-Item $_.FullName (Join-Path $app "storage\$rel") -Force
}

New-Item -ItemType Directory -Path (Join-Path $app "bootstrap\cache") -Force | Out-Null
$gitignore = Join-Path $backend "bootstrap\cache\.gitignore"
if (Test-Path $gitignore) {
  Copy-Item $gitignore (Join-Path $app "bootstrap\cache\.gitignore") -Force
}
Get-ChildItem (Join-Path $app "bootstrap\cache") -File | Where-Object { $_.Name -ne ".gitignore" } | Remove-Item -Force

$publicSrc = Join-Path $backend "public"
Get-ChildItem $publicSrc -Force | Where-Object { $_.Name -notin @("index.php", ".htaccess") } | ForEach-Object {
  Copy-Item $_.FullName (Join-Path $dest $_.Name) -Recurse -Force
}

$composerPath = Join-Path $app "composer.json"
$composerJson = [System.IO.File]::ReadAllText($composerPath)
$composerJson = $composerJson.Replace('"optimize-autoloader": true', '"optimize-autoloader": false')
[System.IO.File]::WriteAllText($composerPath, $composerJson)

$keyLine = (Get-Content (Join-Path $backend ".env") | Where-Object { $_ -like "APP_KEY=*" } | Select-Object -First 1)
if (-not $keyLine) { throw "APP_KEY missing in backend/.env" }

@"
APP_NAME=Cordoba
APP_ENV=production
$keyLine
APP_DEBUG=false
APP_URL=https://YOUR-DOMAIN.infinityfreeapp.com

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=sqlXXX.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_XXXX_cordoba
DB_USERNAME=if0_XXXX
DB_PASSWORD=CHANGE_ME

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
CACHE_STORE=file

MAIL_MAILER=log
MAIL_FROM_ADDRESS="info@cordobamt.com"
MAIL_FROM_NAME="`${APP_NAME}"
"@ | Set-Content -Path (Join-Path $app ".env") -Encoding UTF8

@"
DirectoryIndex index.php index.html

RewriteEngine On
RewriteBase /

RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteRule ^index\.php`$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
"@ | Set-Content -Path (Join-Path $dest ".htaccess") -Encoding ASCII

@"
<IfModule mod_authz_core.c>
    Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
    Deny from all
</IfModule>
"@ | Set-Content -Path (Join-Path $app ".htaccess") -Encoding ASCII

@"
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists(`$maintenance = __DIR__.'/laravel/storage/framework/maintenance.php')) {
    require `$maintenance;
}

require __DIR__.'/laravel/vendor/autoload.php';

/** @var Application `$app */
`$app = require_once __DIR__.'/laravel/bootstrap/app.php';
`$app->usePublicPath(__DIR__);
`$app->handleRequest(Request::capture());
"@ | Set-Content -Path (Join-Path $dest "index.php") -Encoding ASCII

Write-Host "Installing Composer production dependencies"
Push-Location $app
try {
  composer install --no-dev --no-scripts --no-interaction
  & $php artisan package:discover --ansi
  composer dump-autoload --no-dev --no-interaction
  & $php artisan optimize:clear
} finally {
  Pop-Location
}

Write-Host "Exporting MySQL dump"
& $mysqlDump -u root --default-character-set=utf8mb4 --add-drop-table --skip-comments cordoba | Out-File -FilePath (Join-Path $destRoot "database.sql") -Encoding utf8

Write-Host "Done: $destRoot"
Write-Host "InfinityFree File Manager must show index.php inside htdocs"
