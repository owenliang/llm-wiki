---
title: Follow-up 机制
category: 核心概念
tags: [follow-up, agent-control, task-queue, automation]
---

# Follow-up 机制

Follow-up（跟进）机制是 pi-agent-core 提供的任务排队能力，允许在 Agent 完成当前工作后自动执行后续任务。

## 核心概念

与 Steering 不同，Follow-up 不会中断当前执行，而是：

- **排队等待**: 在当前 Agent 完成后才执行
- **链式任务**: 自动连续的多个步骤
- **条件触发**: 无工具调用且无 Steering 时触发

## 使用场景

### 1. 结果总结

Agent 完成分析后，要求总结：

```typescript
agent.followUp({
  role: "user",
  content: "Summarize the findings in 3 bullet points.",
  timestamp: Date.now(),
});
```

### 2. 多步骤工作流

自动化的多步骤任务：

```typescript
// 步骤1: 分析代码
agent.prompt("Analyze the main.ts file");

// 步骤2: 完成后自动重构
agent.followUp({
  role: "user",
  content: "Refactor the code based on your analysis.",
  timestamp: Date.now(),
});

// 步骤3: 完成后自动测试
agent.followUp({
  role: "user",
  content: "Write unit tests for the refactored code.",
  timestamp: Date.now(),
});
```

### 3. 条件分支

根据结果决定下一步：

```typescript
agent.prompt("Check if the API is available");

agent.followUp({
  role: "user",
  content: "If the API is available, fetch the data. Otherwise, use cached data.",
  timestamp: Date.now(),
});
```

## 工作机制

### 触发条件

Follow-up 消息仅在以下情况触发：

1. 当前 turn 完成
2. 没有待处理的工具调用
3. 没有待处理的 Steering 消息
4. Follow-up 队列中有消息

### 处理流程

```
Turn completes
  ↓
Check: Any pending tool calls? → Yes → Wait
  ↓ No
Check: Any steering messages? → Yes → Process steering
  ↓ No
Check: Any follow-up messages? → Yes → Inject and continue
  ↓ No
Agent ends
```

### 模式配置

```typescript
agent.followUpMode = "one-at-a-time"; // 默认，一次处理一个
agent.followUpMode = "all";           // 批量处理所有
```

### 队列管理

```typescript
agent.clearFollowUpQueue();  // 清空待处理的 follow-up 消息
agent.clearAllQueues();      // 清空所有队列（steering + follow-up）
```

## 与 Steering 的对比

| 特性 | Steering | Follow-up |
|------|----------|-----------|
| 打断当前 | 是 | 否 |
| 执行时机 | 立即（当前 turn 后） | 延迟（Agent 完成后） |
| 用途 | 纠正/中断 | 补充/延续 |
| 紧急程度 | 高 | 低 |
| 典型场景 | "Stop!" | "Also do this..." |

## 组合使用

Steering 和 Follow-up 可以组合使用：

```typescript
// 开始任务
agent.prompt("Process the data");

// 准备后续任务（低优先级）
agent.followUp({
  role: "user",
  content: "Generate a report.",
  timestamp: Date.now(),
});

// 但发现需要紧急调整（高优先级）
agent.steer({
  role: "user",
  content: "Use the new dataset instead.",
  timestamp: Date.now(),
});

// 执行顺序:
// 1. 处理 steering 消息（使用新数据集）
// 2. 然后处理 follow-up 消息（生成报告）
```

## 相关页面

- [[pi-agent-core]]
- [[Steering 机制]]
- [[事件驱动架构]]
