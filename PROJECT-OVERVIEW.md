# DSH-IDE 项目概览

## 项目简介

DSH-IDE 是一个将 DSH（DeepSeek Harness）Web GUI 改造为类 VS Code 编程 IDE 的项目。通过插件注入的方式，在不修改 DSH 源码的前提下，提供完整的编程 IDE 体验。

## 技术架构

### 前端技术栈
- **框架**：React 18 + TypeScript
- **构建工具**：Vite 5
- **代码编辑器**：Monaco Editor 0.45
- **终端模拟器**：xterm.js 5.x
- **状态管理**：Zustand 4.5
- **样式方案**：Tailwind CSS
- **图标库**：lucide-react

### 插件系统
- **宿主侧**：Node.js + TypeScript
- **客户端侧**：React + TypeScript
- **构建工具**：tsdown
- **类型系统**：TypeScript 5.7

## 核心功能

### 1. 代码编辑器
- 多标签页管理
- 语法高亮（支持 50+ 语言）
- 代码自动补全
- Minimap 导航
- 代码折叠
- 多光标编辑

### 2. 文件资源管理器
- 文件树浏览
- 文件搜索（支持正则表达式）
- 文件操作（创建、重命名、删除）
- 文件图标显示
- 快速打开文件（Ctrl+P）

### 3. 集成终端
- 多终端标签
- 终端分屏
- 命令历史
- 终端搜索
- 自定义主题

### 4. 用户界面
- VS Code 风格布局
- 深色/浅色主题
- 命令面板（Ctrl+Shift+P）
- 快捷键系统
- 状态栏信息显示

### 5. 插件系统
- 无侵入式注入
- 设置管理
- API 路由扩展
- 系统提示注入
- 热重载支持

## 项目结构

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

## 开发阶段

### Phase 1: 基础骨架 (Week 1) ✅
- 项目初始化
- 基础 UI 组件
- 状态管理架构

### Phase 2: 核心功能 (Week 2-3) 🔄
- Monaco Editor 集成
- 文件资源管理器
- 插件系统开发

### Phase 3: 高级功能 (Week 4-5)
- Git 集成
- 终端优化
- 性能优化

### Phase 4: 完善与测试 (Week 6)
- 功能完善
- 测试覆盖
- 文档编写

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+
- Git

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 插件开发
```bash
cd packages/dsh-ide-mode
npm install
npm run build
```

## 配置说明

### Vite 配置
- 开发服务器端口：5173
- 路径别名：`@` -> `./src`
- 构建目标：ESNext
- Source Map：启用

### Tailwind 配置
- 内容扫描：`./src/**/*.{js,ts,jsx,tsx}`
- 扩展主题：默认配置
- 插件：无

### TypeScript 配置
- 目标：ES2020
- 模块：ESNext
- 严格模式：启用
- JSX：React JSX

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 组件采用函数式组件 + Hooks
- 状态管理使用 Zustand
- 样式使用 Tailwind CSS

### 命名规范
- 组件：PascalCase（如 `EditorGroup`）
- 文件：kebab-case（如 `editor-store.ts`）
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE

### 提交规范
- 使用 Conventional Commits
- 格式：`type(scope): description`
- 类型：feat, fix, docs, style, refactor, test, chore

## 常见问题

### 1. 构建失败
```bash
# 清除缓存
rm -rf node_modules dist
npm install
npm run build
```

### 2. 插件构建错误
```bash
# 检查类型错误
cd packages/dsh-ide-mode
npm run typecheck

# 安装缺失依赖
npm install @types/node
```

### 3. 开发服务器无法启动
```bash
# 检查端口占用
netstat -ano | findstr :5173

# 更换端口
# 修改 vite.config.ts 中的 server.port
```

## 相关资源

- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [xterm.js 文档](https://xtermjs.org/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Vite 文档](https://vitejs.dev/)
- [React 文档](https://react.dev/)

## 联系方式

- 项目负责人：MiMo-v2.5-pro
- 开发团队：小米大模型团队
- 项目地址：[GitHub Repository]

---

**最后更新**：2026-08-19  
**版本**：0.1.0  
**状态**：开发中
