# API Design — POST /api/monthly-summaries/{summaryId}/approve

## Purpose
Approve one student/month summary after validation. If the UI approves the whole class/month at once, define a separate batch endpoint rather than overloading this endpoint.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-31T10:00:00Z",
  "approvalNote": "Đã kiểm tra dữ liệu và minh chứng"
}
```

## Success — 200
Returns summary with `approvalStatus: "APPROVED"`, `approvedAt`, `approvedBy`.

## Preconditions
- All required score fields are verified.
- No unresolved blocking review issue for this summary.
- Summary has been recalculated after the latest source change.
- Caller has approval permission.
- AI-generated comments are not implicitly approved by approving the score summary.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 REVIEW_ISSUES_REMAIN`.

## Transaction and audit
Lock summary; check issue states and freshness; approve and audit atomically.

## Acceptance tests
- Summary with blocking issue cannot be approved.
- Stale summary cannot be approved.
- Approval does not automatically publish or send information externally.
