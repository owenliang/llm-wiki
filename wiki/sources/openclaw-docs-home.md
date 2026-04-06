---
title: OpenClaw 官方文档
date: 2026-04-06
source: raw/articles/openclaw-docs-home.md
url: https://docs.openclaw.ai/
doc_type: 官方文档
tags: [openclaw, documentation, gateway, self-hosted]
---

# OpenClaw 官方文档

## 摘要

OpenClaw 是一个自托管的 AI Agent 网关，连接 Discord、Google Chat、iMessage、Matrix、Microsoft Teams、Signal、Slack、Telegram、WhatsApp、Zalo 等多种聊天应用到 AI coding agents（如 Pi）。

## 关键要点

1. **自托管网关**: 运行在自己的硬件上，数据自主控制
2. **多渠道支持**: 单一 Gateway 进程同时服务多个内置渠道和插件渠道
3. **Agent 原生**: 专为 coding agents 设计，支持工具使用、会话、记忆和多智能体路由
4. **开源**: MIT 协议，社区驱动
5. **系统要求**: Node 24（推荐）或 Node 22 LTS (22.14+)
6. **快速启动**: `npm install -g openclaw@latest` + `openclaw onboard`
7. **Web 控制台**: 默认 http://127.0.0.1:18789/
8. **移动节点**: 支持 iOS 和 Android 节点配对

## 核心能力

- **多渠道网关**: Discord、iMessage、Signal、Slack、Telegram、WhatsApp、WebChat 等
- **插件渠道**: Matrix、Nostr、Twitch、Zalo 等
- **多智能体路由**: 按智能体、工作区或发送者隔离会话
- **媒体支持**: 发送和接收图片、音频、文档
- **Web 控制 UI**: 浏览器仪表板
- **移动节点**: Canvas、相机和语音工作流

## 配置

配置文件: `~/.openclaw/openclaw.json`

默认使用捆绑的 Pi 二进制文件以 RPC 模式运行，支持按发送者隔离会话。

## 提取的实体

- [[OpenClaw]]
- [[Pi]] (AI coding agent)

## 提取的概念

- [[自托管网关]]
- [[多渠道路由]]
- [[多智能体会话隔离]]
- [[移动节点]]

## 相关页面

- [[OpenClaw]]
- [[pi-coding-agent]]
