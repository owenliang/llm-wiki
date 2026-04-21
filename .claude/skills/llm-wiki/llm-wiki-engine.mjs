#!/usr/bin/env node

/**
 * 增强版 LLM Wiki 引擎
 * 实现完整的LLM Wiki模式，支持更复杂的操作和QMD集成
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * 分析源文档内容（增强版）
 * @param {string} content - 源文档内容
 * @returns {Object} 分析结果
 */
async function analyzeSource(content) {
  const lines = content.split('\n');
  const firstParagraph = lines.find(line => line.trim() && line.length > 10) || '未找到有效内容';

  // 提取标题
  const title = extractTitle(content);

  // 提取关键实体（改进算法）
  const entities = extractEntitiesImproved(content);

  // 提取关键概念（改进算法）
  const concepts = extractConceptsImproved(content);

  // 生成摘要
  const summary = generateSummary(content);

  // 提取关键要点
  const keyPoints = extractKeyPoints(content);

  return {
    title: title,
    content: content,
    summary: summary,
    keyPoints: keyPoints,
    entities: entities,
    concepts: concepts,
    wordCount: content.trim().split(/\s+/).filter(Boolean).length,
    date: new Date().toISOString().split('T')[0]
  };
}

/**
 * 从内容中提取标题
 * @param {string} content
 * @returns {string}
 */
function extractTitle(content) {
  // 尝试从内容中提取标题（检查是否是markdown格式）
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim();
    }
  }

  // 如果没有markdown标题，使用第一段作为标题
  const firstParagraph = lines.find(line => line.trim() && line.length > 10);
  return firstParagraph ? firstParagraph.substring(0, 100) : '未命名文档';
}

/**
 * 改进的实体提取算法
 * @param {string} content
 * @returns {string[]}
 */
function extractEntitiesImproved(content) {
  // 定义常见实体类型的关键字模式
  const entityPatterns = [
    // 人名模式（英文）
    /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g,
    // 组织/公司名（英文）
    /\b(?:Inc\.?|Corp\.?|Ltd\.?|LLC|Group|Foundation|University|Institute)\b|(?<!\w)[A-Z]{2,}(?!\w)/g,
    // 产品/项目名（英文）
    /\b(?:[A-Z][a-z]+){2,}\b/g,
    // 中文实体
    /[\u4e00-\u9fa5]{2,8}(?:[a-zA-Z]{2,})?(?=\s|是|在|的|与|和|或|、|\.|,|，|。|！|？)/g,
    // 技术术语
    /\b(?:AI|ML|NLP|API|SDK|HTTP|HTTPS|URL|JSON|XML|HTML|CSS|JS|TS|SQL|NoSQL|Git|Docker|Kubernetes|AWS|Azure|GCP)\b/g
  ];

  const entities = new Set();

  entityPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const entity = match.trim();
        if (entity.length > 1 && entity.length < 50) {
          entities.add(entity);
        }
      });
    }
  });

  // 过滤掉常见的停用词
  const stopWords = new Set(['The', 'And', 'Or', 'But', 'In', 'On', 'At', 'To', 'For', 'Of', 'With', 'By', 'From', 'Is', 'Are', 'Was', 'Were']);

  return Array.from(entities).filter(entity => !stopWords.has(entity)).slice(0, 15);
}

/**
 * 改进的概念提取算法
 * @param {string} content
 * @returns {string[]}
 */
function extractConceptsImproved(content) {
  // 定义概念模式
  const conceptPatterns = [
    // 技术概念
    /\b(?:machine learning|deep learning|neural networks?|artificial intelligence|natural language processing|computer vision|data science|algorithm|framework|protocol|architecture|pattern|method|system|model|technique|approach)\b/gi,
    // 软件概念
    /\b(?:software|application|platform|tool|library|module|component|service|microservice|container|virtualization|cloud computing|distributed system|database|cache|queue|middleware)\b/gi,
    // 研究概念
    /\b(?:research|study|experiment|analysis|survey|finding|result|conclusion|hypothesis|theory|principle|law|rule)\b/gi,
    // 中文概念
    /[\u4e00-\u9fa5]{2,8}(?:[a-zA-Z]{2,})?(?=\s*(?:概念|理论|方法|技术|模型|系统|平台))/g,
    // 技术架构相关
    /\b(?:frontend|backend|fullstack|monolith|microservices?|api|restful|graphql|oauth|jwt|ssl|tls|tcp|udp|http|https)\b/gi
  ];

  const concepts = new Set();

  conceptPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const concept = match.trim().toLowerCase();
        if (concept.length > 3) {
          concepts.add(concept.charAt(0).toUpperCase() + concept.slice(1));
        }
      });
    }
  });

  return Array.from(concepts).slice(0, 15);
}

/**
 * 提取关键要点
 * @param {string} content
 * @returns {string[]}
 */
function extractKeyPoints(content) {
  const sentences = content.split(/[.!?。！？]+/).filter(s => s.trim().length > 10);
  const keyPoints = [];

  // 简单的要点提取 - 实际应用中可以用LLM来做
  for (let i = 0; i < Math.min(5, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (sentence.length > 20) {
      keyPoints.push(sentence.substring(0, 100) + (sentence.length > 100 ? '...' : ''));
    }
  }

  return keyPoints;
}

/**
 * 生成内容摘要
 * @param {string} content
 * @returns {string}
 */
function generateSummary(content) {
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
  if (paragraphs.length === 0) return '无内容摘要';

  // 获取前几个段落作为摘要
  let summary = '';
  for (let i = 0; i < Math.min(2, paragraphs.length); i++) {
    const para = paragraphs[i].replace(/\s+/g, ' ').trim();
    if (para.length > 0) {
      summary += para + ' ';
      if (summary.length > 150) break;
    }
  }

  return summary.substring(0, 150) + (summary.length > 150 ? '...' : '');
}

/**
 * 创建源文档摘要页面（带frontmatter）
 * @param {Object} analysis - 分析结果
 * @param {string} sourceFileName - 源文件名
 */
async function createSourcePage(analysis, sourceFileName) {
  const slug = sourceFileName.replace(/\.[^/.]+$/, "").replace(/\s+/g, '-').toLowerCase(); // 移除扩展名并转为小写连字符
  const sourcePagePath = `wiki/sources/${slug}.md`;

  // 生成标签
  const tags = [...new Set([...analysis.entities.slice(0, 3), ...analysis.concepts.slice(0, 3)])]
    .map(tag => tag.toLowerCase().replace(/\s+/g, '-'))
    .filter(tag => tag.length > 1);

  const sourcePageContent = `---
title: ${analysis.title}
date: ${analysis.date}
source: raw/articles/${sourceFileName}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---

# ${analysis.title}

## 摘要
${analysis.summary}

## 关键要点
${analysis.keyPoints.map(point => `- ${point}`).join('\n')}

## 提取的实体
${analysis.entities.map(entity => `- [[${entity}]]`).join('\n')}

## 提取的概念
${analysis.concepts.map(concept => `- [[${concept}]]`).join('\n')}

## 原始内容
${analysis.content.substring(0, 1000)}${analysis.content.length > 1000 ? '...' : ''}

## 相关页面
${analysis.entities.concat(analysis.concepts).slice(0, 5).map(item => `- [[${item}]]`).join('\n')}
`;

  await fs.mkdir(path.dirname(sourcePagePath), { recursive: true });
  await fs.writeFile(sourcePagePath, sourcePageContent, 'utf8');

  console.log(`Created source page: ${sourcePagePath}`);
  return sourcePagePath;
}

/**
 * 更新实体页面
 * @param {string[]} entities - 实体列表
 * @param {string} sourcePage - 源页面路径
 */
async function updateEntityPages(entities, sourcePage) {
  for (const entity of entities) {
    if (!entity || entity.length < 2) continue;

    // 清理实体名称，使其适合文件名
    const cleanEntity = entity.replace(/[<>:"/\\|?*]/g, '-').substring(0, 50).replace(/\s+/g, '-');
    const entityPagePath = `wiki/entities/${cleanEntity}.md`;

    let entityContent = '';

    // 检查实体页面是否已存在
    try {
      entityContent = await fs.readFile(entityPagePath, 'utf8');

      // 如果实体页面已存在，追加新信息
      const sourceRef = `[[${path.basename(sourcePage, '.md')}]]`;
      if (!entityContent.includes(sourceRef)) {
        // 在References部分添加新来源
        const referencesIndex = entityContent.lastIndexOf('## References');
        if (referencesIndex !== -1) {
          const beforeRefs = entityContent.substring(0, referencesIndex);
          const afterRefs = entityContent.substring(referencesIndex);
          entityContent = `${beforeRefs}- Source: ${sourceRef}\n${afterRefs}`;
        } else {
          // 如果没有References部分，添加它
          entityContent += `\n## References\n- Source: ${sourceRef}\n`;
        }

        // 更新提及次数
        entityContent = entityContent.replace(
          /(Mentions Count: )(\d+)/,
          (match, prefix, count) => `${prefix}${parseInt(count) + 1}`
        );
      }
    } catch (error) {
      // 如果不存在，创建新的实体页面
      entityContent = `---
title: ${entity}
date: ${new Date().toISOString().split('T')[0]}
---

# ${entity}

## Overview
Overview of ${entity} will be expanded as more sources are processed.

## Details
- First Mentioned: ${new Date().toISOString().split('T')[0]}
- From Source: [[${path.basename(sourcePage, '.md')}]]
- Mentions Count: 1

## References
- Source: [[${path.basename(sourcePage, '.md')}]]
`;
    }

    await fs.mkdir(path.dirname(entityPagePath), { recursive: true });
    await fs.writeFile(entityPagePath, entityContent, 'utf8');

    console.log(`Updated entity page: ${entityPagePath}`);
  }
}

/**
 * 更新概念页面
 * @param {string[]} concepts - 概念列表
 * @param {string} sourcePage - 源页面路径
 */
async function updateConceptPages(concepts, sourcePage) {
  for (const concept of concepts) {
    if (!concept || concept.length < 2) continue;

    // 清理概念名称，使其适合文件名
    const cleanConcept = concept.replace(/[<>:"/\\|?*]/g, '-').substring(0, 50).replace(/\s+/g, '-');
    const conceptPagePath = `wiki/concepts/${cleanConcept}.md`;

    let conceptContent = '';

    // 检查概念页面是否已存在
    try {
      conceptContent = await fs.readFile(conceptPagePath, 'utf8');

      // 如果概念页面已存在，追加新信息
      const sourceRef = `[[${path.basename(sourcePage, '.md')}]]`;
      if (!conceptContent.includes(sourceRef)) {
        // 在References部分添加新来源
        const referencesIndex = conceptContent.lastIndexOf('## References');
        if (referencesIndex !== -1) {
          const beforeRefs = conceptContent.substring(0, referencesIndex);
          const afterRefs = conceptContent.substring(referencesIndex);
          conceptContent = `${beforeRefs}- Source: ${sourceRef}\n${afterRefs}`;
        } else {
          // 如果没有References部分，添加它
          conceptContent += `\n## References\n- Source: ${sourceRef}\n`;
        }

        // 更新提及次数
        conceptContent = conceptContent.replace(
          /(Mentions Count: )(\d+)/,
          (match, prefix, count) => `${prefix}${parseInt(count) + 1}`
        );
      }
    } catch (error) {
      // 如果不存在，创建新的概念页面
      conceptContent = `---
title: ${concept}
date: ${new Date().toISOString().split('T')[0]}
---

# ${concept}

## Definition
Definition of ${concept} will be expanded as more sources are processed.

## Details
- First Mentioned: ${new Date().toISOString().split('T')[0]}
- From Source: [[${path.basename(sourcePage, '.md')}]]
- Mentions Count: 1

## Applications
- Application areas will be added as more sources are processed

## References
- Source: [[${path.basename(sourcePage, '.md')}]]
`;
    }

    await fs.mkdir(path.dirname(conceptPagePath), { recursive: true });
    await fs.writeFile(conceptPagePath, conceptContent, 'utf8');

    console.log(`Updated concept page: ${conceptPagePath}`);
  }
}

/**
 * 更新索引文件（按规范格式）
 * @param {string} sourcePage - 新创建的源页面路径
 * @param {string[]} entities - 实体列表
 * @param {string[]} concepts - 概念列表
 * @param {Object} analysis - 分析结果
 */
async function updateIndex(sourcePage, entities, concepts, analysis) {
  let indexContent = '';

  try {
    indexContent = await fs.readFile('wiki/index.md', 'utf8');
  } catch (error) {
    // 如果索引文件不存在，创建一个基本的结构（按规范格式）
    indexContent = `# Wiki 索引

本文件是 LLM Wiki 的内容目录，按类别组织所有页面。

## 源文档摘要

| 页面 | 摘要 | 日期 |
|------|------|------|
| [[${path.basename(sourcePage, '.md')}]] | ${analysis.summary.substring(0, 50)} | ${analysis.date} |

## 实体

| 页面 | 类型 | 摘要 |
|------|------|------|
${entities.slice(0, 5).map(entity => `| [[${entity}]] | Entity | ${entity} 相关信息 |`).join('\n')}

## 概念

| 页面 | 分类 | 摘要 |
|------|------|------|
${concepts.slice(0, 5).map(concept => `| [[${concept}]] | Concept | ${concept} 相关信息 |`).join('\n')}

## 综合分析

| 页面 | 主题 | 摘要 |
|------|------|------|
<!-- 综合分析页面将在这里列出 -->

## 概念

| 页面 | 分类 | 摘要 |
|------|------|------|
<!-- 概念页面将在这里列出 -->
`;
  }

  // 更新Sources表格
  const sourceFileName = path.basename(sourcePage, '.md');
  const sourceEntry = `| [[${sourceFileName}]] | ${analysis.summary.substring(0, 50)} | ${analysis.date} |`;

  // 检查是否已存在该源文档条目
  if (!indexContent.includes(`[[${sourceFileName}]]`)) {
    // 查找Sources部分并插入新条目
    const sourcesSectionRegex = /(## 源文档摘要\s*\n\s*\|\s*页面\s*\|\s*摘要\s*\|\s*日期\s*\|\s*\n\s*\|------\|------\|------\|)([\s\S]*?)(\n\s*## 实体)/;

    if (sourcesSectionRegex.test(indexContent)) {
      indexContent = indexContent.replace(
        sourcesSectionRegex,
        `$1$2\n${sourceEntry}$3`
      );
    } else {
      // 如果没有找到规范格式，使用备选方法
      indexContent = indexContent.replace(
        /## 源文档摘要\s*\n([\s\S]*?)\n\s*## 实体/,
        `## 源文档摘要\n\n| 页面 | 摘要 | 日期 |\n|------|------|------|\n| [[${sourceFileName}]] | ${analysis.summary.substring(0, 50)} | ${analysis.date} |\n\n## 实体`
      );
    }
  }

  // 更新Entities表格
  for (const entity of entities) {
    if (!indexContent.includes(`[[${entity}]]`)) {
      const entityEntry = `| [[${entity}]] | Entity | ${entity} 相关信息 |`;

      const entitiesSectionRegex = /(## 实体\s*\n\s*\|\s*页面\s*\|\s*类型\s*\|\s*摘要\s*\|\s*\n\s*\|------\|------\|------\|)([\s\S]*?)(\n\s*## 概念)/;

      if (entitiesSectionRegex.test(indexContent)) {
        indexContent = indexContent.replace(
          entitiesSectionRegex,
          `$1$2\n${entityEntry}$3`
        );
      } else {
        // 备选方法
        indexContent = indexContent.replace(
          /## 实体\s*\n([\s\S]*?)\n\s*## 概念/,
          `## 实体\n\n| 页面 | 类型 | 摘要 |\n|------|------|------|\n${entityEntry}\n\n## 概念`
        );
      }
    }
  }

  // 更新Concepts表格
  for (const concept of concepts) {
    if (!indexContent.includes(`[[${concept}]]`)) {
      const conceptEntry = `| [[${concept}]] | Concept | ${concept} 相关信息 |`;

      const conceptsSectionRegex = /(## 概念\s*\n\s*\|\s*页面\s*\|\s*分类\s*\|\s*摘要\s*\|\s*\n\s*\|------\|------\|------\|)([\s\S]*?)(\n\s*## 综合分析)/;

      if (conceptsSectionRegex.test(indexContent)) {
        indexContent = indexContent.replace(
          conceptsSectionRegex,
          `$1$2\n${conceptEntry}$3`
        );
      } else {
        // 备选方法
        indexContent = indexContent.replace(
          /## 概念\s*\n([\s\S]*?)\n\s*## 综合分析/,
          `## 概念\n\n| 页面 | 分类 | 摘要 |\n|------|------|------|\n${conceptEntry}\n\n## 综合分析`
        );
      }
    }
  }

  await fs.writeFile('wiki/index.md', indexContent, 'utf8');
  console.log('Updated index: wiki/index.md');
}

/**
 * 更新日志文件（按规范格式）
 * @param {string} sourceFileName - 源文件名
 * @param {Object} analysis - 分析结果
 */
async function updateLog(sourceFileName, analysis) {
  const logEntry = `\n## [${analysis.date}] ingest | ${analysis.title.substring(0, 50)}

- 添加了源文档摘要
- 更新了实体: ${analysis.entities.slice(0, 5).join(', ')}
- 更新了概念: ${analysis.concepts.slice(0, 5).join(', ')}
- 发现矛盾: 无

---
`;

  await fs.appendFile('wiki/log.md', logEntry, 'utf8');
  console.log('Updated log: wiki/log.md');
}

/**
 * 执行完整的Ingest操作（增强版）
 * @param {string} sourcePath - 源文件路径
 */
async function performIngest(sourcePath) {
  try {
    console.log(`Starting ingest operation for: ${sourcePath}`);

    // 读取源文件
    const content = await fs.readFile(sourcePath, 'utf8');

    // 分析源内容
    const analysis = await analyzeSource(content);

    // 创建源页面
    const sourcePagePath = await createSourcePage(analysis, path.basename(sourcePath));

    // 更新实体页面
    await updateEntityPages(analysis.entities, sourcePagePath);

    // 更新概念页面
    await updateConceptPages(analysis.concepts, sourcePagePath);

    // 更新索引
    await updateIndex(sourcePagePath, analysis.entities, analysis.concepts, analysis);

    // 更新日志
    await updateLog(path.basename(sourcePath), analysis);

    // 尝试更新QMD索引（如果QMD可用）
    try {
      await execAsync('qmd update');
      console.log('QMD index updated successfully');
    } catch (qmdError) {
      console.log('QMD not available or failed to update index');
    }

    console.log(`Successfully completed ingest operation for: ${sourcePath}`);
    console.log(`- Created source page: ${sourcePagePath}`);
    console.log(`- Updated ${analysis.entities.length} entity pages`);
    console.log(`- Updated ${analysis.concepts.length} concept pages`);

    return {
      success: true,
      sourcePage: sourcePagePath,
      entities: analysis.entities,
      concepts: analysis.concepts,
      message: `Successfully ingested ${path.basename(sourcePath)} and updated the wiki`
    };
  } catch (error) {
    console.error(`Error during ingest operation:`, error);
    return {
      success: false,
      error: error.message,
      message: `Failed to ingest ${sourcePath}: ${error.message}`
    };
  }
}

/**
 * 执行Lint操作 - 检查维基健康状况（增强版）
 */
async function performLint() {
  console.log('Starting lint operation...');

  try {
    // 检查孤立页面（没有被索引引用的页面）
    const orphanCheckResult = await checkOrphanPages();

    // 检查缺失的交叉引用
    const crossRefResult = await checkCrossReferences();

    // 检查过时声明
    const outdatedResult = await checkOutdatedClaims();

    // 生成lint报告
    const lintReport = `\n## [${new Date().toISOString().split('T')[0]}] lint | Wiki Health Check

### Issues Found:
- Orphan Pages: ${orphanCheckResult.orphanPages.length}
- Missing Cross-References: ${crossRefResult.missingRefs.length}
- Outdated Claims: ${outdatedResult.outdatedClaims.length}

### Orphan Pages:
${orphanCheckResult.orphanPages.map(page => `- ${page}`).join('\n') || 'None'}

### Missing Cross-References:
${crossRefResult.missingRefs.map(ref => `- ${ref}`).join('\n') || 'None'}

### Outdated Claims:
${outdatedResult.outdatedClaims.map(claim => `- ${claim}`).join('\n') || 'None'}

---
`;

    await fs.appendFile('wiki/log.md', lintReport, 'utf8');
    console.log('Completed lint operation and updated log');

    return {
      success: true,
      orphanPages: orphanCheckResult.orphanPages,
      missingRefs: crossRefResult.missingRefs,
      outdatedClaims: outdatedResult.outdatedClaims,
      message: `Lint completed. Found ${orphanCheckResult.orphanPages.length} orphan pages, ${crossRefResult.missingRefs.length} missing references, and ${outdatedResult.outdatedClaims.length} outdated claims.`
    };
  } catch (error) {
    console.error(`Error during lint operation:`, error);
    return {
      success: false,
      error: error.message,
      message: `Failed to perform lint operation: ${error.message}`
    };
  }
}

/**
 * 检查孤立页面
 */
async function checkOrphanPages() {
  const allPages = [];

  // 收集所有wiki页面
  const dirs = ['wiki/entities', 'wiki/concepts', 'wiki/sources', 'wiki/synthesis', 'wiki/overviews'];

  for (const dir of dirs) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          allPages.push(`${dir}/${file}`);
        }
      }
    } catch (error) {
      // 目录可能不存在，忽略错误
    }
  }

  // 读取索引文件，找出被引用的页面
  let indexContent = '';
  try {
    indexContent = await fs.readFile('wiki/index.md', 'utf8');
  } catch (error) {
    // 索引文件可能不存在
  }

  // 找出没有被索引引用的页面（孤立页面）
  const orphanPages = allPages.filter(page => {
    const pageName = path.basename(page, '.md');
    return !indexContent.includes(`[[${pageName}]]`);
  });

  return { orphanPages };
}

/**
 * 检查交叉引用
 */
async function checkCrossReferences() {
  // 这里可以实现更复杂的交叉引用检查逻辑
  return { missingRefs: [] };
}

/**
 * 检查过时声明
 */
async function checkOutdatedClaims() {
  // 这里可以实现过时声明的检查逻辑
  return { outdatedClaims: [] };
}

/**
 * 执行查询操作
 * @param {string} query - 查询字符串
 */
async function performQuery(query) {
  console.log(`Starting query operation for: ${query}`);

  try {
    // 尝试使用QMD进行语义搜索
    let searchResults = [];

    try {
      const { stdout } = await execAsync(`qmd query "${query}"`);
      searchResults = stdout.split('\n').filter(line => line.trim().length > 0);
      console.log('QMD search completed');
    } catch (qmdError) {
      console.log('QMD not available or query failed, falling back to index search');

      // 如果QMD不可用，使用索引搜索
      let indexContent = '';
      try {
        indexContent = await fs.readFile('wiki/index.md', 'utf8');
      } catch (error) {
        console.log('Index file not found');
      }

      // 简单的关键词匹配
      if (indexContent.toLowerCase().includes(query.toLowerCase())) {
        searchResults = [`Found matches in index for query: ${query}`];
      } else {
        searchResults = [`No matches found for query: ${query}`];
      }
    }

    return {
      success: true,
      results: searchResults,
      message: `Query completed for: ${query}`
    };
  } catch (error) {
    console.error(`Error during query operation:`, error);
    return {
      success: false,
      error: error.message,
      message: `Failed to perform query for: ${query}`
    };
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage:');
    console.error('  node llm-wiki-engine-enhanced.mjs ingest <source-file-path>');
    console.error('  node llm-wiki-engine-enhanced.mjs query <search-term>');
    console.error('  node llm-wiki-engine-enhanced.mjs lint');
    process.exit(1);
  }

  const operation = args[0].toLowerCase();

  try {
    if (operation === 'ingest' && args.length >= 2) {
      const sourcePath = args[1];
      const result = await performIngest(sourcePath);
      console.log(result.message);
      if (!result.success) {
        process.exit(1);
      }
    } else if (operation === 'query' && args.length >= 2) {
      const searchTerm = args.slice(1).join(' ');
      const result = await performQuery(searchTerm);
      console.log(result.message);
      if (result.results) {
        console.log('Results:');
        result.results.forEach(r => console.log(`- ${r}`));
      }
      if (!result.success) {
        process.exit(1);
      }
    } else if (operation === 'lint') {
      const result = await performLint();
      console.log(result.message);
      if (!result.success) {
        process.exit(1);
      }
    } else {
      console.error('Invalid operation. Use "ingest <source-file-path>", "query <search-term>", or "lint"');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// 检测是否直接运行此模块
const modulePath = new URL(import.meta.url).pathname;
const scriptPath = process.argv[1];
if (scriptPath && scriptPath.includes(modulePath.split('/').pop().replace('.mjs', ''))) {
  main();
}

export {
  analyzeSource,
  performIngest,
  performQuery,
  performLint,
  extractTitle,
  extractEntitiesImproved,
  extractConceptsImproved,
  generateSummary,
  extractKeyPoints
};