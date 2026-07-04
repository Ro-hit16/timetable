# Next Task for AI Session

## Branch
`phase2-soft-constraints`

## Status
Phase 1 and Phase 2 backend optimizations are complete.
Quality score: 91/100
All hard constraints: 0 violations.

## What To Do Next

### Task 1 — Frontend: Quality Dashboard (HIGH PRIORITY)
The `generateSchedule` API now returns a `metadata` object with:
```json
{
  "qualityScore": 91,
  "teacherUtilization":   { "used": 3, "total": 3, "percentage": 100 },
  "classroomUtilization": { "used": 3, "total": 4, "percentage": 75 },
  "labUtilization":       { "correct": 2, "total": 2, "percentage": 100 },
  "slotUtilization":      { "filled": 25, "total": 60, "percentage": 42 },
  "subjectSpread":        { "violations": 0, "score": 100 },
  "teacherCompactness":   { "idleGaps": 1, "consecRuns": 0, "score": 92 },
  "divisionFairness":     { "fillVariance": 0, "score": 100 },
  "hardClashes": 0
}
```

Display these on the Timetable detail page (`frontend/src/pages/Timetables/`):
- Quality score as a circular progress gauge (green if ≥90, amber if 70-89, red if <70)
- Stat cards for teacher, classroom, lab utilization
- Conflict panel using `validateTimetable` response (sorted by severity)

### Task 2 — Frontend: Timetable Grid Polish (MEDIUM)
- Colour-code slots by type: theory=blue, lab=green, tutorial=amber
- Hover tooltip: teacher name + room number
- Print/export button (window.print() or html2canvas)

### Task 3 — Deployment Preparation (LOW)
- Review `backend/.env` for production secrets
- Add helmet, rate-limiting middleware to `backend/server.js`
- Add `start` script to root `package.json` for concurrent frontend+backend
- Write `README.md`

## Key Files
| File | Notes |
|---|---|
| `backend/utils/timetableGenerator.js` | GA engine — do not rewrite |
| `backend/controllers/timetables.controller.js` | API + validateTimetable |
| `frontend/src/pages/Timetables/Timetables.jsx` | Main timetable page |
| `frontend/src/services/timetableService.js` | API service layer |
| `backend/test.js` | Run `node backend/test.js` to verify |

## Do NOT
- Rewrite the GA
- Restructure the database
- Change the API response format (only add to metadata)
