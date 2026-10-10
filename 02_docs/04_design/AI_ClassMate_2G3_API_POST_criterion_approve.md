# API Design — POST /api/criteria/{criterionId}/approve

## Purpose
Approve a criterion version for use in new event confirmations.

## Request
```json
{
  "expectedVersion": 1,
  "effectiveFrom": "2026-10-01",
  "approvalNote": "Đã được giáo viên xác nhận"
}
```

## Success — 200
Returns the approved criterion and approver metadata.

## Preconditions
- Caller has criterion-approval permission.
- Criterion is in a reviewable state.
- Code, label, point sign and effective date pass domain validation.
- Existing approved versions must not be rewritten; if changing a live rule, create a new version with an effective date.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 CRITERION_INCOMPLETE`.

## Transaction
Approve version, record approver/time, and write audit log atomically.

## Acceptance tests
- Approved version becomes eligible for new events.
- Previously confirmed event items retain their applied point snapshot.
- Double approval is idempotent or returns a documented `409`.
