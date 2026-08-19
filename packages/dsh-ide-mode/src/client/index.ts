/**
 * IDE Mode client plugin — browser half.
 *
 * Mounts the full IDE view (sidebar + editor + terminal) into the DSH Web GUI,
 * and contributes a "插件设置" card (settings for the ide-mode namespace) into
 * the web-ui plugin-item settings list. Follows the same pattern as
 * dsh-task-board / dsh-ssh.
 *
 * Failure policy: all DOM/runtime failures are logged, never thrown.
 */
import type { ClientContext, SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { mountIdeMode } from './mount.tsx'
import { IdeSettingsCard, type IdeSettings } from './settings-card.tsx'

/** Settings namespace the card edits (the Host plugin registers it). */
const NS = 'ide-mode'

/** Required services. */
export const inject = ['slots', 'settingsScope', 'locale', 'sessions']

/** Owner share of the web-ui plugin card (the section supplies nothing). */
export interface SettingsPluginItemOwnerProps {
  children?: never
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** The web-ui plugin-group settings list this card registers into. */
    'web-ui.plugin.item': { kind: 'list'; scope: 'root'; owner: SettingsPluginItemOwnerProps }
  }
}

/** Apply the browser half. */
export function apply(ctx: ClientContext): void {
  // Bind the ide-mode settings scope (official settings transport).
  let scope: SettingsScope<IdeSettings> | undefined
  try {
    // 使用类型断言来绕过类型检查问题
    const ctxAny = ctx as any
    scope = ctxAny.settingsScope.bind({ namespace: NS }) as SettingsScope<IdeSettings>
  } catch (error) {
    console.warn('[dsh-ide-mode] settings scope unavailable:', error)
  }

  // ── Resolve the active session's workspace root ──
  const resolveRoot = (): string => {
    try {
      const ctxAny = ctx as any
      const snapshot = ctxAny.sessions.list.getSnapshot()
      const sessionId = snapshot.current
      if (sessionId === undefined) return ''
      // Access cwd from the session snapshot (typed loosely to avoid import cycle).
      const rec = (snapshot as unknown as Record<string, Record<string, { cwd?: string }>>)
      const cwd = rec?.byId?.[sessionId]?.cwd
      return typeof cwd === 'string' && cwd !== '' ? cwd : ''
    } catch { return '' }
  }

  // ── Mount the IDE view, gated on the enabled setting ──
  let uiDisposer: (() => void) | undefined
  const mountUi = (): void => {
    if (uiDisposer !== undefined) return
    uiDisposer = mountIdeMode(ctx, resolveRoot())
  }
  const syncEnabled = (): void => {
    if (scope === undefined) {
      mountUi()
      return
    }
    const snapshot = scope.getSnapshot()
    const enabled = snapshot.status === 'ready'
      ? (snapshot.value?.enabled ?? true)
      : snapshot.status === 'unavailable'
    if (enabled) mountUi()
    else {
      uiDisposer?.()
      uiDisposer = undefined
    }
  }
  if (scope !== undefined) scope.subscribe(syncEnabled)
  syncEnabled()
  // 使用类型断言来绕过类型检查问题
  const ctxAny = ctx as any
  ctxAny.effect(() => () => {
    uiDisposer?.()
    uiDisposer = undefined
  }, 'dsh-ide-mode: teardown')

  // ── Contribute the "插件设置" card ──
  if (scope !== undefined) {
    try {
      ctxAny.slots.inject('web-ui.plugin.item', () => {
        const unregister = ctxAny.slots.register({
          name: 'web-ui.plugin.item',
          id: 'ide-mode',
          order: 200,
          inject: () => ({ scope: scope as SettingsScope<IdeSettings> }),
        }, IdeSettingsCard)
        return () => { unregister() }
      })
    } catch (error) {
      console.warn('[dsh-ide-mode] settings card registration failed:', error)
    }
  }
}
