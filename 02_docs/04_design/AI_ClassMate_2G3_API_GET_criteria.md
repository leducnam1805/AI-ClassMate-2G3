# API Design — GET /api/criteria

## Purpose
List behavior/scoring criteria and their status.

## Query
- `status`: optional `DRAFT`, `PENDING_CONFIRMATION`, `APPROVED`, `RETIRED`
- `page`, `pageSize`

## Success — 200
```json
{
  "data": [
    {
      "id": "c1f...",
      "code": "RED_FLAG",
      "label": "Vi phạm cờ đỏ",
      "points": -10,
      "status": "APPROVED",
      "version": 1,
      "effectiveFrom": "2026-09-01",
      "effectiveTo": null
    }
  ],
  "meta": { "requestId": "req_006", "page": 1, "pageSize": 20, "total": 1 }
}
```

## Behavior
- Only `APPROVED` criteria are eligible for confirmed events.
- Unresolved criteria must be clearly marked and not silently applied.
- Criteria versions must be immutable once used by a confirmed event. A change creates a new version rather than overwriting history.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Status filter works.
- Pending criteria are not presented as approved.
- Historical versions remain queryable.
