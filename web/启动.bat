@echo off
chcp 65001 >nul
title 党费记账软件

echo ========================================
echo    党费记账软件 - 一键启动
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未检测到 Node.js，请先安装 Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

echo.
echo [2/3] 检查依赖...
if not exist "node_modules" (
    echo 首次运行，正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo 错误：依赖安装失败
        pause
        exit /b 1
    )
    echo ✓ 依赖安装完成
) else (
    echo ✓ 依赖已存在
)

echo.
echo [3/3] 启动服务器...
echo.
echo ========================================
echo    服务器启动中...
echo    请在浏览器中打开：http://localhost:3000
echo ========================================
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause
