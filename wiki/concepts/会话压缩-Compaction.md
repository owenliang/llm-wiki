---
title: 会话压缩 (Compaction)
category: 技术概念
tags: [context-window, session-management, optimization]
---

# 会话压缩 (Compaction)

会话压缩是一种管理 Agent 会话上下文窗口大小的技术，通过压缩历史对话来保留关键信息同时减少 token 消耗。

## 为什么需要压缩

- **上下文窗口限制**: LLM 有最大上下文长度限制
- **成本优化**: 减少 token 数量降低 API 成本
- **性能提升**: 更短的上下文提高响应速度
- **信息密度**: 去除冗余保留关键信息

## 压缩策略

### 1. 自动压缩

由 Agent 或运行时自动触发：
- 达到上下文阈值时自动执行
- 保留关键决策点和工具调用结果
- 摘要化早期对话内容

### 2. 手动压缩

由开发者或用户主动触发：
- 特定节点保存快照
- 选择性保留/删除历史
- 分支管理（多路径探索）

### 3. 分支与合并

支持会话的多分支管理：
- 从某点创建新分支
- 并行探索不同方案
- 合并或丢弃分支

## 实现示例

在 [[OpenClaw]] 中：
- `compact.ts`: 手动/自动压缩逻辑
- `compaction-safeguard.ts`: 压缩安全保护
- `context-pruning.ts`: 基于缓存 TTL 的上下文修剪

## 相关页面

- [[AgentSession]]
- [[上下文窗口管理]]
- [[OpenClaw]]
