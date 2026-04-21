# LLM Wiki 技能

基于LLM Wiki模式实现的完整知识库管理系统，遵循三层架构设计：原始源、维基层和模式层。

## 核心理念

实现LLM Wiki模式：不是在查询时从原始文档中检索，而是让LLM**增量构建和维护一个持久的维基**——一个结构化、互连的Markdown文件集合，位于您和原始源之间。

与传统RAG不同，知识被编译一次然后保持最新，而不是在每次查询时重新推导。

## 三层架构

### 1. 原始源层 (Raw Sources)
- 位于 `raw/` 目录
- 包含源文档，只读不修改
- 用户负责提供和管理源文档

### 2. 维基层 (The Wiki)
- 位于 `wiki/` 目录
- 包含LLM生成的Markdown文件
- 由LLM完全拥有和维护

### 3. 模式层 (The Schema)
- 位于 `CLAUDE.md` 文件
- 定义维基结构和操作约定

## 主要功能

### Ingest（摄取）操作
```bash
node .claude/skills/llm-wiki/llm-wiki-engine-enhanced.mjs ingest <source-file-path>
```

处理新源文档并将其整合到知识库中：
- 从 `raw/articles/` 读取源文档
- 在 `wiki/sources/` 创建带YAML frontmatter的源摘要页面
- 识别并更新/创建实体和概念页面
- 更新交叉引用和索引（按规范格式）
- 记录操作日志（按规范格式）
- 可选：更新QMD索引

### Query（查询）操作
```bash
node .claude/skills/llm-wiki/llm-wiki-engine-enhanced.mjs query <search-term>
```

查询知识库：
- 优先使用QMD进行语义搜索
- 回退到索引搜索
- 返回相关页面和内容

### Lint（检查）操作
```bash
node .claude/skills/llm-wiki/llm-wiki-engine-enhanced.mjs lint
```

检查维基健康状况：
- 查找孤立页面
- 检查缺失的交叉引用
- 检查过时声明
- 生成健康报告
- 记录到日志

## 文件结构

- `SKILL.md` - 技能定义和说明
- `llm-wiki-engine-enhanced.mjs` - 增强版核心处理引擎
- `README.md` - 使用说明
- `CLAUDE.md` - 模式定义（在项目根目录）

## 使用流程

1. 将新源文档放入 `raw/articles/` 目录
2. 运行 ingest 命令处理源文档
3. 检查生成的维基页面和更新的索引
4. 定期运行 lint 命令检查维基健康状况
5. 使用 query 命令搜索知识库

## 目录结构

```
llm-wiki/
├── raw/                    # 原始资料（用户放入，LLM 只读）
│   ├── articles/
│   └── assets/            # 图片等附件
├── wiki/                   # LLM 维护的知识库
│   ├── index.md           # 内容索引目录
│   ├── log.md             # 操作日志（时间线）
│   ├── sources/           # 源文档摘要
│   ├── entities/          # 实体页面（人物、组织、产品等）
│   ├── concepts/          # 概念页面（理论、方法、术语等）
│   └── synthesis/         # 综合分析页面
└── .claude/skills/llm-wiki/  # 本 skill
```

## 增强特性

### YAML Frontmatter 支持
- 所有页面支持YAML frontmatter元数据
- 包括标题、日期、来源、标签等信息

### QMD 集成
- 支持使用QMD进行语义搜索
- 自动更新QMD索引

### 改进的实体/概念提取
- 更精确的实体识别算法
- 更准确的概念提取逻辑
- 支持中英文混合内容

### 规范化索引格式
- 按照表格格式组织索引
- 包含摘要和日期信息