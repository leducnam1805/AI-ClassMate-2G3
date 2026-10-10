# API Design — GET /api/students/{studentId}

## Purpose
Get a pseudonymous student profile and minimal status fields.

## Success — 200
```json
{
  "data": {
    "id": "f6e1c011-4f19-4f5e-9c62-2a8e80c81001",
    "classId": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
    "studentCode": "HS001",
    "active": true,
    "createdAt": "2026-10-01T00:00:00Z",
    "updatedAt": "2026-10-01T00:00:00Z"
  },
  "meta": { "requestId": "req_005" }
}
```

## Authorization and privacy
Must verify class access. Return `404` for absent or out-of-scope records.

## Errors
`400 INVALID_ID`, `401 UNAUTHENTICATED`, `404 NOT_FOUND`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Does not leak other class records.
- Response excludes unnecessary personal data.
