# GitHub 仓库设置指南

## 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `DSH-IDE`
   - **Description**: `DSH-IDE - 将 DSH Web GUI 改造为类 VS Code 的编程 IDE`
   - **Visibility**: Public（推荐）
   - **不要**勾选 "Add a README file"
   - **不要**勾选 "Add .gitignore"
   - **License**: Apache License 2.0
3. 点击 "Create repository"

## 步骤 2：推送代码到 GitHub

### Windows 用户
```cmd
# 双击运行 push-to-github.bat
# 或者手动执行：
git remote add origin https://github.com/你的用户名/DSH-IDE.git
git push -u origin master
```

### Linux/macOS 用户
```bash
# 运行推送脚本
chmod +x push-to-github.sh
./push-to-github.sh

# 或者手动执行：
git remote add origin https://github.com/你的用户名/DSH-IDE.git
git push -u origin master
```

## 步骤 3：配置 GitHub 仓库

### 3.1 设置仓库描述和主题标签
1. 进入仓库页面
2. 点击右侧的 "About" 部分
3. 点击齿轮图标设置：
   - **Description**: `DSH-IDE - 将 DSH Web GUI 改造为类 VS Code 的编程 IDE`
   - **Website**: 项目主页（如有）
   - **Topics**: `ide`, `vscode`, `react`, `typescript`, `monaco-editor`, `web-ide`, `programming`, `development-tools`

### 3.2 设置 GitHub Pages
1. 进入 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages"（由 GitHub Actions 自动创建）
4. 文件夹选择 "/ (root)"
5. 点击 Save

### 3.3 设置仓库社交预览
1. 进入 Settings → General
2. 向下滚动到 "Social preview"
3. 上传一张 1280×640 像素的预览图片
4. 保存更改

## 步骤 4：优化仓库展示

### 4.1 创建仓库截图
1. 启动项目：`npm run dev`
2. 截图 IDE 界面
3. 保存为 `screenshots/ide-main.png`

### 4.2 更新 README 中的图片链接
将 README 中的占位图片链接替换为实际截图：

```markdown
![DSH-IDE Main Interface](screenshots/ide-main.png)
```

### 4.3 创建演示 GIF
1. 录制项目使用演示
2. 保存为 `demo.gif`
3. 在 README 中添加：

```markdown
## 演示 / Demo

![DSH-IDE Demo](demo.gif)
```

## 步骤 5：推广项目

### 5.1 社交媒体推广
参考 `SOCIAL-MEDIA.md` 文件中的模板

### 5.2 技术社区推广
1. **Reddit**: r/programming, r/reactjs, r/typescript
2. **Hacker News**: 提交项目链接
3. **Dev.to**: 撰写项目介绍文章
4. **掘金/CSDN**: 中文技术社区

### 5.3 GitHub 社区建设
1. 启用 Discussions 功能
2. 设置 Issue 模板（已配置）
3. 设置 Pull Request 模板
4. 添加 Contributing 指南（已配置）

## 步骤 6：持续维护

### 6.1 定期更新
- 修复 Bug
- 添加新功能
- 更新文档
- 响应社区反馈

### 6.2 版本发布
- 使用语义化版本号
- 编写详细的 Release Notes
- 创建 Git 标签

### 6.3 社区互动
- 回复 Issues 和 Pull Requests
- 参与技术讨论
- 分享项目进展

---

**提示**：保持项目活跃度是增加知名度的关键。定期更新、积极响应社区反馈、分享技术见解都能帮助项目获得更多关注。
