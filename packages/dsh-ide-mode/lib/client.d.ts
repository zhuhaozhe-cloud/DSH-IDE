
import { ClientContext } from "@deepseek-ai/dsh-client-runtime/client";

//#region src/client/index.d.ts
/** Required services. */
declare const inject: string[];
/** Owner share of the web-ui plugin card (the section supplies nothing). */
interface SettingsPluginItemOwnerProps {
  children?: never;
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** The web-ui plugin-group settings list this card registers into. */
    'web-ui.plugin.item': {
      kind: 'list';
      scope: 'root';
      owner: SettingsPluginItemOwnerProps;
    };
  }
}
/** Apply the browser half. */
declare function apply(ctx: ClientContext): void;
//#endregion
export { SettingsPluginItemOwnerProps, apply, inject };
