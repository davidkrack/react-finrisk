@echo off
echo 🚀 Iniciando Finrisk Systems como servicio de Windows...

REM Cambiar al directorio del proyecto
cd /d "%~dp0"

REM Instalar pm2 globalmente si no existe
npm list -g pm2 >nul 2>&1
if errorlevel 1 (
    echo 📦 Instalando PM2...
    npm install -g pm2
    npm install -g pm2-windows-service
)

REM Detener instancia anterior si existe
echo 🛑 Deteniendo instancias anteriores...
pm2 stop finrisk-server 2>nul
pm2 delete finrisk-server 2>nul

REM Construir aplicación
echo 🔨 Construyendo aplicación...
call npm run build

REM Crear directorio de descargas
if not exist "public\downloads" mkdir "public\downloads"

REM Configurar variables de entorno para producción
set NODE_ENV=production
set PORT=3000

REM Iniciar con PM2
echo 🔄 Iniciando servidor con PM2...
pm2 start src/server.js --name "finrisk-server" --watch false

REM Configurar para que inicie automáticamente
echo ⚙️  Configurando inicio automático...
pm2 save
pm2-service-install -n "FinriskServer"

echo ✅ Finrisk Systems configurado como servicio de Windows
echo 🌐 Aplicación disponible en: http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:3000
echo.
echo 📝 Comandos PM2 útiles:
echo    - Ver estado: pm2 status
echo    - Ver logs: pm2 logs finrisk-server
echo    - Reiniciar: pm2 restart finrisk-server
echo    - Detener: pm2 stop finrisk-server
echo.
pause