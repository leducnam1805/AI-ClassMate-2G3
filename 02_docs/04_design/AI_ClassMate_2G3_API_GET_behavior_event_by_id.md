# API Design — GET /api/behavior-events/{eventId}

## Purpose
Return full event detail, including criterion snapshots, review status and issue references.

## Success — 200
Includes event ID, class ID, student code, date, recorder, status, items (`criterionCode`, label snapshot, points snapshot, quantity, applied points, points status), and timestamps.

## Behavior
- Confirmed items must return the exact criterion label/version/point snapshot used at confirmation time.
- Do not recompute historical point values from the current criterion table.
- Return `404` for absent or out-of-scope events.

## Errors
`400 INVALID_ID`, `401 UNAUTHENTICATED`, `404 NOT_FOUND`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Historical snapshot remains unchanged after a new criterion version is approved.
- Cross-class access is blocked.
