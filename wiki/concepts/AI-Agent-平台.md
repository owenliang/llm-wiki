---
title: AI Agent 平台
category: 技术概念
tags: [ai-agent, platform, llm, automation]
---

# AI Agent 平台

AI Agent 平台是基于大语言模型（LLM）的自动化系统，能够执行复杂任务、与外部工具交互、并在多步骤流程中保持状态。

## 核心特征

1. **大模型驱动**: 以 LLM 为核心推理引擎
2. **工具调用**: 可调用外部 API、数据库、计算资源
3. **状态管理**: 维护对话历史和任务上下文
4. **多智能体协作**: 支持多个智能体分工协作
5. **可扩展性**: 通过 Skills/插件扩展能力

## 主流平台对比

| 平台 | 语言 | 框架 | 协议 | 特点 |
|------|------|------|------|------|
| [[CoPaw]] | Python | [[AgentScope]] | Apache 2.0 | 国内渠道丰富，官方路线图明确 |
| [[OpenClaw]] | TypeScript | [[pi-agent SDK]] | MIT | 国际渠道丰富，社区驱动 |

## 关键组件

- **Agent 框架**: 智能体的核心运行时
- **内存系统**: 长期和短期记忆管理
- **Skills Hub**: 技能/插件市场
- **通信渠道**: 与用户交互的接口（IM、邮件等）

## 相关页面

- [[CoPaw]]
- [[OpenClaw]]
- [[AgentScope]]
- [[多智能体协作]]
- [[Skills Hub]]
