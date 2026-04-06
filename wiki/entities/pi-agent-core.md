---
title: pi-agent-core
type: SDK / Agent 运行时
developer: Mario Zechner
language: TypeScript
version: "0.64.0"
package: "@mariozechner/pi-agent-core"
tags: [pi-sdk, agent-runtime, typescript]
---

# pi-agent-core

pi-agent-core 是 pi SDK 的 Agent 运行时核心，提供 Agent 循环和工具执行能力。

## 概述

作为 pi SDK 的基础层，pi-agent-core 实现了 Agent 的核心运行逻辑。

## 核心功能

- **Agent Loop**: Agent 决策和执行循环
- **Tool Execution**: 工具调用和执行（支持 parallel/sequential 模式）
- **AgentMessage Types**: 消息类型定义
- **事件流**: 完整的事件序列（agent_start → turn_start → message_start/update/end → turn_end → agent_end）
- **Steering 机制**: 运行时中断 Agent，注入新指令
- **Follow-up 机制**: 任务完成后排队后续工作

## 消息流架构

```
AgentMessage[] → transformContext() → convertToLlm() → Message[] → LLM
```

1. **transformContext**: 修剪旧消息、注入外部上下文（可选）
2. **convertToLlm**: 过滤 UI-only 消息、转换自定义类型（必需）

## 事件序列

**普通 prompt()**:
```
agent_start → turn_start → message_start (user) → message_end 
→ message_start (assistant) → message_update (流式) → message_end 
→ turn_end → agent_end
```

**带工具调用**:
```
... → message_end (assistant with toolCall) 
→ tool_execution_start → tool_execution_update → tool_execution_end
→ message_start/end (toolResult) → turn_end → [下一轮回合] → agent_end
```

## 核心方法

- **prompt()**: 发送文本/图片/消息
- **continue()**: 从当前上下文继续（错误重试）
- **steer()**: 运行时注入转向消息
- **followUp()**: 排队后续任务
- **abort()**: 取消当前操作
- **waitForIdle()**: 等待完成
- **subscribe()**: 订阅事件

## 包信息

```json
{
  "@mariozechner/pi-agent-core": "0.64.0"
}
```

## 架构位置

在 pi SDK 架构中，pi-agent-core 位于：
- 上层: [[pi-coding-agent]]（高级 SDK）
- 下层: [[pi-ai]]（LLM 抽象）

## 相关页面

- [[pi-coding-agent]]
- [[pi-ai]]
- [[OpenClaw]]
- [[AgentMessage]]
- [[事件驱动架构]]
- [[Steering 机制]]
