# Shared API Conventions

## 1. Authentication and authorization

MVP assumes an authenticated teacher session. All endpoints except explicitly documented health/auth endpoints require authentication.

- `TEACHER`: can read and manage records for assigned classes, record/confirm events, review issues, generate and approve comments, and approve/reopen monthly summaries.
- `ADMIN`: can manage class configuration and teacher access. Avoid implementing a broad admin role unless needed for MVP.
- A request must be scoped to the teacher's authorized class. Knowing a UUID is not authorization.
- Never send database credentials or AI provider keys to the browser.

If authentication is not implemented in the first local prototype, use a clearly marked development-only mock identity and do not expose the prototype publicly.

## 2. Success envelope

Single resource:
```json
{
  "data": {},
  "meta": { "requestId": "req_example" }
}
```

Collection:
```json
{
  "data": [],
  "meta": {
    "requestId": "req_example",
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

Batch operation:
```json
{
  "data": {
    "items": [],
    "blockingIssues": [],
    "processedCount": 0
  },
  "meta": { "requestId": "req_example" }
}
```

## 3. Error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request data is invalid.",
    "details": [
      { "field": "eventDate", "reason": "Must be a valid date." }
    ]
  },
  "meta": { "requestId": "req_example" }
}
```

Common HTTP codes:
- `400` malformed request or invalid query
- `401` unauthenticated
- `403` authenticated but unauthorized
- `404` resource not found or not accessible in the current scope
- `409` state conflict / duplicate / stale version
- `422` business validation failure
- `429` rate limit
- `500` unexpected internal error
- `503` AI provider temporarily unavailable

Do not return SQL, stack traces, provider secrets, or unnecessary student details in errors.

## 4. Pagination and filtering

List APIs use `page` (default 1) and `pageSize` (default 20, maximum 100). Invalid values return `400`. Sort fields must be allow-listed; never interpolate user-provided sort strings directly into SQL.

## 5. Idempotency and concurrency

- State-changing requests should accept an `Idempotency-Key` where retrying could create duplicate records or expensive AI requests.
- Updates/approval operations should use a version or `updatedAt` precondition where stale edits are possible. Return `409 VERSION_CONFLICT` when the record changed after the client loaded it.
- A state transition must run in a transaction and write an audit event.

## 6. Audit requirements

Record actor, action, entity type/id, timestamp, request/correlation ID and a minimized change summary. Do not copy full sensitive student text into audit logs unless strictly necessary. Application code must not expose update/delete endpoints for audit entries.

## 7. Privacy and AI boundary

- Use student codes in demos and test fixtures.
- Only send the minimum evidence required to the AI provider.
- AI may draft wording and suggestions; it must not calculate points, infer diagnoses/family conditions, rank students, or make disciplinary decisions.
- Persist AI draft separately from teacher-approved final text.
