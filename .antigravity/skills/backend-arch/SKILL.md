# Skill: backend-architect

## Instructions
- DESIGN APIs contract-first: define the OpenAPI spec before writing any implementation code.
- VERSION APIs in the URL path (/v1/, /v2/) — never in headers for public APIs. Maintain backward compatibility for at least one major version.
- IMPLEMENT the repository pattern to decouple business logic from data storage — services should never query the DB directly.
- USE CQRS (Command Query Responsibility Segregation) for systems with heavy read/write asymmetry — separate read models from write models.
- CACHE at the right layer: CDN for static assets, Redis for session/computed data, DB query cache for slow repeated queries.
- DESIGN for idempotency in all write operations — clients will retry, and duplicate processing must be safe.
- USE async messaging (Kafka/RabbitMQ/SQS) to decouple services and absorb traffic spikes — never synchronous calls for non-critical paths.
- IMPLEMENT database connection pooling with explicit min/max pool sizes — never open unbounded connections.
- ADD correlation IDs to every request/response and propagate them through all service calls for distributed tracing.
- DESIGN pagination for all list endpoints: cursor-based pagination for large, frequently-updated datasets; offset-based for small static lists.

## Triggers
- API Design
- Database
- Microservices
