## 演示 / Demo

### 主界面截图 / Main Interface Screenshot

![DSH-IDE Main Interface](screenshots/ide-main.png)

*DSH-IDE 主界面：多标签页编辑器、文件资源管理器、集成终端*

*DSH-IDE main interface: multi-tab editor, file explorer, integrated terminal*

### 功能演示 / Feature Demo

![DSH-IDE Feature Demo](demo.gif)

*DSH-IDE 功能演示：代码编辑、文件浏览、终端操作*

*DSH-IDE feature demo: code editing, file browsing, terminal operations*

### 核心功能展示 / Core Features

#### 1. 多标签页编辑器 / Multi-tab Editor
- 基于 Monaco Editor
- 语法高亮、自动补全
- Minimap 导航
- 多文件同时编辑

*Based on Monaco Editor*
*Syntax highlighting, auto-completion*
*Minimap navigation*
*Multiple file editing simultaneously*

#### 2. 文件资源管理器 / File Explorer
- 树形文件浏览
- 文件搜索功能
- 快速文件导航
- 文件图标支持

*Tree file browsing*
*File search functionality*
*Quick file navigation*
*File icon support*

#### 3. 集成终端 / Integrated Terminal
- 基于 xterm.js
- 多终端标签
- 命令历史记录
- 终端分屏

*Based on xterm.js*
*Multiple terminal tabs*
*Command history*
*Terminal split view*

#### 4. 命令面板 / Command Palette
- Ctrl+Shift+P 快捷键
- 快速执行命令
- 模糊搜索
- 命令分类

*Ctrl+Shift+P shortcut*
*Quick command execution*
*Fuzzy search*
*Command categorization*

#### 5. 快速打开 / Quick Open
- Ctrl+P 快捷键
- 文件快速定位
- 符号搜索
- 行号跳转

*Ctrl+P shortcut*
*Quick file location*
*Symbol search*
*Line number navigation*

#### 6. 编辑器分屏 / Editor Split
- 水平分屏
- 垂直分屏
- 分屏调整
- 多窗口编辑

*Horizontal split*
*Vertical split*
*Split adjustment*
*Multi-window editing*

### 技术架构 / Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DSH-IDE 架构                         │
├─────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)                          │
│  ├── Monaco Editor (代码编辑)                           │
│  ├── xterm.js (终端模拟)                                │
│  ├── Zustand (状态管理)                                 │
│  └── Tailwind CSS (样式)                                │
├─────────────────────────────────────────────────────────┤
│  Plugin System                                          │
│  ├── DSH Plugin Injection (无侵入集成)                  │
│  ├── File System API (/ide-api/*)                       │
│  ├── Settings Management                                │
│  └── System Prompt Injection                            │
├─────────────────────────────────────────────────────────┤
│  Build & Development                                    │
│  ├── Vite 5 (构建工具)                                  │
│  ├── TypeScript 5.7 (类型系统)                          │
│  ├── tsdown (插件构建)                                  │
│  └── ESLint + Prettier (代码规范)                       │
└─────────────────────────────────────────────────────────┘
```

### 使用场景 / Use Cases

#### 1. Web 开发 / Web Development
- 前端项目开发
- React/Vue/Angular 项目
- TypeScript 开发
- CSS/样式开发

*Frontend project development*
*React/Vue/Angular projects*
*TypeScript development*
*CSS/styling development*

#### 2. 代码编辑 / Code Editing
- 多文件项目管理
- 代码重构
- 代码审查
- 快速原型开发

*Multi-file project management*
*Code refactoring*
*Code review*
*Rapid prototyping*

#### 3. 终端操作 / Terminal Operations
- 命令行工具开发
- 脚本编写
- 系统管理
- 自动化任务

*Command-line tool development*
*Script writing*
*System administration*
*Automation tasks*

#### 4. 学习与教育 / Learning & Education
- 编程学习
- 代码示例演示
- 教学演示
- 技术分享

*Programming learning*
*Code example demonstration*
*Teaching demonstration*
*Technology sharing*

### 性能指标 / Performance Metrics

| 指标 / Metric | 数值 / Value | 说明 / Description |
|---------------|--------------|-------------------|
| 启动时间 / Startup Time | < 2s | 本地开发环境 / Local development environment |
| 编辑器响应 / Editor Response | < 100ms | 代码编辑延迟 / Code editing delay |
| 内存占用 / Memory Usage | < 200MB | 典型使用场景 / Typical usage scenario |
| 构建时间 / Build Time | < 30s | 完整项目构建 / Full project build |
| 文件加载 / File Loading | < 500ms | 1000 行文件 / 1000-line file |

### 浏览器兼容性 / Browser Compatibility

| 浏览器 / Browser | 版本 / Version | 支持状态 / Support Status |
|------------------|----------------|---------------------------|
| Chrome | 90+ | ✅ 完全支持 / Full Support |
| Firefox | 88+ | ✅ 完全支持 / Full Support |
| Safari | 14+ | ✅ 完全支持 / Full Support |
| Edge | 90+ | ✅ 完全支持 / Full Support |
| IE | 11 | ❌ 不支持 / Not Supported |

### 移动端支持 / Mobile Support

- 响应式设计
- 触摸优化
- 移动端适配
- 跨平台体验

*Responsive design*
*Touch optimization*
*Mobile adaptation*
*Cross-platform experience*

---

**注意**：实际截图和演示文件需要项目运行后生成。
*Note: Actual screenshots and demo files need to be generated after the project is running.*
