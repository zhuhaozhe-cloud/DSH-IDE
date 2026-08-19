#!/bin/bash

echo "=== DSH-IDE 插件测试脚本 ==="
echo "日期: $(date)"
echo ""

echo "1. 检查插件构建状态..."
cd packages/dsh-ide-mode
if [ -f "lib/client.js" ] && [ -f "lib/index.js" ]; then
    echo "✅ 插件构建成功"
    echo "   - 客户端文件: lib/client.js"
    echo "   - 宿主文件: lib/index.js"
else
    echo "❌ 插件构建失败"
    exit 1
fi

echo ""
echo "2. 检查插件文件大小..."
ls -lh lib/*.js lib/*.d.ts

echo ""
echo "3. 检查插件依赖..."
echo "检查 @types/node 是否安装..."
if npm list @types/node > /dev/null 2>&1; then
    echo "✅ @types/node 已安装"
else
    echo "❌ @types/node 未安装"
fi

echo ""
echo "4. 检查 TypeScript 配置..."
if [ -f "tsconfig.json" ]; then
    echo "✅ TypeScript 配置存在"
else
    echo "❌ TypeScript 配置缺失"
fi

echo ""
echo "5. 测试插件类型检查..."
if npm run typecheck > /dev/null 2>&1; then
    echo "✅ 类型检查通过"
else
    echo "❌ 类型检查失败"
fi

echo ""
echo "=== 插件测试完成 ==="
