import React from 'react'

// File icon component based on file extension
export function getFileIcon(fileName: string, type: 'file' | 'folder'): React.ReactNode {
  if (type === 'folder') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 2.5h4l1.5 1.5h7.5v9h-13z" fill="#dcb67a" stroke="#dcb67a" strokeWidth="0.5"/>
      </svg>
    )
  }

  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''

  const iconMap: Record<string, { color: string; letter: string }> = {
    ts: { color: '#3178c6', letter: 'TS' },
    tsx: { color: '#3178c6', letter: 'TX' },
    js: { color: '#f7df1e', letter: 'JS' },
    jsx: { color: '#61dafb', letter: 'JX' },
    py: { color: '#3572a5', letter: 'PY' },
    java: { color: '#b07219', letter: 'JA' },
    go: { color: '#00add8', letter: 'GO' },
    rs: { color: '#dea584', letter: 'RS' },
    rb: { color: '#cc342d', letter: 'RB' },
    php: { color: '#4f5d95', letter: 'PH' },
    json: { color: '#5b5b5b', letter: '{}' },
    yaml: { color: '#cb171e', letter: 'Y' },
    yml: { color: '#cb171e', letter: 'Y' },
    xml: { color: '#e37933', letter: '<>' },
    html: { color: '#e34c26', letter: '<>' },
    css: { color: '#563d7c', letter: '#' },
    scss: { color: '#c6538c', letter: 'SC' },
    md: { color: '#083fa1', letter: 'M' },
    sh: { color: '#89e051', letter: '$' },
    bash: { color: '#89e051', letter: '$' },
    ps1: { color: '#012456', letter: 'PS' },
    sql: { color: '#e38c00', letter: 'SQ' },
    vue: { color: '#42b883', letter: 'V' },
    svelte: { color: '#ff3e00', letter: 'SV' },
    dockerfile: { color: '#2496ed', letter: 'D' },
    txt: { color: '#888888', letter: 'T' },
  }

  const icon = iconMap[ext]
  if (!icon) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 1.5h6l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1v-12a1 1 0 011-1z" fill="#555" stroke="#666" strokeWidth="0.5"/>
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 1.5h6l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1v-12a1 1 0 011-1z" fill={icon.color + '33'} stroke={icon.color} strokeWidth="0.5"/>
      <text x="8" y="11" textAnchor="middle" fill={icon.color} fontSize="4" fontFamily="monospace" fontWeight="bold">
        {icon.letter}
      </text>
    </svg>
  )
}

// Folder chevron icon
export function FolderChevron({ expanded }: { expanded: boolean }): React.ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transition: 'transform 0.1s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path d="M5.5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
