---
title: OpenClaw
type: AI Agent 平台
developer: Community
license: MIT
language: TypeScript / Node.js
tags: [openclaw, ai-agent, typescript, open-source]
---

# OpenClaw

OpenClaw 是基于 pi-agent SDK 的开源 AI Agent 平台，采用 TypeScript/Node.js 开发。

## 基本信息

- **开发语言**: TypeScript / Node.js
- **核心框架**: [[pi-coding-agent]] SDK
- **开源协议**: MIT（完全开放）
- **内存系统**: 文件型内存（JSONL + MD）
- **系统要求**: Node 24（推荐）或 Node 22 LTS (22.14+)
- **Web 控制台**: http://127.0.0.1:18789/

## 定位

OpenClaw 是一个**自托管网关**，连接多种聊天应用（Discord、Telegram、WhatsApp 等）到 AI coding agents（如 Pi）。适合开发者和高级用户，可以在任何地方通过消息应用访问个人 AI 助手，无需依赖托管服务。

## 架构特点

OpenClaw 采用**嵌入式 Agent 架构**，直接导入 pi SDK 的 `createAgentSession()` 实例化 AgentSession，而非通过子进程或 RPC 模式。这带来以下优势：

- 完全控制会话生命周期和事件处理
- 动态自定义工具注入（消息、沙箱、渠道操作）
- 按渠道/上下文定制系统提示词
- 支持分支/压缩的会话持久化
- 多账户认证配置轮换和故障转移
- 提供商无关的模型切换

## 安装方式

```bash
npm install -g openclaw
openclaw onboard  # CLI 向导
```

## 支持平台

- macOS
- Linux
- Windows（需要 WSL2）

## 部署方式

- 自托管：通过 Docker

## 本地模型支持

通过配置文件配置 Ollama / llama.cpp 端点

## 通信渠道

### 内置渠道
- WhatsApp
- Telegram
- Slack
- Discord
- iMessage
- Signal
- Teams
- WebChat

### 插件渠道
- Matrix
- Nostr
- Twitch
- Zalo
- Google Chat
- 可扩展架构支持更多渠道

## 核心能力

- **多渠道网关**: 单一 Gateway 进程同时服务多个渠道
- **多智能体路由**: 按智能体、工作区或发送者隔离会话
- **媒体支持**: 发送和接收图片、音频、文档
- **移动节点**: 支持 iOS 和 Android 节点配对，支持 Canvas、相机和语音工作流

## 技能生态

- 支持本地技能
- 从 [[ClawHub]] 安装技能

## 安全特性

- 社区驱动的安全加固
- WASM 沙箱提案
- API 密钥保护
- ClawHub 市场全量 VirusTotal 扫描

## 发展路线

以社区驱动为主：
- 安全模型强化
- 多智能体协作
- 云原生架构
- 社区生态持续扩展

## 技术实现

### 核心模块

- `pi-embedded-runner.ts`: 嵌入式 Agent 运行主入口
- `pi-embedded-subscribe.ts`: 会话事件订阅/分发
- `pi-tools.ts`: OpenClaw 自定义工具
- `compact.ts`: 会话压缩逻辑
- `auth-profiles.ts`: 多账户认证和故障转移

### 事件处理

订阅的 AgentSession 事件：
- message_start / message_end / message_update
- tool_execution_start / tool_execution_end
- turn_start / turn_end
- agent_start / agent_end
- auto_compaction_start / auto_compaction_end

## 快速开始

```bash
# 安装
npm install -g openclaw@latest

# 配置向导
openclaw onboard --install-daemon

# 打开控制台
openclaw dashboard
```

## 配置

配置文件: `~/.openclaw/openclaw.json`

```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": { "*": { "requireMention": true } }
    }
  },
  "messages": { "groupChat": { "mentionPatterns": ["@openclaw"] } }
}
```

## 相关页面

- [[CoPaw]]
- [[pi-coding-agent]]
- [[pi-agent-core]]
- [[Mario Zechner]]
- [[ClawHub]]
- [[嵌入式 Agent 架构]]
- [[AgentSession]]
- [[自托管网关]]
