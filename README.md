# LLM Wiki - 全新知识库

欢迎使用基于LLM的智能知识库系统！这是一个增量式知识库构建工具，能够持续构建和维护一个结构化的、相互关联的知识库。

## 开始使用

### 1. 添加新内容
将您想要整合到知识库的新文章或内容放在 `raw/articles/` 目录下，然后使用以下命令处理：

```bash
node .claude/skills/llm-wiki/llm-wiki-engine.mjs ingest raw/articles/your-content.md
```

### 2. 查询知识库
使用技能查询功能搜索您的知识库：

```bash
/llm-wiki 搜索<关键词>
/llm-wiki <问题>
```

### 3. 维护知识库
定期运行健康检查：

```bash
node .claude/skills/llm-wiki/llm-wiki-engine.mjs lint
```

## 目录结构

- `raw/articles/` - 原始资料（用户放入，LLM只读）
- `wiki/index.md` - 内容索引目录
- `wiki/log.md` - 操作日志（时间线）
- `wiki/sources/` - 源文档摘要
- `wiki/entities/` - 实体页面（人物、组织、产品等）
- `wiki/concepts/` - 概念页面（理论、方法、术语等）
- `wiki/synthesis/` - 综合分析页面

## 知识库已清空

当前知识库已重置为干净状态，您可以开始添加您的专属知识内容。

## 核心功能

### 添加新文章
- 自动分析文章内容
- 提取关键实体和概念
- 创建结构化摘要页面
- 更新知识库索引

### 查询功能
- 语义搜索
- 关键词检索
- 交叉引用链接

### 维护功能
- 健康检查
- 孤立页面检测
- 引用完整性检查