# API Design — POST /api/ai-comments/drafts

## Purpose
Generate a draft monthly comment from verified, minimal evidence. This endpoint never approves or publishes the generated text.

## Request
```json
{
  "studentId": "f6e1c011-4f19-4f5e-9c62-2a8e80c81001",
  "period": "2026-10",
  "tone": "ENCOURAGING",
  "teacherContext": "Tập trung vào tiến bộ đã được ghi nhận",
  "idempotencyKey": "ai-comment-HS001-2026-10-v1"
}
```

## Success — 201
```json
{
  "data": {
    "id": "cc2...",
    "studentId": "f6e1c011-4f19-4f5e-9c62-2a8e80c81001",
    "period": "2026-10",
    "status": "DRAFT",
    "draftText": "Trong tháng, em đã ...",
    "evidenceRefs": ["event-id-1"],
    "model": "provider-model",
    "createdAt": "2026-10-31T10:00:00Z"
  },
  "meta": { "requestId": "req_009" }
}
```

## Preconditions and AI boundary
- Summary and evidence must be available and verified; if material evidence is missing, return `422 INSUFFICIENT_VERIFIED_EVIDENCE`.
- Send pseudonymous code and only necessary evidence to provider.
- The server constructs the prompt; clients cannot override system safety instructions.
- AI must not calculate points, invent events, infer health/family conditions, diagnose, rank students, label character, or decide discipline.
- Output is a draft. Teacher must edit/review and approve separately.
- Keep provider call server-side; API keys never reach the browser.
- If provider fails, return `503 AI_PROVIDER_UNAVAILABLE`; core score management remains usable.

## Errors
`400 VALIDATION_ERROR`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 STUDENT_OR_SUMMARY_NOT_FOUND`, `409 IDEMPOTENCY_CONFLICT`, `422 INSUFFICIENT_VERIFIED_EVIDENCE`, `503 AI_PROVIDER_UNAVAILABLE`.

## Acceptance tests
- AI not called when required evidence is unverified.
- Draft is persisted separately from final approved text.
- Prompt injection in teacher context cannot override system safety constraints.
- No external send/publish occurs.
