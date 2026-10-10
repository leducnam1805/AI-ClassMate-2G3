# API Design — POST /api/ai-comments/{commentId}/approve

## Purpose
Save the teacher-reviewed final comment as the official approved version.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-31T10:10:00Z",
  "approvedText": "Nội dung nhận xét đã được giáo viên kiểm tra và chỉnh sửa.",
  "teacherNote": "Đã đối chiếu với minh chứng"
}
```

## Success — 200
Returns comment ID, status `APPROVED`, final text, approver and approval timestamp. Preserve original `draftText`.

## Validation
- `approvedText` required, trimmed, within configured maximum length.
- Teacher must explicitly submit the final text; do not auto-approve the AI output.
- Comment must belong to an authorized class and be in an approvable state.
- If source evidence changed after draft generation, require regeneration or explicit re-review.
- Prevent approval if the text contains unsupported claims detected by validation; automated checks assist but do not replace teacher judgment.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 EVIDENCE_STALE` or `TEXT_REQUIRED`.

## Audit
Record approval, actor and timestamp; avoid logging full text twice if it contains student data.

## Acceptance tests
- Original draft remains available for audit.
- Approval stores exactly the teacher-submitted text.
- Stale evidence forces review.
