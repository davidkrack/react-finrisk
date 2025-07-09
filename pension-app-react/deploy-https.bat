@echo off
echo 🔒 Desplegando Finrisk Systems con HTTPS...

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Este script requiere permisos de administrador
    echo 👉 Ejecuta como administrador
    pause
    exit /b 1
)

REM Solicitar dominio
set /p DOMAIN="Ingresa tu dominio (ej: finrisk.tuempresa.com): "
if "%DOMAIN%"=="" (
    echo ❌ Dominio requerido
    pause
    exit /b 1
)

REM Configurar variables de entorno
set NODE_ENV=production
set DOMAIN=%DOMAIN%

echo 📦 Instalando dependencias...
call npm install

echo 🔨 Construyendo aplicación...
call npm run build

echo 🛑 Deteniendo servicios anteriores...
pm2 stop finrisk-server 2>nul
pm2 delete finrisk-server 2>nul

REM Verificar certificados SSL
set SSL_PATH=C:\Certbot\live\%DOMAIN%
if not exist "%SSL_PATH%\cert.pem" (
    echo ⚠️  Certificados SSL no encontrados en %SSL_PATH%
    echo 👉 Ejecuta primero: setup-ssl.bat
    pause
    exit /b 1
)

echo 📁 Creando directorios...
if not exist "public\downloads" mkdir "public\downloads"

echo 🔒 Iniciando servidor HTTPS...
pm2 start src/server-https.js --name "finrisk-server" --env production

REM Configurar firewall para puertos HTTPS
echo 🔥 Configurando firewall...
netsh advfirewall firewall add rule name="HTTPS - Puerto 443" dir=in action=allow protocol=TCP localport=443
netsh advfirewall firewall add rule name="HTTP - Puerto 80" dir=in action=allow protocol=TCP localport=80

echo ⚙️  Configurando inicio automático...
pm2 save

echo ✅ Finrisk Systems desplegado con HTTPS!
echo 🌐 Aplicación disponible en: https://%DOMAIN%
echo 🔒 Certificado SSL activo
echo.
echo 📋 URLs importantes:
echo    - HTTPS: https://%DOMAIN%
echo    - Test: https://%DOMAIN%/test
echo    - Descargas: https://%DOMAIN%/downloads/
echo.
echo 📝 Para WordPress usa: https://%DOMAIN%
echo.
pause