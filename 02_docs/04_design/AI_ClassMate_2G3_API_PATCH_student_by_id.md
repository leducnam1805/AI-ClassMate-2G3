# API Design — PATCH /api/students/{studentId}

## Purpose
Update allowed student fields, initially only `active`. Student code should not be casually changed because it is referenced by events and reports.

## Request
```json
{
  "active": false,
  "expectedUpdatedAt": "2026-10-01T00:00:00Z"
}
```

## Success — 200
Returns the updated student object.

## Validation and behavior
- Reject unknown fields; never mass-assign request JSON into a database model.
- `active` must be boolean.
- If the student has historical events, deactivation preserves history.
- Re-activation does not alter prior summaries.
- Compare `expectedUpdatedAt` to prevent overwriting concurrent changes.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 VERSION_CONFLICT`.

## Audit
Log actor, student ID, and old/new active state, not unrelated student details.

## Acceptance tests
- Deactivation preserves historical events.
- Stale version returns `409`.
- Unsupported fields are rejected.
