import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
//#region src/host/routes.ts
const registerIdeRoutes = (ctx) => {
	if (!ctx.get("webServer")) {
		ctx.logger("dsh-ide-mode").warn("webServer service not available; /ide-api routes not registered");
		return () => {};
	}
	if (!ctx.get("workspaceRegistry")) {
		ctx.logger("dsh-ide-mode").warn("workspaceRegistry service not available; /ide-api routes not registered");
		return () => {};
	}
	const logger = ctx.logger("dsh-ide-mode:routes");
	const disposers = [];
	logger.info("Registered /ide-api routes");
	return () => {
		for (const disposer of disposers) disposer();
	};
};
//#endregion
//#region src/index.ts
const inject = [
	"webServer",
	"workspaceRegistry",
	"systemPrompt"
];
/** Order within the tool-guidance band. */
const SECTION_ORDER = 220;
const IDE_MODE_GUIDANCE = "本机已安装 dsh-ide-mode 插件（DSH IDE 模式）：侧边栏「IDE」入口；一键切换到类 VS Code 编程界面（Monaco Editor + 文件资源管理器 + 集成终端 + 命令面板 + 状态栏）。中心区域接管为代码编辑区（对话退到后台，不销毁）。能力：多标签页代码编辑（语法高亮/自动补全/Minimap）、文件树浏览与搜索、多终端标签、Ctrl+Shift+P 命令面板、Ctrl+P 快速打开。文件系统 API 走宿主侧 HTTP 路由（/ide-api/*）。用户提到「IDE 模式 / 代码编辑 / 编程界面 / 编辑器」时即指本插件，请据此协作。";
/** Settings namespace the "插件设置" card edits (mirrored in the client half). */
const IDE_MODE_SETTINGS_NAMESPACE = settingsNamespace("ide-mode");
const Config = z.object({
	enabled: z.boolean().default(true),
	announceToAgent: z.boolean().default(true)
});
const DEFAULT_ANNOUNCE = true;
function apply(ctx, config) {
	let current = () => config ?? {};
	let disposeSection;
	const sync = () => {
		if (disposeSection !== void 0) {
			disposeSection();
			disposeSection = void 0;
		}
		if ((current().enabled ?? true) === false) return;
		if ((current().announceToAgent ?? DEFAULT_ANNOUNCE) === false) return;
		disposeSection = ctx.systemPrompt.section({
			name: "plugin:ide-mode",
			order: SECTION_ORDER,
			text: IDE_MODE_GUIDANCE
		});
	};
	installSettingsSection(ctx, IDE_MODE_SETTINGS_NAMESPACE, Config, config ?? {}, {
		setSource: (source) => {
			current = source;
		},
		onChange: sync
	});
	ctx.effect(() => registerIdeRoutes(ctx), "dsh-ide-mode: /ide-api routes");
	sync();
}
//#endregion
export { Config, IDE_MODE_GUIDANCE, IDE_MODE_SETTINGS_NAMESPACE, apply, inject };
