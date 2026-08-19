/**
 * Thin client for the /ide-api/* filesystem routes.
 *
 * Every call includes the workspace root so the host gate can verify it sits
 * inside a registered workspace. The envelope is { ok, value } / { ok, error }.
 */

const BASE = '/ide-api/fs'

interface FsOk<T> { ok: true; value: T }
interface FsFail { ok: false; error: string }
type FsResult<T> = FsOk<T> | FsFail

async function post<T>(op: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(BASE + '/' + op, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok && res.status !== 403 && res.status !== 409) {
    throw new Error('HTTP ' + res.status)
  }
  let json: FsResult<T>
  try {
    json = (await res.json()) as FsResult<T>
  } catch {
    throw new Error('Invalid response from /ide-api/fs/' + op)
  }
  if (json.ok === true) return json.value
  throw new Error(json.error)
}

export interface FsEntry {
  name: string
  isDirectory: boolean
  isFile: boolean
}

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

/** List a directory (relative path, '' = root). */
export async function readdir(root: string, relPath: string): Promise<FsEntry[]> {
  return post<FsEntry[]>('readdir', { root, path: relPath })
}

/** Read a text file. */
export async function readFile(root: string, relPath: string): Promise<string> {
  return post<string>('read', { root, path: relPath })
}

/** Write (create or overwrite) a text file. */
export async function writeFile(root: string, relPath: string, content: string): Promise<void> {
  await post<unknown>('write', { root, path: relPath, content })
}

/** Create a new file (fails if it already exists). */
export async function newFile(root: string, relPath: string): Promise<void> {
  await post<unknown>('new-file', { root, path: relPath })
}

/** Create a directory (recursive). */
export async function mkdir(root: string, relPath: string): Promise<void> {
  await post<unknown>('mkdir', { root, path: relPath })
}

/** Build a file tree from the workspace root (one-level deep recursion for dirs). */
export async function loadTree(root: string, relPath: string, depth: number): Promise<FileNode[]> {
  if (depth <= 0) return []
  const entries = await readdir(root, relPath)
  const nodes: FileNode[] = []
  for (const entry of entries.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1
    return a.name.localeCompare(b.name)
  })) {
    // Skip hidden files and node_modules at depth > 0
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const childPath = relPath ? relPath + '/' + entry.name : entry.name
    if (entry.isDirectory) {
      const children = await loadTree(root, childPath, depth - 1)
      nodes.push({ name: entry.name, path: childPath, type: 'folder', children })
    } else {
      nodes.push({ name: entry.name, path: childPath, type: 'file' })
    }
  }
  return nodes
}
