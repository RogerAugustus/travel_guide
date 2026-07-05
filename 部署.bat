@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 📦 正在构建...
call npx vite build
echo 🚀 正在部署到 GitHub Pages...
call npx gh-pages -d dist -m "部署更新 [ci skip]"
echo ✅ 部署完成！
pause
