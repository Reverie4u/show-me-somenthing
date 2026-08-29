# Repository Guidelines

## Project Structure
- `agent/` — AI Agent 主题的静态 HTML 笔记
- `redis/` — Redis 数据类型笔记（`index.html` 为目录页）
- `redis/internals/` — Redis 底层结构实现笔记
- `redis/theme.css` — 全站共享主题样式

文件命名为 `<topic>.html`；同一主题的后续版本使用 `<topic>-v2.html` 后缀，不覆盖旧版本。新页面需同时更新对应目录页（`index.html` 或 `index-v2.html`）。

## Build, Test, and Development Commands
项目是纯静态 HTML/CSS，无构建器、包管理器或测试框架。
- 本地预览：`python3 -m http.server 8000`，然后访问 `http://localhost:8000/redis/index.html`
- 直接打开文件也可运行，但通过 HTTP 服务更接近实际访问方式

## Coding Style
- 页面统一使用 `<html lang="zh-CN">`、`<meta charset="utf-8">`、viewport 声明
- 标题使用中文（如 `Redis String 类型`）
- 复用现有 class（`hero`、`wrap`、`badge`、`toc`、`part-head`、`card`、`prob` 等），不要为单个页面发明样式
- 颜色一律通过 `theme.css` 中的 CSS 变量引用（`--bg`、`--fg`、`--red` 等），禁止硬编码色值；变量覆盖浅色/深色主题
- 新页面保持与现有 `*-v2.html` 一致的紧凑单行 HTML 格式
- 内容以中文撰写，技术名词保留英文原名（如 String、SDS、listpack）

## Content Conventions
- 一个 HTML 文件讲一个主题；拆分为多个文件，避免超长页面
- 每个主题页面包含导览区、目录和分区标题，结构对齐同目录下的现有页面
- v1 与 v2 并存时，在 v2 页面中明确标注其相对 v1 的差异或改进点

## Testing Guidelines
没有自动化测试。提交前手动验证：
1. 打开新增页面，检查标题、目录锚点和正文渲染
2. 确认所有相对链接有效（`internals/` 内页面引用 `../theme.css`）
3. 在浅色与深色主题下各检查一次
4. 在窄屏宽度下确认表格和代码块无横向溢出

## Commit & Pull Request Guidelines
当前目录尚未纳入 Git 版本控制，因此没有可参考的提交历史。若初始化 Git，建议使用 Conventional Commits 前缀（`feat`、`fix`、`docs`、`refactor`），PR 描述中说明新增/修改的主题、目录页是否同步更新，以及浅色/深色主题的验证结果。

## Agent-Specific Instructions
- 修改前读取目标页面和相邻页面，保持风格与结构一致
- 同时修改共享样式时，确保浅色与深色变量成对更新
- 新增页面后主动更新目录页；无明确要求时不要重写旧版 v1 页面
