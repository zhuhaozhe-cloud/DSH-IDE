#!/bin/bash
# DSH-IDE 插件一键安装脚本
# DSH-IDE Plugin One-Click Install Script

set -e

echo "========================================"
echo "  DSH-IDE 插件安装脚本"
echo "  DSH-IDE Plugin Install Script"
echo "========================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}错误：Node.js 未安装${NC}"
        echo "请先安装 Node.js 18+：https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}错误：Node.js 版本过低${NC}"
        echo "需要 Node.js 18+，当前版本：$(node -v)"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Node.js 版本检查通过：$(node -v)${NC}"
}

# 检查 npm
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}错误：npm 未安装${NC}"
        echo "请先安装 npm 9+"
        exit 1
    fi
    
    NPM_VERSION=$(npm -v | cut -d'.' -f1)
    if [ "$NPM_VERSION" -lt 9 ]; then
        echo -e "${RED}错误：npm 版本过低${NC}"
        echo "需要 npm 9+，当前版本：$(npm -v)"
        exit 1
    fi
    
    echo -e "${GREEN}✓ npm 版本检查通过：$(npm -v)${NC}"
}

# 检查 DSH
check_dsh() {
    if ! command -v dsh &> /dev/null; then
        echo -e "${YELLOW}警告：DSH 未安装${NC}"
        echo "请先安装 DSH：npm install -g dsh"
        echo "或者访问：https://github.com/deepseek-ai/dsh"
        read -p "是否继续安装？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✓ DSH 已安装：$(dsh --version 2>/dev/null || echo '未知版本')${NC}"
    fi
}

# 安装插件
install_plugin() {
    echo ""
    echo "正在安装 DSH-IDE 插件..."
    echo "Installing DSH-IDE plugin..."
    echo ""
    
    # 选择安装方式
    echo "请选择安装方式："
    echo "1) 全局安装 (推荐)"
    echo "2) 本地安装"
    echo "3) 从源码安装"
    read -p "请输入选项 (1-3): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            echo "全局安装中..."
            npm install -g dsh-ide-mode
            ;;
        2)
            echo "本地安装中..."
            npm install dsh-ide-mode
            ;;
        3)
            echo "从源码安装中..."
            git clone https://github.com/username/DSH-IDE.git
            cd DSH-IDE
            npm install
            cd packages/dsh-ide-mode
            npm run build
            npm link
            cd ../..
            ;;
        *)
            echo -e "${RED}无效选项${NC}"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}✓ 插件安装完成${NC}"
}

# 配置插件
configure_plugin() {
    echo ""
    echo "配置 DSH-IDE 插件..."
    echo "Configuring DSH-IDE plugin..."
    echo ""
    
    # 创建配置目录
    CONFIG_DIR="$HOME/.dsh"
    mkdir -p "$CONFIG_DIR"
    
    # 检查配置文件是否存在
    CONFIG_FILE="$CONFIG_DIR/config.json"
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "{}" > "$CONFIG_FILE"
    fi
    
    # 创建示例配置
    EXAMPLE_CONFIG="$CONFIG_DIR/dsh-ide-example.json"
    cat > "$EXAMPLE_CONFIG" << 'EOF'
{
  "plugins": {
    "dsh-ide-mode": {
      "enabled": true,
      "version": "0.1.0",
      "config": {
        "theme": "dark",
        "fontSize": 14,
        "tabSize": 2,
        "wordWrap": "on",
        "minimap": true,
        "terminal": true,
        "autoSave": "afterDelay",
        "formatOnSave": true
      }
    }
  }
}
EOF
    
    echo -e "${GREEN}✓ 示例配置已创建：$EXAMPLE_CONFIG${NC}"
    echo "请将配置内容复制到 $CONFIG_FILE"
}

# 测试安装
test_installation() {
    echo ""
    echo "测试安装..."
    echo "Testing installation..."
    echo ""
    
    # 检查插件是否安装成功
    if command -v dsh-ide-mode &> /dev/null; then
        echo -e "${GREEN}✓ 插件命令可用${NC}"
    else
        echo -e "${YELLOW}⚠ 插件命令不可用，但安装可能成功${NC}"
    fi
    
    # 检查 DSH 插件列表
    if command -v dsh &> /dev/null; then
        echo "DSH 插件列表："
        dsh plugin list 2>/dev/null || echo "无法获取插件列表"
    fi
    
    echo ""
    echo -e "${GREEN}✓ 安装测试完成${NC}"
}

# 显示使用说明
show_usage() {
    echo ""
    echo "========================================"
    echo "  安装完成！"
    echo "  Installation Complete!"
    echo "========================================"
    echo ""
    echo "快速开始："
    echo "Quick Start:"
    echo ""
    echo "1. 启动 DSH IDE："
    echo "   dsh ide"
    echo ""
    echo "2. 或者启动 DSH 并加载插件："
    echo "   dsh start --plugin dsh-ide-mode"
    echo ""
    echo "3. 访问 IDE 界面："
    echo "   http://localhost:3000/ide"
    echo ""
    echo "快捷键："
    echo "Keyboard Shortcuts:"
    echo "  Ctrl+Shift+P  命令面板 / Command Palette"
    echo "  Ctrl+P        快速打开 / Quick Open"
    echo "  Ctrl+S        保存文件 / Save File"
    echo "  Ctrl+N        新建文件 / New File"
    echo "  Ctrl+W        关闭标签 / Close Tab"
    echo "  Ctrl+`        切换终端 / Toggle Terminal"
    echo ""
    echo "配置文件："
    echo "Configuration File:"
    echo "  ~/.dsh/config.json"
    echo ""
    echo "示例配置："
    echo "Example Config:"
    echo "  ~/.dsh/dsh-ide-example.json"
    echo ""
    echo "更多帮助："
    echo "More Help:"
    echo "  - 查看文档：PLUGIN-INSTALL-GUIDE.md"
    echo "  - GitHub Issues：https://github.com/username/DSH-IDE/issues"
    echo "  - GitHub Discussions：https://github.com/username/DSH-IDE/discussions"
    echo ""
    echo "感谢使用 DSH-IDE！"
    echo "Thank you for using DSH-IDE!"
    echo ""
}

# 主函数
main() {
    echo "开始安装 DSH-IDE 插件..."
    echo "Starting DSH-IDE plugin installation..."
    echo ""
    
    # 检查环境
    check_node
    check_npm
    check_dsh
    
    # 安装插件
    install_plugin
    
    # 配置插件
    configure_plugin
    
    # 测试安装
    test_installation
    
    # 显示使用说明
    show_usage
}

# 运行主函数
main
