/**
 * Ambient type declarations for DSH SDK modules.
 * These are provided at build time by the DSH profile's node_modules.
 * Declared here only for local IDE type-checking convenience.
 */
declare module '@deepseek-ai/cordis' {
  export interface Context {
    systemPrompt: {
      section(opts: { name: string; order: number; text: string }): () => void
    }
  }
}

declare module '@deepseek-ai/dsh-client-runtime/client' {
  export interface ClientContext {
    sessions: any
    locale: any
    effect(fn: () => void | (() => void), label?: string): void
    get(name: string): any
    inject(deps: string[], fn: (ctx: ClientContext) => void): void
  }
  export type SessionId = string & { __brand: 'SessionId' }
  export type WorkspaceId = string & { __brand: 'WorkspaceId' }
  export interface SettingsScopeSpec<S> { namespace: string }
  export interface SettingsScope<S> { getSnapshot(): any; subscribe(fn: () => void): () => void }
}

declare module '@deepseek-ai/dsh-client-locale/client' {
  // locale module augmentation
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  export interface SlotMap {}
  export interface LocaleNamespaceMap {}
}

declare module '@deepseek-ai/dsh-client-connection/client' {
  export interface ConnectionHandle {
    api: any
  }
}

declare module '@deepseek-ai/dsh-settings' {
  export function settingsNamespace(name: string): string
  export function installSettingsSection(ctx: any, ns: string, schema: any, defaults: any, hooks: any): void
}

declare module '@deepseek-ai/dsh-system-prompt' {
  // system-prompt module augmentation
}

declare module '@deepseek-ai/dsh-host-webserver' {
  // host-webserver module augmentation
}

declare module '@deepseek-ai/dsh-workspace' {
  // workspace module augmentation
}

declare module '@deepseek-ai/dsh-subprocess' {
  // subprocess module augmentation
}
