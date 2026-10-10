# API Design — GET /api/audit-logs

## Purpose
Search audit events for troubleshooting and accountability.

## Query
Optional `entityType`, `entityId`, `actorId`, `action`, `from`, `to`, `page`, `pageSize`. Require a reasonable date range for general queries.

## Success — 200
Returns audit ID, timestamp, actor pseudonymous/system ID, action, entity type/ID, request ID and a minimized change summary. Do not return secrets or unnecessary student text.

## Authorization
Restricted to authorized teacher/admin roles according to school policy. A regular teacher should only see logs for classes in their scope.

## Behavior
- Read-only endpoint.
- No API to update/delete audit entries.
- Sensitive fields must be redacted.
- Database-level immutability/permissions remain a deployment task, not assumed by this endpoint alone.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Audit entries are returned in stable newest-first order.
- Filters work and are bounded.
- Secrets and unnecessary student data are absent.
