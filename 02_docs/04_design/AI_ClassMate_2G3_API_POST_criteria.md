# API Design — POST /api/criteria

## Purpose
Create a draft criterion; this endpoint must not activate a rule.

## Request
```json
{
  "code": "TALKING",
  "label": "Nói chuyện",
  "points": -1,
  "description": "Ghi nhận hành vi nói chuyện trong giờ học",
  "effectiveFrom": "2026-10-01"
}
```

## Success — 201
Returns criterion with `status: "DRAFT"` or `PENDING_CONFIRMATION`, according to domain policy.

## Validation
- `code`: uppercase stable identifier, 2–50 characters.
- `label`: required, 1–120 characters.
- `points`: integer; positive for rewards, negative for deductions, never zero unless explicitly supported.
- `effectiveFrom`: valid date.
- Duplicate code/version conflict returns `409`.
- If the point value or meaning is unresolved, it must remain pending and unavailable for event confirmation.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `409 CRITERION_VERSION_CONFLICT`.

## Acceptance tests
- New criterion is not automatically approved.
- Zero/non-integer points are rejected unless business rules explicitly allow them.
- Creation is audited.
