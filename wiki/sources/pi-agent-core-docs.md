---
title: pi-agent-core 官方文档
date: 2026-04-06
source: raw/articles/pi-agent-core-docs.md
url: https://github.com/badlogic/pi-mono/tree/main/packages/agent
doc_type: 官方技术文档
tags: [pi-agent-core, agent, typescript, documentation]
---

# pi-agent-core 官方文档

## 摘要

pi-agent-core 是 Mario Zechner 开发的 Stateful Agent 框架，提供工具执行和事件流功能，构建于 pi-ai 之上。

## 关键要点

1. **核心定位**: Stateful Agent，支持工具执行和事件流
2. **消息流架构**: AgentMessage[] → transformContext() → convertToLlm() → LLM
3. **事件驱动**: 完整的事件序列（agent_start → turn_start → message_start/update/end → turn_end → agent_end）
4. **工具执行模式**: 支持 parallel（默认）和 sequential 两种模式
5. **Steering 机制**: 可在工具运行时中断 Agent，注入新指令
6. **Follow-up 机制**: 在 Agent 完成后排队后续任务
7. **自定义消息类型**: 通过声明合并扩展 AgentMessage

## 核心概念

### AgentMessage vs LLM Message

- AgentMessage: 灵活类型，支持 user/assistant/toolResult + 自定义类型
- convertToLlm(): 将 AgentMessage 转换为 LLM 可理解的格式

### 消息处理流程

1. **transformContext**: 修剪旧消息、注入外部上下文（可选）
2. **convertToLlm**: 过滤 UI-only 消息、转换自定义类型（必需）

### 事件序列

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

## 主要配置选项

| 选项 | 说明 |
|------|------|
| initialState | 初始状态（systemPrompt, model, tools, messages） |
| transformContext | 上下文转换（用于修剪、压缩） |
| convertToLlm | 消息格式转换 |
| toolExecution | 工具执行模式：parallel/sequential |
| beforeToolCall | 工具调用前钩子（可阻断） |
| afterToolCall | 工具调用后钩子 |
| steeringMode | 转向模式：one-at-a-time/all |
| followUpMode | 跟进模式：one-at-a-time/all |
| thinkingBudgets | 思考预算配置 |

## Agent State

```typescript
interface AgentState {
  systemPrompt: string;
  model: Model<any>;
  thinkingLevel: ThinkingLevel;
  tools: AgentTool<any>[];
  messages: AgentMessage[];
  readonly isStreaming: boolean;
  readonly streamingMessage?: AgentMessage;
  readonly pendingToolCalls: ReadonlySet<string>;
  readonly errorMessage?: string;
}
```

## 核心方法

- **prompt()**: 发送文本/图片/消息
- **continue()**: 从当前上下文继续（用于错误重试）
- **steer()**: 运行时注入转向消息
- **followUp()**: 排队后续任务
- **abort()**: 取消当前操作
- **waitForIdle()**: 等待完成
- **subscribe()**: 订阅事件

## 提取的实体

- [[pi-agent-core]]
- [[Mario Zechner]]

## 提取的概念

- [[AgentMessage]]
- [[消息流]]
- [[事件驱动架构]]
- [[Steering 机制]]
- [[Follow-up 机制]]
- [[工具执行模式]]

## 相关页面

- [[pi-coding-agent]]
- [[pi-ai]]
- [[OpenClaw]]
