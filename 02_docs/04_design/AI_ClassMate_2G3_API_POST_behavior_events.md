# API Design — POST /api/behavior-events

## Purpose
Record a conduct/reward event for one student. This creates a reviewable record; it does not automatically confirm its score.

## Request
```json
{
  "classId": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
  "studentId": "f6e1c011-4f19-4f5e-9c62-2a8e80c81001",
  "eventDate": "2026-10-10",
  "items": [
    {
      "criterionId": "c1f...",
      "quantity": 1,
      "note": "Minh chứng ngắn gọn, quan sát được"
    }
  ],
  "sourceReference": null
}
```

## Success — 201
```json
{
  "data": {
    "id": "e9d...",
    "classId": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
    "studentId": "f6e1c011-4f19-4f5e-9c62-2a8e80c81001",
    "eventDate": "2026-10-10",
    "status": "PENDING_REVIEW",
    "items": [
      { "criterionId": "c1f...", "quantity": 1, "pointsApplied": null, "pointsStatus": "PENDING_CONFIRMATION" }
    ]
  },
  "meta": { "requestId": "req_007" }
}
```

## Validation
- Student must belong to `classId` and be active.
- Event date must be valid and within an allowed reporting window.
- At least one item; quantity is a positive integer within a configured safe limit.
- Criterion must exist. If it is not approved, create a review issue and do not apply its points.
- Note must be factual, concise, and not contain unsupported labels or sensitive family/health inferences.
- Do not deduplicate different events solely because they share a date. Duplicate detection should flag likely duplicates for teacher review, not silently delete them.

## Status
New record enters `PENDING_REVIEW` (or `DRAFT` if the UI explicitly supports saving an incomplete form; choose one canonical MVP path before implementation).

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 STUDENT_OR_CLASS_NOT_FOUND`, `409 DUPLICATE_REQUEST`, `422 CRITERION_NOT_APPROVED`.

## Transaction and audit
Persist event and items atomically. Create review issues for unresolved rule/data conflicts. Audit the creation.

## Acceptance tests
- Student/class mismatch rejected.
- Unapproved criterion cannot be confirmed/applied.
- Retry with same idempotency key does not create duplicates.
