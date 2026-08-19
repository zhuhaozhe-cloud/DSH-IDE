# DSH-IDE 插件一键安装脚本 (PowerShell)
# DSH-IDE Plugin One-Click Install Script (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DSH-IDE 插件安装脚本" -ForegroundColor Cyan
Write-Host "  DSH-IDE Plugin Install Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误：Node.js 未安装" -ForegroundColor Red
    Write-Host "请先安装 Node.js 18+：https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 检查 npm
try {
    $npmVersion = npm -v
    Write-Host "✓ npm 已安装: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "错误：npm 未安装" -ForegroundColor Red
    exit 1
}

# 检查 DSH
try {
    $dshVersion = dsh --version 2>$null
    Write-Host "✓ DSH 已安装: $dshVersion" -ForegroundColor Green
} catch {
    Write-Host "警告：DSH 未安装" -ForegroundColor Yellow
    Write-Host "请先安装 DSH：npm install -g dsh" -ForegroundColor Yellow
    $continue = Read-Host "是否继续安装？(y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

Write-Host ""
Write-Host "正在安装 DSH-IDE 插件..." -ForegroundColor Cyan
Write-Host "Installing DSH-IDE plugin..." -ForegroundColor Cyan
Write-Host ""

# 选择安装方式
Write-Host "请选择安装方式：" -ForegroundColor Yellow
Write-Host "1) 全局安装 (推荐)" -ForegroundColor White
Write-Host "2) 本地安装" -ForegroundColor White
Write-Host "3) 从源码安装" -ForegroundColor White
$choice = Read-Host "请输入选项 (1-3)"

switch ($choice) {
    "1" {
        Write-Host "全局安装中..." -ForegroundColor Cyan
        npm install -g dsh-ide-mode
    }
    "2" {
        Write-Host "本地安装中..." -ForegroundColor Cyan
        npm install dsh-ide-mode
    }
    "3" {
        Write-Host "从源码安装中..." -ForegroundColor Cyan
        git clone https://github.com/username/DSH-IDE.git
        cd DSH-IDE
        npm install
        cd packages\dsh-ide-mode
        npm run build
        npm link
        cd ..\..
    }
    default {
        Write-Host "无效选项" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  安装完成！" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "快速开始：" -ForegroundColor Cyan
Write-Host "Quick Start:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 启动 DSH IDE：" -ForegroundColor White
Write-Host "   dsh ide" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. 或者启动 DSH 并加载插件：" -ForegroundColor White
Write-Host "   dsh start --plugin dsh-ide-mode" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. 访问 IDE 界面：" -ForegroundColor White
Write-Host "   http://localhost:3000/ide" -ForegroundColor Yellow
Write-Host ""

Write-Host "快捷键：" -ForegroundColor Cyan
Write-Host "Keyboard Shortcuts:" -ForegroundColor Cyan
Write-Host "  Ctrl+Shift+P  命令面板 / Command Palette" -ForegroundColor White
Write-Host "  Ctrl+P        快速打开 / Quick Open" -ForegroundColor White
Write-Host "  Ctrl+S        保存文件 / Save File" -ForegroundColor White
Write-Host "  Ctrl+N        新建文件 / New File" -ForegroundColor White
Write-Host "  Ctrl+W        关闭标签 / Close Tab" -ForegroundColor White
Write-Host "  Ctrl+`        切换终端 / Toggle Terminal" -ForegroundColor White
Write-Host ""

Write-Host "配置文件：" -ForegroundColor Cyan
Write-Host "Configuration File:" -ForegroundColor Cyan
Write-Host "  ~/.dsh/config.json" -ForegroundColor Yellow
Write-Host ""

Write-Host "更多帮助：" -ForegroundColor Cyan
Write-Host "More Help:" -ForegroundColor Cyan
Write-Host "  - 查看文档：PLUGIN-INSTALL-GUIDE.md" -ForegroundColor White
Write-Host "  - GitHub Issues：https://github.com/username/DSH-IDE/issues" -ForegroundColor White
Write-Host ""

Write-Host "感谢使用 DSH-IDE！" -ForegroundColor Green
Write-Host "Thank you for using DSH-IDE!" -ForegroundColor Green
Write-Host ""

Read-Host "按 Enter 键退出"
