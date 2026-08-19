import React, { useEffect, useRef, useCallback } from 'react'
import { useTerminalStore } from '../../stores/terminal-store'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

// Terminal theme matching VS Code dark
const TERMINAL_THEME = {
  background: '#1e1e1e',
  foreground: '#cccccc',
  cursor: '#aeafad',
  cursorAccent: '#1e1e1e',
  selectionBackground: '#264f78',
  selectionForeground: '#ffffff',
  black: '#000000',
  red: '#f44747',
  green: '#6a9955',
  yellow: '#dcdcaa',
  blue: '#569cd6',
  magenta: '#c586c0',
  cyan: '#4ec9b0',
  white: '#d4d4d4',
  brightBlack: '#666666',
  brightRed: '#f44747',
  brightGreen: '#6a9955',
  brightYellow: '#dcdcaa',
  brightBlue: '#569cd6',
  brightMagenta: '#c586c0',
  brightCyan: '#4ec9b0',
  brightWhite: '#ffffff',
}

interface TerminalPanelProps {
  terminalId: string
  isActive: boolean
}

function TerminalPanel({ terminalId, isActive }: TerminalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const terminal = new Terminal({
      theme: TERMINAL_THEME,
      fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 5000,
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)

    terminal.open(containerRef.current)
    fitAddon.fit()

    terminalRef.current = terminal
    fitAddonRef.current = fitAddon

    // Welcome message
    terminal.writeln('\x1b[1;36mDSH IDE Terminal\x1b[0m')
    terminal.writeln('\x1b[90mType commands here...\x1b[0m')
    terminal.writeln('')
    terminal.write('\x1b[32m$\x1b[0m ')

    // Simple command handling
    let currentLine = ''
    terminal.onData((data) => {
      if (data === '\r') {
        // Enter
        terminal.writeln('')
        const cmd = currentLine.trim()
        if (cmd) {
          // Echo command and provide mock responses
          if (cmd === 'help') {
            terminal.writeln('Available commands:')
            terminal.writeln('  help     - Show this help')
            terminal.writeln('  clear    - Clear terminal')
            terminal.writeln('  ls       - List files')
            terminal.writeln('  pwd      - Print working directory')
            terminal.writeln('  echo     - Print text')
            terminal.writeln('  date     - Show current date')
            terminal.writeln('  whoami   - Show current user')
          } else if (cmd === 'clear') {
            terminal.clear()
          } else if (cmd === 'ls') {
            terminal.writeln('src/          node_modules/')
            terminal.writeln('public/       package.json')
            terminal.writeln('tsconfig.json vite.config.ts')
            terminal.writeln('README.md     .gitignore')
          } else if (cmd === 'pwd') {
            terminal.writeln('/workspace')
          } else if (cmd.startsWith('echo ')) {
            terminal.writeln(cmd.slice(5))
          } else if (cmd === 'date') {
            terminal.writeln(new Date().toLocaleString())
          } else if (cmd === 'whoami') {
            terminal.writeln('dsh-ide-user')
          } else {
            terminal.writeln(`\x1b[31mcommand not found: ${cmd}\x1b[0m`)
          }
        }
        currentLine = ''
        terminal.write('\x1b[32m$\x1b[0m ')
      } else if (data === '\x7f') {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1)
          terminal.write('\b \b')
        }
      } else if (data >= ' ') {
        currentLine += data
        terminal.write(data)
      }
    })

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (isActive) {
        fitAddon.fit()
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      terminal.dispose()
      terminalRef.current = null
      fitAddonRef.current = null
    }
  }, [terminalId]) // Recreate on terminal change

  // Fit when becoming active
  useEffect(() => {
    if (isActive && fitAddonRef.current) {
      setTimeout(() => fitAddonRef.current?.fit(), 50)
    }
  }, [isActive])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        background: '#1e1e1e',
        overflow: 'hidden',
      }}
    />
  )
}

// Main Terminal Panel with tabs
export function TerminalView() {
  const terminals = useTerminalStore((s) => s.terminals)
  const activeTerminalId = useTerminalStore((s) => s.activeTerminalId)
  const createTerminal = useTerminalStore((s) => s.createTerminal)
  const closeTerminal = useTerminalStore((s) => s.closeTerminal)
  const setActiveTerminal = useTerminalStore((s) => s.setActiveTerminal)

  // Create initial terminal if none exist
  useEffect(() => {
    if (terminals.length === 0) {
      createTerminal()
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1e1e1e',
        color: '#cccccc',
      }}
    >
      {/* Terminal tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '32px',
          background: '#252526',
          borderBottom: '1px solid #3c3c3c',
          padding: '0 4px',
          gap: '2px',
        }}
      >
        {terminals.map((term) => (
          <div
            key={term.id}
            onClick={() => setActiveTerminal(term.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              background: activeTerminalId === term.id ? '#1e1e1e' : 'transparent',
              color: activeTerminalId === term.id ? '#ffffff' : '#888888',
              borderLeft:
                activeTerminalId === term.id
                  ? '2px solid #007acc'
                  : '2px solid transparent',
              borderRadius: '0',
            }}
          >
            <span>{term.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeTerminal(term.id)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
                background: 'none',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#888888',
                fontSize: '14px',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = '#888888'
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => createTerminal()}
          style={{
            marginLeft: '4px',
            background: 'none',
            border: 'none',
            color: '#888888',
            cursor: 'pointer',
            fontSize: '16px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#888888'
          }}
        >
          +
        </button>
      </div>

      {/* Terminal content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '2px' }}>
        {terminals.map((term) => (
          <div
            key={term.id}
            style={{
              width: '100%',
              height: '100%',
              display: activeTerminalId === term.id ? 'block' : 'none',
            }}
          >
            <TerminalPanel
              terminalId={term.id}
              isActive={activeTerminalId === term.id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
