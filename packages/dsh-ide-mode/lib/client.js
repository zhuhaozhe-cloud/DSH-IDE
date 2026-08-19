window.__ModuleLoader__.load({
	id: "@dsh-ide/dsh-ide-mode",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react_dom_client = require("react-dom/client");
let react = require("react");
react = __toESM(react, 1);
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/client/design-tokens.ts
/**
* Design Tokens — DSH IDE Mode
*
* Centralized design system based on the ui-ux-pro-max skill output.
* Minimalist/Swiss style, dark mode, dense layout.
*
* Color Palette: Deep slate + green accent
* Typography: IBM Plex Sans (UI) + JetBrains Mono (code)
* Spacing: 4px base unit, 8/12/16/24/32/48/64px scale
* Radius: 6px (small), 8px (medium), 12px (large)
* Shadows: None (flat minimalism) or very subtle
* Motion: 150-200ms ease-out for all transitions
*/
const colors = {
	bgBase: "var(--dsw-alias-bg-base, #0F172A)",
	bgLayer1: "var(--dsw-alias-bg-layer-1, #111827)",
	bgLayer2: "var(--dsw-alias-bg-layer-2, #1B2336)",
	bgLayer3: "var(--dsw-alias-bg-layer-3, #1E293B)",
	bgElevated: "var(--dsw-alias-bg-elevated, #1E293B)",
	bgMask: "var(--dsw-alias-bg-mask-1, rgba(0,0,0,0.5))",
	textPrimary: "var(--dsw-alias-label-primary, #F8FAFC)",
	textSecondary: "var(--dsw-alias-label-secondary, #94A3B8)",
	textTertiary: "var(--dsw-alias-label-tertiary, #64748B)",
	textForeground: "var(--dsw-alias-label-primary-foreground, #FFFFFF)",
	borderSubtle: "var(--dsw-alias-border-l1, #1E293B)",
	borderDefault: "var(--dsw-alias-border-l2, #334155)",
	borderStrong: "var(--dsw-alias-border-l3, #475569)",
	accentPrimary: "var(--dsw-alias-state-business-primary, #22C55E)",
	accentHover: "var(--dsw-alias-state-business-primary, #16A34A)",
	inputBg: "var(--dsw-specific-input-major, #1E293B)",
	interactiveHover: "var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,0.05))",
	sidebarNavHover: "var(--dsw-specific-sidebar-nav-item-hover, rgba(255,255,255,0.06))",
	sidebarNavActive: "var(--dsw-specific-sidebar-nav-item-active, rgba(34,197,94,0.12))",
	statusError: "var(--dsw-alias-state-error-primary, #EF4444)",
	statusWarning: "var(--dsw-alias-state-warn-primary, #F59E0B)",
	statusSuccess: "var(--dsw-alias-state-success-primary, #22C55E)",
	statusInfo: "var(--dsw-alias-state-business-primary, #3B82F6)"
};
const typography = {
	fontFamily: "var(--dsw-font-family, \"IBM Plex Sans\", \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif)",
	fontFamilyMono: "\"JetBrains Mono\", \"Fira Code\", \"Cascadia Code\", Consolas, monospace",
	fontSize: {
		xs: "11px",
		sm: "12px",
		base: "13px",
		md: "14px",
		lg: "16px",
		xl: "18px"
	},
	fontWeight: {
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700
	},
	lineHeight: {
		tight: "1.25",
		normal: "1.5",
		relaxed: "1.75"
	}
};
const spacing = {
	px: "1px",
	0: "0",
	1: "4px",
	2: "8px",
	3: "12px",
	4: "16px",
	5: "20px",
	6: "24px",
	8: "32px",
	10: "40px",
	12: "48px",
	16: "64px"
};
const radius = {
	none: "0",
	sm: "4px",
	md: "6px",
	lg: "8px",
	xl: "12px",
	full: "9999px"
};
const shadow = {
	none: "none",
	sm: "0 1px 2px rgba(0,0,0,0.2)",
	md: "0 4px 12px rgba(0,0,0,0.3)",
	lg: "0 8px 32px rgba(0,0,0,0.4)"
};
const transition = {
	fast: "100ms ease-out",
	normal: "150ms ease-out",
	slow: "200ms ease-out"
};
const layout = {
	sidebarWidth: 260,
	sidebarMinWidth: 180,
	sidebarMaxWidth: 400,
	tabBarHeight: "36px",
	menuBarHeight: "32px",
	statusBarHeight: "24px",
	terminalHeaderHeight: "30px",
	resizeHandleSize: "4px"
};
const zIndex = {
	base: 0,
	sidebar: 10,
	editor: 10,
	terminal: 10,
	resizeHandle: 20,
	tabBar: 20,
	menuDropdown: 100,
	dialog: 200,
	overlay: 300
};
//#endregion
//#region src/client/MenuBar.tsx
/**
* VS Code-style menu bar for the IDE view.
*
* Design: Minimalist/Swiss, dense layout, keyboard accessible.
* Uses DSH CSS variables for theme consistency.
*/
const barStyle = {
	display: "flex",
	alignItems: "stretch",
	height: layout.menuBarHeight,
	background: colors.bgLayer1,
	borderBottom: `1px solid ${colors.borderDefault}`,
	fontFamily: typography.fontFamily,
	fontSize: typography.fontSize.xs,
	userSelect: "none"
};
const menuButtonStyle = (active) => ({
	display: "flex",
	alignItems: "center",
	padding: `0 ${spacing[4]}px`,
	background: active ? colors.accentPrimary : "transparent",
	color: active ? "#fff" : colors.textPrimary,
	border: "none",
	cursor: "pointer",
	fontFamily: "inherit",
	fontSize: "inherit",
	transition: transition.fast
});
const dropdownStyle = {
	position: "absolute",
	top: "100%",
	left: 0,
	minWidth: 220,
	background: colors.bgLayer1,
	border: `1px solid ${colors.borderDefault}`,
	borderRadius: radius.md,
	boxShadow: shadow.lg,
	zIndex: zIndex.menuDropdown,
	padding: `${spacing[1]}px 0`
};
const itemStyle = (disabled) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: `${spacing[1]}px ${spacing[4]}px`,
	background: "transparent",
	color: disabled ? colors.textTertiary : colors.textPrimary,
	border: "none",
	cursor: disabled ? "not-allowed" : "pointer",
	fontFamily: "inherit",
	fontSize: "inherit",
	width: "100%",
	textAlign: "left",
	transition: transition.fast
});
const separatorStyle = {
	height: 1,
	background: colors.borderDefault,
	margin: `${spacing[1]}px ${spacing[4]}px`
};
const shortcutStyle = {
	color: colors.textTertiary,
	fontSize: typography.fontSize.xs,
	marginLeft: spacing[8]
};
function MenuBar({ menus }) {
	const [openIndex, setOpenIndex] = (0, react.useState)(null);
	const [hovering, setHovering] = (0, react.useState)(false);
	const barRef = (0, react.useRef)(null);
	const handleButton = (0, react.useCallback)((idx) => {
		setOpenIndex((prev) => prev === idx ? null : idx);
		setHovering(true);
	}, []);
	const handleEnter = (0, react.useCallback)((idx) => {
		if (hovering) setOpenIndex(idx);
	}, [hovering]);
	const handleItemClick = (0, react.useCallback)((item) => {
		if ("separator" in item && item.separator) return;
		const menuItem = item;
		if (!menuItem.disabled) menuItem.action();
		setOpenIndex(null);
		setHovering(false);
	}, []);
	(0, react.useEffect)(() => {
		if (!openIndex && !hovering) return;
		const handler = (e) => {
			if (barRef.current && !barRef.current.contains(e.target)) {
				setOpenIndex(null);
				setHovering(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [openIndex, hovering]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		ref: barRef,
		style: barStyle,
		children: menus.map((menu, idx) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: { position: "relative" },
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				style: menuButtonStyle(openIndex === idx),
				onClick: () => handleButton(idx),
				onMouseEnter: () => handleEnter(idx),
				children: menu.label
			}), openIndex === idx && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: dropdownStyle,
				children: menu.items.map((item, i) => "separator" in item && item.separator ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: separatorStyle }, `sep-${i}`) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					style: itemStyle(item.disabled ?? false),
					onClick: () => handleItemClick(item),
					onMouseEnter: (e) => {
						if (!item.disabled) e.currentTarget.style.background = colors.bgLayer2;
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.background = "transparent";
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item.label }), item.shortcut && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: shortcutStyle,
						children: item.shortcut
					})]
				}, item.label))
			})]
		}, menu.label))
	});
}
//#endregion
//#region src/client/fs-api.ts
async function post(op, body) {
	const res = await fetch("/ide-api/fs/" + op, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(body)
	});
	if (!res.ok && res.status !== 403 && res.status !== 409) throw new Error("HTTP " + res.status);
	let json;
	try {
		json = await res.json();
	} catch {
		throw new Error("Invalid response from /ide-api/fs/" + op);
	}
	if (json.ok === true) return json.value;
	throw new Error(json.error);
}
/** List a directory (relative path, '' = root). */
async function readdir(root, relPath) {
	return post("readdir", {
		root,
		path: relPath
	});
}
/** Read a text file. */
async function readFile(root, relPath) {
	return post("read", {
		root,
		path: relPath
	});
}
/** Write (create or overwrite) a text file. */
async function writeFile(root, relPath, content) {
	await post("write", {
		root,
		path: relPath,
		content
	});
}
/** Create a new file (fails if it already exists). */
async function newFile(root, relPath) {
	await post("new-file", {
		root,
		path: relPath
	});
}
/** Build a file tree from the workspace root (one-level deep recursion for dirs). */
async function loadTree(root, relPath, depth) {
	if (depth <= 0) return [];
	const entries = await readdir(root, relPath);
	const nodes = [];
	for (const entry of entries.sort((a, b) => {
		if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
		return a.name.localeCompare(b.name);
	})) {
		if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
		const childPath = relPath ? relPath + "/" + entry.name : entry.name;
		if (entry.isDirectory) {
			const children = await loadTree(root, childPath, depth - 1);
			nodes.push({
				name: entry.name,
				path: childPath,
				type: "folder",
				children
			});
		} else nodes.push({
			name: entry.name,
			path: childPath,
			type: "file"
		});
	}
	return nodes;
}
//#endregion
//#region src/client/IdeApp.tsx
/**
* IDE App — the full IDE view rendered inside DSH's center column.
*
* This is a self-contained React tree with its own state management,
* Monaco Editor, terminal, file explorer, etc. It does NOT touch DSH's
* React tree at all.
*/
const MONACO_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs";
let monacoPromise = null;
function loadMonaco() {
	if (monacoPromise) return monacoPromise;
	monacoPromise = new Promise((resolve, reject) => {
		if (window.monaco) {
			resolve(window.monaco);
			return;
		}
		const script = document.createElement("script");
		script.src = `${MONACO_CDN}/loader.js`;
		script.onload = () => {
			const _require = window.require;
			_require.config({ paths: { vs: MONACO_CDN } });
			_require(["vs/editor/editor.main"], (m) => resolve(m));
		};
		script.onerror = () => reject(/* @__PURE__ */ new Error("Monaco CDN load failed"));
		document.head.appendChild(script);
	});
	return monacoPromise;
}
let themeRegistered = false;
function registerTheme(monaco) {
	if (themeRegistered) return;
	themeRegistered = true;
	monaco.editor.defineTheme("dsh-dark", {
		base: "vs-dark",
		inherit: true,
		rules: [
			{
				token: "comment",
				foreground: "6a9955",
				fontStyle: "italic"
			},
			{
				token: "keyword",
				foreground: "569cd6"
			},
			{
				token: "string",
				foreground: "ce9178"
			},
			{
				token: "number",
				foreground: "b5cea8"
			},
			{
				token: "type",
				foreground: "4ec9b0"
			},
			{
				token: "function",
				foreground: "dcdcaa"
			},
			{
				token: "variable",
				foreground: "9cdcfe"
			},
			{
				token: "delimiter.bracket",
				foreground: "ffd700"
			}
		],
		colors: {
			"editor.background": "#0f172a",
			"editor.foreground": "#f8fafc",
			"editor.lineHighlightBackground": "#1e293b40",
			"editor.selectionBackground": "#264f7899",
			"editorCursor.foreground": "#22c55e",
			"editorLineNumber.foreground": "#475569",
			"editorLineNumber.activeForeground": "#94a3b8",
			"editor.selectionHighlightBackground": "#22c55e20",
			"editorIndentGuide.background": "#1e293b",
			"editorIndentGuide.activeBackground": "#334155",
			"editorWidget.background": "#1b2336",
			"editorWidget.border": "#334155",
			"input.background": "#1e293b",
			"input.border": "#334155",
			"input.foreground": "#f8fafc",
			"list.hoverBackground": "#1e293b",
			"list.activeSelectionBackground": "#22c55e20",
			"scrollbar.shadow": "#00000000",
			"scrollbarSlider.background": "#33415580",
			"scrollbarSlider.hoverBackground": "#475569",
			"scrollbarSlider.activeBackground": "#64748b",
			"minimap.background": "#0f172a"
		}
	});
}
function detectLanguage(path) {
	return {
		ts: "typescript",
		tsx: "typescript",
		js: "javascript",
		jsx: "javascript",
		json: "json",
		md: "markdown",
		css: "css",
		scss: "scss",
		less: "less",
		html: "html",
		py: "python",
		rs: "rust",
		go: "go",
		java: "java",
		c: "c",
		cpp: "cpp",
		h: "c",
		cs: "csharp",
		rb: "ruby",
		php: "php",
		yml: "yaml",
		yaml: "yaml",
		xml: "xml",
		sh: "shell",
		bash: "shell",
		sql: "sql",
		toml: "toml",
		vue: "vue",
		svelte: "svelte"
	}[path.split(".").pop()?.toLowerCase() ?? ""] ?? "plaintext";
}
const DEMO_TREE = [
	{
		name: "src",
		path: "/workspace/src",
		type: "folder",
		children: [
			{
				name: "components",
				path: "/workspace/src/components",
				type: "folder",
				children: [{
					name: "Header.tsx",
					path: "/workspace/src/components/Header.tsx",
					type: "file"
				}, {
					name: "Footer.tsx",
					path: "/workspace/src/components/Footer.tsx",
					type: "file"
				}]
			},
			{
				name: "App.tsx",
				path: "/workspace/src/App.tsx",
				type: "file"
			},
			{
				name: "main.tsx",
				path: "/workspace/src/main.tsx",
				type: "file"
			},
			{
				name: "index.css",
				path: "/workspace/src/index.css",
				type: "file"
			}
		]
	},
	{
		name: "package.json",
		path: "/workspace/package.json",
		type: "file"
	},
	{
		name: "tsconfig.json",
		path: "/workspace/tsconfig.json",
		type: "file"
	},
	{
		name: "README.md",
		path: "/workspace/README.md",
		type: "file"
	}
];
const DEMO_CONTENTS = {
	"/workspace/src/App.tsx": `import React from 'react'\n\nexport function App() {\n  return (\n    <div>\n      <h1>Hello DSH IDE</h1>\n    </div>\n  )\n}`,
	"/workspace/src/main.tsx": `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport { App } from './App'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)`,
	"/workspace/src/components/Header.tsx": `export function Header() {\n  return <header>Header</header>\n}`,
	"/workspace/src/components/Footer.tsx": `export function Footer() {\n  return <footer>Footer</footer>\n}`,
	"/workspace/src/index.css": `body { margin: 0; font-family: sans-serif; }`,
	"/workspace/package.json": `{\n  "name": "my-app",\n  "version": "0.1.0"\n}`,
	"/workspace/tsconfig.json": `{\n  "compilerOptions": {\n    "target": "ES2020"\n  }\n}`,
	"/workspace/README.md": `# My App\n\nA DSH IDE demo project.`
};
const S = {
	root: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
		height: "100%",
		minWidth: 0,
		minHeight: 0,
		boxSizing: "border-box",
		background: "var(--dsw-alias-bg-base)",
		color: "var(--dsw-alias-label-primary)",
		fontFamily: "var(--dsw-font-family)",
		fontSize: "13px"
	},
	sidebar: {
		width: 260,
		background: "var(--dsw-alias-bg-layer-2)",
		borderRight: "1px solid var(--dsw-alias-border-l1)",
		display: "flex",
		flexDirection: "column",
		flexShrink: 0
	},
	sidebarHeader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "8px 12px",
		fontSize: "11px",
		fontWeight: 600,
		textTransform: "uppercase",
		letterSpacing: "0.5px",
		borderBottom: "1px solid var(--dsw-alias-border-l1)",
		color: "var(--dsw-alias-label-secondary)"
	},
	sidebarInput: {
		width: "100%",
		padding: "4px 8px",
		background: "var(--dsw-specific-input-major)",
		border: "1px solid var(--dsw-alias-border-l2)",
		borderRadius: "4px",
		color: "var(--dsw-alias-label-primary)",
		fontSize: "12px",
		outline: "none",
		boxSizing: "border-box"
	},
	main: {
		flex: 1,
		minWidth: 0,
		minHeight: 0,
		display: "flex",
		flexDirection: "column",
		overflow: "hidden"
	},
	tabBar: {
		display: "flex",
		alignItems: "center",
		height: "35px",
		background: "var(--dsw-alias-bg-layer-2)",
		borderBottom: "1px solid var(--dsw-alias-border-l1)",
		overflow: "hidden"
	},
	editor: {
		flex: 1,
		minWidth: 0,
		minHeight: 0,
		overflow: "hidden"
	},
	bottomBar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		height: "22px",
		background: "var(--dsw-alias-state-business-primary)",
		color: "var(--dsw-alias-label-primary-foreground)",
		fontSize: "12px",
		padding: "0 12px",
		flexShrink: 0
	},
	terminal: {
		background: "var(--dsw-alias-bg-base)",
		borderTop: "1px solid var(--dsw-alias-border-l1)"
	},
	resizeHandle: {
		height: "4px",
		cursor: "row-resize",
		background: "var(--dsw-alias-border-l2)",
		flexShrink: 0
	},
	cmdPalette: {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9999,
		display: "flex",
		justifyContent: "center",
		paddingTop: "80px"
	},
	cmdBackdrop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: "var(--dsw-alias-bg-mask-1)"
	},
	cmdPanel: {
		position: "relative",
		width: 560,
		maxHeight: 400,
		background: "var(--dsw-alias-bg-layer-2)",
		border: "1px solid var(--dsw-alias-border-l2)",
		borderRadius: 6,
		boxShadow: "var(--dsw-shadow-lv3)",
		display: "flex",
		flexDirection: "column",
		overflow: "hidden"
	}
};
let tabIdCounter = 0;
function IdeApp({ root }) {
	const [tabs, setTabs] = (0, react.useState)([]);
	const [activeTabId, setActiveTabId] = (0, react.useState)(null);
	const [expandedPaths, setExpandedPaths] = (0, react.useState)(/* @__PURE__ */ new Set(["/workspace", "/workspace/src"]));
	const [searchQuery, setSearchQuery] = (0, react.useState)("");
	const [cmdOpen, setCmdOpen] = (0, react.useState)(false);
	const [cmdQuery, setCmdQuery] = (0, react.useState)("");
	const [terminals, setTerminals] = (0, react.useState)([{
		id: "t1",
		name: "终端 1"
	}]);
	const [activeTermId, setActiveTermId] = (0, react.useState)("t1");
	const [termHeight, setTermHeight] = (0, react.useState)(180);
	const [termVisible, setTermVisible] = (0, react.useState)(true);
	const [cursorPos, setCursorPos] = (0, react.useState)({
		line: 1,
		column: 1
	});
	const [sidebarVisible, setSidebarVisible] = (0, react.useState)(true);
	const [realTree, setRealTree] = (0, react.useState)(null);
	const [newFileDialog, setNewFileDialog] = (0, react.useState)(false);
	const [newFileDir, setNewFileDir] = (0, react.useState)("");
	const [newFileName, setNewFileName] = (0, react.useState)("");
	const editorContainerRef = (0, react.useRef)(null);
	const editorRef = (0, react.useRef)(null);
	const termContainerRef = (0, react.useRef)(null);
	const termRef = (0, react.useRef)(null);
	const termFitRef = (0, react.useRef)(null);
	const tabsRef = (0, react.useRef)(tabs);
	tabsRef.current = tabs;
	const activeTab = tabs.find((t) => t.id === activeTabId);
	(0, react.useEffect)(() => {
		if (!root) return;
		let disposed = false;
		loadTree(root, "", 4).then((tree) => {
			if (!disposed && tree.length > 0) setRealTree(tree);
		}).catch(() => {});
		return () => {
			disposed = true;
		};
	}, [root]);
	const refreshTree = (0, react.useCallback)(() => {
		if (!root) return;
		loadTree(root, "", 4).then(setRealTree).catch(() => {});
	}, [root]);
	const openFile = (0, react.useCallback)(async (path) => {
		const existing = tabsRef.current.find((t) => t.path === path);
		if (existing) {
			setActiveTabId(existing.id);
			return;
		}
		const name = path.split("/").pop() ?? path;
		let content = DEMO_CONTENTS[path] ?? "";
		if (root) try {
			content = await readFile(root, path);
		} catch {
			content = DEMO_CONTENTS[path] ?? "// Cannot read file";
		}
		const tab = {
			id: "tab-" + ++tabIdCounter,
			path,
			name,
			language: detectLanguage(path),
			dirty: false,
			content
		};
		setTabs((prev) => [...prev, tab]);
		setActiveTabId(tab.id);
	}, [root]);
	const closeTab = (0, react.useCallback)((id) => {
		setTabs((prev) => {
			const next = prev.filter((t) => t.id !== id);
			if (activeTabId === id) setActiveTabId(next.length > 0 ? next[next.length - 1].id : null);
			return next;
		});
	}, [activeTabId]);
	const toggleFolder = (0, react.useCallback)((path) => {
		setExpandedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) next.delete(path);
			else next.add(path);
			return next;
		});
	}, []);
	const newFile$1 = (0, react.useCallback)(() => {
		if (root) {
			setNewFileDir("");
			setNewFileName("untitled.txt");
			setNewFileDialog(true);
		} else {
			const name = "untitled-" + ++tabIdCounter + ".txt";
			const tab = {
				id: "tab-" + ++tabIdCounter,
				path: "untitled:/" + name,
				name,
				language: "plaintext",
				dirty: false,
				content: ""
			};
			setTabs((prev) => [...prev, tab]);
			setActiveTabId(tab.id);
		}
	}, [root]);
	const handleCreateNewFile = (0, react.useCallback)(async () => {
		if (!root || !newFileName.trim()) return;
		const relPath = newFileDir ? newFileDir + "/" + newFileName.trim() : newFileName.trim();
		try {
			await newFile(root, relPath);
		} catch (err) {
			console.warn("[dsh-ide] new file failed:", err);
			return;
		}
		setNewFileDialog(false);
		refreshTree();
		await openFile(relPath);
	}, [
		root,
		newFileDir,
		newFileName,
		refreshTree
	]);
	const saveAll = (0, react.useCallback)(async () => {
		if (root) {
			for (const t of tabsRef.current) if (t.dirty && !t.path.startsWith("untitled:")) try {
				await writeFile(root, t.path, t.content);
			} catch {}
		}
		setTabs((prev) => prev.map((t) => ({
			...t,
			dirty: t.path.startsWith("untitled:") ? t.dirty : false
		})));
	}, [root]);
	const newTerminal = (0, react.useCallback)(() => {
		setTerminals((prev) => {
			const id = "t" + Date.now();
			setActiveTermId(id);
			return [...prev, {
				id,
				name: "终端 " + (prev.length + 1)
			}];
		});
	}, []);
	const clearTerminal = (0, react.useCallback)(() => {
		termRef.current?.clear();
	}, []);
	const editorAction = (0, react.useCallback)((actionId) => {
		const editor = editorRef.current;
		if (editor !== null && editor !== void 0) {
			editor.trigger("menu", actionId, null);
			editor.focus();
		}
	}, []);
	(0, react.useEffect)(() => {
		const handler = (e) => {
			const ctrl = e.ctrlKey || e.metaKey;
			if (ctrl && e.shiftKey && e.key === "P") {
				e.preventDefault();
				setCmdOpen((v) => !v);
			} else if (ctrl && e.key === "p") {
				e.preventDefault();
				setCmdOpen((v) => !v);
			} else if (ctrl && e.key === "`") {
				e.preventDefault();
				setTermVisible((v) => !v);
			} else if (ctrl && e.key === "w" && activeTabId) {
				e.preventDefault();
				closeTab(activeTabId);
			} else if (ctrl && e.key === "b") {
				e.preventDefault();
				setSidebarVisible((v) => !v);
			} else if (ctrl && e.key === "n") {
				e.preventDefault();
				newFile$1();
			} else if (ctrl && e.key === "s") {
				e.preventDefault();
				saveAll();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [
		activeTabId,
		closeTab,
		newFile$1,
		saveAll
	]);
	(0, react.useEffect)(() => {
		if (!termVisible || !termContainerRef.current) return;
		let disposed = false;
		const load = async () => {
			if (!window.Terminal) {
				await new Promise((resolve) => {
					const link = document.createElement("link");
					link.rel = "stylesheet";
					link.href = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css";
					link.onload = () => resolve();
					document.head.appendChild(link);
				});
				await new Promise((resolve) => {
					const s = document.createElement("script");
					s.src = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js";
					s.onload = () => resolve();
					document.head.appendChild(s);
				});
				await new Promise((resolve) => {
					const s = document.createElement("script");
					s.src = "https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js";
					s.onload = () => resolve();
					document.head.appendChild(s);
				});
			}
			if (disposed || !termContainerRef.current) return;
			const XTerm = window.Terminal;
			const FitAddon = window.FitAddon;
			const term = new XTerm({
				theme: {
					background: "#0f172a",
					foreground: "#f8fafc",
					cursor: "#22c55e",
					cursorAccent: "#0f172a",
					selectionBackground: "#264f7899",
					black: "#1e293b",
					red: "#ef4444",
					green: "#22c55e",
					yellow: "#f59e0b",
					blue: "#3b82f6",
					magenta: "#a855f7",
					cyan: "#06b6d4",
					white: "#f8fafc"
				},
				fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
				fontSize: 13,
				cursorBlink: true,
				cursorStyle: "bar",
				lineHeight: 1.4,
				letterSpacing: 0
			});
			const fit = new FitAddon();
			term.loadAddon(fit);
			term.open(termContainerRef.current);
			setTimeout(() => fit.fit(), 50);
			term.writeln("\x1B[1;36mDSH IDE Terminal\x1B[0m");
			term.write("\x1B[32m$\x1B[0m ");
			let buf = "";
			term.onData((data) => {
				if (data === "\r") {
					term.writeln("");
					term.write("\x1B[32m$\x1B[0m ");
					buf = "";
				} else if (data === "") {
					if (buf.length > 0) {
						buf = buf.slice(0, -1);
						term.write("\b \b");
					}
				} else if (data >= " ") {
					buf += data;
					term.write(data);
				}
			});
			termRef.current = term;
			termFitRef.current = fit;
		};
		load();
		return () => {
			disposed = true;
			termRef.current?.dispose();
			termRef.current = null;
		};
	}, [termVisible, activeTermId]);
	(0, react.useEffect)(() => {
		if (termVisible && termFitRef.current) setTimeout(() => termFitRef.current?.fit(), 50);
	}, [termVisible, termHeight]);
	(0, react.useEffect)(() => {
		const onResize = () => {
			requestAnimationFrame(() => {
				editorRef.current?.layout();
				if (termVisible && termFitRef.current) try {
					termFitRef.current.fit();
				} catch {}
			});
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [termVisible]);
	(0, react.useEffect)(() => {
		if (!editorContainerRef.current || !activeTab) {
			editorRef.current?.dispose();
			editorRef.current = null;
			return;
		}
		let disposed = false;
		loadMonaco().then((monaco) => {
			if (disposed || !editorContainerRef.current) return;
			registerTheme(monaco);
			const uri = monaco.Uri.parse(activeTab.path);
			let model = monaco.editor.getModel(uri);
			if (!model) model = monaco.editor.createModel(activeTab.content, activeTab.language, uri);
			else {
				model.setValue(activeTab.content);
				monaco.editor.setModelLanguage(model, activeTab.language);
			}
			const editor = monaco.editor.create(editorContainerRef.current, {
				model,
				theme: "dsh-dark",
				fontSize: 14,
				fontFamily: "'JetBrains Mono', Consolas, monospace",
				minimap: {
					enabled: true,
					scale: 1
				},
				scrollBeyondLastLine: false,
				automaticLayout: true,
				tabSize: 2,
				renderWhitespace: "selection",
				bracketPairColorization: { enabled: true },
				smoothScrolling: true,
				cursorBlinking: "smooth",
				cursorSmoothCaretAnimation: "on",
				padding: { top: 8 },
				folding: true
			});
			editorRef.current = editor;
			editor.onDidChangeCursorPosition((e) => setCursorPos({
				line: e.position.lineNumber,
				column: e.position.column
			}));
			editor.onDidChangeModelContent(() => {
				const val = editor.getValue();
				setTabs((prev) => prev.map((t) => t.id === activeTab.id ? {
					...t,
					content: val,
					dirty: true
				} : t));
			});
			editor.focus();
		});
		return () => {
			disposed = true;
			editorRef.current?.dispose();
			editorRef.current = null;
		};
	}, [activeTab?.id]);
	const startTermResize = (0, react.useCallback)((e) => {
		e.preventDefault();
		const startY = e.clientY, startH = termHeight;
		const onMove = (ev) => setTermHeight(Math.max(80, Math.min(600, startH - (ev.clientY - startY))));
		const onUp = () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseup", onUp);
		};
		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseup", onUp);
	}, [termHeight]);
	const renderTree = (nodes, depth) => {
		return [...nodes].sort((a, b) => {
			if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
			return a.name.localeCompare(b.name);
		}).map((node) => {
			const isFolder = node.type === "folder";
			const expanded = expandedPaths.has(node.path);
			const isActive = activeTab?.path === node.path;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react.default.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				onClick: () => isFolder ? toggleFolder(node.path) : openFile(node.path),
				style: {
					display: "flex",
					alignItems: "center",
					gap: 4,
					padding: "2px 8px",
					paddingLeft: depth * 16 + 8,
					cursor: "pointer",
					fontSize: 13,
					color: isActive ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-secondary)",
					background: isActive ? "var(--dsw-alias-state-business-primary)" : "transparent",
					height: 22,
					whiteSpace: "nowrap"
				},
				onMouseEnter: (e) => {
					if (!isActive) e.currentTarget.style.background = "var(--dsw-specific-sidebar-nav-item-hover)";
				},
				onMouseLeave: (e) => {
					if (!isActive) e.currentTarget.style.background = "transparent";
				},
				children: [
					isFolder && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							width: 16,
							fontSize: 10,
							color: "var(--dsw-alias-label-tertiary)"
						},
						children: expanded ? "▾" : "▸"
					}),
					!isFolder && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: { width: 16 } }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: isFolder ? null : getFileIcon(node.name) || null }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							overflow: "hidden",
							textOverflow: "ellipsis"
						},
						children: node.name
					})
				]
			}), isFolder && expanded && node.children && renderTree(node.children, depth + 1)] }, node.path);
		});
	};
	const filteredTree = searchQuery ? (realTree ?? DEMO_TREE).reduce((acc, n) => {
		const q = searchQuery.toLowerCase();
		if (n.type === "folder" && n.children) {
			const fc = filterTree(n.children, q);
			if (fc.length > 0 || n.name.toLowerCase().includes(q)) acc.push({
				...n,
				children: fc
			});
		} else if (n.name.toLowerCase().includes(q)) acc.push(n);
		return acc;
	}, []) : realTree ?? DEMO_TREE;
	const commands = [
		{
			label: "新建文件",
			shortcut: "Ctrl+N",
			action: newFile$1
		},
		{
			label: "切换终端",
			shortcut: "Ctrl+`",
			action: () => setTermVisible((v) => !v)
		},
		{
			label: "新建终端",
			action: newTerminal
		},
		{
			label: "保存文件",
			shortcut: "Ctrl+S",
			action: () => void saveAll()
		},
		{
			label: "关闭标签页",
			shortcut: "Ctrl+W",
			action: () => activeTabId && closeTab(activeTabId)
		}
	];
	const filteredCmds = cmdQuery ? commands.filter((c) => c.label.includes(cmdQuery)) : commands;
	const menus = [
		{
			label: "文件",
			items: [
				{
					label: "新建文件",
					shortcut: "Ctrl+N",
					action: newFile$1
				},
				{
					label: "保存",
					shortcut: "Ctrl+S",
					action: saveAll
				},
				{
					label: "全部保存",
					shortcut: "Ctrl+Shift+S",
					action: saveAll
				},
				{ separator: true },
				{
					label: "关闭标签页",
					shortcut: "Ctrl+W",
					action: () => {
						if (activeTabId) closeTab(activeTabId);
					},
					disabled: activeTabId === null
				}
			]
		},
		{
			label: "编辑",
			items: [
				{
					label: "撤销",
					shortcut: "Ctrl+Z",
					action: () => editorAction("undo")
				},
				{
					label: "重做",
					shortcut: "Ctrl+Shift+Z",
					action: () => editorAction("redo")
				},
				{ separator: true },
				{
					label: "剪切",
					shortcut: "Ctrl+X",
					action: () => editorAction("editor.action.clipboardCutAction")
				},
				{
					label: "复制",
					shortcut: "Ctrl+C",
					action: () => editorAction("editor.action.clipboardCopyAction")
				},
				{
					label: "粘贴",
					shortcut: "Ctrl+V",
					action: () => editorAction("editor.action.clipboardPasteAction")
				},
				{ separator: true },
				{
					label: "全选",
					shortcut: "Ctrl+A",
					action: () => editorAction("editor.action.selectAll")
				},
				{
					label: "查找",
					shortcut: "Ctrl+F",
					action: () => editorAction("actions.find")
				},
				{
					label: "替换",
					shortcut: "Ctrl+H",
					action: () => editorAction("editor.action.startFindReplaceAction")
				}
			]
		},
		{
			label: "视图",
			items: [
				{
					label: "命令面板",
					shortcut: "Ctrl+Shift+P",
					action: () => setCmdOpen((v) => !v)
				},
				{
					label: "快速打开",
					shortcut: "Ctrl+P",
					action: () => setCmdOpen((v) => !v)
				},
				{ separator: true },
				{
					label: "切换侧边栏",
					shortcut: "Ctrl+B",
					action: () => setSidebarVisible((v) => !v)
				},
				{
					label: "切换终端",
					shortcut: "Ctrl+`",
					action: () => setTermVisible((v) => !v)
				}
			]
		},
		{
			label: "终端",
			items: [
				{
					label: "新建终端",
					shortcut: "Ctrl+Shift+`",
					action: newTerminal
				},
				{
					label: "清空终端",
					action: clearTerminal
				},
				{ separator: true },
				{
					label: "切换终端面板",
					shortcut: "Ctrl+`",
					action: () => setTermVisible((v) => !v)
				}
			]
		},
		{
			label: "运行",
			items: [{
				label: "启动调试",
				disabled: true,
				action: () => {}
			}, {
				label: "运行代码",
				disabled: true,
				action: () => {}
			}]
		},
		{
			label: "帮助",
			items: [{
				label: "关于 DSH IDE",
				action: () => {
					termRef.current?.writeln("\x1B[1;36mDSH IDE Mode v0.1.0\x1B[0m");
				}
			}]
		}
	];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		style: S.root,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuBar, { menus }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					display: "flex",
					overflow: "hidden"
				},
				children: [sidebarVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: S.sidebar,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: S.sidebarHeader,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "资源管理器" })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								padding: "4px 8px",
								borderBottom: "1px solid var(--dsw-alias-border-l1)"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "搜索文件...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								style: S.sidebarInput,
								onFocus: (e) => e.currentTarget.style.borderColor = "var(--dsw-alias-state-business-primary)",
								onBlur: (e) => e.currentTarget.style.borderColor = "var(--dsw-alias-border-l2)"
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								flex: 1,
								overflow: "auto",
								padding: "4px 0"
							},
							children: renderTree(filteredTree, 0)
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: S.main,
					children: [
						tabs.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: S.tabBar,
							children: tabs.map((tab) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								onClick: () => setActiveTabId(tab.id),
								style: {
									display: "flex",
									alignItems: "center",
									gap: 6,
									padding: "0 12px",
									height: "100%",
									cursor: "pointer",
									background: tab.id === activeTabId ? "var(--dsw-alias-bg-base)" : "transparent",
									color: tab.id === activeTabId ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-tertiary)",
									borderBottom: tab.id === activeTabId ? "2px solid var(--dsw-alias-state-business-primary)" : "2px solid transparent",
									fontSize: 13,
									whiteSpace: "nowrap"
								},
								children: [
									getFileIcon(tab.name) || null,
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: tab.name }),
									tab.dirty && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: { fontSize: 10 },
										children: "●"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										onClick: (e) => {
											e.stopPropagation();
											closeTab(tab.id);
										},
										style: {
											background: "none",
											border: "none",
											color: "var(--dsw-alias-label-tertiary)",
											cursor: "pointer",
											fontSize: 14,
											padding: 0,
											marginLeft: 4
										},
										children: "×"
									})
								]
							}, tab.id))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							ref: editorContainerRef,
							style: S.editor
						}),
						!activeTab && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								color: "var(--dsw-alias-label-tertiary)",
								gap: 16
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
									width: "64",
									height: "64",
									viewBox: "0 0 64 64",
									fill: "none",
									xmlns: "http://www.w3.org/2000/svg",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
										x: "8",
										y: "8",
										width: "48",
										height: "48",
										rx: "8",
										stroke: "var(--dsw-alias-label-tertiary)",
										strokeWidth: "2"
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M24 22L14 32l10 10M40 22l10 10-10 10",
										stroke: "var(--dsw-alias-state-business-primary)",
										strokeWidth: "2.5",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 16,
										fontWeight: 500
									},
									children: "DSH IDE Mode"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 12,
										color: "var(--dsw-alias-label-tertiary)"
									},
									children: "点击左侧文件打开 · Ctrl+P 快速搜索 · Ctrl+Shift+P 命令面板"
								})
							]
						}),
						termVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							onMouseDown: startTermResize,
							style: S.resizeHandle,
							onMouseEnter: (e) => e.currentTarget.style.background = "var(--dsw-alias-state-business-primary)",
							onMouseLeave: (e) => e.currentTarget.style.background = "var(--dsw-alias-border-l2)"
						}),
						termVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								height: termHeight,
								...S.terminal,
								display: "flex",
								flexDirection: "column"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									alignItems: "center",
									height: 28,
									background: "var(--dsw-alias-bg-layer-2)",
									borderBottom: "1px solid var(--dsw-alias-border-l1)",
									padding: "0 4px",
									gap: 2
								},
								children: [terminals.map((t) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									onClick: () => setActiveTermId(t.id),
									style: {
										display: "flex",
										alignItems: "center",
										gap: 6,
										padding: "2px 10px",
										fontSize: 12,
										cursor: "pointer",
										color: t.id === activeTermId ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-tertiary)",
										borderLeft: t.id === activeTermId ? "2px solid var(--dsw-alias-state-business-primary)" : "2px solid transparent"
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										onClick: (e) => {
											e.stopPropagation();
											setTerminals((p) => p.filter((x) => x.id !== t.id));
										},
										style: {
											fontSize: 14,
											cursor: "pointer"
										},
										children: "×"
									})]
								}, t.id)), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									onClick: () => {
										const id = `t${Date.now()}`;
										setTerminals((p) => [...p, {
											id,
											name: `终端 ${p.length + 1}`
										}]);
										setActiveTermId(id);
									},
									style: {
										marginLeft: 4,
										background: "none",
										border: "none",
										color: "var(--dsw-alias-label-tertiary)",
										cursor: "pointer",
										fontSize: 16
									},
									children: "+"
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								ref: termContainerRef,
								style: {
									flex: 1,
									overflow: "hidden"
								}
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: S.bottomBar,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 16,
						alignItems: "center"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "main" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "0 错误" })]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 16,
						alignItems: "center"
					},
					children: [
						activeTab && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: activeTab.language }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "UTF-8" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "LF" }),
						activeTab && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
							"行 ",
							cursorPos.line,
							", 列 ",
							cursorPos.column
						] })
					]
				})]
			}),
			cmdOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: S.cmdPalette,
				onClick: () => setCmdOpen(false),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: S.cmdBackdrop }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: S.cmdPanel,
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							padding: "8px 12px",
							borderBottom: "1px solid var(--dsw-alias-border-l1)"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							autoFocus: true,
							type: "text",
							value: cmdQuery,
							onChange: (e) => setCmdQuery(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Escape") setCmdOpen(false);
								if (e.key === "Enter" && filteredCmds[0]) {
									filteredCmds[0].action();
									setCmdOpen(false);
								}
							},
							placeholder: "输入命令...",
							style: {
								...S.sidebarInput,
								fontSize: 14
							}
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							flex: 1,
							overflow: "auto",
							padding: "4px 0"
						},
						children: filteredCmds.map((cmd, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							onClick: () => {
								cmd.action();
								setCmdOpen(false);
							},
							style: {
								display: "flex",
								justifyContent: "space-between",
								padding: "6px 12px",
								cursor: "pointer",
								background: i === 0 ? "var(--dsw-alias-state-business-primary)" : "transparent"
							},
							onMouseEnter: (e) => e.currentTarget.style.background = "var(--dsw-alias-state-business-primary)",
							onMouseLeave: (e) => e.currentTarget.style.background = i === 0 ? "var(--dsw-alias-state-business-primary)" : "transparent",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: cmd.label }), cmd.shortcut && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									color: "var(--dsw-alias-label-tertiary)",
									fontSize: 12
								},
								children: cmd.shortcut
							})]
						}, cmd.label))
					})]
				})]
			}),
			newFileDialog && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 9999,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "var(--dsw-alias-bg-mask-1)"
				},
				onClick: () => setNewFileDialog(false),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						background: "var(--dsw-alias-bg-layer-2)",
						border: "1px solid var(--dsw-alias-border-l2)",
						borderRadius: 8,
						padding: 20,
						width: 400,
						color: "var(--dsw-alias-label-primary)",
						fontFamily: "var(--dsw-font-family)"
					},
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 14,
								fontWeight: 700,
								marginBottom: 16
							},
							children: "新建文件"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 12 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: {
									display: "block",
									fontSize: 12,
									color: "var(--dsw-alias-label-secondary)",
									marginBottom: 4
								},
								children: "目录（相对于项目根）"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								value: newFileDir,
								onChange: (e) => setNewFileDir(e.target.value),
								placeholder: "留空表示项目根目录",
								style: {
									width: "100%",
									padding: "6px 10px",
									background: "var(--dsw-specific-input-major)",
									border: "1px solid var(--dsw-alias-border-l2)",
									borderRadius: 4,
									color: "var(--dsw-alias-label-primary)",
									fontSize: 13,
									outline: "none",
									boxSizing: "border-box"
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: { marginBottom: 16 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								style: {
									display: "block",
									fontSize: 12,
									color: "var(--dsw-alias-label-secondary)",
									marginBottom: 4
								},
								children: "文件名"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								value: newFileName,
								onChange: (e) => setNewFileName(e.target.value),
								placeholder: "example.ts",
								autoFocus: true,
								style: {
									width: "100%",
									padding: "6px 10px",
									background: "var(--dsw-specific-input-major)",
									border: "1px solid var(--dsw-alias-border-l2)",
									borderRadius: 4,
									color: "var(--dsw-alias-label-primary)",
									fontSize: 13,
									outline: "none",
									boxSizing: "border-box"
								},
								onKeyDown: (e) => {
									if (e.key === "Enter") handleCreateNewFile();
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								justifyContent: "flex-end",
								gap: 8
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => setNewFileDialog(false),
								style: {
									padding: "6px 16px",
									background: "transparent",
									border: "1px solid var(--dsw-alias-border-l2)",
									borderRadius: 6,
									color: "var(--dsw-alias-label-primary)",
									cursor: "pointer",
									fontSize: 13
								},
								children: "取消"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => void handleCreateNewFile(),
								disabled: !newFileName.trim(),
								style: {
									padding: "6px 16px",
									background: newFileName.trim() ? "var(--dsw-alias-state-business-primary)" : "var(--dsw-alias-interactive-bg-hover)",
									border: "none",
									borderRadius: 6,
									color: "var(--dsw-alias-label-primary)",
									cursor: newFileName.trim() ? "pointer" : "default",
									fontSize: 13
								},
								children: "创建"
							})]
						})
					]
				})
			})
		]
	});
}
function filterTree(nodes, query) {
	const result = [];
	for (const n of nodes) if (n.type === "folder" && n.children) {
		const fc = filterTree(n.children, query);
		if (fc.length > 0 || n.name.toLowerCase().includes(query)) result.push({
			...n,
			children: fc
		});
	} else if (n.name.toLowerCase().includes(query)) result.push(n);
	return result;
}
const EXT_COLORS = {
	ts: "#3178c6",
	tsx: "#3178c6",
	js: "#f7df1e",
	jsx: "#f7df1e",
	json: "#e44d26",
	md: "#519aba",
	css: "#563d7c",
	scss: "#cf649a",
	html: "#e44d26",
	py: "#3572a5",
	rs: "#dea584",
	go: "#00add8",
	java: "#b07219",
	yml: "#cb171e",
	yaml: "#cb171e",
	toml: "#9c4221",
	sh: "#89e051",
	lock: "#6e7681",
	vue: "#41b883",
	svelte: "#ff3e00"
};
const EXT_LABELS = {
	ts: "TS",
	tsx: "TX",
	js: "JS",
	jsx: "JX",
	json: "{}",
	md: "MD",
	css: "CS",
	scss: "SC",
	html: "HT",
	py: "PY",
	rs: "RS",
	go: "GO",
	java: "JV",
	yml: "YM",
	yaml: "YM",
	toml: "TL",
	sh: "SH",
	lock: "LK",
	vue: "VU",
	svelte: "SV"
};
function getFileIcon(name) {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	const color = EXT_COLORS[ext];
	const label = EXT_LABELS[ext];
	if (!color || !label) return null;
	return react.default.createElement("span", { style: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: 16,
		height: 16,
		fontSize: 9,
		fontWeight: 700,
		color,
		opacity: .85,
		flexShrink: 0,
		fontFamily: "var(--dsw-font-family)",
		letterSpacing: "-0.5px"
	} }, label);
}
//#endregion
//#region src/client/mount.tsx
/**
* IDE mode mounting.
*
* Injects a sidebar entry ("IDE") and mounts a full IDE React tree into the
* DSH center column. Uses the same DOM-injection + data-attribute toggle
* pattern as dsh-task-board / dsh-ssh, and (like them) a body-level
* MutationObserver self-heals until the center column actually exists — the
* dsh AppFrame mounts only after boot settlement, so a single eager query at
* apply time is not enough.
*
* The IDE view is a standalone React tree (createRoot) that never touches DSH's
* React reconciliation. Visibility is toggled via `data-dsh-ide-active` on
* <html>, with CSS rules hiding the conversation content when active.
*/
const SIDEBAR_ROOT_SELECTOR = "[data-pane=\"sidebar\"], [class*=\"sidebarCol\"]";
const CENTER_SELECTOR = "[data-pane=\"conversation\"], [class*=\"centerCol\"]";
const ENTRY_SELECTOR = "[data-dsh-ide-entry]";
const ACTIVE_ATTR = "data-dsh-ide-active";
const ACTIVATE_EVENT = "dsh-panel-activate";
const PANEL_NAME = "ide";
const OTHER_PANEL_ATTRS = ["data-dsh-taskboard-active", "data-dsh-ssh-active"];
const ICON_SVG = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3L1.5 8l3.5 5M11 3l3.5 5-3.5 5"/></svg>`;
const ENTRY_STYLES = `
/* --- sidebar entry row (matches the shell's nav-item look) --- */
[data-dsh-ide-entry] {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 32px;
  padding: 0 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--dsw-font-family);
  white-space: nowrap;
}
[data-dsh-ide-entry]:hover {
  background: var(--dsw-specific-sidebar-nav-item-hover);
  color: var(--dsw-alias-label-primary);
}
[data-dsh-ide-entry][data-active] {
  background: var(--dsw-specific-sidebar-nav-item-active);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
[data-dsh-ide-entry][data-active]:hover {
  background: var(--dsw-specific-sidebar-nav-item-active);
}
[data-dsh-ide-entry]:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}
[data-dsh-ide-entry]:active {
  transform: translateY(1px);
}
[data-ide-entry-icon] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
[data-ide-entry-label] {
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Collapsed rail: icon-only, centered, matching the shell's rail. */
[data-dsh-frame][data-sidebar-collapsed] [data-dsh-ide-entry] {
  justify-content: center;
  padding: 0;
  width: 100%;
}
[data-dsh-frame][data-sidebar-collapsed] [data-ide-entry-label] {
  display: none;
}

/* --- center-column takeover (single-occupant, like task-board / ssh) --- */
[data-pane='conversation'],
[class*='centerCol'] {
  position: relative;
}
[data-dsh-ide-view] {
  position: absolute;
  inset: 0;
  display: none;
  z-index: 60;
  /* Opaque backdrop: the conversation subtree stays mounted under the view,
     so sticky code-block banners cannot show through. */
  background: var(--dsw-alias-bg-base);
}
html[data-dsh-ide-active]:not([data-dsh-taskboard-active]):not([data-dsh-ssh-active]) [data-dsh-ide-view] {
  display: flex;
}
/* While the IDE is active, the conversation content underneath is hidden
   (it stays mounted and stateful). !important is required: the dsh shell
   wraps the conversation view in a node with an inline display:contents,
   and inline styles beat a plain stylesheet rule. */
html[data-dsh-ide-active]:not([data-dsh-taskboard-active]):not([data-dsh-ssh-active]) [data-pane='conversation'] > :not([data-dsh-ide-view]),
html[data-dsh-ide-active]:not([data-dsh-taskboard-active]):not([data-dsh-ssh-active]) [class*='centerCol'] > :not([data-dsh-ide-view]) {
  display: none !important;
}
`;
function sidebarRoot() {
	const column = document.querySelector(SIDEBAR_ROOT_SELECTOR);
	if (column === null) return void 0;
	return column.querySelector("[class*=\"logoRow\"]")?.parentElement ?? column.firstElementChild;
}
function newSessionButton(root) {
	const nested = root.querySelector("button[class*=\"newSession\"]");
	if (nested !== null) return nested;
	for (const child of root.children) if (child.tagName === "BUTTON") return child;
}
function createEntry() {
	const entry = document.createElement("button");
	entry.type = "button";
	entry.dataset.dshIdeEntry = "";
	entry.setAttribute("aria-label", "IDE");
	entry.setAttribute("title", "IDE");
	entry.innerHTML = `<span data-ide-entry-icon>${ICON_SVG}</span><span data-ide-entry-label>IDE</span>`;
	entry.addEventListener("click", () => {
		const html = document.documentElement;
		if (html.hasAttribute(ACTIVE_ATTR)) html.removeAttribute(ACTIVE_ATTR);
		else {
			for (const attr of OTHER_PANEL_ATTRS) html.removeAttribute(attr);
			html.setAttribute(ACTIVE_ATTR, "");
		}
		document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: PANEL_NAME }));
	});
	return entry;
}
function placeEntry(root, entry) {
	const button = newSessionButton(root);
	if (button === void 0) return false;
	if (entry.parentElement !== root) {
		const row = button.closest("[class*=\"logoRow\"]");
		const base = row !== null && row.parentElement === root ? row : button;
		const family = Array.from(root.children).filter((el) => el instanceof HTMLElement && el.matches("[data-dsh-ide-entry], [data-dsh-taskboard-entry], [data-dsh-ssh-entry]"));
		const anchor = family.length > 0 ? family[family.length - 1].nextElementSibling : base.nextElementSibling;
		root.insertBefore(entry, anchor ?? null);
	}
	return true;
}
let ideRoot;
let ideContainer;
let ideStyle;
/**
* Inject the plugin stylesheet once (entry + center-column takeover rules).
*/
function ensureStyles() {
	if (ideStyle !== void 0) return;
	ideStyle = document.createElement("style");
	ideStyle.dataset.dshIdeStyle = "";
	ideStyle.textContent = ENTRY_STYLES;
	document.head.appendChild(ideStyle);
}
/**
* Lazily create the IDE container and mount the React tree. Idempotent and
* retried by a body-level MutationObserver until the center column exists
* (the dsh AppFrame mounts only after boot settlement).
*/
/** Cached workspace root passed to the IdeApp. */
let workspaceRoot = "";
function ensureIdeView() {
	if (ideContainer !== void 0) return;
	const column = document.querySelector(CENTER_SELECTOR);
	if (column === null) return;
	ideContainer = document.createElement("div");
	ideContainer.dataset.dshIdeView = "";
	column.appendChild(ideContainer);
	ideRoot = (0, react_dom_client.createRoot)(ideContainer);
	ideRoot.render(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IdeApp, { root: workspaceRoot }));
}
/**
* Mount the IDE mode plugin.
* Returns a disposer that removes everything.
*/
function mountIdeMode(_ctx, root) {
	if (root !== void 0 && root !== "") workspaceRoot = root;
	if (document.querySelector(ENTRY_SELECTOR) !== null) {
		if (root !== void 0 && root !== "" && ideRoot !== void 0) ideRoot.render(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IdeApp, { root: workspaceRoot }));
		return () => {};
	}
	ensureStyles();
	const entry = createEntry();
	let rootEl;
	let placed = false;
	const tryPlace = () => {
		if (rootEl !== void 0 && !rootEl.isConnected) {
			rootObserver.disconnect();
			rootEl = void 0;
			placed = false;
		}
		if (placed && document.body.contains(entry)) return;
		rootEl ??= sidebarRoot();
		if (rootEl === void 0) return;
		placed = placeEntry(rootEl, entry);
		if (placed) rootObserver.observe(rootEl, {
			childList: true,
			subtree: true
		});
	};
	const waitObserver = new MutationObserver(() => tryPlace());
	waitObserver.observe(document.body, {
		childList: true,
		subtree: true
	});
	const rootObserver = new MutationObserver(() => {
		if (rootEl === void 0 || !rootEl.isConnected) {
			placed = false;
			tryPlace();
			return;
		}
		if (!rootEl.contains(entry)) placed = placeEntry(rootEl, entry);
	});
	const viewObserver = new MutationObserver(() => ensureIdeView());
	viewObserver.observe(document.body, {
		childList: true,
		subtree: true
	});
	ensureIdeView();
	const skinObserver = new MutationObserver(() => {
		if (ideRoot !== void 0) ideRoot.render(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IdeApp, { root: workspaceRoot }));
	});
	skinObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: [
			"class",
			"data-skin",
			"data-theme"
		]
	});
	const onOtherActivate = (event) => {
		if (event.detail !== PANEL_NAME) document.documentElement.removeAttribute(ACTIVE_ATTR);
	};
	document.addEventListener(ACTIVATE_EVENT, onOtherActivate);
	const syncActive = () => {
		if (document.documentElement.hasAttribute(ACTIVE_ATTR)) entry.dataset.active = "true";
		else delete entry.dataset.active;
	};
	const activeObserver = new MutationObserver(syncActive);
	activeObserver.observe(document.documentElement, {
		attributes: true,
		attributeFilter: [ACTIVE_ATTR]
	});
	const SESSION_ROW_SELECTOR = "[class*=\"sessionRow\"], [class*=\"projectRow\"], [class*=\"searchResultRow\"], [class*=\"searchResultWorkspace\"], [class*=\"newSession\"]";
	const onClickSession = (event) => {
		if (!document.documentElement.hasAttribute(ACTIVE_ATTR)) return;
		if (event.target?.closest(SESSION_ROW_SELECTOR) !== null) document.documentElement.removeAttribute(ACTIVE_ATTR);
	};
	document.addEventListener("click", onClickSession, true);
	tryPlace();
	syncActive();
	return () => {
		waitObserver.disconnect();
		rootObserver.disconnect();
		viewObserver.disconnect();
		skinObserver.disconnect();
		activeObserver.disconnect();
		document.removeEventListener(ACTIVATE_EVENT, onOtherActivate);
		document.removeEventListener("click", onClickSession, true);
		document.documentElement.removeAttribute(ACTIVE_ATTR);
		entry.remove();
		ideRoot?.unmount();
		ideRoot = void 0;
		ideContainer?.remove();
		ideContainer = void 0;
		ideStyle?.remove();
		ideStyle = void 0;
	};
}
//#endregion
//#region src/client/settings-card.tsx
/**
* IDE mode settings card — the plugin's "插件设置" entry in the DSH settings
* surface, registered into the web-ui plugin-item list (the same seat as
* dsh-task-board / dsh-ssh).
*
* Direct-write over the ide-mode settings namespace: toggling a field calls
* scope.set/unset immediately (no staged form). Colors ride the --dsw-* design
* tokens so the card follows the active theme.
*/
const CARD = {
	display: "flex",
	flexDirection: "column",
	gap: 10,
	padding: "14px 16px",
	background: "var(--dsw-alias-bg-layer-2)",
	border: "1px solid var(--dsw-alias-border-l1)",
	borderRadius: 12,
	color: "var(--dsw-alias-label-primary)",
	fontFamily: "var(--dsw-font-family)",
	fontSize: 13,
	listStyle: "none"
};
const NAME = {
	fontSize: 14,
	fontWeight: 700
};
const DESC = {
	fontSize: 12,
	color: "var(--dsw-alias-label-secondary)"
};
const NOTE = {
	margin: 0,
	padding: "8px 10px",
	fontSize: 12,
	color: "var(--dsw-alias-label-tertiary)",
	background: "var(--dsw-alias-interactive-bg-hover)",
	borderRadius: 8
};
const BODY = {
	display: "flex",
	flexDirection: "column",
	gap: 12
};
const FIELD = {
	display: "flex",
	flexDirection: "column",
	gap: 5
};
const FIELD_HEAD = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 8
};
const LABEL = {
	fontSize: 13,
	fontWeight: 600,
	color: "var(--dsw-alias-label-secondary)"
};
const BADGE = {
	fontSize: 11,
	padding: "1px 8px",
	borderRadius: 999,
	border: "1px solid var(--dsw-alias-border-l2)",
	color: "var(--dsw-alias-label-secondary)"
};
const RESET = {
	background: "none",
	border: "none",
	cursor: "pointer",
	fontSize: 12,
	color: "var(--dsw-alias-state-business-primary)",
	padding: 0
};
const SELECT = {
	padding: "6px 10px",
	fontSize: 13,
	color: "var(--dsw-alias-label-primary)",
	background: "var(--dsw-specific-input-major)",
	border: "1px solid var(--dsw-alias-border-l2)",
	borderRadius: 8,
	outline: "none",
	fontFamily: "inherit",
	maxWidth: "100%"
};
const HINT = {
	margin: 0,
	fontSize: 12,
	color: "var(--dsw-alias-label-tertiary)"
};
function BoolField(props) {
	const draft = props.overridden ? String(props.value) : "";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		style: FIELD,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: FIELD_HEAD,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					htmlFor: props.id,
					style: LABEL,
					children: props.label
				}), props.overridden && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					style: {
						display: "inline-flex",
						alignItems: "center",
						gap: 8
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: BADGE,
						children: "已覆盖"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						style: RESET,
						disabled: props.disabled,
						onClick: props.onReset,
						children: "重置"
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
				id: props.id,
				style: SELECT,
				value: draft,
				disabled: props.disabled,
				onChange: (e) => {
					props.onChange(e.target.value);
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
						value: "",
						children: "继承"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
						value: "true",
						children: "开"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
						value: "false",
						children: "关"
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				style: HINT,
				children: props.hint
			})
		]
	});
}
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
function IdeSettingsCard({ scope }) {
	const snapshot = (0, react.useSyncExternalStore)((cb) => scope.subscribe(cb), () => scope.getSnapshot());
	const ready = snapshot.status === "ready";
	const writable = snapshot.writable;
	const value = snapshot.value ?? {};
	const user = snapshot.user ?? {};
	const scopeAny = scope;
	const write = (field, text) => {
		if (text === "") scopeAny.unset(field).catch(() => {});
		else if (text === "true") scopeAny.set(field, true).catch(() => {});
		else if (text === "false") scopeAny.set(field, false).catch(() => {});
	};
	const reset = (field) => {
		scopeAny.unset(field).catch(() => {});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
		style: CARD,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: NAME,
				children: "IDE 模式"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: DESC,
				children: "DSH IDE 模式插件的启用与配置。"
			})] }),
			!ready && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				style: NOTE,
				children: "设置命名空间未开放，当前配置不可编辑。"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: BODY,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoolField, {
					id: "ide-mode-enabled",
					label: "启用 IDE 模式",
					hint: "开启后，侧边栏出现「IDE」入口，点击可切换到类 VS Code 编程界面。",
					value: value.enabled ?? true,
					overridden: hasOwn(user, "enabled"),
					disabled: !ready || !writable,
					onChange: (t) => write("enabled", t),
					onReset: () => reset("enabled")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BoolField, {
					id: "ide-mode-announce",
					label: "向 Agent 宣告 IDE 能力",
					hint: "开启后，每个 Agent 的系统提示会包含 IDE 模式的能力说明，以便与 IDE 功能协作。",
					value: value.announceToAgent ?? true,
					overridden: hasOwn(user, "announceToAgent"),
					disabled: !ready || !writable,
					onChange: (t) => write("announceToAgent", t),
					onReset: () => reset("announceToAgent")
				})]
			})
		]
	});
}
//#endregion
//#region src/client/index.ts
/** Settings namespace the card edits (the Host plugin registers it). */
const NS = "ide-mode";
/** Required services. */
const inject = [
	"slots",
	"settingsScope",
	"locale",
	"sessions"
];
/** Apply the browser half. */
function apply(ctx) {
	let scope;
	try {
		scope = ctx.settingsScope.bind({ namespace: NS });
	} catch (error) {
		console.warn("[dsh-ide-mode] settings scope unavailable:", error);
	}
	const resolveRoot = () => {
		try {
			const snapshot = ctx.sessions.list.getSnapshot();
			const sessionId = snapshot.current;
			if (sessionId === void 0) return "";
			const cwd = snapshot?.byId?.[sessionId]?.cwd;
			return typeof cwd === "string" && cwd !== "" ? cwd : "";
		} catch {
			return "";
		}
	};
	let uiDisposer;
	const mountUi = () => {
		if (uiDisposer !== void 0) return;
		uiDisposer = mountIdeMode(ctx, resolveRoot());
	};
	const syncEnabled = () => {
		if (scope === void 0) {
			mountUi();
			return;
		}
		const snapshot = scope.getSnapshot();
		if (snapshot.status === "ready" ? snapshot.value?.enabled ?? true : snapshot.status === "unavailable") mountUi();
		else {
			uiDisposer?.();
			uiDisposer = void 0;
		}
	};
	if (scope !== void 0) scope.subscribe(syncEnabled);
	syncEnabled();
	const ctxAny = ctx;
	ctxAny.effect(() => () => {
		uiDisposer?.();
		uiDisposer = void 0;
	}, "dsh-ide-mode: teardown");
	if (scope !== void 0) try {
		ctxAny.slots.inject("web-ui.plugin.item", () => {
			const unregister = ctxAny.slots.register({
				name: "web-ui.plugin.item",
				id: "ide-mode",
				order: 200,
				inject: () => ({ scope })
			}, IdeSettingsCard);
			return () => {
				unregister();
			};
		});
	} catch (error) {
		console.warn("[dsh-ide-mode] settings card registration failed:", error);
	}
}
//#endregion
exports.apply = apply;
exports.inject = inject;

		return module.exports;
	}
});