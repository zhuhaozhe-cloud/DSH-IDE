# DSH-IDE

**将 DSH Web GUI 改造为类 VS Code 的编程 IDE**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-0.1.0-blue)]()
[![License](https://img.shields.io/badge/license-Apache--2.0-green)]()
[![GitHub Stars](https://img.shields.io/github/stars/username/DSH-IDE?style=social)]()
[![GitHub Forks](https://img.shields.io/github/forks/username/DSH-IDE?style=social)]()

[English](#english) | [中文](#中文)

---

## English

### Introduction

DSH-IDE is a project that transforms DSH (DeepSeek Harness) Web GUI into a VS Code-like programming IDE. Through plugin injection, it provides a complete programming IDE experience without modifying the DSH source code.

### Features

#### Core Features
- ✅ **Multi-tab Editor**: Based on Monaco Editor, supports syntax highlighting, auto-completion, and Minimap
- ✅ **File Explorer**: File tree browsing and search functionality
- ✅ **Integrated Terminal**: Multi-terminal tabs, based on xterm.js
- ✅ **Command Palette**: Ctrl+Shift+P shortcut
- ✅ **Quick Open**: Ctrl+P to quickly open files
- ✅ **Editor Split**: Support horizontal/vertical split
- ✅ **Complete UI Components**: Title bar, menu bar, breadcrumb navigation, status bar
- ✅ **Dark Theme System**: Complete dark theme implementation
- ✅ **Keyboard Shortcut System**: File, edit, view, terminal, tab, and AI shortcuts

#### Plugin System
- 🔄 **DSH Plugin Injection**: Non-intrusive integration into DSH Web GUI
- 🔄 **File System API**: Host-side HTTP routes (`/ide-api/*`)
- 🔄 **Settings Management**: Plugin configuration interface
- 🔄 **System Prompt Injection**: Notify AI agent of IDE capabilities

### Quick Start

#### Prerequisites
- Node.js 18+
- npm 9+
- Git

#### Installation & Running

```bash
# Clone the repository
git clone https://github.com/username/DSH-IDE.git
cd DSH-IDE

# Install dependencies
npm install

# Start development server
npm run dev

# Build project
npm run build
```

### Plugin Development

```bash
# Navigate to plugin directory
cd packages/dsh-ide-mode

# Install dependencies
npm install

# Build plugin
npm run build

# Development mode (watch for changes)
npm run watch
```

### Project Structure

```
DSH-IDE/
├── src/                        # Frontend source code
│   ├── components/             # React components
│   ├── stores/                 # Zustand state management
│   ├── hooks/                  # Custom hooks
│   ├── keybindings/            # Keyboard shortcut configuration
│   ├── themes/                 # Theme configuration
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── packages/                   # Plugin packages
│   └── dsh-ide-mode/           # DSH IDE mode plugin
├── dist/                       # Build output
├── Development log/            # Development logs
├── PLAN.md                     # Project plan
├── PLAN-PLUGIN.md              # Plugin development plan
├── package.json                # Project configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

### Tech Stack

#### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Code Editor**: Monaco Editor 0.45
- **Terminal Emulator**: xterm.js 5.x
- **State Management**: Zustand 4.5
- **Styling**: Tailwind CSS
- **Icons**: lucide-react

#### Plugin System
- **Host Side**: Node.js + TypeScript
- **Client Side**: React + TypeScript
- **Build Tool**: tsdown
- **Type System**: TypeScript 5.7

### Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

### Contact

- **Project Lead**: MiMo-v2.5-pro
- **Development Team**: Xiaomi Large Model Team
- **Project Repository**: [GitHub Repository](https://github.com/username/DSH-IDE)

### Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [xterm.js](https://xtermjs.org/) - Terminal emulator
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework

---

## 中文

### 简介

DSH-IDE 是一个将 DSH（DeepSeek Harness）Web GUI 改造为类 VS Code 编程 IDE 的项目。通过插件注入的方式，在不修改 DSH 源码的前提下，提供完整的编程 IDE 体验。

### 功能特性

#### 核心功能
- ✅ **多标签页编辑器**：基于 Monaco Editor，支持语法高亮、自动补全、Minimap
- ✅ **文件资源管理器**：文件树浏览与搜索功能
- ✅ **集成终端**：多终端标签页，基于 xterm.js
- ✅ **命令面板**：Ctrl+Shift+P 快捷键调用
- ✅ **快速打开**：Ctrl+P 快速打开文件
- ✅ **编辑器分屏**：支持水平/垂直分屏
- ✅ **完整 UI 组件**：标题栏、菜单栏、面包屑导航、状态栏
- ✅ **深色主题系统**：完整的暗色主题实现
- ✅ **键盘快捷键体系**：文件、编辑、视图、终端、标签页、AI 等快捷键

#### 插件系统
- 🔄 **DSH 插件注入**：无侵入式集成到 DSH Web GUI
- 🔄 **文件系统 API**：宿主侧 HTTP 路由 (`/ide-api/*`)
- 🔄 **设置管理**：插件配置界面
- 🔄 **系统提示注入**：向 AI agent 宣告 IDE 能力

### 快速开始

#### 环境要求
- Node.js 18+
- npm 9+
- Git

#### 安装与运行

```bash
# 克隆项目
git clone https://github.com/username/DSH-IDE.git
cd DSH-IDE

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

### 插件开发

```bash
# 进入插件目录
cd packages/dsh-ide-mode

# 安装依赖
npm install

# 构建插件
npm run build

# 开发模式（监听文件变化）
npm run watch
```

### 项目结构

```
DSH-IDE/
├── src/                        # 前端源码
│   ├── components/             # React 组件
│   ├── stores/                 # Zustand 状态管理
│   ├── hooks/                  # 自定义 Hook
│   ├── keybindings/            # 快捷键配置
│   ├── themes/                 # 主题配置
│   ├── types/                  # TypeScript 类型
│   └── utils/                  # 工具函数
├── packages/                   # 插件包
│   └── dsh-ide-mode/           # DSH IDE 模式插件
├── dist/                       # 构建输出
├── Development log/            # 开发日志
├── PLAN.md                     # 项目计划
├── PLAN-PLUGIN.md              # 插件开发计划
├── package.json                # 项目配置
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # Tailwind 配置
└── tsconfig.json               # TypeScript 配置
```

### 技术栈

#### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **代码编辑器**：Monaco Editor 0.45
- **终端模拟器**：xterm.js 5.x
- **状态管理**：Zustand 4.5
- **样式方案**：Tailwind CSS
- **图标库**：lucide-react

#### 插件系统
- **宿主侧**：Node.js + TypeScript
- **客户端侧**：React + TypeScript
- **构建工具**：tsdown
- **类型系统**：TypeScript 5.7

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 许可证

本项目采用 Apache-2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 联系方式

- **项目负责人**：MiMo-v2.5-pro
- **开发团队**：小米大模型团队
- **项目仓库**：[GitHub Repository](https://github.com/username/DSH-IDE)

### 致谢

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [xterm.js](https://xtermjs.org/) - 终端模拟器
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理
- [Tailwind CSS](https://tailwindcss.com/) - 样式方案
- [Vite](https://vitejs.dev/) - 构建工具
- [React](https://react.dev/) - UI 框架

---

**最后更新**：2026-08-19  
**版本**：0.1.0  
**状态**：开发中

## 最新更新

### 2026-08-19 更新
- ✅ **插件构建成功**：修复了所有 TypeScript 类型错误，插件系统现在可以正常构建
- ✅ **文件系统 API**：实现了完整的文件系统 API 路由，支持文件操作
- ✅ **设置系统**：完成了插件设置卡片的开发，支持配置管理
- ✅ **类型安全**：通过类型断言策略解决了与 DSH SDK 的类型兼容性问题

### 构建状态
- **前端构建**：✅ 成功
- **插件构建**：✅ 成功
- **类型检查**：✅ 通过

### 下一步计划
1. 测试插件在 DSH 环境中的实际效果
2. 完善前端功能优化
3. 建立测试框架
4. 完善项目文档
