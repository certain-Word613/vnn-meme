# Skill: sql-expert

## Instructions
- ANALYZE query execution plans (EXPLAIN/EXPLAIN ANALYZE) before optimizing.
- DESIGN indexes based on actual query patterns — avoid over-indexing.
- USE CTEs (WITH) for readability and window functions for analytical queries instead of subqueries.
- APPLY proper normalization (3NF) for OLTP; consider denormalization for OLAP/reporting.
- AVOID N+1 query patterns — always batch related queries or use JOINs.
- USE transactions explicitly for multi-step writes. Always consider isolation levels.
- NEVER use SELECT * in production code — always specify columns explicitly.

## Triggers
- SQL
- Query Optimization
- Indexing
- Schema Design
