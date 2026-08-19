# DSH-IDE 插件快速安装指南

## ⚡ 5 分钟快速安装

### 方法一：npm 全局安装（推荐）

```bash
# 1. 安装插件
npm install -g dsh-ide-mode

# 2. 启动 DSH IDE
dsh ide

# 3. 访问界面
# 浏览器会自动打开 http://localhost:3000/ide
```

### 方法二：本地项目安装

```bash
# 1. 进入项目目录
cd your-project

# 2. 安装插件
npm install dsh-ide-mode

# 3. 启动 DSH
dsh start --plugin dsh-ide-mode
```

### 方法三：从源码安装

```bash
# 1. 克隆仓库
git clone https://github.com/username/DSH-IDE.git
cd DSH-IDE

# 2. 安装依赖
npm install

# 3. 构建插件
cd packages/dsh-ide-mode
npm run build

# 4. 链接到全局
npm link

# 5. 启动
dsh ide
```

## 🎯 基本使用

### 快捷键
| 功能 | 快捷键 |
|------|--------|
| 命令面板 | Ctrl+Shift+P |
| 快速打开 | Ctrl+P |
| 保存文件 | Ctrl+S |
| 新建文件 | Ctrl+N |
| 关闭标签 | Ctrl+W |
| 切换终端 | Ctrl+` |

### 核心功能
- ✅ **多标签页编辑器**：同时编辑多个文件
- ✅ **文件资源管理器**：浏览项目文件
- ✅ **集成终端**：运行命令行
- ✅ **命令面板**：快速执行命令
- ✅ **语法高亮**：支持多种编程语言
- ✅ **自动补全**：智能代码补全

## ⚙️ 基础配置

创建配置文件 `~/.dsh/config.json`：

```json
{
  "plugins": {
    "dsh-ide-mode": {
      "enabled": true,
      "config": {
        "theme": "dark",
        "fontSize": 14,
        "tabSize": 2
      }
    }
  }
}
```

## 🔧 常见问题

### Q: 插件无法加载？
```bash
# 检查安装
npm list -g dsh-ide-mode

# 重新安装
npm uninstall -g dsh-ide-mode
npm install -g dsh-ide-mode
```

### Q: 端口 3000 被占用？
``ash
# 更改端口
dsh config set port 3001
```

### Q: 如何更新插件？
```bash
npm update -g dsh-ide-mode
```

### Q: 如何卸载插件？
```bash
npm uninstall -g dsh-ide-mode
```

## 📱 系统要求

- **操作系统**: Windows 10+, macOS 10.15+, Linux
- **Node.js**: 18.0+
- **npm**: 9.0+
- **DSH**: 已安装

## 🎨 自定义配置

### 主题设置
```json
{
  "theme": "dark",  // 或 "light"
  "fontSize": 14,
  "tabSize": 2,
  "wordWrap": "on"
}
```

### 终端配置
```json
{
  "terminal": {
    "shell": "/bin/bash",
    "fontSize": 14
  }
}
```

## 🚀 下一步

1. **探索功能**：尝试所有 IDE 功能
2. **阅读文档**：查看完整文档
3. **参与贡献**：提交你的第一个 PR
4. **分享项目**：告诉朋友和同事

## 📞 获取帮助

- **GitHub Issues**: 报告问题
- **GitHub Discussions**: 社区讨论
- **文档**: 查看详细文档

---

**开始您的 DSH-IDE 之旅！** 🎉

*让编程更简单，让开发更高效*
