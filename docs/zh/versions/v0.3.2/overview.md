---
title: v0.3.2 概览
description: Agent Runtime v0.3.2 发布概览。
---

# Agent Runtime v0.3.2

Agent Runtime v0.3.2 增加面向 LLM 的文档入口。该版本在仓库根目录与文档站点根目录发布精简索引和完整上下文 Markdown，方便 AI 客户端直接发现 runtime standard。

## Highlights

- 新增 `llms.txt` 作为精简 LLM 导航索引。
- 新增 `llms-full.txt`，合并英文核心文档并保留 source URLs。
- 新增兼容 alias：`llm.txt` 与 `llm-full.txt`。
- 通过 `docs/public/` 发布同名文件，让 GitHub Pages 可以从站点根目录访问。
- 将 LLM 入口文件加入 package manifest。

## Compatibility

v0.3.2 兼容 v0.3.1，不改变 runtime event、control-plane、task、A2A 或 snapshot 语义。
