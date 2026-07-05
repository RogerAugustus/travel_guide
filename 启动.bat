@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 🚀 正在启动旅行路书...
start "" http://localhost:5173
npx vite --host --port 5173
pause
