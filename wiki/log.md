# Wiki 操作日志

按时间顺序记录所有对 wiki 的修改操作。

格式: `## [YYYY-MM-DD] 操作类型 | 描述`

---

## [2026-04-06] init | Wiki 初始化
- 创建目录结构
- 初始化索引和日志文件

## [2026-04-06] ingest | CoPaw vs OpenClaw 功能对比
- 源文档: https://agentscope.io/article/?id=copaw
- 保存原文: raw/articles/agentscope-copaw-vs-openclaw.md
- 创建源摘要: wiki/sources/agentscope-copaw-vs-openclaw.md
- 创建实体页面:
  - [[CoPaw]]
  - [[OpenClaw]]
  - [[AgentScope]]
- 创建概念页面:
  - [[AI-Agent-平台]]
  - [[Skills-Hub]]
  - [[大小模型协作]]
- 更新索引: wiki/index.md
- 发现矛盾: 无

## [2026-04-06] ingest | OpenClaw Pi 集成架构
- 源文档: https://docs.openclaw.ai/pi
- 保存原文: raw/articles/openclaw-pi-integration-architecture.md
- 创建源摘要: wiki/sources/openclaw-pi-integration-architecture.md
- 创建实体页面:
  - [[pi-coding-agent]]
  - [[pi-agent-core]]
  - [[Mario Zechner]]
- 更新实体页面:
  - [[OpenClaw]]: 添加嵌入式架构详情
- 创建概念页面:
  - [[嵌入式-Agent-架构]]
  - [[AgentSession]]
  - [[会话压缩-Compaction]]
- 更新索引: wiki/index.md
- 发现矛盾: 无（补充了 OpenClaw 的技术实现细节）

## [2026-04-06] synthesis | AI Agent 平台生态分析
- 基于源文档:
  - agentscope-copaw-vs-openclaw
  - openclaw-pi-integration-architecture
- 创建综合分析: wiki/synthesis/AI-Agent-平台生态分析.md
- 整合内容:
  - 平台对比总览
  - 技术架构分析（嵌入式 vs 传统）
  - 生态系统组件
  - 发展趋势
  - 选择建议
- 图片资源: 无（源文档无图片）
- 更新索引: wiki/index.md

## [2026-04-06] ingest | OpenClaw 官方文档
- 源文档: https://docs.openclaw.ai/
- 保存原文: raw/articles/openclaw-docs-home.md
- 创建源摘要: wiki/sources/openclaw-docs-home.md
- 更新实体页面:
  - [[OpenClaw]]: 补充定位、系统要求、Web 控制台、核心能力、快速开始、配置示例
- 创建概念页面:
  - [[自托管网关]]
- 图片资源: 无
- 更新索引: wiki/index.md

## [2026-04-06] ingest | pi-agent-core 官方文档
- 源文档: https://github.com/badlogic/pi-mono/tree/main/packages/agent
- 保存原文: raw/articles/pi-agent-core-docs.md
- 创建源摘要: wiki/sources/pi-agent-core-docs.md
- 更新实体页面:
  - [[pi-agent-core]]: 补充消息流架构、事件序列、核心方法、Steering/Follow-up 机制
- 创建概念页面:
  - [[Steering-机制]]
  - [[Follow-up-机制]]
- 图片资源: 无
- 更新索引: wiki/index.md

## [2026-04-06] ingest | Qwen3.6-Plus 官方博客
- 源文档: https://qwen.ai/blog?id=qwen3.6
- 保存原文: raw/articles/qwen3.6-plus-blog.md
- 创建源摘要: wiki/sources/qwen3.6-plus-blog.md
- 创建实体页面:
  - [[Qwen]] - 阿里巴巴通义千问大语言模型系列
  - [[QwenTeam]] - 阿里巴巴通义千问开发团队
  - [[阿里云百炼]] - 阿里云大模型服务平台
- 创建概念页面:
  - [[代码智能体]] - 能够编写、修改、调试代码的AI智能体
  - [[多模态推理]] - 结合文本、图像、视频等多种模态进行推理
  - [[长上下文窗口]] - 支持处理超长文本序列的模型能力
- 更新实体页面:
  - [[OpenClaw]]: 添加 Qwen3.6-Plus 支持信息
- 图片资源: 无
- 更新索引: wiki/index.md
- 发现矛盾: 无（补充了 Qwen3.6-Plus 与 OpenClaw 的集成信息）

