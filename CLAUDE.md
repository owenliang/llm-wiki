# LLM Wiki Schema

This document defines the structure and operations for the LLM Wiki system, following the pattern described in the LLM Wiki design document.

## Architecture

The LLM Wiki follows a three-layer architecture:

1. **Raw Sources** - Located in `raw/` directory, contains source documents that are read but never modified
2. **The Wiki** - Located in `wiki/` directory, contains LLM-generated markdown files
3. **The Schema** - This document, defines conventions and workflows

## Directory Structure

```
llm-wiki/
├── raw/                 # Raw source documents
│   ├── sources/         # Curated source files
│   ├── articles/        # Articles and papers
│   └── assets/          # Images and other media
├── wiki/                # Generated wiki pages
│   ├── entities/        # Entity pages (people, organizations, products)
│   ├── concepts/        # Concept pages (ideas, methodologies, patterns)
│   ├── sources/         # Source summaries and analyses
│   ├── synthesis/       # Cross-source analysis and synthesis
│   ├── overviews/       # Summary and overview pages
│   ├── index.md         # Content-oriented index
│   └── log.md           # Chronological operation log
└── CLAUDE.md            # This schema document
```

## Page Conventions

### Entity Pages
- Located in `wiki/entities/`
- Named descriptively (e.g., `CoPaw.md`, `Qwen.md`)
- Format:
```
# [Entity Name]

## Overview
[Entity description and key characteristics]

## Details
[Additional information about the entity]

## References
- Source: [link to source or source page]
- Related: [[Related Entity]]
```

### Concept Pages
- Located in `wiki/concepts/`
- Named descriptively (e.g., `AI-Agent-Platforms.md`)
- Format:
```
# [Concept Name]

## Definition
[Clear definition of the concept]

## Details
[Elaboration on the concept]

## Applications
[How the concept is applied]

## References
- Related: [[Related Concept]]
- Source: [link to relevant source]
```

### Source Pages
- Located in `wiki/sources/`
- Named to match the source file
- Format:
```
# [Source Title]

## Summary
[Concise summary of the source content]

## Key Points
- [Point 1]
- [Point 2]

## Implications
[What this source contributes to the overall understanding]

## References
- Original: [link to original source if available]
- Related: [[Related Entity]], [[Related Concept]]
```

## Operations

### Ingest Operation
When a new source is added:

1. Read the source from `raw/sources/`
2. Create a source summary page in `wiki/sources/`
3. Identify and update/create entity pages in `wiki/entities/`
4. Identify and update/create concept pages in `wiki/concepts/`
5. Update cross-references across affected pages
6. Update the index in `wiki/index.md`
7. Add an entry to `wiki/log.md`

### Query Operation
When answering questions:

1. Read the index `wiki/index.md` to identify relevant pages
2. Read relevant wiki pages
3. Synthesize an answer with citations to wiki pages
4. Optionally, save valuable analyses back to the wiki

### Lint Operation
Periodically check the wiki for:
- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Missing cross-references
- Data gaps that could be filled

## Index Maintenance

The `wiki/index.md` file should be updated on every ingest operation to include:
- New pages with links and one-line summaries
- Updates to existing page summaries if content changed significantly
- Organization by category (entities, concepts, sources, etc.)

## Logging Convention

Entries in `wiki/log.md` should follow the format:
```
## [YYYY-MM-DD] Operation Type | Description

Detailed description of what was done, which files were affected, 
what was discovered, and any notable outcomes.
```

## Best Practices

1. Keep the wiki updated - don't let it become stale
2. Maintain cross-references between related pages
3. Use consistent formatting and naming conventions
4. Link to related entities and concepts using [[Wikilinks]]
5. When creating new content from queries, consider if it should be saved back to the wiki
6. Regularly perform lint operations to maintain quality