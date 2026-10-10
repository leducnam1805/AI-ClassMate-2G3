# API Design — POST /api/classes

## Purpose
Create a class record. Use only if class creation is in MVP scope; otherwise seed the initial class administratively.

## Request
```json
{
  "classCode": "2G3",
  "className": "Lớp 2G3",
  "schoolYear": "2026-2027"
}
```

## Authorization
Admin or explicitly authorized teacher, according to the final permission matrix.

## Success — 201
Returns the created class in the standard `data` envelope.

## Validation
- `classCode`: required, trimmed, 1–30 characters.
- `className`: required, trimmed, 1–100 characters.
- `schoolYear`: required, format `YYYY-YYYY`.
- Prevent duplicate class code within the same school year.

## Errors
- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `409 CLASS_ALREADY_EXISTS`
- `500 INTERNAL_ERROR`

## Transaction and audit
Insert class and audit record atomically.

## Acceptance tests
- Valid class creates with `201`.
- Duplicate class/year returns `409`.
- Invalid school year returns `400`.
- Unauthorized caller cannot create a class.
