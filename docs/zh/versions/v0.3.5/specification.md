---
title: v0.3.5 规范快照
description: Agent Runtime v0.3.5 规范快照。
---

# v0.3.5 规范快照

v0.3.5 是文档资源链接修复版本。核心 Agent Runtime 规范继续兼容 v0.3.4。

## 首页资源链接契约

兼容文档 SHOULD 保证 repository-base 部署安全：

- logo 使用 base-aware 或由 VitePress 管理的 public asset 路径。
- `/en/` 与 `/zh/` 首页指向根 public LLM 文件时使用相对链接。
- 本地构建检查本地化首页不渲染 sidebar 或 aside navigation。

## 当前规范

- [最新规范](../../specification.md)
