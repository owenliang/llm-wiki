# LLM Wiki 项目使用手册

本项目是一个基于 LLM 的智能知识库管理系统，结合 Qoder Agent、Obsidian 和 QMD 语义检索工具，实现知识的自动沉淀与高效检索。

## 项目起源

本项目基于 [Karpathy 的 LLM Wiki 理念](https://gist.githubusercontent.com/karpathy/442a6bf555914893e9891c11519de94f/raw/ac46de1ad27f92b28ac95459c782c07f6b8c964a/llm-wiki.md) 构建，核心理念是：

> LLM Wiki 是一种增量式知识库构建模式，与传统 RAG 不同，它会**持续构建和维护**一个结构化的、相互关联的 markdown 文件集合，知识是累积的而非每次都重新检索。

## 项目架构

```
llm-wiki/
├── .qoder/skills/llm-wiki/   # Qoder Agent Skill 定义
├── raw/                       # 原始资料（用户放入，LLM 只读）
│   ├── articles/             # 原始文章
│   └── assets/               # 图片等附件
├── wiki/                      # LLM 维护的结构化知识库
│   ├── index.md              # 内容索引目录
│   ├── log.md                # 操作日志
│   ├── sources/              # 源文档摘要
│   ├── entities/             # 实体页面（人物、组织、产品等）
│   ├── concepts/             # 概念页面（理论、方法、术语等）
│   └── synthesis/            # 综合分析页面
└── README.md                  # 本使用手册
```

## 核心组件

### 1. Qoder Agent + LLM Wiki Skill

用于自动分析新文章并沉淀到结构化 wiki 中。

#### 安装 Skill

**方式 1 - 使用 create-skill 命令（推荐）**：

```bash
# 在项目根目录执行
cd c:\Users\liangdong\Documents\VsCode\llm-wiki

# 使用 create-skill 创建 skill
/create-skill

# 根据提示输入：
# - Skill 名称: llm-wiki
# - 描述: 基于 LLM 的智能知识库管理工具，接收用户传入的新文章或内容，自动提取关键信息并整合到现有 wiki 中
# - 参考: https://gist.githubusercontent.com/karpathy/442a6bf555914893e9891c11519de94f/raw/ac46de1ad27f92b28ac95459c782c07f6b8c964a/llm-wiki.md
```

**方式 2 - 手动创建**：

```bash
# 创建 skill 目录
mkdir -p .qoder/skills/llm-wiki

# 复制 SKILL.md 到该目录
cp SKILL.md .qoder/skills/llm-wiki/
```

Skill 文件位置：`.qoder/skills/llm-wiki/SKILL.md`

#### Skill 功能

- **接收新文章**：将原始内容保存到 `raw/articles/`，自动分析并更新 wiki
- **查询知识库**：基于 wiki 内容回答用户问题
- **健康检查**：扫描所有页面，检查矛盾、过时声明、孤立页面等

#### 使用方式

本 Skill 支持 `/llm-wiki` 命令前缀，提供两种主要功能：

**1. 添加新文章**
```
/llm-wiki <文章链接>
```
示例：
- `/llm-wiki https://qwen.ai/blog?id=qwen3.6`
- `/llm-wiki https://github.com/user/repo/blob/main/docs/guide.md`

**2. 搜索知识库**
```
/llm-wiki 搜索<关键词>
/llm-wiki <问题>
```
示例：
- `/llm-wiki 搜索Agent平台`
- `/llm-wiki Agent平台有哪些`
- `/llm-wiki CoPaw和OpenClaw的区别`

**自然语言方式**（不使用命令前缀）：
- `"添加这篇文章"` + 文章内容 → 自动分析并沉淀到 wiki
- `"查询知识库"` + 问题 → 基于 wiki 内容回答
- `"检查 wiki"` 或 `"lint"` → 执行健康检查

### 2. Obsidian

用于可视化浏览和编辑 wiki 内容。

#### 配置步骤

1. **安装 Obsidian**
   - 下载地址：https://obsidian.md/
   - 安装并启动

2. **打开 Vault**
   - 选择 `打开本地仓库`
   - 选择 `llm-wiki` 项目根目录

3. **启用核心插件**（可选但推荐）
   - 设置 → 核心插件 → 启用以下插件：
     - 图谱（Graph view）
     - 反向链接（Backlinks）
     - 出链（Outgoing links）

4. **查看 Wiki**
   - 打开 `wiki/index.md` 查看内容索引
   - 点击 `[[页面名]]` 链接浏览关联内容
   - 使用图谱视图查看知识关联

### 3. QMD（Quick Markdown Search）

用于命令行语义检索 wiki 内容。

#### 安装

```bash
# 全局安装（推荐）
npm install -g @tobilu/qmd

# 或使用 bun
bun install -g @tobilu/qmd

# 或直接运行，无需安装
npx @tobilu/qmd ...
bunx @tobilu/qmd ...
```

#### 配置

1. **添加集合（Collection）**

```bash
# 将 wiki 目录添加到 QMD 索引
qmd collection add llm-wiki ./wiki
```

2. **更新索引和嵌入**

当 wiki 内容有更新时，需要执行以下两个命令：

```bash
# 1. 更新索引 - 扫描文件系统，检测新增/修改/删除的文件
qmd update

# 2. 生成向量嵌入 - 用于语义搜索
qmd embed

# 强制重新生成所有嵌入（即使文件未改变）
qmd embed -f
```

#### 常用命令

```bash
# 语义搜索（推荐）- 自动扩展 + 重排序
qmd query "Agent 平台对比"

# 纯向量相似度搜索
qmd vsearch "嵌入式架构"

# 全文关键词搜索（BM25）
qmd search "OpenClaw"

# 查看索引状态
qmd status

# 更新索引（扫描文件系统，检测新增/修改/删除的文件）
qmd update

# 生成向量嵌入（用于语义搜索）
qmd embed

# 查看帮助
qmd --help
```

#### 高级查询语法

```bash
# 混合查询：指定 lexical 和 vector 搜索
qmd query $'lex: CAP theorem\nvec: consistency'

# 带引号的精确匹配
qmd query 'lex: "exact matches" sports -baseball'

# Hyde 查询（假设文档查询）
qmd query $'hyde: Hypothetical answer text'

# 限制结果数量
qmd query "Agent 平台" -n 10

# 输出完整文档
qmd query "Agent 平台" --full

# 输出为 JSON 格式
qmd query "Agent 平台" --json
```

## 完整工作流程

### 方式 1：添加新文章（/llm-wiki 命令）

```bash
# 第 1 步：使用 /llm-wiki 命令添加文章
/llm-wiki https://qwen.ai/blog?id=qwen3.6

# 第 2 步：Agent 自动执行知识沉淀
#    - 获取文章内容
#    - 保存原文到 raw/articles/
#    - 分析内容，提取实体、概念
#    - 创建/更新 wiki/sources/ 摘要
#    - 更新 wiki/entities/ 实体页面
#    - 更新 wiki/concepts/ 概念页面
#    - 更新 wiki/index.md 索引
#    - 记录到 wiki/log.md
```

### 方式 2：搜索知识点（/llm-wiki 命令）

```bash
# 使用 /llm-wiki 命令搜索知识库
/llm-wiki 搜索Agent平台
/llm-wiki Agent平台有哪些
/llm-wiki CoPaw和OpenClaw的区别

# Agent 执行流程：
#    - 执行 qmd update 更新索引
#    - 执行 qmd embed 生成向量嵌入
#    - 执行 qmd query 进行语义搜索
#    - 根据搜索结果读取相关 wiki 页面
#    - 综合信息生成带引用的回答
```

### 方式 3：可视化浏览（Obsidian）

```bash
# 第 1 步：打开 Obsidian
# 第 2 步：打开 llm-wiki Vault
# 第 3 步：导航到 wiki/index.md

# 浏览内容：
#    - 源文档摘要：查看所有文章的索引
#    - 实体：查看人物、组织、产品等实体
#    - 概念：查看技术概念和术语
#    - 综合分析：查看跨文档的主题分析

# 第 4 步：点击 [[链接]] 跳转到相关页面
# 第 5 步：使用图谱视图查看知识关联
```

### 方式 4：命令行语义检索（QMD）

```bash
# 更新索引（当 wiki 内容有变化时）
qmd update
qmd embed

# 语义搜索
qmd query "Agent 平台有哪些"
qmd query "CoPaw 和 OpenClaw 的区别"

# 查看搜索结果并阅读相关页面
qmd get "wiki/sources/qwen3.6-plus-blog.md" --full
```

## 典型使用场景示例

### 场景 A：研究新技术并沉淀

```bash
# 1. 发现一篇好文章
/llm-wiki https://example.com/new-tech-article

# 2. 文章自动沉淀到 wiki

# 3. 在 Obsidian 中查看新添加的内容
#    - 打开 wiki/index.md
#    - 查看新文章的摘要
#    - 点击实体链接了解相关概念

# 4. 后续搜索相关知识
/llm-wiki 搜索new-tech
```

### 场景 B：对比分析多个来源

```bash
# 1. 添加多篇文章
/llm-wiki https://source1.com/article1
/llm-wiki https://source2.com/article2
/llm-wiki https://source3.com/article3

# 2. 在 Obsidian 中查看综合分析
#    - 打开 wiki/synthesis/ 下的综合分析页面
#    - 查看跨文档的观点整合

# 3. 搜索特定主题
/llm-wiki 对比分析主题
```

### 场景 C：快速查找知识点

```bash
# 方式 1：命令行快速搜索
qmd query "某个概念的定义"

# 方式 2：Agent 对话搜索
/llm-wiki 某个概念是什么

# 方式 3：Obsidian 图谱浏览
#    - 打开图谱视图
#    - 搜索概念名称
#    - 浏览关联的知识节点
```

## 目录规范

### 原始资料层 (raw/)

- `raw/articles/`：存放原始文章，文件名使用小写，空格用 `-` 替换
- `raw/assets/`：存放图片等附件，命名格式：`{文章名}-{序号}.{扩展名}`

### Wiki 层 (wiki/)

- `wiki/sources/`：源文档摘要，每个原始文章对应一个摘要页面
- `wiki/entities/`：实体页面（人物、组织、产品等）
- `wiki/concepts/`：概念页面（理论、方法、术语等）
- `wiki/synthesis/`：综合分析页面（跨文档的主题分析）
- `wiki/index.md`：内容索引目录（必须保持更新）
- `wiki/log.md`：操作日志（时间线记录）

## 命名规范

- 文件名使用小写，空格用 `-` 替换
- 实体页面：`wiki/entities/实体名.md`
- 概念页面：`wiki/concepts/概念名.md`
- 源摘要：`wiki/sources/原始文件名.md`
- 内部链接使用 Obsidian 格式：`[[页面名]]`

## 故障排除

### QMD 搜索无结果

```bash
# 检查索引状态
qmd status

# 重新生成嵌入
qmd embed -f

# 检查集合是否正确添加
qmd collection list
```

### Obsidian 链接无法跳转

- 确保文件存在且命名正确（区分大小写）
- 检查 `[[链接名]]` 是否与文件名完全匹配
- 重新加载 Obsidian（Ctrl+R）

### Skill 未生效

- 检查 `.qoder/skills/llm-wiki/SKILL.md` 是否存在
- 重启 Qoder Agent
- 确认 Skill 格式正确（YAML frontmatter + Markdown 内容）

## 相关链接

- [QMD 文档](https://github.com/.../qmd)
- [Obsidian 帮助](https://help.obsidian.md/)
- [LLM Wiki 理念](https://github.com/karpathy/llm-wiki)
