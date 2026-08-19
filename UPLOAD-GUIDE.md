# DSH-IDE 上传和维护指南

## 🎉 项目已成功上传！

您的 DSH-IDE 项目已经成功上传到 GitHub 仓库：
**https://github.com/zhuhaozhe-cloud/DSH-IDE**

## 📋 当前状态

- ✅ **Git 仓库**：已初始化并配置
- ✅ **远程仓库**：已添加 origin 远程仓库
- ✅ **代码推送**：已推送到 master 分支
- ✅ **提交历史**：3 个提交，包含完整的项目设置

## 🚀 如何更新项目

### 1. 日常更新流程

#### 步骤 1：修改代码
```bash
# 编辑文件
# 修改 src/ 下的代码
# 更新文档等
```

#### 步骤 2：提交更改
```bash
# 查看更改
git status

# 添加更改到暂存区
git add .

# 提交更改
git commit -m "描述你的更改"

# 示例：
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "docs: 更新文档"
```

#### 步骤 3：推送到 GitHub
```bash
# 推送到远程仓库
git push origin master
```

### 2. 分支管理

#### 创建功能分支
```bash
# 创建并切换到新分支
git checkout -b feature/新功能名称

# 在分支上开发
# ...

# 提交更改
git add .
git commit -m "feat: 实现新功能"

# 推送分支到 GitHub
git push origin feature/新功能名称
```

#### 合并分支
```bash
# 切换回主分支
git checkout master

# 合并功能分支
git merge feature/新功能名称

# 推送合并结果
git push origin master

# 删除功能分支（可选）
git branch -d feature/新功能名称
git push origin --delete feature/新功能名称
```

### 3. 版本发布

#### 创建标签
```bash
# 创建标签
git tag -a v0.1.0 -m "版本 0.1.0 发布"

# 推送标签到 GitHub
git push origin v0.1.0
```

#### 在 GitHub 上创建 Release
1. 访问 https://github.com/zhuhaozhe-cloud/DSH-IDE/releases
2. 点击 "Create a new release"
3. 选择标签版本
4. 填写发布说明
5. 上传构建文件（可选）
6. 发布

## 🔧 常用 Git 命令

### 查看状态
```bash
# 查看工作区状态
git status

# 查看提交历史
git log --oneline

# 查看分支
git branch -a

# 查看远程仓库
git remote -v
```

### 撤销更改
```bash
# 撤销工作区更改
git checkout -- 文件名

# 撤销暂存区更改
git reset HEAD 文件名

# 撤销提交（保留更改）
git reset --soft HEAD~1

# 撤销提交（丢弃更改）
git reset --hard HEAD~1
```

### 同步远程仓库
```bash
# 拉取远程更改
git pull origin master

# 推送本地更改
git push origin master

# 强制推送（谨慎使用）
git push --force origin master
```

## 📁 项目结构

```
DSH-IDE/
├── .github/                   # GitHub 配置
│   ├── ISSUE_TEMPLATE/       # Issue 模板
│   └── workflows/           # CI/CD 工作流
├── src/                      # 源代码
│   ├── components/           # React 组件
│   ├── stores/              # 状态管理
│   └── utils/               # 工具函数
├── packages/                # 插件包
│   └── dsh-ide-mode/        # DSH IDE 插件
├── dist/                    # 构建输出
├── README.md                # 项目介绍
├── CONTRIBUTING.md          # 贡献指南
├── LICENSE                  # 许可证
└── package.json             # 项目配置
```

## 🎯 GitHub 仓库管理

### 1. 仓库设置
1. 访问 https://github.com/zhuhaozhe-cloud/DSH-IDE/settings
2. 设置仓库描述：
   - **Description**: `DSH-IDE - 将 DSH Web GUI 改造为类 VS Code 的编程 IDE`
   - **Website**: 项目主页（如有）
   - **Topics**: `ide`, `vscode`, `react`, `typescript`, `monaco-editor`, `web-ide`

### 2. 启用 GitHub Pages
1. 进入 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "gh-pages"
4. 文件夹选择 "/ (root)"
5. 点击 Save

### 3. 设置保护分支
1. 进入 Settings → Branches
2. 添加分支保护规则：
   - Branch name pattern: `master`
   - 勾选 "Require pull request reviews before merging"
   - 勾选 "Require status checks to pass before merging"

## 🛠️ CI/CD 自动化

您的项目已配置 GitHub Actions，会自动：

### 1. 测试流程
- 每次推送代码时自动运行测试
- 检查代码规范
- 构建项目

### 2. 部署流程
- 主分支推送时自动部署到 GitHub Pages
- 创建 Release 时自动构建和发布

### 查看 Actions 状态
1. 访问 https://github.com/zhuhaozhe-cloud/DSH-IDE/actions
2. 查看工作流运行状态
3. 查看测试结果

## 📊 项目统计

### 查看仓库统计
1. 访问 https://github.com/zhuhaozhe-cloud/DSH-IDE/pulse
2. 查看：
   - 提交活动
   - 代码频率
   - 贡献者
   - 流量统计

### 查看下载统计
1. 访问 https://github.com/zhuhaozhe-cloud/DSH-IDE/releases
2. 查看每个版本的下载次数

## 🤝 社区管理

### 1. 管理 Issues
1. 及时回复用户问题
2. 使用 Issue 模板
3. 标记和分类 Issues
4. 关闭已解决的问题

### 2. 管理 Pull Requests
1. 审查代码质量
2. 运行测试
3. 提供反馈
4. 合并优秀的贡献

### 3. 社区互动
1. 启用 Discussions 功能
2. 创建 Wiki 文档
3. 回答用户问题
4. 分享项目进展

## 🔄 发布新版本

### 1. 准备发布
```bash
# 更新版本号
# 修改 package.json 中的版本号
# 更新 CHANGELOG.md

# 提交更改
git add .
git commit -m "chore: 准备发布 v0.2.0"
git push origin master
```

### 2. 创建标签
```bash
# 创建标签
git tag -a v0.2.0 -m "版本 0.2.0 发布"

# 推送标签
git push origin v0.2.0
```

### 3. 创建 GitHub Release
1. 访问 https://github.com/zhuhaozhe-cloud/DSH-IDE/releases/new
2. 选择标签版本
3. 填写发布说明
4. 上传构建文件（可选）
5. 发布

## 📈 推广项目

### 1. 社交媒体推广
- Twitter/X: 分享项目更新
- LinkedIn: 专业项目介绍
- 微博: 中文社区推广

### 2. 技术社区推广
- Reddit: r/programming, r/reactjs
- Hacker News: 提交项目链接
- 掘金/CSDN: 中文技术社区

### 3. 内容营销
- 撰写技术博客
- 制作演示视频
- 分享开发经验

## 🔧 故障排除

### 常见问题

#### Q: 推送失败怎么办？
```bash
# 检查网络连接
ping github.com

# 检查认证
git config --global credential.helper

# 重新设置远程仓库
git remote set-url origin https://github.com/zhuhaozhe-cloud/DSH-IDE.git
```

#### Q: 如何解决冲突？
```bash
# 拉取远程更改
git pull origin master

# 解决冲突
# 编辑冲突文件

# 提交解决结果
git add .
git commit -m "fix: 解决合并冲突"
git push origin master
```

#### Q: 如何回滚到之前版本？
```bash
# 查看提交历史
git log --oneline

# 回滚到指定提交
git reset --hard 提交哈希

# 强制推送
git push --force origin master
```

## 📞 获取帮助

### GitHub 资源
- **Issues**: https://github.com/zhuhaozhe-cloud/DSH-IDE/issues
- **Discussions**: https://github.com/zhuhaozhe-cloud/DSH-IDE/discussions
- **Wiki**: https://github.com/zhuhaozhe-cloud/DSH-IDE/wiki

### 文档资源
- **README.md**: 项目介绍
- **CONTRIBUTING.md**: 贡献指南
- **PLUGIN-INSTALL-GUIDE.md**: 安装指南
- **GITHUB-SETUP.md**: GitHub 设置

---

**恭喜！您的 DSH-IDE 项目已成功上传到 GitHub！**

现在您可以：
1. 分享项目链接给其他人
2. 接受社区贡献
3. 持续更新和改进项目
4. 建立开源社区

🚀 **开始您的开源之旅！**
