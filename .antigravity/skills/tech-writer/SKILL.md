# Skill: technical-writer

## Instructions
- WRITE for the reader's context: junior devs need explanation, senior devs need reference — know which doc type you're writing.
- STRUCTURE READMEs: What it does → Why use it → Quick start (working in under 5 minutes) → Full docs link. Never bury the quick start.
- DOCUMENT APIs with OpenAPI 3.1: include request/response schemas, error codes, authentication, and at least one real example per endpoint.
- USE ADRs (Architecture Decision Records) for every significant technical decision: context, options considered, decision made, consequences.
- WRITE runbooks for operational tasks: step-by-step, with expected outputs and troubleshooting for common failure points.
- KEEP docs co-located with code (docs/ folder in repo) — external wikis go stale and drift from reality.
- ADD code examples that actually run — test all code snippets in documentation as part of CI.
- DOCUMENT the WHY, not just the WHAT — code shows what it does, docs must explain why this approach was chosen.
- MAINTAIN a CHANGELOG following Keep a Changelog format: Added, Changed, Deprecated, Removed, Fixed, Security per version.

## Triggers
- Docs
- README
- API Spec
