# API Design — POST /api/behavior-events/{eventId}/reject

## Purpose
Reject an event record that should not count, preserving the record for traceability.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-10T09:30:00Z",
  "reasonCode": "INCORRECT_RECORD",
  "reason": "Bản ghi trùng với sự việc đã xác minh"
}
```

## Success — 200
Returns event with `status: "REJECTED"`.

## Validation
- A reason code and concise explanation are required.
- Confirmed events cannot be rejected through this endpoint without a separate correction/void workflow.
- Do not hard-delete event data.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 REASON_REQUIRED`.

## Audit
Record reviewer, reason code, timestamp and entity ID.

## Acceptance tests
- Pending event can be rejected.
- Confirmed event cannot be silently removed.
- Rejection is visible in audit history.
