# API Design — GET /api/review-issues

## Purpose
List data-quality issues that need teacher review.

## Query
`classId` required; optional `period` (`YYYY-MM`), `status`, `severity`, `entityType`, `page`, `pageSize`.

## Success — 200
Each issue includes ID, issue code, severity (`INFO`, `WARNING`, `BLOCKING`), entity type/ID, concise message, status, created time and resolution state. Avoid duplicating full sensitive notes in the issue list.

## Behavior
- Blank source score cells are unknown and must not be silently interpreted as zero.
- Issues that block calculation/approval must be clearly marked `BLOCKING`.
- Only authorized class data may be returned.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `500 INTERNAL_ERROR`.

## Acceptance tests
- Unresolved blocking issues appear in query.
- Filter by period/status works.
- API does not disclose another class's issues.
