# API Design — POST /api/monthly-summaries/recalculate

## Purpose
Recalculate all student summaries for a class and month from confirmed event items and verified source data.

## Request
```json
{
  "classId": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
  "period": "2026-10",
  "dryRun": false
}
```

## Success — 200
```json
{
  "data": {
    "classId": "2e89c1c4-4ad9-4d6c-9c7c-5f1c8b3c1001",
    "period": "2026-10",
    "processedCount": 26,
    "updatedCount": 24,
    "blockedCount": 2,
    "items": [
      {
        "studentId": "f6e...",
        "studentCode": "HS001",
        "positivePoints": 8,
        "negativePoints": -3,
        "totalPoints": 5,
        "giftCount": 0,
        "remainderPoints": 5,
        "calculationStatus": "READY"
      }
    ],
    "blockingIssues": [
      { "issueId": "i1...", "studentCode": "HS002", "code": "SOURCE_SCORE_UNVERIFIED" }
    ]
  },
  "meta": { "requestId": "req_008" }
}
```

## Calculation rules
- Recalculate from confirmed/verified source data only.
- Never interpret a blank score as zero.
- Sum positive and negative points according to approved rules; total is derived by deterministic code.
- For `totalPoints >= 0`: `giftCount = floor(totalPoints / 10)`, `remainderPoints = totalPoints % 10`.
- For `totalPoints < 0`: `giftCount = 0`, `remainderPoints = null`.
- If data is incomplete or criteria are unresolved, mark the affected student summary `NEEDS_REVIEW`; do not present it as official.
- AI is not called by this endpoint.

## Behavior
- `dryRun=true` calculates and returns proposed outcomes without persisting.
- Use one transaction per class/month batch or a documented safe batching strategy.
- Return collection-level status, not a single `summaryId`.
- Idempotent: repeating calculation on unchanged source data produces identical results.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 CLASS_NOT_FOUND`, `409 MONTH_ALREADY_APPROVED` (require reopen first), `422 PERIOD_INVALID`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Negative totals produce zero gifts and null remainder.
- Blank source cells create a blocking issue.
- `28` points produces `2` gifts and remainder `8`.
- Approved month cannot be silently recalculated without explicit reopen policy.
- `dryRun` does not persist changes.
