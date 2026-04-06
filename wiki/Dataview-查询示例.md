# Dataview 查询示例

本页面提供常用的 Dataview 查询语句，方便在 Obsidian 中动态查看 wiki 内容。

## 安装 Dataview

1. Obsidian 设置 → 社区插件
2. 关闭安全模式
3. 浏览 → 搜索 "Dataview"
4. 安装并启用

---

## 常用查询

### 1. 查看所有源文档摘要

```dataview
table title, date, tags
from "wiki/sources"
sort date desc
```

### 2. 查看所有实体页面

```dataview
table type, tags
from "wiki/entities"
sort file.name asc
```

### 3. 查看所有概念页面

```dataview
table category, tags
from "wiki/concepts"
sort category asc
```

### 4. 查看最近更新的页面

```dataview
table title, date
from "wiki"
where date
sort date desc
limit 10
```

### 5. 按标签筛选文章

```dataview
table title, date
from "wiki/sources"
where contains(tags, "openclaw")
sort date desc
```

### 6. 统计各类页面数量

```dataview
TABLE WITHOUT ID
  "源文档: " + length(rows) as "数量"
FROM "wiki/sources"
GROUP BY true
```

或者分别查看：

```dataview
LIST
FROM "wiki/sources" OR "wiki/entities" OR "wiki/concepts" OR "wiki/synthesis"
GROUP BY file.folder
```

### 7. 查看所有综合分析

```dataview
table sources
from "wiki/synthesis"
sort file.name asc
```

### 8. 查找没有标签的页面

```dataview
table file.path
from "wiki"
where !tags
```

---

## 查询语法参考

| 语法 | 说明 |
|------|------|
| `from "路径"` | 指定查询范围 |
| `where 条件` | 过滤条件 |
| `sort 字段 方向` | 排序（asc/desc） |
| `limit 数量` | 限制结果数量 |
| `contains(字段, "值")` | 包含判断 |
| `!字段` | 不存在该字段 |

---

## 使用技巧

1. **实时更新**: Dataview 查询结果会自动随笔记更新
2. **嵌入查询**: 可以将查询嵌入到其他页面中
3. **复杂条件**: 支持 `and`、`or` 组合多个条件
4. **格式化**: 支持自定义输出格式

---

*本页面由 LLM Wiki 自动生成*
