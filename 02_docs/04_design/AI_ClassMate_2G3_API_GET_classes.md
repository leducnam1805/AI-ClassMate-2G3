# API Design — GET /api/classes

## Purpose
Return classes available to the authenticated teacher.

## Request
- Method: `GET`
- Path: `/api/classes`
- Query: `page`, `pageSize`, optional `active`
- Body: none

## Authorization
Authenticated teacher; only classes in the caller's permitted scope are returned.

## Success — 200
```json
{
  "data": [
    {
      "id": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
      "classCode": "2G3",
      "className": "Lớp 2G3",
      "schoolYear": "2026-2027",
      "active": true,
      "studentCount": 26
    }
  ],
  "meta": { "requestId": "req_001", "page": 1, "pageSize": 20, "total": 1 }
}
```

## Validation and behavior
- `active` accepts `true` or `false`.
- Do not expose student names in the class list.
- `studentCount` counts active students in the authorized class.

## Errors
- `400 VALIDATION_ERROR`: invalid pagination/filter.
- `401 UNAUTHENTICATED`.
- `500 INTERNAL_ERROR`.

## Data access
`classes`, `students`. Apply teacher/class authorization in the query or service layer.

## Acceptance tests
1. Returns only authorized classes.
2. Pagination metadata matches the result.
3. Inactive classes are filtered correctly when requested.
4. Does not return student PII.
