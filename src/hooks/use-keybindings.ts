import { useEffect } from 'react'
import { useUIStore } from '../stores/ui-store'
import { useEditorStore } from '../stores/editor-store'
import { useTerminalStore } from '../stores/terminal-store'
import { useFileStore } from '../stores/file-store'
import { defaultKeybindings } from '../keybindings/default'

export function useKeybindings() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel)
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette)
  const toggleQuickOpen = useUIStore((s) => s.toggleQuickOpen)
  const showNotification = useUIStore((s) => s.showNotification)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const key = e.key.toLowerCase()

      // Build the key string for matching
      let keyStr = ''
      if (ctrl) keyStr += 'ctrl+'
      if (shift) keyStr += 'shift+'
      keyStr += key

      // Find matching keybinding
      const binding = defaultKeybindings.find((kb) => kb.key === keyStr)
      if (!binding) return

      // Prevent default browser behavior
      e.preventDefault()
      e.stopPropagation()

      // Execute command
      switch (binding.command) {
        case 'view.toggleSidebar':
          toggleSidebar()
          break
        case 'view.toggleTerminal':
          toggleBottomPanel()
          break
        case 'view.commandPalette':
          toggleCommandPalette()
          break
        case 'view.quickOpen':
          toggleQuickOpen()
          break
        case 'terminal.new':
          useTerminalStore.getState().createTerminal()
          break
        case 'file.save':
          // Save current file
          const state = useEditorStore.getState()
          const group = state.groups.find((g) => g.id === state.activeGroupId)
          const activeTab = group?.tabs.find((t) => t.id === group.activeTabId)
          if (activeTab) {
            state.setTabDirty(activeTab.id, false)
            showNotification(`已保存 ${activeTab.fileName}`)
          }
          break
        case 'file.saveAll':
          const allState = useEditorStore.getState()
          allState.groups.forEach((g) => {
            g.tabs.forEach((t) => {
              if (t.isDirty) allState.setTabDirty(t.id, false)
            })
          })
          showNotification('已保存所有文件')
          break
        case 'tab.close':
          const closeState = useEditorStore.getState()
          const closeGroup = closeState.groups.find((g) => g.id === closeState.activeGroupId)
          if (closeGroup?.activeTabId) {
            closeState.closeTab(closeState.activeGroupId, closeGroup.activeTabId)
          }
          break
        case 'tab.next':
          const nextState = useEditorStore.getState()
          const nextGroup = nextState.groups.find((g) => g.id === nextState.activeGroupId)
          if (nextGroup && nextGroup.tabs.length > 1) {
            const currentIdx = nextGroup.tabs.findIndex((t) => t.id === nextGroup.activeTabId)
            const nextIdx = (currentIdx + 1) % nextGroup.tabs.length
            nextState.setActiveTab(nextState.activeGroupId, nextGroup.tabs[nextIdx].id)
          }
          break
        case 'tab.previous':
          const prevState = useEditorStore.getState()
          const prevGroup = prevState.groups.find((g) => g.id === prevState.activeGroupId)
          if (prevGroup && prevGroup.tabs.length > 1) {
            const currentIdx = prevGroup.tabs.findIndex((t) => t.id === prevGroup.activeTabId)
            const prevIdx = (currentIdx - 1 + prevGroup.tabs.length) % prevGroup.tabs.length
            prevState.setActiveTab(prevState.activeGroupId, prevGroup.tabs[prevIdx].id)
          }
          break
        default:
          // Handle tab.gotoN commands
          if (binding.command.startsWith('tab.goto')) {
            const gotoState = useEditorStore.getState()
            const gotoGroup = gotoState.groups.find((g) => g.id === gotoState.activeGroupId)
            if (gotoGroup) {
              let idx: number
              if (binding.command === 'tab.gotoLast') {
                idx = gotoGroup.tabs.length - 1
              } else {
                idx = parseInt(binding.command.replace('tab.goto', '')) - 1
              }
              if (gotoGroup.tabs[idx]) {
                gotoState.setActiveTab(gotoState.activeGroupId, gotoGroup.tabs[idx].id)
              }
            }
          }
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleSidebar, toggleBottomPanel, toggleCommandPalette, toggleQuickOpen, showNotification])
}
