# Repository Guidelines

## Project Structure
- `index.html` — 站点根首页，简要介绍两个模块
- `agent/` — AI Agent 主题，`what-is-agent.html` 为概念页；下设 patterns / core / multi-agent / engineering
- `agent/patterns/` — Agent 设计模式页（react / plan-execute / reasoning / reflection / tasksplit）
- `agent/core/` — 核心组件（llm / tools / memory / planning）
- `agent/multi-agent/` — 多智能体（handoff / orchestrator-workers / debate）
- `agent/engineering/` — 工程实践（memory-compression / framework-vs-scratch）
- `redis/` — Redis 主题，下设 data-types / data-structures / memory 子目录
- `redis/data-types/` — 数据类型与扩展页（string / list / hash / set / zset / stream / bitmap / hyperloglog / geo）
- `redis/memory/` — 内存管理页（过期删除与内存淘汰，`expire-evict.html`）
- `redis/data-structures/` — 底层结构实现笔记（SDS / dict / listpack / robj）
- `theme.css` — 全站共享主题样式（根目录，所有页面按层级用相对路径引用）

文件命名统一为 `<topic>.html`，每个模块（`agent/`、`redis/`）都有一份 `index.html` 作为入口；新增页面后需同步更新所属模块的 `index.html`，并在首页 `index.html` 酌情补充说明。

## Build, Test, and Development Commands
项目是纯静态 HTML/CSS，无构建器、包管理器或测试框架。
- 本地预览：`python3 -m http.server 8000`，然后访问 `http://localhost:8000/`
- 部署：GitHub Pages，`git push origin main` 后自动构建；仓库根目录的 `.nojekyll` 让 Pages 跳过 Jekyll、直接发布静态文件
- 线上地址：`https://reverie4u.github.io/show-me-somenthing/`

## Coding Style
- 统一使用 `<html lang="zh-CN">`、`<meta charset="utf-8">`、viewport 声明
- 标题使用中文（如 `什么是 AI Agent`、`Redis String 类型`）
- 复用现有 class（`hero`、`wrap`、`badge`、`toc`、`part-head`、`part-title`、`card`、`prob`、`fields`、`field`、`note`、`flow`、`fl`、`fl-arr`、`memcard`、`memlabel` 等），不要为单个页面发明样式
- 颜色一律通过 `theme.css` 中的 CSS 变量引用（`--bg`、`--fg`、`--red` 等），禁止硬编码色值；变量覆盖浅色/深色主题
- 页面采用与现有页面一致的紧凑单行 HTML 格式（避免引入无关换行与缩进差异）
- 内容以中文撰写，技术名词保留英文原名（如 String、SDS、listpack、agent）

## Content Conventions
- 一个 HTML 文件讲一个主题；按模块拆分，避免超长页面
- 每个主题页面包含导览区、目录和分区标题，结构对齐同目录下的现有页面
- 模块索引（`agent/index.html`、`redis/index.html`）负责汇总该模块的入口与阅读路径

## Agent & Pattern 写作约定
- 页面骨架固定：`hero`（badge + h1 + 一句话 lead）→ `main.wrap` → `nav.toc`（PART 01..N：num/name/desc）→ 每个 PART 用 `part-head` + `section`（`h2` + `p.sub` + 内容）
- 表达组件复用：流程图用 `flow`/`fl`/`fl-arr`（箭头保持小尺寸）、特性卡用 `fields`/`field`、对比表用 `card`+`table.prob`、代码/内存示意用 `memcard`+`memlabel`+`pre`
- 每条关键结论在 `note` 中标出处（资料名 + 可点击的一手链接，如 arXiv / 官方文档）；无法核实的标注「存疑」，不能只写「见官方文档」却无链接
- 相关模式之间用纯文字提及、不互加超链接，保持单页自洽

## Source & Evidence Rules
- 所有学习笔记（概念页、模块索引、总结）中的结论必须能溯源到一手资料：原始论文、官方文档/官方博客、权威教科书（如 Russell & Norvig《Artificial Intelligence: A Modern Approach》）原文，或公开的一手规范/数据集
- 二手解读、转述文章、他人博客的总结、以及 AI 生成的草稿均不构成一手资料；引用前必须核对原文，不可只凭搜索结果摘要下结论
- 禁止凭印象猜测或补全细节；若无法找到一手来源，宁可留空或明确标注“存疑”，也不得写成确定结论
- 每条关键结论应在页面内标注出处（资料名称 + 链接/引用），并说明该资料的类型（教科书 / 论文 / 官方文档 / 规范）
- 一手资料之间若有冲突，并列呈现并说明差异，不擅自调和成未经证实的共识

## Testing Guidelines
项目用 Playwright 做布局回归（`npm test`，覆盖桌面+移动全部静态页）。提交前：
1. 运行 `npm test`，确保无横向溢出、无块级元素重叠、箭头尺寸正常
2. 确认所有相对链接有效（`agent/`、`agent/patterns/`、`redis/`、`redis/data-types/`、`redis/data-structures/`、`redis/memory/` 内页面正确引用根目录 `theme.css`）
3. 在浅色与深色主题下各检查一次
4. 宽表格务必放在 `.card` 内（`.card` 已设 `overflow-x:auto`），不要在页面层撑宽
5. 推送后确认 Pages 构建状态与线上地址可访问

## Commit & Pull Request Guidelines
仓库已纳入 Git 版本管理并托管到 GitHub，使用 Conventional Commits 前缀（`feat`、`fix`、`docs`、`refactor`、`chore`）。
PR 描述中说明：新增/修改的主题与页面、所属模块 `index.html` 是否同步更新、以及浅色/深色主题与线上地址的验证结果。

## Agent-Specific Instructions
- 不要自行执行 `git commit` / `git push`：完成改动后先向用户展示变更（改动内容、`git diff` 或关键文件），等用户确认无误后再提交并推送
- 修改前读取目标页面和相邻页面，保持风格与结构一致
- 同时修改共享样式时，确保浅色与深色变量成对更新
- 新增页面后主动更新所属模块的 `index.html`；无明确要求时不要改动其他模块页
- 若对文件名做删除或重命名，同步修复所有指向它的链接
