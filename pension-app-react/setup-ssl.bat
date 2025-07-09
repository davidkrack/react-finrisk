@echo off
echo 🔒 Configurando SSL/HTTPS para Finrisk Systems...

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Este script requiere permisos de administrador
    echo 👉 Ejecuta como administrador
    pause
    exit /b 1
)

echo 📋 PASO 1: Configurar dominio
echo.
echo 🌐 Para usar SSL necesitas:
echo    1. Un dominio (ej: finrisk.tuempresa.com)
echo    2. Apuntar el dominio a tu IP EC2: ec2-54-177-111-101.us-west-1.compute.amazonaws.com
echo.
set /p DOMAIN="Ingresa tu dominio (sin https://): "

if "%DOMAIN%"=="" (
    echo ❌ Dominio requerido
    pause
    exit /b 1
)

echo.
echo 📋 PASO 2: Instalar Certbot para Windows
echo.
echo 📥 Descargando Certbot...
if not exist "C:\certbot" mkdir "C:\certbot"
cd /d "C:\certbot"

REM Descargar certbot si no existe
if not exist "certbot.exe" (
    echo Descarga certbot desde: https://dl.eff.org/certbot-beta-installer-win32.exe
    echo 👉 Ejecuta el instalador y vuelve a ejecutar este script
    pause
    exit /b 1
)

echo.
echo 📋 PASO 3: Detener aplicación temporalmente
echo.
pm2 stop finrisk-server

echo.
echo 📋 PASO 4: Obtener certificado SSL
echo.
echo 🔒 Obteniendo certificado para %DOMAIN%...
certbot certonly --standalone -d %DOMAIN% --non-interactive --agree-tos --email admin@%DOMAIN%

if %errorlevel% neq 0 (
    echo ❌ Error obteniendo certificado
    echo 👉 Verifica que el dominio apunte a tu servidor
    pm2 start finrisk-server
    pause
    exit /b 1
)

echo.
echo 📋 PASO 5: Configurar renovación automática
echo.
schtasks /create /tn "Renovar SSL Finrisk" /tr "C:\certbot\certbot.exe renew --quiet" /sc weekly /mo 1

echo.
echo ✅ Certificado SSL configurado!
echo 📍 Certificados en: C:\Certbot\live\%DOMAIN%\
echo.
echo 📋 SIGUIENTE PASO: Configurar Node.js para HTTPS
echo    👉 Ejecuta: configure-https-server.bat %DOMAIN%
echo.
pause