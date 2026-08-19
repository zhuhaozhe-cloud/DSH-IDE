@echo off
REM DSH-IDE 插件一键安装脚本 (Windows)
REM DSH-IDE Plugin One-Click Install Script (Windows)

echo ========================================
echo   DSH-IDE 插件安装脚本
echo   DSH-IDE Plugin Install Script
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误：Node.js 未安装
    echo Error: Node.js is not installed
    echo 请先安装 Node.js 18+：https://nodejs.org/
    echo Please install Node.js 18+ first: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误：npm 未安装
    echo Error: npm is not installed
    pause
    exit /b 1
)

REM 检查 DSH
where dsh >nul 2>nul
if %errorlevel% neq 0 (
    echo 警告：DSH 未安装
    echo Warning: DSH is not installed
    echo 请先安装 DSH：npm install -g dsh
    echo Please install DSH first: npm install -g dsh
    set /p continue="是否继续安装？(y/N): "
    if /i not "%continue%"=="y" (
        exit /b 1
    )
)

echo.
echo 正在安装 DSH-IDE 插件...
echo Installing DSH-IDE plugin...
echo.

REM 选择安装方式
echo 请选择安装方式：
echo Please select installation method:
echo 1) 全局安装 (推荐) / Global install (Recommended)
echo 2) 本地安装 / Local install
echo 3) 从源码安装 / Install from source
set /p choice="请输入选项 (1-3): "

if "%choice%"=="1" (
    echo 全局安装中...
    echo Installing globally...
    npm install -g dsh-ide-mode
) else if "%choice%"=="2" (
    echo 本地安装中...
    echo Installing locally...
    npm install dsh-ide-mode
) else if "%choice%"=="3" (
    echo 从源码安装中...
    echo Installing from source...
    git clone https://github.com/username/DSH-IDE.git
    cd DSH-IDE
    npm install
    cd packages\dsh-ide-mode
    npm run build
    npm link
    cd ..\..
) else (
    echo 无效选项
    echo Invalid option
    pause
    exit /b 1
)

echo.
echo ========================================
echo   安装完成！
echo   Installation Complete!
echo ========================================
echo.
echo 快速开始：
echo Quick Start:
echo.
echo 1. 启动 DSH IDE：
echo    dsh ide
echo.
echo 2. 或者启动 DSH 并加载插件：
echo    dsh start --plugin dsh-ide-mode
echo.
echo 3. 访问 IDE 界面：
echo    http://localhost:3000/ide
echo.
echo 快捷键：
echo Keyboard Shortcuts:
echo   Ctrl+Shift+P  命令面板 / Command Palette
echo   Ctrl+P        快速打开 / Quick Open
echo   Ctrl+S        保存文件 / Save File
echo   Ctrl+N        新建文件 / New File
echo   Ctrl+W        关闭标签 / Close Tab
echo   Ctrl+`        切换终端 / Toggle Terminal
echo.
echo 配置文件：
echo Configuration File:
echo   %USERPROFILE%\.dsh\config.json
echo.
echo 更多帮助：
echo More Help:
echo   - 查看文档：PLUGIN-INSTALL-GUIDE.md
echo   - GitHub Issues：https://github.com/username/DSH-IDE/issues
echo.
echo 感谢使用 DSH-IDE！
echo Thank you for using DSH-IDE!
echo.

pause
