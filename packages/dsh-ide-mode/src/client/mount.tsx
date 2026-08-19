/**
 * IDE mode mounting.
 *
 * Injects a sidebar entry ("IDE") and mounts a full IDE React tree into the
 * DSH center column. Uses the same DOM-injection + data-attribute toggle
 * pattern as dsh-task-board / dsh-ssh, and (like them) a body-level
 * MutationObserver self-heals until the center column actually exists — the
 * dsh AppFrame mounts only after boot settlement, so a single eager query at
 * apply time is not enough.
 *
 * The IDE view is a standalone React tree (createRoot) that never touches DSH's
 * React reconciliation. Visibility is toggled via `data-dsh-ide-active` on
 * <html>, with CSS rules hiding the conversation content when active.
 */
import { createRoot, type Root } from 'react-dom/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { IdeApp } from './IdeApp.tsx'

// ─── Constants ──────────────────────────────────────────────────────────
const SIDEBAR_ROOT_SELECTOR = '[data-pane="sidebar"], [class*="sidebarCol"]'
const CENTER_SELECTOR = '[data-pane="conversation"], [class*="centerCol"]'
const ENTRY_SELECTOR = '[data-dsh-ide-entry]'
const VIEW_SELECTOR = '[data-dsh-ide-view]'
const ACTIVE_ATTR = 'data-dsh-ide-active'
const ACTIVATE_EVENT = 'dsh-panel-activate'
const PANEL_NAME = 'ide'
const OTHER_PANEL_ATTRS = [
  'data-dsh-taskboard-active',
  'data-dsh-ssh-active',
]

const ICON_SVG = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3L1.5 8l3.5 5M11 3l3.5 5-3.5 5"/></svg>`

// ─── Styles ─────────────────────────────────────────────────────────────
//
// Attribute-scoped so nothing leaks into the rest of the GUI. Colors ride the
// dsh --dsw-* design tokens, so the entry follows the active theme (light /
// dark / skins) exactly like the task-board and ssh entries. The center-column
// takeover rules mirror the sibling panels (single-occupant column, opaque
// backdrop, z-index above the composer).

const ENTRY_STYLES = `
/* --- sidebar entry row (matches the shell's nav-item look) --- */
[data-dsh-ide-entry] {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--dsw-font-family);
  white-space: nowrap;
}
[data-dsh-ide-entry]:hover {
  background: var(--dsw-specific-sidebar-nav-item-hover);
  color: var(--dsw-alias-label-primary);
}
[data-dsh-ide-entry][data-active] {
  background: var(--dsw-specific-sidebar-nav-item-active);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
[data-dsh-ide-entry][data-active]:hover {
  background: var(--dsw-specific-sidebar-nav-item-active);
}
[data-dsh-ide-entry]:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}
[data-dsh-ide-entry]:active {
  transform: translateY(1px);
}
[data-ide-entry-icon] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
[data-ide-entry-label] {
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Collapsed rail: icon-only, centered, matching the shell's rail. */
[data-dsh-frame][data-sidebar-collapsed] [data-dsh-ide-entry] {
  justify-content: center;
  padding: 0;
  width: 100%;
}
[data-dsh-frame][data-sidebar-collapsed] [data-ide-entry-label] {
  display: none;
}

/* --- center-column takeover (single-occupant, like task-board / ssh) --- */
[data-pane='conversation'],
[class*='centerCol'] {
  position: relative;
}
[data-dsh-ide-view] {
  position: absolute;
  inset: 0;
  display: none;
  z-index: 60;
  /* Opaque backdrop: the conversation subtree stays mounted under the view,
     so sticky code-block banners cannot show through. */
  background: var(--dsw-alias-bg-base);
}
html[data-dsh-ide-active]:not([data-dsh-taskboard-active]):not([data-dsh-ssh-active]) [data-dsh-ide-view] {
  display: flex;
}
/* While the IDE is active, the conversation content underneath is hidden
   (it stays mounted and stateful). !important is required: the dsh shell
   wraps the conversation view in a node with an inline display:contents,
   and inline styles beat a plain stylesheet rule. */
html[data-dsh-ide-active]:not([data-dsh-taskboard-active]):not([data-dsh-ssh-active]) [data-pane='conversation'] > :not([data-dsh-ide-view]),
html[data-dsh-ide-active]:not([data-dsh-taskboard-active]):not([data-dsh-ssh-active]) [class*='centerCol'] > :not([data-dsh-ide-view]) {
  display: none !important;
}
`

// ─── Sidebar entry ──────────────────────────────────────────────────────

function sidebarRoot(): HTMLElement | undefined {
  const column = document.querySelector<HTMLElement>(SIDEBAR_ROOT_SELECTOR)
  if (column === null) return undefined
  const logoOwner = column.querySelector<HTMLElement>('[class*="logoRow"]')?.parentElement
  return logoOwner ?? (column.firstElementChild as HTMLElement | undefined)
}

function newSessionButton(root: HTMLElement): HTMLButtonElement | undefined {
  const nested = root.querySelector<HTMLButtonElement>('button[class*="newSession"]')
  if (nested !== null) return nested
  for (const child of root.children) {
    if (child.tagName === 'BUTTON') return child as HTMLButtonElement
  }
  return undefined
}

function createEntry(): HTMLButtonElement {
  const entry = document.createElement('button')
  entry.type = 'button'
  entry.dataset.dshIdeEntry = ''
  entry.setAttribute('aria-label', 'IDE')
  entry.setAttribute('title', 'IDE')
  entry.innerHTML = `<span data-ide-entry-icon>${ICON_SVG}</span><span data-ide-entry-label>IDE</span>`

  entry.addEventListener('click', () => {
    const html = document.documentElement
    if (html.hasAttribute(ACTIVE_ATTR)) {
      html.removeAttribute(ACTIVE_ATTR)
    } else {
      // Evict sibling panels before opening (single-occupant center column).
      for (const attr of OTHER_PANEL_ATTRS) html.removeAttribute(attr)
      html.setAttribute(ACTIVE_ATTR, '')
    }
    document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: PANEL_NAME }))
  })

  return entry
}

function placeEntry(root: HTMLElement, entry: HTMLButtonElement): boolean {
  const button = newSessionButton(root)
  if (button === undefined) return false

  if (entry.parentElement !== root) {
    const row = button.closest('[class*="logoRow"]')
    const base = (row !== null && row.parentElement === root) ? row : button
    // Find sibling plugin entries to maintain consistent ordering.
    const family = Array.from(root.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        el.matches('[data-dsh-ide-entry], [data-dsh-taskboard-entry], [data-dsh-ssh-entry]'),
    )
    // IDE entry sits after task-board and ssh, but before unclaimed entries.
    const anchor = family.length > 0 ? family[family.length - 1].nextElementSibling : base.nextElementSibling
    root.insertBefore(entry, anchor ?? null)
  }
  return true
}

// ─── IDE view mounting ──────────────────────────────────────────────────

let ideRoot: Root | undefined
let ideContainer: HTMLDivElement | undefined
let ideStyle: HTMLStyleElement | undefined

/**
 * Inject the plugin stylesheet once (entry + center-column takeover rules).
 */
function ensureStyles(): void {
  if (ideStyle !== undefined) return
  ideStyle = document.createElement('style')
  ideStyle.dataset.dshIdeStyle = ''
  ideStyle.textContent = ENTRY_STYLES
  document.head.appendChild(ideStyle)
}

/**
 * Lazily create the IDE container and mount the React tree. Idempotent and
 * retried by a body-level MutationObserver until the center column exists
 * (the dsh AppFrame mounts only after boot settlement).
 */
/** Cached workspace root passed to the IdeApp. */
let workspaceRoot = ''

function ensureIdeView(): void {
  if (ideContainer !== undefined) return

  const column = document.querySelector<HTMLElement>(CENTER_SELECTOR)
  if (column === null) return

  ideContainer = document.createElement('div')
  ideContainer.dataset.dshIdeView = ''
  column.appendChild(ideContainer)

  ideRoot = createRoot(ideContainer)
  ideRoot.render(<IdeApp root={workspaceRoot} />)
}

/**
 * Mount the IDE mode plugin.
 * Returns a disposer that removes everything.
 */
export function mountIdeMode(_ctx: ClientContext, root?: string): () => void {
  // Update workspace root (even if already mounted, so the IdeApp can refresh).
  if (root !== undefined && root !== '') workspaceRoot = root

  // Idempotency guard — but still update root if the view already exists.
  if (document.querySelector(ENTRY_SELECTOR) !== null) {
    // Force re-render with updated root if the IdeApp is already mounted.
    if (root !== undefined && root !== '' && ideRoot !== undefined) {
      ideRoot.render(<IdeApp root={workspaceRoot} />)
    }
    return () => {}
  }

  ensureStyles()

  const entry = createEntry()
  let rootEl: HTMLElement | undefined
  let placed = false

  // ── Entry placement with self-healing ──
  const tryPlace = (): void => {
    if (rootEl !== undefined && !rootEl.isConnected) {
      rootObserver.disconnect()
      rootEl = undefined
      placed = false
    }
    if (placed && document.body.contains(entry)) return
    rootEl ??= sidebarRoot()
    if (rootEl === undefined) return
    placed = placeEntry(rootEl, entry)
    if (placed) {
      rootObserver.observe(rootEl, { childList: true, subtree: true })
    }
  }

  const waitObserver = new MutationObserver(() => tryPlace())
  waitObserver.observe(document.body, { childList: true, subtree: true })

  const rootObserver = new MutationObserver(() => {
    if (rootEl === undefined || !rootEl.isConnected) {
      placed = false
      tryPlace()
      return
    }
    if (!rootEl.contains(entry)) {
      placed = placeEntry(rootEl, entry)
    }
  })

  // ── IDE view (self-healing until the center column arrives) ──
  const viewObserver = new MutationObserver(() => ensureIdeView())
  viewObserver.observe(document.body, { childList: true, subtree: true })
  ensureIdeView()

  // ── Re-render IdeApp when the skin/theme changes ──
  // Skin changes modify <html> attributes (class, data-skin, data-theme) and
  // CSS variables. Re-rendering forces the IdeApp to pick up the new tokens.
  const skinObserver = new MutationObserver(() => {
    if (ideRoot !== undefined) ideRoot.render(<IdeApp root={workspaceRoot} />)
  })
  skinObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-skin', 'data-theme'] })

  // ── Evict IDE when another panel opens ──
  const onOtherActivate = (event: Event): void => {
    const detail = (event as CustomEvent).detail
    if (detail !== PANEL_NAME) {
      document.documentElement.removeAttribute(ACTIVE_ATTR)
    }
  }
  document.addEventListener(ACTIVATE_EVENT, onOtherActivate)

  // ── Sync entry active state ──
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

  // ── Clicking a session row exits IDE mode ──
  const SESSION_ROW_SELECTOR = '[class*="sessionRow"], [class*="projectRow"], [class*="searchResultRow"], [class*="searchResultWorkspace"], [class*="newSession"]'
  const onClickSession = (event: MouseEvent): void => {
    if (!document.documentElement.hasAttribute(ACTIVE_ATTR)) return
    const target = (event.target as HTMLElement | null)
    if (target?.closest(SESSION_ROW_SELECTOR) !== null) {
      document.documentElement.removeAttribute(ACTIVE_ATTR)
    }
  }
  document.addEventListener('click', onClickSession, true)

  tryPlace()
  syncActive()

  // ── Cleanup ──
  return () => {
    waitObserver.disconnect()
    rootObserver.disconnect()
    viewObserver.disconnect()
    skinObserver.disconnect()
    activeObserver.disconnect()
    document.removeEventListener(ACTIVATE_EVENT, onOtherActivate)
    document.removeEventListener('click', onClickSession, true)
    document.documentElement.removeAttribute(ACTIVE_ATTR)
    entry.remove()
    ideRoot?.unmount()
    ideRoot = undefined
    ideContainer?.remove()
    ideContainer = undefined
    ideStyle?.remove()
    ideStyle = undefined
  }
}
