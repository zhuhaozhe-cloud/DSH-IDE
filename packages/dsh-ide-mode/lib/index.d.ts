import z from "@deepseek-ai/schemastery";
import { Context } from "@deepseek-ai/cordis";

//#region src/index.d.ts
declare const inject: string[];
declare const IDE_MODE_GUIDANCE: string;
/** Settings namespace the "插件设置" card edits (mirrored in the client half). */
declare const IDE_MODE_SETTINGS_NAMESPACE: import("@deepseek-ai/dsh-settings").SettingsNamespace;
/** Plugin config, validated by the same-named schemastery schema. */
interface Config {
  /** Master switch for the plugin (browser half + host announcement). */
  enabled?: boolean;
  /** When true (default), announce the IDE to every agent's system prompt. */
  announceToAgent?: boolean;
}
declare const Config: z<Config>;
declare function apply(ctx: Context, config?: Config): void;
//#endregion
export { Config, IDE_MODE_GUIDANCE, IDE_MODE_SETTINGS_NAMESPACE, apply, inject };