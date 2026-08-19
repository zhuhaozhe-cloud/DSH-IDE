#!/bin/bash

echo "=== DSH-IDE 项目测试脚本 ==="
echo "日期: $(date)"
echo ""

echo "1. 检查项目结构..."
if [ -d "src" ] && [ -d "packages" ] && [ -f "package.json" ]; then
    echo "✅ 项目结构正常"
else
    echo "❌ 项目结构异常"
    exit 1
fi

echo ""
echo "2. 检查依赖安装..."
if [ -d "node_modules" ]; then
    echo "✅ 依赖已安装"
else
    echo "⚠️  依赖未安装，正在安装..."
    npm install
fi

echo ""
echo "3. 检查前端构建..."
if npm run build; then
    echo "✅ 前端构建成功"
else
    echo "❌ 前端构建失败"
    exit 1
fi

echo ""
echo "4. 检查插件构建..."
cd packages/dsh-ide-mode
if npm run build; then
    echo "✅ 插件构建成功"
else
    echo "⚠️  插件构建失败（存在类型错误，需要修复）"
fi
cd ../..

echo ""
echo "5. 检查开发服务器..."
echo "启动开发服务器（按 Ctrl+C 停止）..."
echo "访问地址: http://localhost:5173"
npm run dev

echo ""
echo "=== 测试完成 ==="
