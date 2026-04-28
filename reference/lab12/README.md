# Lab 12 Escape Hatch

This rescue slice restores the real Lab 12 reviewer-directory feature:

- backend endpoint: `/app/hr/api/v1/assessments`
- frontend page: `/hr/assessments`

This is an end-to-end rescue path, not just a page stub.

Restore only the Lab 12 slice. Do not replace unrelated app areas or overwrite learner work from earlier labs.

## What This Escape Hatch Covers

Backend:

- `HrAssessmentResource`
- `HrAssessmentDirectoryJdbcRepository`
- `HrAssessmentDirectoryRowDTO`
- `HrAssessmentResourceTest`
- HK2 / Jersey registration in `HrApplicationConfig`

Frontend:

- `frontend/src/api/assessments.ts`
- `frontend/src/pages/assessments/AssessmentsPage.tsx`
- route wiring
- sidebar wiring
- command-palette wiring
- reviewer-directory i18n labels

## Restore Order

Use this order so the feature comes back cleanly.

### 1. Restore backend files

Copy back only:

- `reference/lab12/backend/hrapp-service/src/main/java/com/company/hr/resource/HrAssessmentResource.java`
- `reference/lab12/backend/hrapp-service/src/main/java/com/company/hr/repository/HrAssessmentDirectoryJdbcRepository.java`
- `reference/lab12/backend/hrapp-service/src/main/java/com/company/hr/dto/response/HrAssessmentDirectoryRowDTO.java`
- `reference/lab12/backend/hrapp-service/src/test/java/com/company/hr/resource/HrAssessmentResourceTest.java`

Then apply:

- `reference/lab12/backend/hrapp-service/src/main/java/com/company/hr/HrApplicationConfig.assessments.snippet.txt`

Target:

- `backend/hrapp-service/src/main/java/com/company/hr/HrApplicationConfig.java`

Add only the binding/import/register changes for the Lab 12 slice.

### 2. Restore frontend files

Copy back only:

- `reference/lab12/frontend/src/api/assessments.ts`
- `reference/lab12/frontend/src/pages/assessments/AssessmentsPage.tsx`

Then apply:

- `reference/lab12/frontend/src/routes/router.assessments.snippet.txt`
- `reference/lab12/frontend/src/components/hr/layout/HrSidebar.assessments.snippet.txt`
- `reference/lab12/frontend/src/components/hr/layout/HrCommandPalette.assessments.snippet.txt`

Targets:

- `frontend/src/routes/router.tsx`
- `frontend/src/components/hr/layout/HrSidebar.tsx`
- `frontend/src/components/hr/layout/HrCommandPalette.tsx`

### 3. Restore i18n labels

Apply the `directory` block from:

- `reference/lab12/frontend/src/i18n/locales/en-US/assessments.directory.snippet.json`
- `reference/lab12/frontend/src/i18n/locales/es-MX/assessments.directory.snippet.json`
- `reference/lab12/frontend/src/i18n/locales/fr-FR/assessments.directory.snippet.json`
- `reference/lab12/frontend/src/i18n/locales/hi-IN/assessments.directory.snippet.json`

Target:

- `frontend/src/i18n/locales/*/assessments.json`

Also restore:

- `reference/lab12/frontend/src/i18n/locales/en-US/navigation.assessments-directory.snippet.json`

Target:

- `frontend/src/i18n/locales/en-US/navigation.json`

## Verification After Restore

Run:

```bash
cd backend && ./build-jersey-service.sh test
cd frontend && npm run build
```

Then verify in the browser:

- `/hr/assessments` renders
- sidebar link works
- command-palette entry works
- HR specialist can see full results
- manager sees only scoped results

## Scope Reminder

This reference exists to rescue the intended Lab 12 slice.

Do not use it to:

- replace the employee self-service `My Assessments` flow
- broaden the feature into create/edit workflows
- overwrite learner work outside the Lab 12 reviewer directory
