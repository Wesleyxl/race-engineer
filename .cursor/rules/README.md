# Cursor Rules — Backend Template

Professional, reusable Cursor rules for **backend** services and APIs.

## Quick Start

```bash
mkdir -p .cursor/rules
cp -r path/to/.cursor-backend/* .cursor/rules/
```

## Structure

| Folder | Purpose |
|--------|---------|
| `core/` | Principles, change boundaries, decision policy |
| `architecture/` | Clean Architecture, module boundaries |
| `quality/` | TypeScript, testing, docs, backend performance |
| `workflows/` | Git, CI/PR, spec-driven development |
| `security/` | Fundamentals + API security + data protection |
| `ai/` | Agent behavior, context engineering, workflows |
| `backend/` | **Backend-only** — API, domain, data, auth, jobs, observability |
| `meta/` | Rule authoring and precedence |
| `templates/` | Specs, ADRs, OpenAPI snippets, agent tasks |

## Customization

1. Copy to `.cursor/rules/`
2. Add `meta/030-project-overrides.mdc` for stack-specific overrides (NestJS, Express, Go, etc.)
3. Disable unused rules to save context budget

## Full-Stack Projects

Use **both** templates selectively:

```bash
cp -r .cursor-frontend/{core,architecture,quality,workflows,security,ai,meta,templates} .cursor/rules/
cp -r .cursor-frontend/frontend .cursor/rules/
cp -r .cursor-backend/backend .cursor/rules/
cp .cursor-backend/security/020-api-security.mdc .cursor/rules/security/
cp .cursor-backend/security/030-data-protection.mdc .cursor/rules/security/
cp .cursor-backend/quality/050-backend-performance.mdc .cursor/rules/quality/
```

Resolve duplicates: keep one `010-security-fundamentals.mdc`, merge globs as needed.

## Precedence

See `meta/020-context-hierarchy.mdc`.