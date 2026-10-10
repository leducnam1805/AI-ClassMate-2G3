# API Design — POST /api/behavior-events/{eventId}/confirm

## Purpose
Confirm an event after teacher review and snapshot the exact scoring rule used.

## Request
```json
{
  "expectedUpdatedAt": "2026-10-10T09:30:00Z",
  "itemDecisions": [
    {
      "itemId": "b12...",
      "decision": "CONFIRM",
      "confirmedQuantity": 1,
      "pointsAppliedPerUnit": -10,
      "criterionVersion": 1
    }
  ],
  "reviewNote": "Đã đối chiếu minh chứng"
}
```

## Success — 200
Returns event in `CONFIRMED` status and immutable scoring snapshots for confirmed items.

## Preconditions
- Caller can review events in this class.
- Event is in `PENDING_REVIEW` or another explicitly allowed reviewable state.
- Each criterion version is `APPROVED` and effective on the event date.
- Client-provided points are not trusted. Server reloads the approved criterion version and computes points.
- If a single incident contains both “nói chuyện” and “nói leo”, the domain rule for this specific situation must prevent duplicate counting as already confirmed by the teacher. Encode only the confirmed rule; do not generalize beyond its stated scope.
- Any unresolved blocking issue prevents confirmation unless the issue is specifically resolved as part of the same transaction.

## Errors
`401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 VERSION_CONFLICT` or `INVALID_STATE`, `422 CRITERION_NOT_APPROVED` or `REVIEW_REQUIRED`.

## Transaction
Lock event for update; validate; snapshot criterion version/label/points; compute applied points in server code; update status; write audit log.

## Acceptance tests
- Tampered client point value is ignored/rejected.
- Event item records the approved point snapshot.
- Duplicate confirmation cannot double-apply points.
- Stale event returns `409`.
