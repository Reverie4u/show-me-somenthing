# Repository Guidelines

## Project Structure
- `index.html` — 站点根首页，简要介绍两个模块
- `agent/` — AI Agent 主题，`index.html` 为模块入口，`what-is-agent.html` 为概念页
- `redis/` — Redis 主题，`index.html` 为类型×编码×结构索引
- `redis/internals/` — Redis 底层结构实现笔记（SDS / dict / listpack / robj）
- `theme.css` — 全站共享主题样式（根目录，所有页面按层级用相对路径引用）

文件命名统一为 `<topic>.html`，**不使用 `-v2` 等版本后缀**。每个模块（`agent/`、`redis/`）都有一份 `index.html` 作为入口；新增页面后需同步更新所属模块的 `index.html`，并在首页 `index.html` 酌情补充说明。

## Build, Test, and Development Commands
项目是纯静态 HTML/CSS，无构建器、包管理器或测试框架。
- 本地预览：`python3 -m http.server 8000`，然后访问 `http://localhost:8000/`
- 部署：GitHub Pages，`git push origin main` 后自动构建；仓库根目录的 `.nojekyll` 让 Pages 跳过 Jekyll、直接发布静态文件
- 线上地址：`https://reverie4u.github.io/show-me-somenthing/`

## Coding Style
- 统一使用 `<html lang="zh-CN">`、`<meta charset="utf-8">`、viewport 声明
- 标题使用中文（如 `什么是 AI Agent`、`Redis String 类型`）
- 复用现有 class（`hero`、`wrap`、`badge`、`toc`、`part-head`、`part-title`、`card`、`prob`、`fields`、`field`、`note`、`flow`、`fl` 等），不要为单个页面发明样式
- 颜色一律通过 `theme.css` 中的 CSS 变量引用（`--bg`、`--fg`、`--red` 等），禁止硬编码色值；变量覆盖浅色/深色主题
- 页面采用与现有页面一致的紧凑单行 HTML 格式（避免引入无关换行与缩进差异）
- 内容以中文撰写，技术名词保留英文原名（如 String、SDS、listpack、agent）

## Content Conventions
- 一个 HTML 文件讲一个主题；按模块拆分，避免超长页面
- 每个主题页面包含导览区、目录和分区标题，结构对齐同目录下的现有页面
- 模块索引（`agent/index.html`、`redis/index.html`）负责汇总该模块的入口与阅读路径

## Testing Guidelines
没有自动化测试。提交前手动验证：
1. 打开页面，检查标题、目录锚点和正文渲染
2. 确认所有相对链接有效（`agent/`、`agent/`、`redis/`、`redis/internals/` 内页面正确引用根目录 `theme.css`）
3. 在浅色与深色主题下各检查一次
4. 在窄屏宽度下确认表格和代码块无横向溢出
5. 推送后查看 GitHub Actions 或 Pages 构建状态，确认线上地址可访问

## Commit & Pull Request Guidelines
仓库已纳入 Git 版本管理并托管到 GitHub，使用 Conventional Commits 前缀（`feat`、`fix`、`docs`、`refactor`、`chore`）。
PR 描述中说明：新增/修改的主题与页面、所属模块 `index.html` 是否同步更新、以及浅色/深色主题与线上地址的验证结果。

## Agent-Specific Instructions
- 修改前读取目标页面和相邻页面，保持风格与结构一致
- 同时修改共享样式时，确保浅色与深色变量成对更新
- 新增页面后主动更新所属模块的 `index.html`；无明确要求时不要改动其他模块页
- 若对文件名做删除或重命名，同步修复所有指向它的链接
