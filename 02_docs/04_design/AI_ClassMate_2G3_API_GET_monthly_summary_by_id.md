# API Design — GET /api/monthly-summaries/{summaryId}

## Purpose
Get one student's summary for a month, with calculation breakdown and review issue references.

## Success — 200
Includes summary identity, student code, period, positive/negative/total points, gift count, nullable remainder, calculation status, approval status, calculation timestamp, rule-version references and breakdown of confirmed event items.

## Behavior
- Do not reveal real name by default.
- Detail breakdown must use the stored points snapshots from event items.
- Return `404` if absent or outside caller's class scope.

## Errors
`400 INVALID_ID`, `401 UNAUTHENTICATED`, `404 NOT_FOUND`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Sum breakdown reconciles to total.
- Historical point snapshots do not change when rules are updated.
