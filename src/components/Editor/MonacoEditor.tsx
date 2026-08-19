import React, { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { useEditorStore } from '../../stores/editor-store'
import { darkTheme } from '../../themes/dark-theme'

// Configure Monaco environment for web workers (Vite 5 compatible)
// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_, label) {
    const getWorkerModule = (workerPath: string) => {
      return new Worker(new URL(workerPath, import.meta.url), { type: 'module' })
    }
    if (label === 'json') {
      return getWorkerModule('monaco-editor/esm/vs/language/json/json.worker.js')
    }
    if (label === 'typescript' || label === 'javascript') {
      return getWorkerModule('monaco-editor/esm/vs/language/typescript/ts.worker.js')
    }
    return getWorkerModule('monaco-editor/esm/vs/editor/editor.worker.js')
  },
}

interface MonacoEditorProps {
  filePath: string
  content: string
  language: string
  tabId: string
}

export function MonacoEditor({ filePath, content, language, tabId }: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const setTabDirty = useEditorStore((s) => s.setTabDirty)
  const updateTabContent = useEditorStore((s) => s.updateTabContent)

  // Register DSH Dark theme with Monaco
  useEffect(() => {
    const theme = darkTheme.colors
    monaco.editor.defineTheme('dsh-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'keyword', foreground: '569cd6' },
        { token: 'keyword.control', foreground: 'c586c0' },
        { token: 'entity.name.function', foreground: 'dcdcaa' },
        { token: 'support.function', foreground: 'dcdcaa' },
        { token: 'entity.name.type', foreground: '4ec9b0' },
        { token: 'support.type', foreground: '4ec9b0' },
        { token: 'constant.numeric', foreground: 'b5cea8' },
        { token: 'variable', foreground: '9cdcfe' },
        { token: 'variable.parameter', foreground: '9cdcfe' },
        { token: 'entity.name.tag', foreground: '569cd6' },
        { token: 'attribute.name', foreground: '9cdcfe' },
        { token: 'attribute.value', foreground: 'ce9178' },
        { token: 'delimiter', foreground: 'd4d4d4' },
        { token: 'delimiter.bracket', foreground: 'ffd700' },
      ],
      colors: {
        'editor.background': theme['editor.background'],
        'editor.foreground': theme['editor.foreground'],
        'editor.lineHighlightBackground': theme['editor.lineHighlightBackground'],
        'editor.selectionBackground': theme['editor.selectionBackground'],
        'editorCursor.foreground': '#aeafad',
        'editorWidget.background': '#252526',
        'editorWidget.border': '#454545',
        'editorSuggestWidget.background': '#252526',
        'editorSuggestWidget.border': '#454545',
        'editorSuggestWidget.selectedBackground': '#094771',
        'editorHoverWidget.background': '#252526',
        'editorHoverWidget.border': '#454545',
        'input.background': '#3c3c3c',
        'input.border': '#3c3c3c',
        'scrollbarSlider.background': 'rgba(121, 121, 121, 0.4)',
        'scrollbarSlider.hoverBackground': 'rgba(100, 100, 100, 0.7)',
        'scrollbarSlider.activeBackground': 'rgba(191, 191, 191, 0.4)',
        'minimap.background': '#1e1e1e',
      },
    })
  }, [])

  // Create editor
  useEffect(() => {
    if (!containerRef.current) return

    const editor = monaco.editor.create(containerRef.current, {
      value: content,
      language,
      theme: 'dsh-dark',
      automaticLayout: true,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
      lineHeight: 20,
      padding: { top: 8 },
      scrollBeyondLastLine: true,
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'off',
      minimap: { enabled: true, scale: 1, showSlider: 'mouseover' },
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
      smoothScrolling: true,
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showIcons: true,
        showStatusBar: true,
        preview: true,
      },
    })

    editorRef.current = editor

    // Track changes for dirty state
    editor.onDidChangeModelContent(() => {
      const model = editor.getModel()
      if (model) {
        updateTabContent(tabId, model.getValue())
        setTabDirty(tabId, true)
      }
    })

    // Focus the editor
    editor.focus()

    return () => {
      editor.dispose()
      editorRef.current = null
    }
  }, [filePath, language]) // Recreate on file change

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
