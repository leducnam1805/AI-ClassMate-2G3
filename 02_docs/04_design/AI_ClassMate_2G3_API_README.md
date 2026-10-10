# AI ClassMate 2G3 — API Design per Endpoint

- Version: 1.0
- Date: 10/10/2026
- Status: Draft for implementation planning
- API base path: `/api`
- Architecture: Next.js Route Handlers + application services + domain rules + PostgreSQL
- Data policy: use anonymized student codes in demos; minimize student data; teacher approval is required for official educational comments.

## Folder structure

- `00-conventions/` — shared response, errors, authentication, pagination and status conventions
- `01-classes/` — class APIs
- `02-students/` — student APIs
- `03-criteria/` — behavior/scoring criteria APIs
- `04-behavior-events/` — record and review conduct events
- `05-review-issues/` — data-quality issues
- `06-monthly-summaries/` — calculation and month close/approval
- `07-ai-comments/` — AI-generated comment drafts and teacher review
- `08-audit-logs/` — audit history

## Endpoint inventory

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/classes` | List classes |
| POST | `/api/classes` | Create class |
| GET | `/api/classes/{classId}` | Get class details |
| GET | `/api/classes/{classId}/students` | List students in a class |
| POST | `/api/classes/{classId}/students` | Add student to class |
| GET | `/api/students/{studentId}` | Get student profile |
| PATCH | `/api/students/{studentId}` | Update limited student fields |
| GET | `/api/criteria` | List scoring criteria |
| POST | `/api/criteria` | Create draft criterion |
| POST | `/api/criteria/{criterionId}/approve` | Approve criterion |
| POST | `/api/behavior-events` | Create conduct event |
| GET | `/api/behavior-events` | Search/list events |
| GET | `/api/behavior-events/{eventId}` | Get event detail |
| POST | `/api/behavior-events/{eventId}/confirm` | Confirm event and applied points |
| POST | `/api/behavior-events/{eventId}/reject` | Reject event |
| GET | `/api/review-issues` | List unresolved data issues |
| POST | `/api/review-issues/{issueId}/resolve` | Resolve issue |
| POST | `/api/monthly-summaries/recalculate` | Recalculate class/month summaries |
| GET | `/api/monthly-summaries` | List class/month summaries |
| GET | `/api/monthly-summaries/{summaryId}` | Get student/month summary |
| POST | `/api/monthly-summaries/{summaryId}/approve` | Approve summary |
| POST | `/api/monthly-summaries/{summaryId}/reopen` | Reopen approved summary |
| POST | `/api/ai-comments/drafts` | Generate an AI comment draft |
| POST | `/api/ai-comments/{commentId}/approve` | Approve edited comment |
| POST | `/api/ai-comments/{commentId}/reject` | Reject AI draft |
| GET | `/api/audit-logs` | Query audit logs |

## Implementation sequence

1. Shared conventions and class/student read APIs.
2. Criteria and event capture/review.
3. Review issues and monthly calculation.
4. Monthly approval workflow.
5. AI draft/review workflow.
6. Audit query, integration tests and security checks.

## Important design decisions

1. Points are calculated by deterministic application code, never by AI.
2. Blank source scores are unknown and must create a review issue; do not coerce them to zero.
3. Unapproved criteria cannot be used to confirm an event.
4. Month summaries cannot be approved while blocking review issues exist or required source data remains unverified.
5. Negative total: `giftCount = 0`, `remainderPoints = null`. For non-negative total: `giftCount = floor(totalPoints / 10)`, `remainderPoints = totalPoints % 10`.
6. The `recalculate` endpoint is a class/month batch operation and returns a collection plus blocking issues, not one `summaryId`.
7. AI text is always a draft until a teacher approves it. Preserve draft and approved text separately.
8. Historical calculations must not silently change when a criterion is edited. The application must snapshot the applied points and rule version when an event item is confirmed.
9. IDs are UUID strings in examples. Dates use ISO 8601 (`YYYY-MM-DD`); timestamps use UTC ISO 8601.
10. The API contracts below are proposals. Verify them against the actual SQL schema and the cross-document consistency review before implementation.
