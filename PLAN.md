# DSH → 类 VS Code 编程 IDE 改造方案

## 一、需求分析

将 DSH（DeepSeek Harness）Web GUI 改造为类似 VS Code 的编程 IDE，核心需求：

| 功能模块 | VS Code 对标 | 优先级 |
|---------|-------------|-------|
| 代码编辑器 | Monaco Editor | P0 |
| 文件资源管理器 | Explorer 侧边栏 | P0 |
| 集成终端 | xterm.js + pty | P0 |
| 顶部菜单栏 | Menu Bar | P1 |
| 标签页系统 | Tab Groups | P0 |
| 状态栏 | Status Bar | P1 |
| 搜索/替换 | Search Panel | P1 |
| Git 集成 | Source Control | P2 |
| 插件/扩展系统 | Extension Host | P3 |
| 调试器 | Debug Adapter Protocol | P3 |
| 命令面板 | Ctrl+Shift+P | P1 |
| 主题系统 | Color Themes | P2 |

## 二、技术方案对比

### 方案 A：基于 DSH 插件扩展（增量改造）
```
DSH Web GUI + dsh-aionui-panel 增强
├── 复用 DSH 的 Electron/Web 架构
├── 通过插件系统添加 Monaco、xterm
├── 复用 DSH 的文件系统和终端能力
└── 代码量：~5,000-8,000 行
```
**优点**：复用现有架构，与 DSH AI 能力无缝集成
**缺点**：受限于 DSH 架构，部分 IDE 功能难以实现

### 方案 B：独立 Web IDE 应用（全新构建）
```
React + Monaco + xterm + Electron
├── 独立的 IDE 应用
├── 完整的 VS Code 风格 UI
├── 可选集成 DSH AI 能力
└── 代码量：~15,000-25,000 行
```
**优点**：完全可控，功能完整
**缺点**：工作量大，需要维护独立项目

### 方案 C：基于 code-server/OpenVSCode Server（混合方案）⭐推荐
```
OpenVSCode Server（后端） + DSH AI 插件
├── 使用成熟的 VS Code Web 版本
├── DSH 作为 AI 辅助插件集成
├── 保留 DSH 的 AI 能力
└── 代码量：~3,000-5,000 行（集成层）
```
**优点**：最成熟的方案，VS Code 完整功能开箱即用
**缺点**：依赖外部项目，定制化受限

### 方案 D：Monaco Editor 深度定制（轻量级 IDE）
```
Monaco Editor + xterm.js + React/Vue
├── 轻量级但功能完整
├── 可深度定制
├── 良好的扩展性
└── 代码量：~8,000-12,000 行
```
**优点**：平衡功能与复杂度，完全可控
**缺点**：需要自己实现部分 VS Code 功能

## 三、推荐方案：方案 D - Monaco Editor 深度定制

### 3.1 技术栈选择

```json
{
  "核心框架": "React 18 + TypeScript",
  "构建工具": "Vite 5",
  "代码编辑器": "Monaco Editor 0.45+",
  "终端模拟": "xterm.js 5.x + node-pty",
  "UI组件": "Radix UI + Tailwind CSS",
  "状态管理": "Zustand",
  "文件系统": "node:fs (Electron) 或 WebDAV",
  "包管理": "pnpm"
}
```

### 3.2 项目结构

```
dsh-ide/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── electron/
│   ├── main.ts              # Electron 主进程
│   ├── preload.ts           # 预加载脚本
│   └── ipc-handlers.ts      # IPC 通信处理
├── src/
│   ├── main.tsx             # 应用入口
│   ├── App.tsx              # 主布局
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── TitleBar.tsx        # 顶部标题栏
│   │   │   ├── MenuBar.tsx         # 菜单栏
│   │   │   ├── SideBar.tsx         # 侧边栏容器
│   │   │   ├── StatusBar.tsx       # 状态栏
│   │   │   └── Breadcrumbs.tsx     # 面包屑导航
│   │   ├── Editor/
│   │   │   ├── EditorGroup.tsx     # 编辑器组
│   │   │   ├── TabBar.tsx          # 标签页栏
│   │   │   ├── MonacoEditor.tsx    # Monaco 编辑器封装
│   │   │   └── DiffEditor.tsx      # 差异对比编辑器
│   │   ├── Terminal/
│   │   │   ├── TerminalPanel.tsx   # 终端面板
│   │   │   └── TerminalTabs.tsx    # 终端标签
│   │   ├── Sidebar/
│   │   │   ├── FileExplorer.tsx    # 文件资源管理器
│   │   │   ├── SearchPanel.tsx     # 搜索面板
│   │   │   ├── GitPanel.tsx        # Git 面板
│   │   │   └── ExtensionsPanel.tsx # 扩展面板
│   │   ├── StatusBar/
│   │   │   ├── LanguageStatus.tsx  # 语言状态
│   │   │   ├── LineColumn.tsx      # 行列号
│   │   │   ├── GitBranch.tsx       # Git 分支
│   │   │   └── EncodingStatus.tsx  # 编码状态
│   │   └── Common/
│   │       ├── CommandPalette.tsx  # 命令面板
│   │       ├── QuickOpen.tsx       # 快速打开
│   │       └── Notifications.tsx   # 通知系统
│   ├── core/
│   │   ├── editor/
│   │   │   ├── editor-manager.ts   # 编辑器管理
│   │   │   ├── tab-manager.ts      # 标签页管理
│   │   │   └── language-service.ts # 语言服务
│   │   ├── filesystem/
│   │   │   ├── file-system.ts      # 文件系统抽象
│   │   │   ├── file-watcher.ts     # 文件监听
│   │   │   └── workspace.ts        # 工作区管理
│   │   ├── terminal/
│   │   │   ├── terminal-manager.ts # 终端管理
│   │   │   └── pty-service.ts      # PTY 服务
│   │   ├── git/
│   │   │   ├── git-service.ts      # Git 服务
│   │   │   └── git-decoration.ts   # Git 装饰器
│   │   ├── ai/
│   │   │   ├── dsh-connector.ts    # DSH AI 连接器
│   │   │   ├── code-assist.ts      # 代码辅助
│   │   │   └── chat-panel.tsx      # AI 对话面板
│   │   └── plugin/
│   │       ├── plugin-loader.ts    # 插件加载器
│   │       └── plugin-api.ts       # 插件 API
│   ├── stores/
│   │   ├── editor-store.ts         # 编辑器状态
│   │   ├── file-store.ts           # 文件状态
│   │   ├── terminal-store.ts       # 终端状态
│   │   └── ui-store.ts             # UI 状态
│   ├── hooks/
│   │   ├── use-editor.ts           # 编辑器 Hook
│   │   ├── use-file-tree.ts        # 文件树 Hook
│   │   └── use-keybindings.ts      # 快捷键 Hook
│   ├── keybindings/
│   │   ├── default.ts              # 默认快捷键
│   │   └── keybinding-manager.ts   # 快捷键管理
│   ├── themes/
│   │   ├── default-theme.ts        # 默认主题
│   │   ├── dark-theme.ts           # 暗色主题
│   │   └── theme-manager.ts        # 主题管理
│   ├── i18n/
│   │   ├── zh-CN.ts                # 中文
│   │   └── en-US.ts                # 英文
│   └── utils/
│       ├── file-icons.ts           # 文件图标
│       └── syntax-highlight.ts     # 语法高亮
├── public/
│   └── worker/                     # Web Workers
│       ├── editor.worker.js
│       └── json.worker.js
└── extensions/                     # 内置扩展
    └── dsh-ai/
        └── package.json
```

### 3.3 核心模块实现

#### 3.3.1 编辑器核心（~2000 行）

```typescript
// src/core/editor/editor-manager.ts
class EditorManager {
  private editorGroups: Map<string, EditorGroup>;
  private activeGroup: string;
  
  constructor(private monaco: typeof import('monaco-editor')) {
    this.editorGroups = new Map();
    this.activeGroup = 'main';
  }
  
  // 创建编辑器组
  createGroup(id: string): EditorGroup {
    const group = new EditorGroup(id, this.monaco);
    this.editorGroups.set(id, group);
    return group;
  }
  
  // 打开文件
  async openFile(filePath: string, options?: OpenOptions): Promise<void> {
    const content = await this.readFile(filePath);
    const language = this.detectLanguage(filePath);
    const group = this.editorGroups.get(this.activeGroup);
    
    await group.openDocument({
      uri: this.monaco.Uri.file(filePath),
      content,
      language,
      ...options
    });
  }
  
  // 分割编辑器
  splitEditor(direction: 'horizontal' | 'vertical'): void {
    const newGroupId = `group-${Date.now()}`;
    this.createGroup(newGroupId);
    // 布局逻辑...
  }
}
```

#### 3.3.2 终端集成（~1500 行）

```typescript
// src/core/terminal/terminal-manager.ts
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';

class TerminalManager {
  private terminals: Map<string, TerminalInstance>;
  
  constructor() {
    this.terminals = new Map();
  }
  
  // 创建终端
  async createTerminal(options?: TerminalOptions): Promise<string> {
    const id = `term-${Date.now()}`;
    const terminal = new Terminal({
      theme: this.getTheme(),
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      fontSize: 14,
      cursorBlink: true,
    });
    
    // 连接后端 PTY
    const pty = await this.createPty(options);
    
    terminal.onData(data => pty.write(data));
    pty.onData(data => terminal.write(data));
    
    this.terminals.set(id, { terminal, pty });
    return id;
  }
  
  // Electron 环境下使用 node-pty
  private async createPty(options?: TerminalOptions) {
    if (window.__ELECTRON__) {
      return window.electron.createPty(options);
    }
    // Web 环境使用 WebSocket 连接后端
    return new WebSocketPty(options);
  }
}
```

#### 3.3.3 文件资源管理器（~1200 行）

```tsx
// src/components/Sidebar/FileExplorer.tsx
import { useVirtualizedTree } from '../../hooks/use-file-tree';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  gitStatus?: GitStatus;
  icon?: string;
}

export function FileExplorer({ rootPath }: Props) {
  const { tree, expand, collapse, refresh } = useFileTree(rootPath);
  const { containerRef, virtualItems } = useVirtualizedTree(tree);
  
  return (
    <div className="file-explorer" ref={containerRef}>
      <div className="explorer-header">
        <span>资源管理器</span>
        <div className="actions">
          <IconButton icon="new-file" onClick={createFile} />
          <IconButton icon="new-folder" onClick={createFolder} />
          <IconButton icon="refresh" onClick={refresh} />
        </div>
      </div>
      <VirtualizedList items={virtualItems}>
        {item => (
          <FileTreeItem
            key={item.path}
            node={item}
            onExpand={() => expand(item.path)}
            onOpen={() => openFile(item.path)}
            gitStatus={item.gitStatus}
          />
        )}
      </VirtualizedList>
    </div>
  );
}
```

#### 3.3.4 AI 集成模块（~1000 行）

```typescript
// src/core/ai/dsh-connector.ts
class DSHConnector {
  private ws: WebSocket;
  private sessionId: string;
  
  // 连接 DSH 后端
  async connect(endpoint: string): Promise<void> {
    this.ws = new WebSocket(endpoint);
    this.sessionId = await this.createSession();
  }
  
  // 代码补全
  async getCompletions(context: CompletionContext): Promise<CompletionItem[]> {
    return this.sendRequest('completions', {
      code: context.code,
      language: context.language,
      position: context.position,
      surroundingCode: context.surroundingCode
    });
  }
  
  // 代码解释
  async explainCode(code: string): Promise<string> {
    return this.sendRequest('explain', { code });
  }
  
  // 代码重构建议
  async refactor(code: string, intent: string): Promise<RefactorSuggestion[]> {
    return this.sendRequest('refactor', { code, intent });
  }
  
  // 内联聊天
  async inlineChat(message: string, codeContext: string): Promise<string> {
    return this.sendRequest('chat', { message, codeContext });
  }
}
```

### 3.4 UI 布局实现

```tsx
// src/App.tsx
export function App() {
  const [layout, setLayout] = useState<LayoutState>({
    sidebar: { visible: true, position: 'left', width: 250 },
    panel: { visible: true, position: 'bottom', height: 300 },
    editor: { splitDirection: null }
  });
  
  return (
    <div className="ide-container" data-theme="dark">
      <TitleBar />
      <MenuBar />
      
      <div className="main-content">
        <SideBar layout={layout.sidebar}>
          <SidebarTab id="explorer" icon="files" title="资源管理器">
            <FileExplorer />
          </SidebarTab>
          <SidebarTab id="search" icon="search" title="搜索">
            <SearchPanel />
          </SidebarTab>
          <SidebarTab id="git" icon="git" title="源代码管理">
            <GitPanel />
          </SidebarTab>
          <SidebarTab id="ai" icon="sparkles" title="AI 助手">
            <AIPanel />
          </SidebarTab>
        </SideBar>
        
        <div className="editor-area">
          <EditorGroup />
          
          <Panel layout={layout.panel}>
            <PanelTab id="terminal" title="终端">
              <TerminalPanel />
            </PanelTab>
            <PanelTab id="output" title="输出">
              <OutputPanel />
            </PanelTab>
            <PanelTab id="problems" title="问题">
              <ProblemsPanel />
            </PanelTab>
          </Panel>
        </div>
      </div>
      
      <StatusBar />
      <CommandPalette />
      <Notifications />
    </div>
  );
}
```

### 3.5 快捷键系统

```typescript
// src/keybindings/default.ts
export const defaultKeybindings: KeyBinding[] = [
  // 文件操作
  { key: 'ctrl+n', command: 'file.new', label: '新建文件' },
  { key: 'ctrl+o', command: 'file.open', label: '打开文件' },
  { key: 'ctrl+s', command: 'file.save', label: '保存' },
  { key: 'ctrl+shift+s', command: 'file.saveAll', label: '全部保存' },
  
  // 编辑器
  { key: 'ctrl+z', command: 'editor.undo', label: '撤销' },
  { key: 'ctrl+shift+z', command: 'editor.redo', label: '重做' },
  { key: 'ctrl+d', command: 'editor.selectNextOccurrence', label: '选择下一个匹配' },
  { key: 'ctrl+shift+l', command: 'editor.selectAllOccurrences', label: '选择所有匹配' },
  
  // 视图
  { key: 'ctrl+b', command: 'view.toggleSidebar', label: '切换侧边栏' },
  { key: 'ctrl+`', command: 'view.toggleTerminal', label: '切换终端' },
  { key: 'ctrl+shift+p', command: 'view.commandPalette', label: '命令面板' },
  { key: 'ctrl+p', command: 'view.quickOpen', label: '快速打开' },
  
  // 终端
  { key: 'ctrl+`', command: 'terminal.toggle', label: '切换终端' },
  { key: 'ctrl+shift+`', command: 'terminal.new', label: '新建终端' },
  { key: 'ctrl+shift+n', command: 'terminal.new', label: '新建终端' },
  
  // AI 功能
  { key: 'ctrl+shift+a', command: 'ai.inlineChat', label: 'AI 内联聊天' },
  { key: 'ctrl+k ctrl+i', command: 'ai.hover', label: 'AI 信息' },
];
```

### 3.6 主题系统

```typescript
// src/themes/dark-theme.ts
export const darkTheme: ThemeDefinition = {
  name: 'DSH Dark',
  type: 'dark',
  colors: {
    // 编辑器
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    'editor.lineHighlightBackground': '#2a2d2e',
    'editor.selectionBackground': '#264f78',
    
    // 侧边栏
    'sidebar.background': '#252526',
    'sidebar.foreground': '#cccccc',
    'sidebar.activeBackground': '#37373d',
    
    // 标签页
    'tab.activeBackground': '#1e1e1e',
    'tab.inactiveBackground': '#2d2d2d',
    'tab.activeForeground': '#ffffff',
    
    // 状态栏
    'statusBar.background': '#007acc',
    'statusBar.foreground': '#ffffff',
    
    // 终端
    'terminal.background': '#1e1e1e',
    'terminal.foreground': '#cccccc',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#6a9955' }
    },
    {
      scope: ['string', 'string.quoted'],
      settings: { foreground: '#ce9178' }
    },
    {
      scope: ['keyword', 'storage.type'],
      settings: { foreground: '#569cd6' }
    },
    {
      scope: ['entity.name.function', 'support.function'],
      settings: { foreground: '#dcdcaa' }
    },
    {
      scope: ['entity.name.type', 'support.type'],
      settings: { foreground: '#4ec9b0' }
    }
  ]
};
```

## 四、与 DSH 集成方案

### 4.1 DSH 作为 AI 后端

```
┌─────────────────────────────────────────────────────────┐
│                    DSH IDE 前端                          │
├─────────────────────────────────────────────────────────┤
│  Monaco Editor  │  xterm.js  │  File Explorer  │  Git  │
├─────────────────────────────────────────────────────────┤
│                    AI 集成层                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ 代码补全     │  │ 代码解释     │  │ 内联聊天     │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────────────────────────┤
│                    DSH WebSocket API                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    DSH 后端服务                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ AI 模型调用  │  │ 代码分析     │  │ 会话管理     │   │
│  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 复用 DSH 现有能力

```typescript
// src/core/ai/dsh-integration.ts
class DSHIntegration {
  // 复用 DSH 的终端能力
  async createTerminal() {
    if (window.__DSH__) {
      // 使用 DSH 的终端
      return window.__DSH__.createTerminal();
    }
    // 回退到本地终端
    return this.createLocalTerminal();
  }
  
  // 复用 DSH 的文件系统
  async readFile(path: string) {
    if (window.__DSH__) {
      return window.__DSH__.readFile(path);
    }
    return this.readLocalFile(path);
  }
  
  // 复用 DSH 的 AI 能力
  async aiAssist(prompt: string, context: string) {
    if (window.__DSH__) {
      return window.__DSH__.sendMessage(prompt, { code: context });
    }
    return this.callAI(prompt, context);
  }
}
```

## 五、开发路线图

### Phase 1：核心框架（2-3 周）
- [ ] 项目初始化（Vite + React + TypeScript）
- [ ] Monaco Editor 集成
- [ ] 基础布局（侧边栏、编辑器、状态栏）
- [ ] 标签页系统

### Phase 2：核心功能（3-4 周）
- [ ] 文件资源管理器
- [ ] 集成终端（xterm.js）
- [ ] 命令面板
- [ ] 快速打开（Ctrl+P）

### Phase 3：AI 集成（2 周）
- [ ] DSH 连接器
- [ ] 代码补全
- [ ] 内联聊天
- [ ] AI 面板

### Phase 4：增强功能（3-4 周）
- [ ] Git 集成
- [ ] 搜索/替换
- [ ] 主题系统
- [ ] 快捷键自定义

### Phase 5：Electron 打包（1-2 周）
- [ ] Electron 主进程
- [ ] 原生菜单
- [ ] 自动更新
- [ ] 安装包构建

**总计：11-15 周**

## 六、代码量估算

| 模块 | 代码量 | 说明 |
|-----|-------|-----|
| 编辑器核心 | ~2,500 行 | Monaco 封装、标签页管理 |
| 文件系统 | ~1,500 行 | 文件树、监听、操作 |
| 终端集成 | ~1,500 行 | xterm 封装、PTY 管理 |
| UI 组件 | ~3,000 行 | 布局、侧边栏、状态栏 |
| AI 集成 | ~1,000 行 | DSH 连接、代码辅助 |
| 快捷键/命令 | ~800 行 | 快捷键系统、命令注册 |
| 主题系统 | ~600 行 | 主题定义、切换 |
| Git 集成 | ~800 行 | Git 状态、操作 |
| 工具函数 | ~500 行 | 文件图标、语言检测等 |
| 配置/类型 | ~600 行 | TypeScript 类型定义 |
| **总计** | **~12,800 行** | |

## 七、关键依赖

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "monaco-editor": "^0.45.0",
    "@xterm/xterm": "^5.5.0",
    "@xterm/addon-fit": "^0.10.0",
    "@xterm/addon-web-links": "^0.11.0",
    "zustand": "^4.5.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  }
}
```

## 八、总结

**推荐方案 D** 的理由：

1. **完全可控**：不依赖外部 IDE 项目，可以深度定制
2. **性能优秀**：Monaco Editor 是 VS Code 的核心编辑器，性能等同
3. **AI 集成灵活**：可以无缝集成 DSH 的 AI 能力
4. **代码量适中**：~12,800 行，2-3 人团队 3 个月可完成
5. **扩展性强**：后续可以添加插件系统、调试器等高级功能

**vs 方案 C 的优势**：
- 更轻量，不需要维护完整的 VS Code 服务端
- 更灵活，可以完全定制 UI 和功能
- 更好的 DSH 集成，不会受限于 VS Code 扩展 API

---

## 附录：VS Code 核心功能实现参考

### 实现难度评估

| 功能 | 难度 | 代码量 | 参考 |
|-----|------|-------|-----|
| Monaco Editor | ⭐⭐ | 500 行 | 官方示例 |
| 标签页系统 | ⭐⭐⭐ | 800 行 | VS Code 源码 |
| 文件资源管理器 | ⭐⭐⭐ | 1200 行 | 自己实现 |
| 集成终端 | ⭐⭐⭐⭐ | 1500 行 | xterm.js 示例 |
| 命令面板 | ⭐⭐⭐ | 600 行 | 自己实现 |
| Git 集成 | ⭐⭐⭐⭐ | 800 行 | isomorphic-git |
| 调试器 | ⭐⭐⭐⭐⭐ | 3000+ 行 | DAP 协议 |
| 插件系统 | ⭐⭐⭐⭐⭐ | 2000+ 行 | VS Code 源码 |

### 参考项目

1. **Monaco Editor**：https://github.com/microsoft/monaco-editor
2. **xterm.js**：https://github.com/xtermjs/xterm.js
3. **code-server**：https://github.com/coder/code-server
4. **OpenVSCode Server**：https://github.com/gitpod-io/openvscode-server
5. **Electron**：https://www.electronjs.org/
