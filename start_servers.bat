@echo off
title Blood Management System - Server Startup
color 0A
echo ========================================
echo   Blood Management System
echo   Starting Servers...
echo ========================================
echo.

echo [1/2] Starting Django Backend Server...
start "Django Backend - Port 8000" cmd /k "cd /d %~dp0 && python manage.py runserver && pause"
timeout /t 3 /nobreak >nul

echo [2/2] Starting React Frontend Server...
start "React Frontend - Port 3000" cmd /k "cd /d %~dp0frontend && npm start && pause"

echo.
echo ========================================
echo   Servers are starting...
echo ========================================
echo.
echo Django Backend:  http://localhost:8000
echo React Frontend:  http://localhost:3000
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Please wait 10-30 seconds for React to compile...
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul
