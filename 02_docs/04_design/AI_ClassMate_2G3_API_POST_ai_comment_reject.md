# API Design — POST /api/ai-comments/{commentId}/reject

## Purpose
Reject a draft that should not be used.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-31T10:10:00Z",
  "reasonCode": "UNSUPPORTED_CLAIM",
  "reason": "Bản nháp có nội dung chưa được minh chứng"
}
```

## Success — 200
Returns status `REJECTED`, reviewer and rejection timestamp. Keep draft for controlled audit access.

## Validation
- Rejection reason required.
- Only drafts or reviewable comments can be rejected.
- Approved comments must use a correction/revocation workflow, not this endpoint.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 REASON_REQUIRED`.

## Acceptance tests
- Rejected draft is not treated as official.
- Rejection reason and actor are recorded.
- Approved comments cannot be silently overwritten by rejection.
