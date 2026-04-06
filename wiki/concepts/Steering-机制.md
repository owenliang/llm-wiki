---
title: Steering 机制
category: 核心概念
tags: [steering, agent-control, interruption, real-time]
---

# Steering 机制

Steering（转向）机制是 pi-agent-core 提供的运行时干预能力，允许在 Agent 执行过程中动态注入新指令。

## 核心概念

在传统的 Agent 架构中，一旦 prompt 发送，用户只能等待完整响应。Steering 机制打破了这一限制，允许：

- **运行时中断**: 在工具执行期间注入新消息
- **动态调整**: 根据中间结果改变 Agent 行为
- **即时响应**: 无需等待当前任务完成

## 使用场景

### 1. 纠正错误方向

Agent 正在执行一个长任务，但发现方向错了：

```typescript
agent.steer({
  role: "user",
  content: "Stop! Don't delete that file, just read it.",
  timestamp: Date.now(),
});
```

### 2. 补充上下文

Agent 执行过程中获得新信息：

```typescript
agent.steer({
  role: "user", 
  content: "Also consider the config.json file in the parent directory.",
  timestamp: Date.now(),
});
```

### 3. 紧急停止

发现 Agent 即将执行危险操作：

```typescript
agent.steer({
  role: "user",
  content: "STOP! Do not execute that command.",
  timestamp: Date.now(),
});
```

## 工作机制

### 触发时机

Steering 消息在当前 turn 的所有工具调用完成后注入：

1. Assistant 消息（含工具调用）完成
2. 所有工具执行完成
3. **Steering 消息注入**
4. 下一 turn 开始，LLM 响应 steering 消息

### 模式配置

```typescript
agent.steeringMode = "one-at-a-time"; // 默认，一次处理一个
agent.steeringMode = "all";           // 批量处理所有
```

### 队列管理

```typescript
agent.clearSteeringQueue();  // 清空待处理的 steering 消息
agent.clearAllQueues();      // 清空所有队列（steering + follow-up）
```

## 与 Follow-up 的区别

| 特性 | Steering | Follow-up |
|------|----------|-----------|
| 触发时机 | 工具执行期间 | Agent 完成后 |
| 用途 | 中断/纠正 | 补充任务 |
| 紧急程度 | 高 | 低 |
| 典型场景 | "Stop!" | "Also do this..." |

## 实现示例

```typescript
const agent = new Agent({
  initialState: { /* ... */ },
  steeringMode: "one-at-a-time",
});

// 开始一个长任务
agent.prompt("Analyze all files in /data directory");

// 5秒后，发现需要调整方向
setTimeout(() => {
  agent.steer({
    role: "user",
    content: "Focus only on .json files, ignore others.",
    timestamp: Date.now(),
  });
}, 5000);
```

## 相关页面

- [[pi-agent-core]]
- [[Follow-up 机制]]
- [[事件驱动架构]]
