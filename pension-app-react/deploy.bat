@echo off
echo 🚀 Iniciando despliegue de Finrisk Systems en Windows Server...

REM 1. Instalar dependencias
echo 📦 Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

REM 2. Construir la aplicación React
echo 🔨 Construyendo aplicación React...
call npm run build
if errorlevel 1 (
    echo ❌ Error en build de React
    pause
    exit /b 1
)

REM 3. Detener procesos anteriores de Node.js
echo 🛑 Deteniendo procesos anteriores...
taskkill /f /im node.exe /t 2>nul
timeout /t 3 /nobreak >nul

REM 4. Crear directorio de descargas si no existe
echo 📁 Creando directorios necesarios...
if not exist "public\downloads" mkdir "public\downloads"

REM 5. Verificar que el puerto esté libre
echo 🔍 Verificando puerto 3000...
netstat -an | findstr :3000 >nul
if %errorlevel% == 0 (
    echo ⚠️  Puerto 3000 aún ocupado, esperando...
    timeout /t 5 /nobreak >nul
)

REM 6. Iniciar servidor
echo 🔄 Iniciando servidor Finrisk...
start "Finrisk Server" cmd /k "node src/server.js"

REM 7. Esperar que el servidor inicie
timeout /t 3 /nobreak >nul

REM 8. Verificar que el servidor está funcionando
echo 🧪 Verificando servidor...
curl http://localhost:3000/test >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Servidor iniciado correctamente!
    echo 🌐 Aplicación disponible en: http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:3000
) else (
    echo ❌ Error: Servidor no responde
    echo 📋 Revisa la ventana del servidor para ver errores
)

echo.
echo 📝 Comandos útiles:
echo    - Ver estado: curl http://localhost:3000/test
echo    - Detener: taskkill /f /im node.exe
echo    - Ver logs: revisar la ventana "Finrisk Server"
echo.
pause