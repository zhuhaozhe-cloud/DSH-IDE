#!/bin/bash
# DSH-IDE 重新上传脚本
# DSH-IDE Re-upload Script

set -e

echo "========================================"
echo "  DSH-IDE 重新上传脚本"
echo "  DSH-IDE Re-upload Script"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查Git状态
echo -e "${BLUE}检查Git状态...${NC}"
git status

echo ""
echo -e "${BLUE}提交历史：${NC}"
git log --oneline

echo ""
echo -e "${BLUE}远程仓库配置：${NC}"
git remote -v

echo ""
echo -e "${YELLOW}准备重新上传到 GitHub...${NC}"
echo "仓库地址：https://github.com/zhuhaozhe-cloud/DSH-IDE"
echo ""

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}发现未提交的更改，正在提交...${NC}"
    git add .
    git commit -m "feat: 更新项目文件"
    echo -e "${GREEN}✓ 更改已提交${NC}"
else
    echo -e "${GREEN}✓ 没有未提交的更改${NC}"
fi

# 推送到GitHub
echo ""
echo -e "${BLUE}正在推送到 GitHub...${NC}"
echo "仓库地址：https://github.com/zhuhaozhe-cloud/DSH-IDE"
echo "分支：master"
echo ""

try {
    git push origin master
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  重新上传成功！${NC}"
    echo -e "${GREEN}  Re-upload Successful!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "项目已成功上传到 GitHub："
    echo "https://github.com/zhuhaozhe-cloud/DSH-IDE"
    echo ""
    echo "接下来您可以："
    echo "1. 访问 GitHub 仓库查看项目"
    echo "2. 配置仓库设置"
    echo "3. 分享项目链接"
    echo "4. 开始推广项目"
    echo ""
} catch {
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}  上传失败${NC}"
    echo -e "${RED}  Upload Failed${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo "可能的原因："
    echo "1. 网络连接问题"
    echo "2. GitHub 认证失败"
    echo "3. 仓库不存在或没有权限"
    echo ""
    echo "请尝试以下解决方案："
    echo "1. 检查网络连接"
    echo "2. 重新配置 GitHub 认证"
    echo "3. 手动执行：git push origin master"
    echo ""
}

echo ""
echo -e "${BLUE}项目文件统计：${NC}"
echo "总文件数：$(find . -type f -not -path './.git/*' | wc -l)"
echo "总文件夹数：$(find . -type d -not -path './.git*' | wc -l)"
echo ""
echo -e "${BLUE}提交统计：${NC}"
echo "总提交数：$(git log --oneline | wc -l)"
echo "最新提交：$(git log -1 --pretty=format:'%h %s')"
echo ""
