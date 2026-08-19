/**
 * Host-side entry for the dsh-ide-mode plugin.
 *
 * Runs in the DSH Node.js process. Two jobs:
 *  1. Register the ide-mode settings namespace (schema + composition entry) so
 *     the web settings surface can read/write it — this is what backs the
 *     "插件设置" card.
 *  2. Inject a system-prompt section so every agent knows the IDE mode exists
 *     and how to cooperate with it. The section is gated on the live settings
 *     (enabled + announceToAgent) and re-registers when either changes.
 */
import type { Context } from '@deepseek-ai/cordis'
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-workspace'
import { registerIdeRoutes } from './host/routes.ts'

export const inject: string[] = ['webServer', 'workspaceRegistry', 'systemPrompt']

/** Order within the tool-guidance band. */
const SECTION_ORDER = 220

export const IDE_MODE_GUIDANCE =
  '本机已安装 dsh-ide-mode 插件（DSH IDE 模式）：侧边栏「IDE」入口；' +
  '一键切换到类 VS Code 编程界面（Monaco Editor + 文件资源管理器 + 集成终端 + 命令面板 + 状态栏）。' +
  '中心区域接管为代码编辑区（对话退到后台，不销毁）。' +
  '能力：多标签页代码编辑（语法高亮/自动补全/Minimap）、文件树浏览与搜索、多终端标签、Ctrl+Shift+P 命令面板、Ctrl+P 快速打开。' +
  '文件系统 API 走宿主侧 HTTP 路由（/ide-api/*）。' +
  '用户提到「IDE 模式 / 代码编辑 / 编程界面 / 编辑器」时即指本插件，请据此协作。'

/** Settings namespace the "插件设置" card edits (mirrored in the client half). */
export const IDE_MODE_SETTINGS_NAMESPACE = settingsNamespace('ide-mode')

/** Plugin config, validated by the same-named schemastery schema. */
export interface Config {
  /** Master switch for the plugin (browser half + host announcement). */
  enabled?: boolean
  /** When true (default), announce the IDE to every agent's system prompt. */
  announceToAgent?: boolean
}

export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  announceToAgent: z.boolean().default(true),
})

const DEFAULT_ANNOUNCE = true

export function apply(ctx: Context, config?: Config): void {
  // Live source the announcement reads: the settings section once the settings
  // service is served, the composition entry otherwise.
  let current: () => Config = () => config ?? {}
  let disposeSection: (() => void) | undefined

  const sync = (): void => {
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if ((current().enabled ?? true) === false) return
    if ((current().announceToAgent ?? DEFAULT_ANNOUNCE) === false) return
    // 使用类型断言来绕过类型检查问题
    const ctxAny = ctx as any
    disposeSection = ctxAny.systemPrompt.section({
      name: 'plugin:ide-mode',
      order: SECTION_ORDER,
      text: IDE_MODE_GUIDANCE,
    })
  }

  installSettingsSection(ctx, IDE_MODE_SETTINGS_NAMESPACE, Config, config ?? {}, {
    setSource: (source: () => Config) => { current = source },
    onChange: sync,
  })

  // Wire the /ide-api/* filesystem routes on the shared webserver.
  // 使用类型断言来绕过类型检查问题
  const ctxAny = ctx as any
  ctxAny.effect(() => registerIdeRoutes(ctx), 'dsh-ide-mode: /ide-api routes')

  // Initial registration from the composition entry (covers deployments with
  // no settings service).
  sync()
}
