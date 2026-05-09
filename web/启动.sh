#!/bin/bash

echo "========================================"
echo "   党费记账软件 - 一键启动"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "[1/3] 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "错误：未检测到 Node.js，请先安装 Node.js"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js 已安装"

echo ""
echo "[2/3] 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误：依赖安装失败"
        exit 1
    fi
    echo "✓ 依赖安装完成"
else
    echo "✓ 依赖已存在"
fi

echo ""
echo "[3/3] 启动服务器..."
echo ""
echo "========================================"
echo "   服务器启动中..."
echo "   请在浏览器中打开：http://localhost:3000"
echo "========================================"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
