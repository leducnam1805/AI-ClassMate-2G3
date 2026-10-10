# API Design — GET /api/behavior-events

## Purpose
Search events for a class, student and date range.

## Query
`classId` required; optional `studentId`, `from`, `to`, `status`, `page`, `pageSize`.

## Success — 200
Returns paginated event records with event date, pseudonymous student code, status and compact item summaries. Do not return unrelated student profile details.

## Validation
- `from` and `to` use `YYYY-MM-DD`; `from <= to`.
- Restrict maximum date range for MVP (for example, 12 months) to prevent unbounded queries.
- `status` must be one of the documented event states.
- Class must be authorized.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `404 CLASS_NOT_FOUND`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Date filters are inclusive and consistent.
- Only events from the selected authorized class appear.
- Pagination is stable.
