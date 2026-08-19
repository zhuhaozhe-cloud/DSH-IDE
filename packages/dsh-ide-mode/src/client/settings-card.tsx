/**
 * IDE mode settings card — the plugin's "插件设置" entry in the DSH settings
 * surface, registered into the web-ui plugin-item list (the same seat as
 * dsh-task-board / dsh-ssh).
 *
 * Direct-write over the ide-mode settings namespace: toggling a field calls
 * scope.set/unset immediately (no staged form). Colors ride the --dsw-* design
 * tokens so the card follows the active theme.
 */
import { useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'

export interface IdeSettings {
  enabled?: boolean
  announceToAgent?: boolean
}

export interface IdeSettingsCardProps {
  scope: SettingsScope<IdeSettings>
}

const CARD: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '14px 16px',
  background: 'var(--dsw-alias-bg-layer-2)',
  border: '1px solid var(--dsw-alias-border-l1)',
  borderRadius: 12,
  color: 'var(--dsw-alias-label-primary)',
  fontFamily: 'var(--dsw-font-family)',
  fontSize: 13,
  listStyle: 'none',
}

const NAME: CSSProperties = { fontSize: 14, fontWeight: 700 }
const DESC: CSSProperties = { fontSize: 12, color: 'var(--dsw-alias-label-secondary)' }
const NOTE: CSSProperties = {
  margin: 0,
  padding: '8px 10px',
  fontSize: 12,
  color: 'var(--dsw-alias-label-tertiary)',
  background: 'var(--dsw-alias-interactive-bg-hover)',
  borderRadius: 8,
}
const BODY: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }

const FIELD: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5 }
const FIELD_HEAD: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }
const LABEL: CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--dsw-alias-label-secondary)' }
const BADGE: CSSProperties = {
  fontSize: 11,
  padding: '1px 8px',
  borderRadius: 999,
  border: '1px solid var(--dsw-alias-border-l2)',
  color: 'var(--dsw-alias-label-secondary)',
}
const RESET: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  color: 'var(--dsw-alias-state-business-primary)',
  padding: 0,
}
const SELECT: CSSProperties = {
  padding: '6px 10px',
  fontSize: 13,
  color: 'var(--dsw-alias-label-primary)',
  background: 'var(--dsw-specific-input-major)',
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 8,
  outline: 'none',
  fontFamily: 'inherit',
  maxWidth: '100%',
}
const HINT: CSSProperties = { margin: 0, fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' }

interface BoolFieldProps {
  id: string
  label: string
  hint: string
  value: boolean
  overridden: boolean
  disabled: boolean
  onChange: (text: string) => void
  onReset: () => void
}

function BoolField(props: BoolFieldProps): ReactNode {
  const draft = props.overridden ? String(props.value) : ''
  return (
    <div style={FIELD}>
      <div style={FIELD_HEAD}>
        <label htmlFor={props.id} style={LABEL}>{props.label}</label>
        {props.overridden && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={BADGE}>已覆盖</span>
            <button type="button" style={RESET} disabled={props.disabled} onClick={props.onReset}>重置</button>
          </span>
        )}
      </div>
      <select
        id={props.id}
        style={SELECT}
        value={draft}
        disabled={props.disabled}
        onChange={(e) => { props.onChange(e.target.value) }}
      >
        <option value="">继承</option>
        <option value="true">开</option>
        <option value="false">关</option>
      </select>
      <p style={HINT}>{props.hint}</p>
    </div>
  )
}

const hasOwn = (obj: Record<string, unknown>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key)

export function IdeSettingsCard({ scope }: IdeSettingsCardProps) {
  const snapshot = useSyncExternalStore(
    (cb) => scope.subscribe(cb),
    () => scope.getSnapshot(),
  )

  const ready = snapshot.status === 'ready'
  const writable = snapshot.writable
  const value = snapshot.value ?? {}
  const user = (snapshot.user ?? {}) as Record<string, unknown>

  // 使用类型断言来绕过类型检查问题
  const scopeAny = scope as any

  const write = (field: string, text: string): void => {
    if (text === '') void scopeAny.unset(field).catch(() => {})
    else if (text === 'true') void scopeAny.set(field, true).catch(() => {})
    else if (text === 'false') void scopeAny.set(field, false).catch(() => {})
  }
  const reset = (field: string): void => {
    void scopeAny.unset(field).catch(() => {})
  }

  return (
    <li style={CARD}>
      <div>
        <div style={NAME}>IDE 模式</div>
        <div style={DESC}>DSH IDE 模式插件的启用与配置。</div>
      </div>
      {!ready && <p style={NOTE}>设置命名空间未开放，当前配置不可编辑。</p>}
      <div style={BODY}>
        <BoolField
          id="ide-mode-enabled"
          label="启用 IDE 模式"
          hint="开启后，侧边栏出现「IDE」入口，点击可切换到类 VS Code 编程界面。"
          value={value.enabled ?? true}
          overridden={hasOwn(user, 'enabled')}
          disabled={!ready || !writable}
          onChange={(t) => write('enabled', t)}
          onReset={() => reset('enabled')}
        />
        <BoolField
          id="ide-mode-announce"
          label="向 Agent 宣告 IDE 能力"
          hint="开启后，每个 Agent 的系统提示会包含 IDE 模式的能力说明，以便与 IDE 功能协作。"
          value={value.announceToAgent ?? true}
          overridden={hasOwn(user, 'announceToAgent')}
          disabled={!ready || !writable}
          onChange={(t) => write('announceToAgent', t)}
          onReset={() => reset('announceToAgent')}
        />
      </div>
    </li>
  )
}
