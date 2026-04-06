---
title: AgentSession
category: 核心概念
tags: [agent, session, state-management]
---

# AgentSession

AgentSession 是 Agent 运行时的会话抽象，维护 Agent 的状态、历史和上下文。

## 核心职责

- **状态管理**: 维护对话历史和上下文窗口
- **工具执行**: 协调工具调用和结果处理
- **事件分发**: 向订阅者发送生命周期事件
- **持久化**: 支持会话保存和恢复

## 生命周期事件

| 事件 | 说明 |
|------|------|
| message_start / message_end | 消息开始/结束 |
| message_update | 流式文本/思考更新 |
| tool_execution_start / tool_execution_end | 工具执行开始/结束 |
| turn_start / turn_end | 一轮交互开始/结束 |
| agent_start / agent_end | Agent 运行开始/结束 |
| auto_compaction_start / auto_compaction_end | 自动压缩开始/结束 |

## 使用示例

```typescript
const { session } = await createAgentSession({
  model,
  tools,
  customTools,
});

// 订阅事件
subscribeEmbeddedPiSession({
  session,
  onBlockReply: (payload) => { /* ... */ },
  onToolResult: (result) => { /* ... */ },
});

// 发送提示词
await session.prompt("Hello", { images: [] });
```

## 相关概念

- [[会话压缩 (Compaction)]]: 管理上下文窗口大小
- [[Agent Loop]]: Agent 决策循环
- [[嵌入式 Agent 架构]]: 集成模式

## 相关页面

- [[pi-coding-agent]]
- [[OpenClaw]]
