---
title: CoPaw
type: AI Agent 平台
developer: AgentScope Team
license: Apache 2.0
language: Python
tags: [agentscope, ai-agent, python, open-source]
---

# CoPaw

CoPaw 是基于 [[AgentScope]] 框架开发的开源 AI Agent 平台，由 AgentScope Team 维护。

## 基本信息

- **开发语言**: Python
- **核心框架**: [[AgentScope]] + [[AgentScope-Runtime]]
- **开源协议**: Apache 2.0（商业友好）
- **内存系统**: 基于 AgentScope-AI/ReMe 的文件型内存系统

## 安装方式

1. **一键脚本安装**（推荐）
2. **pip 安装**: `pip install copaw`
3. **Docker 安装**: `agentscope/copaw:latest`（带 Web 控制台）

## 支持平台

- macOS
- Linux
- Windows（原生支持 PowerShell/CMD）

## 本地模型支持

安装时通过 `--extras` 参数按需集成：
- `--extras llamacpp`: 跨平台支持
- `--extras mlx`: Apple Silicon 专用

## 通信渠道

- 国内: 钉钉、飞书、QQ
- 国际: Discord、iMessage
- 可扩展架构支持更多渠道

## 技能生态

支持从多个 Skills Hub 安装：
- https://skills.sh/
- https://clawhub.ai/
- https://skillsmp.com/
- https://github.com/

## 官方路线图

- **工具沙箱** (tool-sandbox): 增强安全性
- **云原生架构**: 通过 AgentScope Runtime 扩展云计算、存储和云服务生态
- **大小模型协作**: 轻量本地 LLM 处理隐私数据，复杂任务路由到云端大模型
- **本地模型训练**: 针对 CoPaw 核心技能训练可本地部署的 LLM
- **多模态交互**: 支持语音和视频交互
- **技能生态**: 持续丰富 AgentScope-Skills 仓库

## 相关页面

- [[AgentScope]]
- [[OpenClaw]]
- [[AgentScope-Runtime]]
- [[ReMe]]
