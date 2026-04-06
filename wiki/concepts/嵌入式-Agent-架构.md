---
title: 嵌入式 Agent 架构
category: 架构模式
tags: [agent-architecture, embedded, sdk-integration]
---

# 嵌入式 Agent 架构

嵌入式 Agent 架构是指将 Agent SDK 直接集成到应用程序中，而非通过子进程或 RPC 调用外部服务。

## 架构对比

| 特性 | 嵌入式架构 | 子进程/RPC |
|------|------------|------------|
| 生命周期控制 | 完全控制 | 受限 |
| 工具注入 | 动态自定义 | 预定义 |
| 系统提示词 | 按上下文定制 | 固定 |
| 会话持久化 | 灵活（分支/压缩） | 基础 |
| 多账户支持 | 内置故障转移 | 需额外实现 |
| 模型切换 | 提供商无关 | 通常绑定 |
| 性能开销 | 低（同进程） | 高（进程间通信）|
| 部署复杂度 | 依赖管理 | 服务编排 |

## 实现示例

以 [[OpenClaw]] 使用 [[pi-coding-agent]] 为例：

```typescript
import { createAgentSession } from "@mariozechner/pi-coding-agent";

// 直接实例化，非子进程
const { session } = await createAgentSession({
  model,
  tools: builtInTools,
  customTools: allCustomTools,
  // ...
});

// 完全控制事件处理
const subscription = subscribeEmbeddedPiSession({
  session,
  onBlockReply: async (payload) => {
    await sendToChannel(payload.text);
  },
});
```

## 优势

1. **精细控制**: 完全掌控会话生命周期
2. **动态扩展**: 运行时注入自定义工具
3. **上下文感知**: 根据渠道/用户定制行为
4. **性能优化**: 避免进程间通信开销

## 挑战

1. **依赖管理**: SDK 版本兼容性
2. **资源占用**: 同进程内存共享
3. **错误隔离**: 需要额外机制隔离故障

## 相关页面

- [[OpenClaw]]
- [[pi-coding-agent]]
- [[AgentSession]]
