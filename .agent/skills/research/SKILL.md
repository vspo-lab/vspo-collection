---
name: research
description: Technical research and spec verification using Context7 MCP. Use for checking the latest library/framework documentation, verifying API specs, checking version differences, and gathering evidence for implementation decisions. Especially useful for investigating "latest", "recommended", "breaking change", and "migration steps".
---

# Trigger Conditions

- When asked to look up the latest specs or verify official recommendations
- When compatibility checks are needed before introducing or upgrading a library or framework
- When implementation decisions need to be backed by primary sources

# Research Flow

1. Clarify the target library name, target version, and implementation purpose
2. Resolve the library ID using `mcp__context7__resolve-library-id`
3. Investigate per use case using `mcp__context7__query-docs`
4. Verify important findings against English-language primary sources (official docs / official blog / release notes / RFCs)
5. Organize the response in the order: Conclusion, Evidence, Impact Scope, Open Questions

# Key Rules

- Use Context7 MCP as the primary source for technical research
- Prefer English-language versions of technical documentation
- Treat Japanese-language articles as supplementary; limit definitive statements to information verified against primary sources
- When asked for "latest" or "as of today" information, always state the reference date, last-updated date, and target version
- For breaking changes, deprecations, and security fixes, verify against release notes/changelogs
- Do not mix speculation with facts. Clearly label speculation

# When Context7 Is Unavailable

- Prefer official documentation, official GitHub repos, and official release notes
- Annotate information obtained through alternative research as "Context7 not used"
- Separate weakly-evidenced information into a follow-up verification task before finalizing implementation

# Output Format

- `Conclusion`: Key points for the quickest decision-making
- `Evidence`: Source links (English-language preferred) and key points
- `Impact Scope`: Layers, files, and configuration that need changes
- `Open Questions`: Items requiring further verification

# Research Quality Checklist

- Have you stated the library name, version, and runtime environment (Node/Browser/Edge, etc.)?
- Are the references primarily from primary sources?
- Are dates and versions consistent?
- Are speculation and facts clearly separated?
- Have you provided next actions that directly inform implementation?
