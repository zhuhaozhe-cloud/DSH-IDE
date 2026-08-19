# DSH-IDE 快速启动指南

## 🚀 5 分钟快速开始

### 1. 克隆项目
```bash
git clone https://github.com/username/DSH-IDE.git
cd DSH-IDE
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问 IDE
打开浏览器访问：http://localhost:3000

## 📦 项目结构概览

```
DSH-IDE/
├── src/                    # 前端源码
│   ├── components/         # React 组件
│   ├── stores/            # 状态管理
│   └── utils/             # 工具函数
├── packages/              # 插件包
│   └── dsh-ide-mode/      # DSH IDE 插件
├── dist/                  # 构建输出
└── package.json           # 项目配置
```

## 🎯 核心功能体验

### 1. 代码编辑
- 打开任意文件开始编辑
- 使用 Ctrl+P 快速打开文件
- 使用 Ctrl+Shift+P 打开命令面板

### 2. 文件管理
- 左侧文件树浏览文件
- 右键菜单进行文件操作
- 拖拽文件进行移动

### 3. 终端操作
- 使用 Ctrl+` 打开终端
- 执行命令行操作
- 多终端标签切换

### 4. 编辑器功能
- Ctrl+S 保存文件
- Ctrl+Z 撤销操作
- Ctrl+F 查找替换

## 🛠️ 开发指南

### 添加新组件
1. 在 `src/components/` 下创建组件文件
2. 使用 TypeScript 和 React Hooks
3. 遵循项目命名规范

### 修改样式
1. 使用 Tailwind CSS 类名
2. 遵循设计规范
3. 保持响应式设计

### 添加快捷键
1. 在 `src/keybindings/` 中配置
2. 避免与系统快捷键冲突
3. 提供用户自定义选项

## 🔧 构建和部署

### 开发构建
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 插件构建
```bash
cd packages/dsh-ide-mode
npm run build
```

## 📚 学习资源

### 官方文档
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [xterm.js 文档](https://xtermjs.org/)

### 项目文档
- [README.md](README.md) - 项目介绍
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [PLAN.md](PLAN.md) - 项目计划

## 🤝 参与贡献

### 报告问题
1. 使用 GitHub Issues
2. 选择合适模板
3. 提供详细描述

### 提交代码
1. Fork 项目
2. 创建功能分支
3. 提交 Pull Request

### 社区互动
1. 参与讨论
2. 分享经验
3. 帮助他人

## 🎉 下一步

1. **探索功能**：尝试所有 IDE 功能
2. **阅读源码**：了解实现原理
3. **参与贡献**：提交你的第一个 PR
4. **分享项目**：告诉朋友和同事

## 💡 常见问题

### Q: 如何自定义主题？
A: 修改 `src/themes/` 下的主题文件

### Q: 如何添加新的语言支持？
A: Monaco Editor 支持多种语言，查看官方文档

### Q: 如何优化性能？
A: 使用 React.memo、useMemo 等优化手段

### Q: 如何调试插件？
A: 使用浏览器开发者工具和 console.log

## 📞 获取帮助

- **GitHub Issues**：报告问题和功能请求
- **GitHub Discussions**：社区讨论和问答
- **文档**：查看项目文档
- **社区**：参与技术社区

---

**开始你的 DSH-IDE 之旅吧！** 🚀
