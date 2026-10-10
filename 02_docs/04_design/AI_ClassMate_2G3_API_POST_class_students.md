# API Design — POST /api/classes/{classId}/students

## Purpose
Create a student record in a class using a pseudonymous student code.

## Request
```json
{
  "studentCode": "HS027"
}
```

## Success — 201
```json
{
  "data": {
    "id": "f6e1c011-4f19-4f5e-9c62-2a8e80c81027",
    "classId": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
    "studentCode": "HS027",
    "active": true
  },
  "meta": { "requestId": "req_004" }
}
```

## Validation
- `classId` must exist and be accessible.
- `studentCode` required, trimmed, 1–30 characters.
- Code must be unique within the class.
- Do not accept real name, address, phone, health data or family data in this MVP endpoint.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 CLASS_NOT_FOUND`, `409 STUDENT_CODE_EXISTS`.

## Acceptance tests
- Creates a student with a unique code.
- Duplicate code returns `409`.
- Cross-class insertion is not possible through this route.
