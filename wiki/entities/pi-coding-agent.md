---
title: pi-coding-agent
type: SDK / Agent 框架
developer: Mario Zechner
language: TypeScript
version: "0.64.0"
package: "@mariozechner/pi-coding-agent"
tags: [pi-sdk, agent-framework, typescript, coding-agent]
---

# pi-coding-agent

pi-coding-agent 是 [[Mario Zechner]] 开发的高级 Agent SDK，提供完整的 AI coding agent 功能。

## 概述

作为 pi SDK 家族的核心包，pi-coding-agent 提供了构建 AI coding agent 所需的高层次抽象和工具。

## 核心功能

- **createAgentSession**: 创建和管理 Agent 会话
- **SessionManager**: 会话生命周期管理
- **AuthStorage**: 认证信息存储
- **ModelRegistry**: 模型注册和管理
- **内置工具**: 开箱即用的 coding 工具集

## 包信息

```json
{
  "@mariozechner/pi-coding-agent": "0.64.0"
}
```

## 相关包

| 包名 | 用途 |
|------|------|
| [[pi-ai]] | LLM 抽象层 |
| [[pi-agent-core]] | Agent 循环和工具执行 |
| [[pi-tui]] | 终端 UI 组件 |

## 使用场景

- [[OpenClaw]] 使用 pi-coding-agent 作为核心 Agent 引擎
- 嵌入式 Agent 架构
- 自定义 coding agent 开发

## 资源链接

- GitHub: https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent

## 相关页面

- [[OpenClaw]]
- [[pi-agent-core]]
- [[pi-ai]]
- [[Mario Zechner]]
