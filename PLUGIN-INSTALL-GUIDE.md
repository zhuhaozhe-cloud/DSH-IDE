# DSH-IDE 插件安装指南

## 📦 插件简介

DSH-IDE 是一个将 DSH (DeepSeek Harness) Web GUI 改造为类 VS Code 编程 IDE 的插件。通过安装此插件，用户可以在 DSH 环境中获得完整的编程 IDE 体验。

## 🔧 安装前准备

### 系统要求
- **操作系统**：Windows 10/11, macOS 10.15+, Linux (Ubuntu 18.04+)
- **Node.js**：18.0 或更高版本
- **npm**：9.0 或更高版本
- **DSH**：已安装并配置好的 DSH 环境

### 检查环境
```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 DSH 是否已安装
dsh --version
```

## 🚀 安装方法

### 方法一：从 npm 安装（推荐）

```bash
# 全局安装 DSH-IDE 插件
npm install -g dsh-ide-mode

# 或者本地安装到项目目录
npm install dsh-ide-mode
```

### 方法二：从 GitHub 安装

```bash
# 克隆仓库
git clone https://github.com/username/DSH-IDE.git
cd DSH-IDE

# 安装依赖
npm install

# 构建插件
cd packages/dsh-ide-mode
npm run build

# 链接到全局
npm link
```

### 方法三：使用 DSH 插件管理器

```bash
# 使用 DSH 插件管理器安装
dsh plugin install dsh-ide-mode

# 或者从本地路径安装
dsh plugin install ./path/to/dsh-ide-mode
```

## ⚙️ 配置 DSH 使用插件

### 1. 配置文件位置
DSH 插件配置文件通常位于：
- **Windows**: `%USERPROFILE%\.dsh\config.json`
- **macOS/Linux**: `~/.dsh/config.json`

### 2. 添加插件配置
在 DSH 配置文件中添加以下内容：

```json
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
        "terminal": true
      }
    }
  }
}
```

### 3. 环境变量配置（可选）
```bash
# 设置 DSH 插件目录
export DSH_PLUGIN_DIR=~/.dsh/plugins

# 设置 DSH IDE 配置
export DSH_IDE_THEME=dark
export DSH_IDE_FONT_SIZE=14
```

## 🎯 使用插件

### 1. 启动 DSH IDE 模式
```bash
# 启动 DSH 并加载 IDE 插件
dsh start --plugin dsh-ide-mode

# 或者使用快捷命令
dsh ide
```

### 2. 访问 IDE 界面
启动后，DSH 会自动打开浏览器，访问：
```
http://localhost:3000/ide
```

### 3. 基本操作
- **打开文件**：Ctrl+P (快速打开)
- **命令面板**：Ctrl+Shift+P
- **保存文件**：Ctrl+S
- **新建文件**：Ctrl+N
- **关闭标签**：Ctrl+W

## 🔌 插件功能

### 核心功能
- ✅ **多标签页编辑器**：基于 Monaco Editor
- ✅ **文件资源管理器**：树形文件浏览
- ✅ **集成终端**：基于 xterm.js
- ✅ **命令面板**：快速执行命令
- ✅ **快速打开**：文件快速定位
- ✅ **编辑器分屏**：水平/垂直分屏

### 配置选项
```json
{
  "theme": "dark",           // 主题：dark/light
  "fontSize": 14,           // 字体大小
  "tabSize": 2,             // Tab 大小
  "wordWrap": "on",         // 自动换行
  "minimap": true,          // 显示小地图
  "terminal": true,         // 启用终端
  "autoSave": "afterDelay", // 自动保存
  "formatOnSave": true      // 保存时格式化
}
```

## 🛠️ 故障排除

### 常见问题

#### 1. 插件无法加载
```bash
# 检查插件是否正确安装
npm list -g dsh-ide-mode

# 重新安装插件
npm uninstall -g dsh-ide-mode
npm install -g dsh-ide-mode
```

#### 2. 端口被占用
```bash
# 查看端口占用情况
netstat -ano | findstr :3000  # Windows
lsof -i :3000                # macOS/Linux

# 更改端口配置
dsh config set port 3001
```

#### 3. 权限问题
```bash
# Linux/macOS 修复权限
sudo chown -R $(whoami) ~/.dsh

# Windows 以管理员身份运行
# 右键点击命令提示符 -> 以管理员身份运行
```

#### 4. 依赖冲突
``ash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules
npm install
```

### 日志文件
插件日志文件位于：
- **Windows**: `%USERPROFILE%\.dsh\logs\ide-plugin.log`
- **macOS/Linux**: `~/.dsh/logs/ide-plugin.log`

查看日志：
```bash
# 实时查看日志
tail -f ~/.dsh/logs/ide-plugin.log  # macOS/Linux
Get-Content ~/.dsh/logs/ide-plugin.log -Wait  # Windows PowerShell
```

## 🔄 更新插件

### 检查更新
```bash
# 检查可用更新
npm outdated -g dsh-ide-mode

# 更新到最新版本
npm update -g dsh-ide-mode
```

### 版本管理
```bash
# 查看当前版本
npm list -g dsh-ide-mode

# 安装特定版本
npm install -g dsh-ide-mode@0.1.0

# 回退到旧版本
npm install -g dsh-ide-mode@0.0.9
```

## 🧹 卸载插件

### 完全卸载
```bash
# 卸载插件
npm uninstall -g dsh-ide-mode

# 清理配置文件
# 手动删除 ~/.dsh/config.json 中的插件配置

# 清理缓存
npm cache clean --force
```

### 保留配置卸载
```bash
# 仅卸载插件，保留配置
npm uninstall -g dsh-ide-mode

# 配置文件中的设置会保留
# 重新安装时会自动恢复配置
```

## 📚 高级配置

### 自定义主题
```json
{
  "themes": {
    "custom-dark": {
      "name": "Custom Dark",
      "type": "dark",
      "colors": {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "sideBar.background": "#252526"
      }
    }
  }
}
```

### 快捷键自定义
```json
{
  "keybindings": {
    "ctrl+shift+p": "commandPalette",
    "ctrl+p": "quickOpen",
    "ctrl+s": "save",
    "ctrl+shift+s": "saveAll"
  }
}
```

### 终端配置
```json
{
  "terminal": {
    "shell": "/bin/bash",
    "fontSize": 14,
    "cursorStyle": "line",
    "copyOnSelect": true
  }
}
```

## 🤝 获取帮助

### 社区支持
- **GitHub Issues**: https://github.com/username/DSH-IDE/issues
- **GitHub Discussions**: https://github.com/username/DSH-IDE/discussions
- **文档**: https://github.com/username/DSH-IDE/wiki

### 贡献代码
1. Fork 项目
2. 创建功能分支
3. 提交 Pull Request
4. 参与代码审查

### 报告问题
1. 使用 GitHub Issues
2. 选择合适模板
3. 提供详细信息：
   - 操作系统版本
   - Node.js 版本
   - DSH 版本
   - 错误日志
   - 重现步骤

## 📖 相关文档

- [README.md](README.md) - 项目介绍
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [GITHUB-SETUP.md](GITHUB-SETUP.md) - GitHub 设置
- [QUICK-START.md](QUICK-START.md) - 快速开始
- [DEMO.md](DEMO.md) - 功能演示

---

**DSH-IDE** - 将 DSH Web GUI 改造为类 VS Code 的编程 IDE

*让编程更简单，让开发更高效*

🚀 **开始您的现代化编程体验！**
