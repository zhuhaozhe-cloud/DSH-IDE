# 贡献指南 / Contributing Guide

感谢您对 DSH-IDE 项目的关注！我们欢迎所有形式的贡献。

Thank you for your interest in the DSH-IDE project! We welcome all forms of contribution.

## 如何贡献 / How to Contribute

### 报告问题 / Reporting Issues

1. 使用 GitHub Issues 报告问题
2. 选择合适的问题模板（Bug 报告、功能请求或文档改进）
3. 提供详细的描述和重现步骤

1. Use GitHub Issues to report problems
2. Choose the appropriate issue template (Bug Report, Feature Request, or Documentation Improvement)
3. Provide detailed description and reproduction steps

### 提交代码 / Submitting Code

1. Fork 项目仓库
2. 创建功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 打开 Pull Request

1. Fork the project repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### 代码规范 / Code Standards

#### TypeScript 规范
- 使用 TypeScript 严格模式
- 所有函数和变量都要有类型注解
- 避免使用 `any` 类型

#### React 规范
- 使用函数式组件和 Hooks
- 组件使用 PascalCase 命名
- 使用 Zustand 进行状态管理

#### 样式规范
- 使用 Tailwind CSS
- 遵循 BEM 命名约定
- 保持响应式设计

### 提交规范 / Commit Standards

使用 Conventional Commits 格式：

```
type(scope): description

类型 / Type:
- feat: 新功能 / New feature
- fix: 修复问题 / Bug fix
- docs: 文档更新 / Documentation update
- style: 代码格式 / Code formatting
- refactor: 代码重构 / Code refactoring
- test: 测试相关 / Testing related
- chore: 构建/工具 / Build/tooling

范围 / Scope:
- 可选，表示影响范围
- Optional, indicates the scope of the change

描述 / Description:
- 简洁明了地描述更改
- Concisely describe the changes
```

示例 / Examples:
```
feat(editor): add syntax highlighting support
fix(terminal): resolve connection issues
docs(readme): update installation instructions
```

### 开发环境设置 / Development Setup

1. 克隆仓库
   ```bash
   git clone https://github.com/username/DSH-IDE.git
   cd DSH-IDE
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

4. 构建插件
   ```bash
   cd packages/dsh-ide-mode
   npm run build
   ```

### 测试 / Testing

运行测试套件：
```bash
npm test
```

### 代码审查 / Code Review

所有 Pull Request 都需要经过代码审查：
- 确保代码符合项目规范
- 检查是否有适当的测试
- 验证功能是否按预期工作
- 检查文档是否更新

### 行为准则 / Code of Conduct

请遵守我们的行为准则：
- 尊重所有参与者
- 使用包容性语言
- 接受建设性批评
- 专注于对社区最有利的事情

### 许可证 / License

通过贡献代码，您同意您的贡献将在 Apache-2.0 许可证下发布。

By contributing code, you agree that your contributions will be released under the Apache-2.0 License.

### 联系方式 / Contact

如有任何问题，请通过以下方式联系我们：
- GitHub Issues
- 项目负责人：MiMo-v2.5-pro
- 开发团队：小米大模型团队

For any questions, please contact us through:
- GitHub Issues
- Project Lead: MiMo-v2.5-pro
- Development Team: Xiaomi Large Model Team

---

感谢您的贡献！ / Thank you for your contribution!
