import { defineConfig } from 'tsdown'

const MODULE_ID = '@dsh-ide/dsh-ide-mode'

// Platform modules that the dsh browser module loader (`__ModuleLoader__`)
// already provides at runtime — these must stay external (resolved via the
// factory's `require`), everything else is inlined into the bundle.
const isExternal = (id: string): boolean =>
  id === 'react' ||
  id === 'react-dom' ||
  id.startsWith('react/') ||
  id.startsWith('react-dom/') ||
  id.startsWith('@deepseek-ai/')

export default defineConfig([
  // Host entry (Node.js side) — plain ESM
  {
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    format: 'esm',
    outExtension: () => ({ js: '.js' }),
    dts: { entry: 'src/index.ts' },
    external: isExternal,
  },
  // Client entry (browser side) — dsh `__ModuleLoader__` CJS closure contract
  {
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: 'cjs',
    outExtension: () => ({ js: '.js' }),
    external: isExternal,
    banner: {
      js: [
        `window.__ModuleLoader__.load({`,
        `\tid: "${MODULE_ID}",`,
        `\tfactory: (require) => {`,
        `\t\tvar module = { exports: {} };`,
        `\t\tvar exports = module.exports;`,
        `\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });`,
      ].join('\n'),
    },
    footer: {
      js: [
        `\t\treturn module.exports;`,
        `\t}`,
        `});`,
      ].join('\n'),
    },
  },
])
