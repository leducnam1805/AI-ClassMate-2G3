# API Design — GET /api/classes/{classId}/students

## Purpose
List active students in a class using pseudonymous codes by default.

## Query
`page`, `pageSize`, optional `active` (default `true`), optional `q` to search student code only.

## Success — 200
```json
{
  "data": [
    {
      "id": "f6e1c011-4f19-4f5e-9c62-2a8e80c81001",
      "studentCode": "HS001",
      "active": true
    }
  ],
  "meta": { "requestId": "req_003", "page": 1, "pageSize": 20, "total": 26 }
}
```

## Behavior and privacy
- Do not include real names in demo responses.
- Real-name display, if ever required, must be a separate protected capability and approved by school policy.
- Stable sort by `studentCode`, then ID.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `404 CLASS_NOT_FOUND`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Returns only students from requested authorized class.
- Search matches code only.
- Stable ordering and correct pagination.
