@echo off
echo 🔥 Configurando Firewall de Windows para Finrisk Systems...

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Este script requiere permisos de administrador
    echo 👉 Ejecuta como administrador
    pause
    exit /b 1
)

REM Agregar regla para puerto 3000
echo 📡 Agregando regla de firewall para puerto 3000...
netsh advfirewall firewall add rule name="Finrisk Systems - Puerto 3000" dir=in action=allow protocol=TCP localport=3000

REM Agregar regla para Node.js
echo 📡 Agregando regla para Node.js...
netsh advfirewall firewall add rule name="Node.js - Finrisk" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe"

REM Verificar reglas creadas
echo 🔍 Verificando reglas del firewall...
netsh advfirewall firewall show rule name="Finrisk Systems - Puerto 3000"

echo ✅ Firewall configurado correctamente
echo 🌐 Puerto 3000 habilitado para conexiones externas
echo.
pause