import { create } from 'zustand'
import type { FileNode } from '../types'

interface FileStoreState {
  rootPath: string
  tree: FileNode[]
  selectedPath: string | null
  expandedPaths: Set<string>

  setRootPath: (path: string) => void
  setTree: (tree: FileNode[]) => void
  selectFile: (path: string) => void
  toggleFolder: (path: string) => void
  expandFolder: (path: string) => void
  collapseFolder: (path: string) => void
}

export const useFileStore = create<FileStoreState>((set, get) => ({
  rootPath: '/workspace',
  tree: [],
  selectedPath: null,
  expandedPaths: new Set(['/workspace']),

  setRootPath: (path) => set({ rootPath: path }),
  setTree: (tree) => set({ tree }),
  selectFile: (path) => set({ selectedPath: path }),
  toggleFolder: (path) => {
    const { expandedPaths } = get()
    const next = new Set(expandedPaths)
    if (next.has(path)) {
      next.delete(path)
    } else {
      next.add(path)
    }
    set({ expandedPaths: next })
  },
  expandFolder: (path) => {
    const { expandedPaths } = get()
    const next = new Set(expandedPaths)
    next.add(path)
    set({ expandedPaths: next })
  },
  collapseFolder: (path) => {
    const { expandedPaths } = get()
    const next = new Set(expandedPaths)
    next.delete(path)
    set({ expandedPaths: next })
  },
}))
