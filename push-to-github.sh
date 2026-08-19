#!/bin/bash
# GitHub 仓库推送脚本
# GitHub Repository Push Script

echo "========================================"
echo "  DSH-IDE GitHub 仓库推送脚本"
echo "  DSH-IDE GitHub Repository Push Script"
echo "========================================"
echo ""

# 检查是否已安装Git
if ! command -v git &> /dev/null; then
    echo "错误：Git 未安装。请先安装 Git。"
    echo "Error: Git is not installed. Please install Git first."
    exit 1
fi

# 检查是否在Git仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "错误：当前目录不是 Git 仓库。请先运行 git init。"
    echo "Error: Current directory is not a Git repository. Please run git init first."
    exit 1
fi

# 获取GitHub用户名
echo "请输入你的 GitHub 用户名："
echo "Please enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "错误：GitHub 用户名不能为空。"
    echo "Error: GitHub username cannot be empty."
    exit 1
fi

# 设置仓库名称
REPO_NAME="DSH-IDE"
REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "准备推送到 GitHub 仓库："
echo "Preparing to push to GitHub repository:"
echo "仓库地址 / Repository URL: $REMOTE_URL"
echo ""

# 检查是否已添加远程仓库
if git remote get-url origin > /dev/null 2>&1; then
    echo "远程仓库已存在，更新地址..."
    echo "Remote repository exists, updating URL..."
    git remote set-url origin "$REMOTE_URL"
else
    echo "添加远程仓库..."
    echo "Adding remote repository..."
    git remote add origin "$REMOTE_URL"
fi

# 推送代码到GitHub
echo ""
echo "正在推送代码到 GitHub..."
echo "Pushing code to GitHub..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  推送成功！"
    echo "  Push Successful!"
    echo "========================================"
    echo ""
    echo "你的项目已成功推送到 GitHub："
    echo "Your project has been successfully pushed to GitHub:"
    echo "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "接下来你可以："
    echo "Next steps you can:"
    echo "1. 在 GitHub 上设置仓库描述和主题标签"
    echo "   Set up repository description and topics on GitHub"
    echo "2. 添加项目截图和演示"
    echo "   Add project screenshots and demos"
    echo "3. 设置 GitHub Pages 展示项目"
    echo "   Set up GitHub Pages to showcase the project"
    echo "4. 开始推广你的项目"
    echo "   Start promoting your project"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  推送失败"
    echo "  Push Failed"
    echo "========================================"
    echo ""
    echo "可能的原因："
    echo "Possible reasons:"
    echo "1. GitHub 仓库不存在，请先在 GitHub 上创建仓库"
    echo "   GitHub repository does not exist, please create it on GitHub first"
    echo "2. 认证失败，请检查 GitHub 凭据"
    echo "   Authentication failed, please check GitHub credentials"
    echo "3. 网络连接问题"
    echo "   Network connection issues"
    echo ""
    echo "请访问 https://github.com/new 创建仓库："
    echo "Please visit https://github.com/new to create the repository:"
    echo "- 仓库名称 / Repository name: $REPO_NAME"
    echo "- 描述 / Description: DSH-IDE - 将 DSH Web GUI 改造为类 VS Code 的编程 IDE"
    echo "- 可见性 / Visibility: Public"
    echo "- 不要初始化 README / Do not initialize with README"
    echo ""
fi
