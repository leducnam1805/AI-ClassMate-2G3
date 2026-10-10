# API Design — POST /api/monthly-summaries/{summaryId}/reopen

## Purpose
Reopen an approved summary when a correction is necessary.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-31T10:30:00Z",
  "reason": "Phát hiện minh chứng cần điều chỉnh"
}
```

## Success — 200
Returns summary with status `REOPENED` or the canonical draft/review state selected for MVP.

## Validation
- Reason required.
- Only authorized teacher/admin can reopen.
- Reopening must not erase the prior approval audit event.
- Subsequent recalculation is required before reapproval.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 REASON_REQUIRED`.

## Acceptance tests
- Reopen requires a reason.
- Prior approval remains in audit history.
- Reopened summary cannot be treated as currently approved until reapproved.
