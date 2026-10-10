# API Design — POST /api/review-issues/{issueId}/resolve

## Purpose
Record the teacher's resolution of a data-quality issue.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-10T09:30:00Z",
  "resolutionCode": "SOURCE_VERIFIED",
  "resolutionNote": "Đã đối chiếu sổ ghi chép của giáo viên",
  "correctedValue": null
}
```

## Success — 200
Returns issue with `status: "RESOLVED"`, `resolvedAt`, `resolvedBy`, and resolution metadata.

## Validation
- Issue must exist, be unresolved, and be in caller's class scope.
- `resolutionCode` must be from an allow-list.
- Resolution note required for blocking issues.
- If resolving by correcting a source value, update the source entity through its own validated workflow in the same transaction; do not store a correction only in issue text.
- `resolvedAt` and `resolvedBy` must be populated for `RESOLVED` and `DISMISSED`.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 INVALID_STATE` or `VERSION_CONFLICT`, `422 RESOLUTION_REQUIRED`.

## Acceptance tests
- Blocking issue can be resolved with traceable evidence.
- Issue cannot be resolved twice without a conflict response.
- The associated entity is updated only through the authorized domain workflow.
