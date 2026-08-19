# DSH 插件扩展方案：将 DSH 改造为类 VS Code 编程 IDE

## 一、方案概述

### 1.1 核心思路

**不修改 DSH 源码**，通过 DSH 的插件体系（`cordis.patch.yml` + profile 机制），以 npm 包形式开发一系列客户端插件，在 DSH Web GUI 的 DOM 层注入 IDE 功能模块，将 DSH 逐步改造为具备类 VS Code 体验的编程 IDE。

### 1.2 技术约束

通过逆向分析 DSH 现有插件（`dsh-task-board`、`dsh-aionui-panel`、`dsh-ssh` 等），我们掌握了以下关键架构事实：

| 约束项 | 现状 | 影响 |
|-------|------|------|
| **侧边栏** | 无可用 Slot，插件通过 DOM 注入 + MutationObserver 自愈 | IDE 侧边栏（文件树）需同样方式注入 |
| **中心区域** | 单占位（conversation），插件通过 DOM 覆盖 + CSS 切换 | IDE 编辑器需接管中心区域 |
| **右侧面板** | 已被 `dsh-aionui-panel` 占用 | 需与之共存或替换 |
| **底部面板** | 无官方 Slot | 终端面板需 DOM 注入 |
| **宿主进程** | 插件可注册 HTTP 路由（`/aionui-panel/*`） | IDE 可复用此模式提供文件系统/Git API |
| **系统提示** | 插件可注入 systemPrompt section | IDE 可向 AI agent 宣告自身能力 |
| **客户端模块** | `window.__ModuleLoader__.load()` 加载 client.js | 插件通过此机制注入浏览器端代码 |

### 1.3 代码量估算

| 模块 | 代码量 | 说明 |
|-----|--------|------|
| `dsh-ide-sidebar`（文件资源管理器） | ~2,500 行 | 文件树 + 搜索 + 文件操作 |
| `dsh-ide-editor`（代码编辑器） | ~3,000 行 | Monaco Editor 集成 + 标签页 |
| `dsh-ide-terminal`（集成终端） | ~1,500 行 | xterm.js + WebSocket PTY |
| `dsh-ide-toolbar`（工具栏/状态栏） | ~1,200 行 | 快捷操作 + 状态信息 |
| `dsh-ide-host`（宿主服务端） | ~1,500 行 | 文件系统 API + Git API + PTY 服务 |
| `dsh-ide-core`（核心协调层） | ~800 行 | 布局管理 + 事件协调 |
| `dsh-ide-all`（聚合包） | ~200 行 | 一键安装 |
| **总计** | **~10,700 行** | |

### 1.4 开发周期

| 阶段 | 时间 | 内容 |
|-----|------|------|
| Phase 1 | 2 周 | 宿主服务端 + 文件资源管理器 |
| Phase 2 | 3 周 | Monaco 编辑器 + 标签页系统 |
| Phase 3 | 1.5 周 | 集成终端 |
| Phase 4 | 1 周 | 工具栏/状态栏 + 快捷键 |
| Phase 5 | 0.5 周 | 聚合包 + 测试 + 文档 |
| **总计** | **~8 周** | |

---

## 二、DSH 插件架构深度分析

### 2.1 插件双面结构

DSH 插件采用**双面（dual-face）架构**，每个插件包含两个独立入口：

```
dsh-ide-xxx/
├── package.json          # 声明 dsh.client、dsh.bundle.patch
├── cordis.patch.yml      # 宿主侧插件注册
├── src/
│   ├── index.ts          # 宿主侧入口（Node.js 进程）
│   └── client/
│       └── index.ts      # 浏览器侧入口（Web GUI）
└── lib/
    ├── index.js          # 宿主侧编译产物
    └── client.js         # 浏览器侧编译产物（window.__ModuleLoader__.load）
```

**宿主侧（`src/index.ts`）**：
- 运行在 DSH 的 Node.js 进程中
- 通过 `@deepseek-ai/cordis` 的 `Context` 注入服务
- 主要职责：系统提示注入（`systemPrompt.section`）、设置管理、宿主进程路由注册
- 导出 `inject` 数组声明依赖服务，`apply` 函数执行注册

**浏览器侧（`src/client/index.ts`**）：
- 运行在 Web GUI 的浏览器进程中
- 通过 `window.__ModuleLoader__.load()` 加载
- 主要职责：DOM 注入、React 组件挂载、事件绑定、状态管理
- 导出 `inject` 数组声明运行时依赖，`apply` 函数执行挂载

### 2.2 插件注册机制

```yaml
# cordis.patch.yml
- insert:
    - id: ide-sidebar
      name: '@your-scope/dsh-ide-sidebar'
```

DSH 的 profile 机制会在 `~/.dsh/profiles/web/` 下管理插件。安装命令：

```bash
dsh plugin --profile web add @your-scope/dsh-ide-sidebar
```

### 2.3 package.json 关键字段

```json
{
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js"
  }
}
```

### 2.4 DOM 注入模式

现有插件（task-board、ssh）采用**DOM 注入 + MutationObserver 自愈**模式：

1. **查找锚点**：通过 CSS 选择器定位 DSH 的 DOM 结构
   - 侧边栏：`[class*="sidebarCol"]`、`[class*="logoRow"]`
   - 中心区域：`[class*="centerCol"]`、`[data-pane="conversation"]`
   - 会话行：`[class*="sessionRow"]`、`[class*="projectRow"]`

2. **注入 DOM**：在锚点位置插入自定义元素
   - 使用 `data-dsh-xxx` 属性标识注入元素
   - 使用独立的 React Root（`createRoot`）挂载组件
   - 不污染 DSH 的 React 树

3. **自愈机制**：MutationObserver 监听 DOM 变化
   - 当 DSH 的 React 重渲染导致注入元素被移除时，自动重新注入
   - 使用 `requestAnimationFrame` 合并突发的 DOM 变化
   - 在同一帧内完成重插入，无视觉闪烁

4. **可见性切换**：通过 `<html>` 的 data 属性控制
   ```html
   <html data-dsh-ide-active="">
   ```
   配合 CSS 规则切换显示/隐藏：

### 2.5 宿主进程 API 模式

`dsh-aionui-panel` 展示了宿主侧路由注册模式：
- 在 `src/host/routes.ts` 中注册 HTTP 路由
- 浏览器侧通过 `PanelApi` 类调用这些路由
- 路由提供文件系统操作（readdir、readFile、stat）
- 路由提供 Git 操作（status、diff）

---

## 三、插件模块详细设计

### 3.1 `@dsh-ide/dsh-ide-host` — 宿主服务端

**职责**：提供 IDE 所需的后端 API，运行在 DSH 的 Node.js 进程中。

#### 3.1.1 package.json

```json
{
  "name": "@dsh-ide/dsh-ide-host",
  "version": "0.1.0",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  }
}
```

#### 3.1.2 cordis.patch.yml

```yaml
- insert:
    - id: ide-host
      name: '@dsh-ide/dsh-ide-host'
```

#### 3.1.3 宿主侧入口（`src/index.ts`）

```typescript
import type { Context } from '@deepseek-ai/cordis'

export const inject: string[] = []

export function apply(ctx: Context): void {
  // 注册 IDE 系统提示（告知 AI agent IDE 的存在和能力）
  // ctx.systemPrompt.section({ ... })
  
  // IDE 的后端逻辑主要通过子进程 API 或 WebSocket 暴露
  // 宿主侧仅做最小化的注册工作
}
```

#### 3.1.4 浏览器侧入口（`src/client/index.ts`）

```typescript
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

export const inject = ['sessions', 'connection']

/**
 * IDE 宿主 API 封装
 * 通过 DSH 的 connection handle 调用宿主进程的 HTTP 路由
 */
class IdeHostApi {
  private baseUrl = '/ide-api'

  // === 文件系统 API ===
  async readdir(path: string): Promise<FileEntry[]> {
    const resp = await fetch(`${this.baseUrl}/fs/readdir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })
    return resp.json()
  }

  async readFile(path: string): Promise<string> {
    const resp = await fetch(`${this.baseUrl}/fs/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })
    return resp.json()
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fetch(`${this.baseUrl}/fs/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    })
  }

  async stat(path: string): Promise<StatResult> {
    const resp = await fetch(`${this.baseUrl}/fs/stat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })
    return resp.json()
  }

  // === Git API ===
  async gitStatus(root: string): Promise<GitStatus> {
    const resp = await fetch(`${this.baseUrl}/git/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ root }),
    })
    return resp.json()
  }

  async gitDiff(root: string, path: string): Promise<string> {
    const resp = await fetch(`${this.baseUrl}/git/diff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ root, path }),
    })
    return resp.json()
  }

  // === 终端 API（WebSocket PTY）===
  createTerminal(cols: number, rows: number): WebSocket {
    const ws = new WebSocket(
      `ws://${location.host}${this.baseUrl}/terminal/create?cols=${cols}&rows=${rows}`
    )
    return ws
  }
}

export const ideApi = new IdeHostApi()

export function apply(ctx: ClientContext): void {
  // 将 API 挂载到全局，供其他 IDE 插件使用
  ;(window as any).__IDE_API__ = ideApi
}
```

---

### 3.2 `@dsh-ide/dsh-ide-sidebar` — 文件资源管理器

**职责**：在 DSH 左侧侧边栏注入文件树组件，替代/增强 DSH 自带的会话列表。

#### 3.2.1 项目结构

```
packages/dsh-ide-sidebar/
├── package.json
├── cordis.patch.yml
├── tsconfig.json
├── tsdown.config.ts
├── src/
│   ├── index.ts                    # 宿主侧入口
│   ├── client/
│   │   ├── index.ts                # 浏览器侧入口
│   │   ├── mount.tsx               # 侧边栏注入挂载
│   │   ├── FileTree.tsx            # 文件树组件
│   │   ├── FileTreeItem.tsx        # 文件树条目
│   │   ├── SearchPanel.tsx         # 搜索面板
│   │   ├── ContextMenu.tsx         # 右键菜单
│   │   ├── locales.ts              # 国际化
│   │   ├── store.ts                # 状态管理
│   │   └── icons.tsx               # SVG 图标
│   └── core/
│       └── types.ts                # 类型定义
└── lib/                            # 编译产物
```

#### 3.2.2 宿主侧（`src/index.ts`）

```typescript
import type { Context } from '@deepseek-ai/cordis'

export const inject: string[] = []

export const IDE_SIDEBAR_GUIDANCE =
  '本机已安装 dsh-ide-sidebar 插件（DSH IDE 文件资源管理器）：侧边栏「文件」入口；' +
  '提供项目文件树浏览、文件搜索、文件创建/删除/重命名。' +
  '文件树跟随当前会话的 cwd（工作目录）。' +
  '用户提到「文件树 / 文件管理器 / 项目结构」时即指本插件。'

export function apply(ctx: Context): void {
  // 可选：注入系统提示
  // ctx.systemPrompt.section({ name: 'plugin:ide-sidebar', order: 210, text: IDE_SIDEBAR_GUIDANCE })
}
```

#### 3.2.3 浏览器侧入口（`src/client/index.ts`）

```typescript
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { mountFileExplorer } from './mount.ts'
import { dictionaries, NS, setLanguage } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'ide-sidebar': typeof import('./locales.ts').zh
  }
}

export const inject = ['sessions', 'locale', 'connection']

export function apply(ctx: ClientContext): void {
  // 注册国际化
  ctx.effect(() => ctx.locale.register(NS, dictionaries), 'dsh-ide-sidebar: dictionaries')

  ctx.effect(() => {
    let disposer: (() => void) | undefined

    // 跟随当前会话的 cwd 绑定项目根目录
    const bindRoot = (): void => {
      const snapshot = ctx.sessions.list.getSnapshot()
      const sessionId = snapshot.current as SessionId | undefined
      const cwd = sessionId !== undefined ? snapshot.byId[sessionId]?.cwd : undefined
      const root = typeof cwd === 'string' && cwd !== '' ? cwd : ''

      disposer?.()
      disposer = undefined
      if (root === '') return

      // 获取连接句柄用于 API 调用
      const connection = ctx.get('connection')
      disposer = mountFileExplorer(root, connection)
    }

    const unsubscribe = ctx.sessions.list.subscribe(bindRoot)
    bindRoot()

    return () => {
      unsubscribe()
      disposer?.()
    }
  }, 'dsh-ide-sidebar: wiring')
}
```

#### 3.2.4 侧边栏注入挂载（`src/client/mount.ts`）

```typescript
import { createRoot, type Root } from 'react-dom/client'
import { FileTree } from './FileTree.tsx'
import { SearchPanel } from './SearchPanel.tsx'

/** 注入元素的 data 属性标识 */
const ENTRY_SELECTOR = '[data-dsh-ide-sidebar-entry]'
const VIEW_SELECTOR = '[data-dsh-ide-sidebar-view]'
const ACTIVE_ATTR = 'data-dsh-ide-sidebar-active'

/** 查找侧边栏根元素 */
function sidebarRoot(): HTMLElement | undefined {
  const column = document.querySelector<HTMLElement>(
    '[data-pane="sidebar"], [class*="sidebarCol"]'
  )
  if (column === null) return undefined
  const logoOwner = column.querySelector<HTMLElement>('[class*="logoRow"]')?.parentElement
  return logoOwner ?? (column.firstElementChild as HTMLElement | undefined)
}

/** 构建侧边栏入口按钮 */
function createEntry(): HTMLButtonElement {
  const entry = document.createElement('button')
  entry.type = 'button'
  entry.dataset.dshIdeSidebarEntry = ''
  entry.setAttribute('aria-label', '文件')
  entry.innerHTML = `
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" 
         stroke="currentColor" stroke-width="1.3">
      <path d="M2 3.5h5l1.5 1.5H14v8H2z"/>
    </svg>
    <span>文件</span>
  `
  // 点击切换文件树视图的显隐
  entry.addEventListener('click', () => {
    const html = document.documentElement
    if (html.hasAttribute(ACTIVE_ATTR)) {
      html.removeAttribute(ACTIVE_ATTR)
    } else {
      // 关闭其他面板（task-board、ssh）
      html.removeAttribute('data-dsh-taskboard-active')
      html.removeAttribute('data-dsh-ssh-active')
      html.setAttribute(ACTIVE_ATTR, '')
    }
  })
  return entry
}

/** 在侧边栏中放置入口按钮 */
function placeEntry(root: HTMLElement, entry: HTMLButtonElement): boolean {
  const newSessionBtn = root.querySelector<HTMLButtonElement>('button[class*="newSession"]')
    ?? Array.from(root.children).find(
      (el): el is HTMLButtonElement => el.tagName === 'BUTTON'
    )
  if (newSessionBtn === undefined) return false

  if (entry.parentElement !== root) {
    const row = newSessionBtn.closest('[class*="logoRow"]')
    const base = (row !== null && row.parentElement === root) ? row : newSessionBtn
    // 与其他插件入口（task-board、ssh）排在一起
    const family = Array.from(root.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el.matches('[data-dsh-ide-sidebar-entry], [data-dsh-taskboard-entry], [data-dsh-ssh-entry]'),
    )
    const anchor = family.length > 0 ? family[0] : base.nextElementSibling
    root.insertBefore(entry, anchor)
  }
  return true
}

/**
 * 挂载文件资源管理器
 * @param rootPath - 项目根目录（当前会话的 cwd）
 * @param connection - DSH 连接句柄
 * @returns 清理函数
 */
export function mountFileExplorer(rootPath: string, connection: any): () => void {
  // 幂等保护
  if (document.querySelector(ENTRY_SELECTOR) !== null) {
    return () => {}
  }

  const entry = createEntry()
  let sidebarEl: HTMLElement | undefined
  let placed = false
  let viewRoot: Root | undefined
  let viewContainer: HTMLDivElement | undefined

  // === 入口按钮注入 ===
  const tryPlace = (): void => {
    if (sidebarEl !== undefined && !sidebarEl.isConnected) {
      rootObserver.disconnect()
      sidebarEl = undefined
      placed = false
    }
    if (placed && document.body.contains(entry)) return
    sidebarEl ??= sidebarRoot()
    if (sidebarEl === undefined) return
    placed = placeEntry(sidebarEl, entry)
    if (placed) {
      rootObserver.observe(sidebarEl, { childList: true, subtree: true })
    }
  }

  const waitObserver = new MutationObserver(() => tryPlace())
  waitObserver.observe(document.body, { childList: true, subtree: true })

  const rootObserver = new MutationObserver(() => {
    if (sidebarEl === undefined || !sidebarEl.isConnected) {
      placed = false
      tryPlace()
      return
    }
    if (!sidebarEl.contains(entry)) {
      placed = placeEntry(sidebarEl, entry)
    }
  })

  // === 文件树视图挂载到中心区域 ===
  const CENTER_SELECTOR = '[data-pane="conversation"], [class*="centerCol"]'

  const ensureView = (): void => {
    if (viewContainer !== undefined) return
    const column = document.querySelector<HTMLElement>(CENTER_SELECTOR)
    if (column === undefined) return

    viewContainer = document.createElement('div')
    viewContainer.dataset.dshIdeSidebarView = ''
    viewContainer.style.cssText = 'width:100%;height:100%;overflow:hidden;'
    column.appendChild(viewContainer)

    viewRoot = createRoot(viewContainer)
    viewRoot.render(<FileTree rootPath={rootPath} connection={connection} />)
  }

  const viewObserver = new MutationObserver(() => ensureView())
  viewObserver.observe(document.body, { childList: true, subtree: true })

  // === 可见性 CSS 规则 ===
  const style = document.createElement('style')
  style.textContent = `
    /* 文件树视图激活时，隐藏对话内容 */
    html[${ACTIVE_ATTR}] [class*="conversationContent"],
    html[${ACTIVE_ATTR}] [class*="messageList"] {
      display: none !important;
    }
    html[${ACTIVE_ATTR}] [data-dsh-ide-sidebar-view] {
      display: block !important;
    }
    /* 未激活时隐藏文件树视图 */
    :not(html[${ACTIVE_ATTR}]) > body [data-dsh-ide-sidebar-view] {
      display: none !important;
    }
  `
  document.head.appendChild(style)

  // === 同步入口按钮的激活状态 ===
  const syncActive = (): void => {
    if (document.documentElement.hasAttribute(ACTIVE_ATTR)) {
      entry.dataset.active = 'true'
    } else {
      delete entry.dataset.active
    }
  }
  const activeObserver = new MutationObserver(syncActive)
  activeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ACTIVE_ATTR],
  })

  tryPlace()
  ensureView()

  return () => {
    waitObserver.disconnect()
    rootObserver.disconnect()
    viewObserver.disconnect()
    activeObserver.disconnect()
    entry.remove()
    style.remove()
    viewRoot?.unmount()
    viewContainer?.remove()
  }
}
```

#### 3.2.5 文件树组件（`src/client/FileTree.tsx`）

```tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'

interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder' | 'symlink'
  children?: FileNode[]
  expanded?: boolean
  gitStatus?: string  // 'M' | 'A' | 'D' | '?' | ...
}

interface FileTreeProps {
  rootPath: string
  connection: any
}

export function FileTree({ rootPath, connection }: FileTreeProps) {
  const [tree, setTree] = useState<FileNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FileNode[]>([])
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; path: string; type: string
  } | null>(null)
  const api = (window as any).__IDE_API__

  // 加载目录内容
  const loadDir = useCallback(async (path: string): Promise<FileNode[]> => {
    if (!api) return []
    const entries = await api.readdir(path)
    const nodes: FileNode[] = []
    for (const entry of entries) {
      // 跳过隐藏文件和 node_modules
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const childPath = `${path}/${entry.name}`
      nodes.push({
        name: entry.name,
        path: childPath,
        type: entry.isDirectory ? 'folder' : 'file',
        children: entry.isDirectory ? undefined : undefined,
      })
    }
    // 文件夹排在前面，按字母排序
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    return nodes
  }, [api])

  // 初始化加载
  useEffect(() => {
    loadDir(rootPath).then((children) => {
      setTree({ name: rootPath.split('/').pop() ?? rootPath, path: rootPath, type: 'folder', children, expanded: true })
    })
  }, [rootPath, loadDir])

  // 展开/折叠文件夹
  const toggleExpand = useCallback(async (node: FileNode) => {
    if (node.type !== 'folder') return

    setTree((prev) => {
      if (!prev) return prev
      const updateNode = (n: FileNode): FileNode => {
        if (n.path === node.path) {
          if (n.expanded && n.children) {
            return { ...n, expanded: false }
          }
          // 首次展开时加载子目录
          if (!n.children) {
            loadDir(n.path).then((children) => {
              setTree((root) => insertChildren(root, n.path, children))
            })
            return { ...n, expanded: true }
          }
          return { ...n, expanded: true }
        }
        if (n.children) return { ...n, children: n.children.map(updateNode) }
        return n
      }
      return updateNode(prev)
    })
  }, [loadDir])

  // 打开文件（触发编辑器标签页）
  const openFile = useCallback((path: string) => {
    document.dispatchEvent(new CustomEvent('dsh-ide-open-file', {
      detail: { path },
    }))
  }, [])

  // 搜索过滤
  const filteredNodes = useMemo(() => {
    if (!searchQuery || !tree) return null
    const results: FileNode[] = []
    const search = (node: FileNode) => {
      if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push(node)
      }
      node.children?.forEach(search)
    }
    search(tree)
    return results
  }, [searchQuery, tree])

  // 右键菜单
  const handleContextMenu = useCallback((e: React.MouseEvent, node: FileNode) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, path: node.path, type: node.type })
  }, [])

  return (
    <div className="ide-file-tree" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--dsh-font)',
      fontSize: '13px',
      color: 'var(--dsh-fg)',
      background: 'var(--dsh-bg)',
    }}>
      {/* 搜索栏 */}
      <div style={{ padding: '8px', borderBottom: '1px solid var(--dsh-border)' }}>
        <input
          type="text"
          placeholder="搜索文件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            border: '1px solid var(--dsh-border)',
            borderRadius: '4px',
            background: 'var(--dsh-input-bg)',
            color: 'var(--dsh-fg)',
            fontSize: '12px',
          }}
        />
      </div>

      {/* 文件树 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {filteredNodes
          ? filteredNodes.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                level={0}
                onToggle={toggleExpand}
                onOpen={openFile}
                onContextMenu={handleContextMenu}
                searchMode
              />
            ))
          : tree?.children?.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                level={0}
                onToggle={toggleExpand}
                onOpen={openFile}
                onContextMenu={handleContextMenu}
              />
            ))
        }
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetType={contextMenu.type}
          targetPath={contextMenu.path}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

// === 辅助函数 ===
function insertChildren(root: FileNode, path: string, children: FileNode[]): FileNode {
  if (root.path === path) return { ...root, children, expanded: true }
  if (root.children) return { ...root, children: root.children.map(c => insertChildren(c, path, children)) }
  return root
}
```

#### 3.2.6 文件树条目组件（`src/client/FileTreeItem.tsx`）

```tsx
import React, { useCallback, useState } from 'react'

interface FileTreeItemProps {
  node: import('./FileTree').FileNode
  level: number
  onToggle: (node: import('./FileTree').FileNode) => void
  onOpen: (path: string) => void
  onContextMenu: (e: React.MouseEvent, node: import('./FileTree').FileNode) => void
  searchMode?: boolean
}

// 文件扩展名 → 图标颜色
const FILE_COLORS: Record<string, string> = {
  '.ts': '#3178c6',
  '.tsx': '#3178c6',
  '.js': '#f7df1e',
  '.jsx': '#f7df1e',
  '.json': '#a8b9cc',
  '.md': '#519aba',
  '.css': '#8bc34a',
  '.html': '#e44d26',
  '.py': '#3572A5',
  '.rs': '#dea584',
  '.go': '#00ADD8',
  '.java': '#b07219',
  '.yml': '#cb171e',
  '.yaml': '#cb171e',
  '.toml': '#9c4221',
}

function getFileColor(name: string): string {
  const ext = '.' + name.split('.').pop()
  return FILE_COLORS[ext] || '#888'
}

function getFileIcon(name: string, isDir: boolean): string {
  if (isDir) return '📁'
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const iconMap: Record<string, string> = {
    ts: '📘', tsx: '📘', js: '📒', jsx: '📒',
    json: '📋', md: '📝', css: '🎨', html: '🌐',
    py: '🐍', rs: '🦀', go: '🔷', java: '☕',
    yml: '⚙️', yaml: '⚙️', toml: '⚙️',
    gitignore: '🙈', lock: '🔒',
  }
  return iconMap[ext] || '📄'
}

export function FileTreeItem({
  node, level, onToggle, onOpen, onContextMenu, searchMode,
}: FileTreeItemProps) {
  const isDir = node.type === 'folder'
  const indent = searchMode ? 0 : level * 16

  const handleClick = useCallback(() => {
    if (isDir) onToggle(node)
    else onOpen(node.path)
  }, [isDir, node, onToggle, onOpen])

  const handleDoubleClick = useCallback(() => {
    if (isDir) onToggle(node)
  }, [isDir, node, onToggle])

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: `${8 + indent}px`,
          paddingRight: '8px',
          height: '24px',
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => onContextMenu(e, node)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'var(--dsh-hover-bg, rgba(255,255,255,0.05))'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent'
        }}
      >
        {/* 展开箭头 */}
        <span style={{ width: '16px', textAlign: 'center', fontSize: '10px', color: '#888' }}>
          {isDir ? (node.expanded ? '▼' : '▶') : ''}
        </span>

        {/* 图标 */}
        <span style={{ width: '20px', textAlign: 'center', fontSize: '13px' }}>
          {getFileIcon(node.name, isDir)}
        </span>

        {/* 文件名 */}
        <span style={{
          marginLeft: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: isDir ? 'var(--dsh-fg)' : 'var(--dsh-fg-secondary, #ccc)',
          fontWeight: isDir ? 500 : 400,
        }}>
          {searchMode ? node.path : node.name}
        </span>

        {/* Git 状态标记 */}
        {node.gitStatus && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '10px',
            fontWeight: 'bold',
            color: node.gitStatus === 'M' ? '#e2c08d'
              : node.gitStatus === 'A' ? '#73c991'
              : node.gitStatus === 'D' ? '#f47067'
              : '#e5c07b',
          }}>
            {node.gitStatus}
          </span>
        )}
      </div>

      {/* 子节点 */}
      {isDir && node.expanded && node.children?.map((child) => (
        <FileTreeItem
          key={child.path}
          node={child}
          level={level + 1}
          onToggle={onToggle}
          onOpen={onOpen}
          onContextMenu={onContextMenu}
        />
      ))}
    </>
  )
}
```

---

### 3.3 `@dsh-ide/dsh-ide-editor` — 代码编辑器

**职责**：在 DSH 中心区域注入 Monaco Editor，提供多标签页代码编辑体验。

#### 3.3.1 项目结构

```
packages/dsh-ide-editor/
├── package.json
├── cordis.patch.yml
├── tsdown.config.ts
├── src/
│   ├── index.ts                    # 宿主侧入口
│   ├── client/
│   │   ├── index.ts                # 浏览器侧入口
│   │   ├── mount.tsx               # 编辑器挂载
│   │   ├── EditorTabs.tsx          # 标签页栏
│   │   ├── MonacoContainer.tsx     # Monaco 编辑器容器
│   │   ├── WelcomeTab.tsx          # 欢迎标签页
│   │   ├── locales.ts
│   │   └── store.ts                # 标签页状态管理
│   └── core/
│       └── types.ts
└── lib/
```

#### 3.3.2 浏览器侧核心逻辑（`src/client/store.ts`）

```typescript
export interface Tab {
  id: string
  path: string
  name: string
  language: string
  modified: boolean
  content: string
  scrollTop: number
  viewState: any  // Monaco ICodeEditorViewState
}

export interface EditorStore {
  tabs: Tab[]
  activeTabId: string | null
  splitDirection: 'horizontal' | 'vertical' | null
}

type Listener = () => void

class EditorStoreImpl {
  private state: EditorStore = { tabs: [], activeTabId: null, splitDirection: null }
  private listeners: Set<Listener> = new Set()

  getSnapshot(): EditorStore { return this.state }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void { this.listeners.forEach((l) => l()) }

  async openFile(path: string): Promise<void> {
    // 已打开则切换
    const existing = this.state.tabs.find((t) => t.path === path)
    if (existing) {
      this.state = { ...this.state, activeTabId: existing.id }
      this.notify()
      return
    }

    // 从 API 读取文件内容
    const api = (window as any).__IDE_API__
    if (!api) return

    const content: string = await api.readFile(path)
    const name = path.split('/').pop() ?? path
    const language = detectLanguage(name)

    const tab: Tab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      path,
      name,
      language,
      modified: false,
      content,
      scrollTop: 0,
      viewState: null,
    }

    this.state = {
      ...this.state,
      tabs: [...this.state.tabs, tab],
      activeTabId: tab.id,
    }
    this.notify()
  }

  closeTab(id: string): void {
    const tabs = this.state.tabs.filter((t) => t.id !== id)
    const activeTabId = this.state.activeTabId === id
      ? (tabs.length > 0 ? tabs[Math.min(tabs.length - 1, this.state.tabs.findIndex(t => t.id === id))].id : null)
      : this.state.activeTabId
    this.state = { ...this.state, tabs, activeTabId }
    this.notify()
  }

  setActive(id: string): void {
    this.state = { ...this.state, activeTabId: id }
    this.notify()
  }

  markModified(id: string, modified: boolean): void {
    this.state = {
      ...this.state,
      tabs: this.state.tabs.map((t) => t.id === id ? { ...t, modified } : t),
    }
    this.notify()
  }

  saveTab(id: string, content: string): void {
    const tab = this.state.tabs.find((t) => t.id === id)
    if (tab) {
      const api = (window as any).__IDE_API__
      api?.writeFile(tab.path, content)
      this.state = {
        ...this.state,
        tabs: this.state.tabs.map((t) => t.id === id ? { ...t, content, modified: false } : t),
      }
      this.notify()
    }
  }
}

function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    json: 'json', md: 'markdown', css: 'css', scss: 'scss',
    html: 'html', py: 'python', rs: 'rust', go: 'go',
    java: 'java', yml: 'yaml', yaml: 'yaml', toml: 'toml',
    sh: 'shell', bash: 'shell', sql: 'sql', xml: 'xml',
    c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
    cs: 'csharp', rb: 'ruby', php: 'php', swift: 'swift',
  }
  return map[ext] ?? 'plaintext'
}

export const editorStore = new EditorStoreImpl()
```

#### 3.3.3 编辑器挂载（`src/client/mount.tsx`）

```tsx
import { createRoot, type Root } from 'react-dom/client'
import type { ClientContext, SessionId } from '@deepseek-ai/dsh-client-runtime/client'
import { EditorTabs } from './EditorTabs.tsx'
import { MonacoContainer } from './MonacoContainer.tsx'
import { editorStore } from './store.ts'

const CENTER_SELECTOR = '[data-pane="conversation"], [class*="centerCol"]'
const VIEW_SELECTOR = '[data-dsh-ide-editor-view]'
const ACTIVE_ATTR = 'data-dsh-ide-editor-active'

/** 监听文件打开事件（来自侧边栏的文件树） */
function listenFileOpen(): () => void {
  const handler = (e: Event) => {
    const { path } = (e as CustomEvent).detail
    editorStore.openFile(path)
  }
  document.addEventListener('dsh-ide-open-file', handler)
  return () => document.removeEventListener('dsh-ide-open-file', handler)
}

export function mountEditor(ctx: ClientContext): () => void {
  if (document.querySelector(VIEW_SELECTOR) !== null) return () => {}

  let root: Root | undefined
  let container: HTMLDivElement | undefined

  const ensure = (): void => {
    if (container !== undefined) return
    const column = document.querySelector<HTMLElement>(CENTER_SELECTOR)
    if (column === undefined) return

    container = document.createElement('div')
    container.dataset.dshIdeEditorView = ''
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;'
    column.appendChild(container)

    root = createRoot(container)
    root.render(
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <EditorTabs store={editorStore} />
        <MonacoContainer store={editorStore} />
      </div>
    )
  }

  const observer = new MutationObserver(() => ensure())
  observer.observe(document.body, { childList: true, subtree: true })

  // 监听来自侧边栏的文件打开事件
  const unlisten = listenFileOpen()

  // CSS：编辑器激活时隐藏对话内容
  const style = document.createElement('style')
  style.textContent = `
    html[${ACTIVE_ATTR}] [class*="conversationContent"],
    html[${ACTIVE_ATTR}] [class*="messageList"] {
      display: none !important;
    }
    html[${ACTIVE_ATTR}] [${VIEW_SELECTOR}] {
      display: flex !important;
    }
  `
  document.head.appendChild(style)

  // 自动激活：有标签页打开时自动显示编辑器
  const unsub = editorStore.subscribe(() => {
    const { tabs } = editorStore.getSnapshot()
    if (tabs.length > 0) {
      document.documentElement.setAttribute(ACTIVE_ATTR, '')
    }
  })

  ensure()

  return () => {
    observer.disconnect()
    unlisten()
    unsub()
    style.remove()
    root?.unmount()
    container?.remove()
  }
}
```

#### 3.3.4 Monaco 编辑器容器（`src/client/MonacoContainer.tsx`）

```tsx
import React, { useRef, useEffect, useCallback } from 'react'
import type { editor } from 'monaco-editor'
import { editorStore, type EditorStore, type Tab } from './store.ts'

// Monaco Editor 通过 CDN 动态加载（避免 bundle 过大）
const MONACO_CDN = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'

async function loadMonaco(): Promise<typeof import('monaco-editor')> {
  if ((window as any).monaco) return (window as any).monaco

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${MONACO_CDN}/loader.js`
    script.onload = () => {
      ;(window as any).require.config({ paths: { vs: MONACO_CDN } })
      ;(window as any).require(['vs/editor/editor.main'], (monaco: any) => {
        resolve(monaco)
      })
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export function MonacoContainer({ store }: { store: EditorStore }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<any>(null)
  const viewStatesRef = useRef<Map<string, any>>(new Map())

  const { tabs, activeTabId } = store.getSnapshot()

  // 初始化 Monaco
  useEffect(() => {
    let disposed = false

    loadMonaco().then((monaco) => {
      if (disposed || !containerRef.current) return
      monacoRef.current = monaco

      // 定义暗色主题
      monaco.editor.defineTheme('dsh-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
          { token: 'string', foreground: 'ce9178' },
          { token: 'keyword', foreground: '569cd6' },
          { token: 'type', foreground: '4ec9b0' },
          { token: 'function', foreground: 'dcdcaa' },
          { token: 'variable', foreground: '9cdcfe' },
          { token: 'number', foreground: 'b5cea8' },
          { token: 'operator', foreground: 'd4d4d4' },
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
          'editor.lineHighlightBackground': '#2a2d2e',
          'editor.selectionBackground': '#264f78',
          'editorCursor.foreground': '#aeafad',
          'editorLineNumber.foreground': '#858585',
          'editorLineNumber.activeForeground': '#c6c6c6',
          'editor.selectionHighlightBackground': '#264f7833',
          'editorIndentGuide.background': '#404040',
          'editorIndentGuide.activeBackground': '#707070',
        },
      })

      editorRef.current = monaco.editor.create(containerRef.current, {
        theme: 'dsh-dark',
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
        minimap: { enabled: true, scale: 1 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        renderWhitespace: 'selection',
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        padding: { top: 8, bottom: 8 },
      })

      // 快捷键：Ctrl+S 保存
      editorRef.current.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        () => {
          const { activeTabId } = store.getSnapshot()
          if (!activeTabId || !editorRef.current) return
          const content = editorRef.current.getValue()
          store.saveTab(activeTabId, content)
        }
      )
    })

    return () => {
      disposed = true
      editorRef.current?.dispose()
    }
  }, [])

  // 切换标签页时同步编辑器内容
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    const { tabs, activeTabId } = store.getSnapshot()
    const activeTab = tabs.find((t) => t.id === activeTabId)

    if (!activeTab) {
      editorRef.current.setModel(null)
      return
    }

    // 保存当前视图状态
    const currentModel = editorRef.current.getModel()
    if (currentModel) {
      const currentUri = currentModel.uri.toString()
      viewStatesRef.current.set(currentUri, editorRef.current.saveViewState())
    }

    // 切换到新模型
    const monaco = monacoRef.current
    let model = monaco.editor.getModel(monaco.Uri.parse(activeTab.path))
    if (!model) {
      model = monaco.editor.createModel(
        activeTab.content,
        activeTab.language,
        monaco.Uri.parse(activeTab.path)
      )
    }
    editorRef.current.setModel(model)

    // 恢复视图状态
    const savedState = viewStatesRef.current.get(activeTab.path)
    if (savedState) {
      editorRef.current.restoreViewState(savedState)
    }
  }, [activeTabId, tabs])

  // 监听内容变化
  useEffect(() => {
    if (!editorRef.current) return
    const disposable = editorRef.current.onDidChangeModelContent(() => {
      const { activeTabId } = store.getSnapshot()
      if (activeTabId) {
        store.markModified(activeTabId, true)
      }
    })
    return () => disposable.dispose()
  }, [activeTabId])

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, minHeight: 0 }}
    />
  )
}
```

---

### 3.4 `@dsh-ide/dsh-ide-terminal` — 集成终端

**职责**：在 DSH 底部面板注入 xterm.js 终端，通过 WebSocket 连接宿主 PTY。

#### 3.4.1 项目结构

```
packages/dsh-ide-terminal/
├── package.json
├── cordis.patch.yml
├── src/
│   ├── index.ts
│   ├── client/
│   │   ├── index.ts
│   │   ├── mount.tsx
│   │   ├── TerminalView.tsx
│   │   ├── store.ts
│   │   └── locales.ts
│   └── core/
│       └── types.ts
└── lib/
```

#### 3.4.2 终端组件（`src/client/TerminalView.tsx`）

```tsx
import React, { useRef, useEffect, useState } from 'react'

// xterm.js 通过 CDN 动态加载
async function loadXTerm() {
  if ((window as any).Terminal) return (window as any).Terminal

  const loadCSS = (href: string) => new Promise<void>((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href
    link.onload = () => resolve()
    document.head.appendChild(link)
  })

  const loadScript = (src: string) => new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    document.head.appendChild(script)
  })

  await loadCSS('https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css')
  await loadScript('https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js')
  await loadScript('https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js')
  await loadScript('https://cdn.jsdelivr.net/npm/@xterm/addon-web-links@0.11.0/lib/addon-web-links.js')

  return (window as any).Terminal
}

interface TerminalInstance {
  id: string
  name: string
  terminal: any
  ws: WebSocket
}

export function TerminalView({ rootPath }: { rootPath: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [terminals, setTerminals] = useState<TerminalInstance[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const instancesRef = useRef<Map<string, TerminalInstance>>(new Map())

  const api = (window as any).__IDE_API__

  // 创建新终端
  const createTerminal = async () => {
    const Terminal = await loadXTerm()
    if (!Terminal || !api) return

    const cols = 80
    const rows = 24
    const ws = api.createTerminal(cols, rows)

    const terminal = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#aeafad',
        selectionBackground: '#264f78',
        black: '#000000',
        red: '#f44747',
        green: '#6a9955',
        yellow: '#dcdcaa',
        blue: '#569cd6',
        magenta: '#c586c0',
        cyan: '#4ec9b0',
        white: '#d4d4d4',
      },
      fontFamily: "'JetBrains Mono', Consolas, monospace",
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 5000,
    })

    const FitAddon = (window as any).FitAddon
    if (FitAddon) {
      const fitAddon = new FitAddon()
      terminal.loadAddon(fitAddon)
      // 延迟适配
      setTimeout(() => fitAddon.fit(), 100)
    }

    const id = `term-${Date.now()}`
    terminal.open(document.createElement('div'))

    // 双向数据绑定
    terminal.onData((data: string) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data)
    })
    ws.onmessage = (event) => {
      terminal.write(event.data)
    }

    const instance: TerminalInstance = { id, name: `终端 ${instancesRef.current.size + 1}`, terminal, ws }
    instancesRef.current.set(id, instance)
    setTerminals((prev) => [...prev, instance])
    setActiveId(id)
  }

  // 关闭终端
  const closeTerminal = (id: string) => {
    const instance = instancesRef.current.get(id)
    if (instance) {
      instance.terminal.dispose()
      instance.ws.close()
      instancesRef.current.delete(id)
    }
    setTerminals((prev) => prev.filter((t) => t.id !== id))
    if (activeId === id) {
      const remaining = Array.from(instancesRef.current.values())
      setActiveId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  // 挂载活跃终端到 DOM
  useEffect(() => {
    if (!containerRef.current || !activeId) return
    const instance = instancesRef.current.get(activeId)
    if (!instance) return

    // 清空容器并挂载终端元素
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(instance.terminal.element)

    // 触发 resize
    instance.terminal.element.style.width = '100%'
    instance.terminal.element.style.height = '100%'
  }, [activeId])

  // 初始创建一个终端
  useEffect(() => {
    createTerminal()
    return () => {
      // 清理所有终端
      instancesRef.current.forEach((inst) => {
        inst.terminal.dispose()
        inst.ws.close()
      })
    }
  }, [rootPath])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#1e1e1e',
      color: '#d4d4d4',
    }}>
      {/* 终端标签栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        background: '#252526',
        borderBottom: '1px solid #3c3c3c',
        padding: '0 8px',
        gap: '2px',
      }}>
        {terminals.map((t) => (
          <div
            key={t.id}
            onClick={() => setActiveId(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              background: activeId === t.id ? '#1e1e1e' : 'transparent',
              color: activeId === t.id ? '#fff' : '#888',
              borderLeft: activeId === t.id ? '2px solid #007acc' : '2px solid transparent',
            }}
          >
            <span>{t.name}</span>
            <span
              onClick={(e) => { e.stopPropagation(); closeTerminal(t.id) }}
              style={{ fontSize: '14px', lineHeight: 1 }}
            >
              ×
            </span>
          </div>
        ))}
        <button
          onClick={createTerminal}
          style={{
            marginLeft: '4px',
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          +
        </button>
      </div>

      {/* 终端内容 */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'hidden', padding: '4px' }}
      />
    </div>
  )
}
```

---

### 3.5 `@dsh-ide/dsh-ide-toolbar` — 工具栏与状态栏

**职责**：注入顶部工具栏（文件操作按钮）和底部状态栏（行列号、语言、编码等）。

#### 3.5.1 顶部工具栏

在侧边栏顶部或编辑器上方注入快捷操作按钮：

```tsx
// src/client/Toolbar.tsx
import React from 'react'

export function Toolbar() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: '32px',
      background: '#323233',
      borderBottom: '1px solid #3c3c3c',
      padding: '0 8px',
      gap: '4px',
      fontSize: '12px',
    }}>
      {/* 新建文件 */}
      <ToolButton icon="📄" tooltip="新建文件" onClick={() => {
        document.dispatchEvent(new CustomEvent('dsh-ide-new-file'))
      }} />
      {/* 保存 */}
      <ToolButton icon="💾" tooltip="保存 (Ctrl+S)" onClick={() => {
        document.dispatchEvent(new CustomEvent('dsh-ide-save'))
      }} />
      {/* 全部保存 */}
      <ToolButton icon="📦" tooltip="全部保存" onClick={() => {
        document.dispatchEvent(new CustomEvent('dsh-ide-save-all'))
      }} />
      <div style={{ width: 1, height: 16, background: '#555', margin: '0 4px' }} />
      {/* 撤销 */}
      <ToolButton icon="↩" tooltip="撤销" onClick={() => {
        document.dispatchEvent(new CustomEvent('dsh-ide-undo'))
      }} />
      {/* 重做 */}
      <ToolButton icon="↪" tooltip="重做" onClick={() => {
        document.dispatchEvent(new CustomEvent('dsh-ide-redo'))
      }} />
      <div style={{ flex: 1 }} />
      {/* 搜索 */}
      <ToolButton icon="🔍" tooltip="搜索 (Ctrl+Shift+F)" onClick={() => {
        document.dispatchEvent(new CustomEvent('dsh-ide-search'))
      }} />
    </div>
  )
}

function ToolButton({ icon, tooltip, onClick }: { icon: string; tooltip: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        background: 'none',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'none'
      }}
    >
      {icon}
    </button>
  )
}
```

#### 3.5.2 底部状态栏

```tsx
// src/client/StatusBar.tsx
import React, { useState, useEffect } from 'react'

export function StatusBar() {
  const [info, setInfo] = useState({
    language: '',
    line: 1,
    column: 1,
    encoding: 'UTF-8',
    lineEnding: 'LF',
    gitBranch: '',
  })

  // 监听编辑器变化事件
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setInfo((prev) => ({ ...prev, ...detail }))
    }
    document.addEventListener('dsh-ide-status', handler)
    return () => document.removeEventListener('dsh-ide-status', handler)
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: '22px',
      background: '#007acc',
      color: '#fff',
      fontSize: '12px',
      padding: '0 8px',
      gap: '16px',
    }}>
      {/* 分支 */}
      {info.gitBranch && (
        <StatusItem icon="🌿" text={info.gitBranch} />
      )}
      <div style={{ flex: 1 }} />
      {/* 语言 */}
      {info.language && <StatusItem text={info.language} />}
      {/* 编码 */}
      <StatusItem text={info.encoding} />
      {/* 行尾 */}
      <StatusItem text={info.lineEnding} />
      {/* 行列号 */}
      <StatusItem text={`行 ${info.line}, 列 ${info.column}`} />
    </div>
  )
}

function StatusItem({ icon, text }: { icon?: string; text: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </span>
  )
}
```

---

### 3.6 `@dsh-ide/dsh-ide-all` — 聚合包

**职责**：一键安装所有 IDE 插件。

#### 3.6.1 package.json

```json
{
  "name": "@dsh-ide/dsh-ide-all",
  "version": "0.1.0",
  "description": "DSH IDE 聚合插件：一键安装全部 IDE 功能（文件管理器 + 代码编辑器 + 集成终端 + 工具栏）",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "dependencies": {
    "@dsh-ide/dsh-ide-host": "0.1.0",
    "@dsh-ide/dsh-ide-sidebar": "0.1.0",
    "@dsh-ide/dsh-ide-editor": "0.1.0",
    "@dsh-ide/dsh-ide-terminal": "0.1.0",
    "@dsh-ide/dsh-ide-toolbar": "0.1.0"
  }
}
```

#### 3.6.2 cordis.patch.yml

```yaml
- insert:
    - id: ide-host
      name: '@dsh-ide/dsh-ide-host'
    - id: ide-sidebar
      name: '@dsh-ide/dsh-ide-sidebar'
    - id: ide-editor
      name: '@dsh-ide/dsh-ide-editor'
    - id: ide-terminal
      name: '@dsh-ide/dsh-ide-terminal'
    - id: ide-toolbar
      name: '@dsh-ide/dsh-ide-toolbar'
```

---

## 四、布局协调与面板互斥

### 4.1 中心区域多面板切换

DSH 的中心区域是单占位的，多个插件（对话、文件树、编辑器、任务看板、SSH）需要互斥显示。采用统一的 data 属性协议：

```html
<!-- 激活状态互斥切换 -->
<html data-dsh-ide-editor-active>    <!-- 编辑器 -->
<html data-dsh-ide-sidebar-active>   <!-- 文件树 -->
<html data-dsh-taskboard-active>     <!-- 任务看板 -->
<html data-dsh-ssh-active>           <!-- SSH -->
<!-- 无属性 = 默认对话视图 -->
```

### 4.2 跨插件事件协议

```typescript
// 自定义事件用于插件间通信
interface DshIdeEvents {
  'dsh-ide-open-file': { path: string }
  'dsh-ide-save': {}
  'dsh-ide-save-all': {}
  'dsh-ide-new-file': {}
  'dsh-ide-undo': {}
  'dsh-ide-redo': {}
  'dsh-ide-search': {}
  'dsh-ide-status': { language?: string; line?: number; column?: number }
  'dsh-panel-activate': { detail: string }  // 已有协议（task-board、ssh 使用）
}
```

### 4.3 与现有 DSH 插件共存

| 现有插件 | 共存策略 |
|---------|---------|
| `dsh-task-board` | 互斥切换：点击「任务看板」关闭 IDE 面板，反之亦然 |
| `dsh-ssh` | 互斥切换：同上 |
| `dsh-aionui-panel` | 替换或共存：IDE 编辑器可替代其 Preview 面板，Explorer 可共存 |
| `dsh-live-stats` | 无冲突：状态栏插件 |
| `dsh-pet` | 无冲突：装饰性插件 |
| `dsh-skins` | 共存：主题系统可适配 IDE 样式 |

---

## 五、开发路线图

### Phase 1：基础架构（第 1-2 周）

**目标**：搭建插件骨架，实现宿主 API 和文件资源管理器。

```
✅ 项目 monorepo 搭建（pnpm workspace）
✅ dsh-ide-host 宿主插件（路由注册、文件系统 API）
✅ dsh-ide-sidebar 文件资源管理器（文件树 + 搜索）
✅ dsh-ide-all 聚合包骨架
✅ npm 发布配置
```

**交付物**：
- `dsh-ide-all` 可通过 `dsh plugin add` 安装
- 侧边栏出现「文件」入口，点击显示文件树
- 文件树可浏览、展开、搜索

### Phase 2：代码编辑器（第 3-5 周）

**目标**：实现 Monaco Editor 集成和多标签页系统。

```
✅ dsh-ide-editor Monaco 集成
✅ 标签页管理（打开/关闭/切换/排序）
✅ 文件保存（Ctrl+S）
✅ 语法高亮（多语言）
✅ 暗色主题
✅ 基础快捷键
```

**交付物**：
- 点击文件树中的文件，在中心区域打开 Monaco 编辑器
- 支持多标签页切换
- 支持保存文件

### Phase 3：集成终端（第 6-7 周）

**目标**：实现 xterm.js 终端和 WebSocket PTY 连接。

```
✅ dsh-ide-terminal xterm.js 集成
✅ 宿主侧 WebSocket PTY 服务
✅ 多终端标签
✅ 终端大小自适应
```

**交付物**：
- 底部面板显示终端
- 支持多终端标签
- 可在终端中执行命令

### Phase 4：工具栏与状态栏（第 8 周）

**目标**：注入顶部工具栏和底部状态栏。

```
✅ dsh-ide-toolbar 工具栏按钮
✅ 底部状态栏（语言、行列号、编码）
✅ 快捷键系统（Ctrl+P 命令面板基础版）
```

**交付物**：
- 顶部显示快捷操作按钮
- 底部显示编辑器状态信息

### Phase 5：收尾（第 8 周末）

```
✅ 聚合包完善和测试
✅ README 文档
✅ npm 发布
✅ 与现有 DSH 插件的兼容性测试
```

---

## 六、技术栈与依赖

### 6.1 核心依赖

```json
{
  "monaco-editor": "^0.45.0",
  "@xterm/xterm": "^5.5.0",
  "@xterm/addon-fit": "^0.10.0",
  "@xterm/addon-web-links": "^0.11.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0"
}
```

### 6.2 DSH SDK 依赖（devDependencies）

```json
{
  "@deepseek-ai/cordis": "^4.0.1",
  "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-client-connection": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-client-ui-slots": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-client-ui-settings": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-client-ui-conversation": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-settings": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-host-webserver": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-subprocess": "^0.1.0-rc.6",
  "@deepseek-ai/dsh-workspace": "^0.1.0-rc.6"
}
```

### 6.3 开发工具

```json
{
  "typescript": "~5.7.2",
  "tsdown": "0.22.2",
  "vitest": "^3.0.0",
  "lightningcss": "^1.32.0"
}
```

---

## 七、与方案 D（独立应用）的对比

| 维度 | 本方案（插件扩展） | 方案 D（独立应用） |
|-----|-------------------|-------------------|
| **代码量** | ~10,700 行 | ~12,800 行 |
| **开发周期** | ~8 周 | ~12 周 |
| **AI 集成** | ✅ 天然集成 DSH AI | 需要自己对接 |
| **终端能力** | ✅ 复用 DSH 的 xterm | 需要自己实现 PTY |
| **文件系统** | ✅ 复用 DSH 的工作区 | 需要自己实现 |
| **独立运行** | ❌ 依赖 DSH | ✅ 独立运行 |
| **部署复杂度** | ✅ `dsh plugin add` 一行命令 | ❌ 需要单独部署 |
| **维护成本** | ✅ 跟随 DSH 版本更新 | ❌ 独立维护 |
| **功能上限** | ⚠️ 受限于 DSH 架构 | ✅ 完全可控 |
| **用户体验** | ⚠️ DOM 注入有局限 | ✅ 原生体验 |

---

## 八、已知限制与风险

### 8.1 架构限制

1. **DOM 注入的脆弱性**：DSH 升级可能改变 DOM 结构，导致选择器失效
   - 缓解：MutationObserver 自愈机制 + 多选择器兼容
2. **中心区域单占位**：编辑器和对话无法同时显示
   - 缓解：通过 CSS 切换，保留对话的 React 状态
3. **无原生 Split View**：无法像 VS Code 那样分割编辑器
   - 缓解：后续可扩展，但需要更多 DOM 操作

### 8.2 功能限制

1. **Monaco Editor 体积**：完整版 ~10MB，通过 CDN 加载
   - 缓解：懒加载 + 缓存
2. **终端性能**：WebSocket PTY 的延迟比本地终端高
   - 缓解：DSH 已经实现了此模式，性能可接受
3. **无调试器**：DAP（Debug Adapter Protocol）集成复杂度高
   - 缓解：Phase 3+ 考虑

### 8.3 兼容性风险

| 风险 | 概率 | 影响 | 缓解措施 |
|-----|------|------|---------|
| DSH DOM 结构变更 | 中 | 侧边栏/中心注入失效 | 多选择器 + 自愈 |
| DSH SDK 版本不兼容 | 低 | 编译失败 | 锁定版本 + 适配 |
| 与现有插件冲突 | 中 | UI 异常 | 互斥协议 + 测试 |
| Monaco CDN 不可用 | 低 | 编辑器无法加载 | 本地 fallback |

---

## 九、总结

**DSH 插件扩展方案**通过 DSH 的 `cordis.patch.yml` + profile 机制，以 npm 包形式开发 IDE 功能模块，在浏览器 DOM 层注入文件管理器、Monaco 编辑器、集成终端等组件。

**核心优势**：
- ✅ **零 DSH 源码修改**：纯插件化，`dsh plugin add` 一行安装
- ✅ **天然 AI 集成**：复用 DSH 的 AI 对话、agent 能力
- ✅ **开发量小**：~10,700 行，8 周可完成
- ✅ **与现有生态兼容**：可与 task-board、ssh、live-stats 等共存
- ✅ **维护成本低**：跟随 DSH 版本更新

**核心代价**：
- ⚠️ 受限于 DSH 的 DOM 架构，部分高级 IDE 功能难以实现
- ⚠️ DOM 注入模式的稳定性依赖 DSH 的 DOM 结构稳定性
- ⚠️ 编辑器和对话无法真正并排显示（只能切换）

**推荐路径**：先用本方案快速搭建可用的 IDE 体验，验证需求后再决定是否迁移到方案 D（独立应用）。

---

## 附录 A：Monorepo 项目结构

```
dsh-ide/
├── package.json              # pnpm workspace 根配置
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── packages/
│   ├── dsh-ide-all/          # 聚合包
│   ├── dsh-ide-host/         # 宿主服务端
│   ├── dsh-ide-sidebar/      # 文件资源管理器
│   ├── dsh-ide-editor/       # 代码编辑器
│   ├── dsh-ide-terminal/     # 集成终端
│   └── dsh-ide-toolbar/      # 工具栏/状态栏
└── README.md
```

## 附录 B：安装与使用

```bash
# 安装
dsh plugin --profile web add @dsh-ide/dsh-ide-all

# 或单独安装
dsh plugin --profile web add @dsh-ide/dsh-ide-sidebar
dsh plugin --profile web add @dsh-ide/dsh-ide-editor
dsh plugin --profile web add @dsh-ide/dsh-ide-terminal

# 重启 DSH Web GUI
dsh web
```

## 附录 C：参考资源

- [DeepSeek Harness 架构文档](https://github.com/deepseek-ai/deepseek-harness/blob/HEAD/docs/architecture.zh.md)
- [DSH 客户端模块文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/client-modules.zh.md)
- [dsh-web-ui 插件集合](https://github.com/zhu1090093659/dsh-web-ui)
- [Monaco Editor](https://github.com/microsoft/monaco-editor)
- [xterm.js](https://github.com/xtermjs/xterm.js)
- [DSH 插件开发实战](https://www.cnblogs.com/pc2005/p/22477987)
- [DSH 插件开发全指南](https://www.53ai.com/news/LargeLanguageModel/2026081613046.html)
