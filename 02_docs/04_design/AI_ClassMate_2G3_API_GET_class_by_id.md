# API Design — GET /api/classes/{classId}

## Purpose
Get class metadata and high-level counts for the authenticated teacher.

## Path parameters
- `classId`: UUID.

## Success — 200
```json
{
  "data": {
    "id": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
    "classCode": "2G3",
    "className": "Lớp 2G3",
    "schoolYear": "2026-2027",
    "active": true,
    "activeStudentCount": 26
  },
  "meta": { "requestId": "req_002" }
}
```

## Behavior
Return `404` for nonexistent or out-of-scope IDs to avoid leaking resource existence.

## Errors
`400 INVALID_ID`, `401 UNAUTHENTICATED`, `404 NOT_FOUND`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Correct class metadata returned.
- Unknown and unauthorized class IDs return the same external `404` behavior.
