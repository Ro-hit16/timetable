# Files Modified — Phase 1 & Phase 2

## Phase 2 (This Session)

### backend/utils/timetableGenerator.js
- Lines 1173-1209: Penalty table expanded with 10 new Phase 2 entries
- Lines 1510-1700: `fitness()` — Phase 2A-2E additions (subject spacing, room consistency, teacher compactness, lab spread, division fairness)
- Lines 1736-1850: `mutate()` — Added Type 4 subject spacing repair operator; rebalanced probabilities
- Lines 2151-2290: `computeQualityMetrics()` — Phase 2 extended metrics

## Phase 1 (Previous Session)

### backend/models/teacher.model.js
- Added fields: `maxWeeklyWorkload`, `maxDailyWorkload`, `unavailableSlots`

### backend/models/class.model.js
- Added field: `capacity`

### backend/controllers/timetables.controller.js
- Fixed classroom query (line ~1303-1309): removed semester filter, fetch all dept rooms
- Rewrote `validateTimetable()` (lines 1515-1700): teacher/room clash, unavailability, overload, capacity, lab consecutive

### backend/utils/timetableGenerator.js
- Added `getLecturePerWeek()`, `getTeacherWorkload()` helpers
- Rewrote `createRandomSchedule()` with global clash tracking
- Rewrote `fitness()` with hard/soft penalty separation + rewards
- Replaced `selection()` roulette wheel with tournament selection
- Rewrote `mutate()` with 4 operators
- Added adaptive mutation in `run()`
- Added `computeQualityMetrics()`
- Updated `generateSchedule()` metadata

### backend/test.js (NEW)
- Verification suite: 8 tests

## Unchanged Files
- All frontend files
- All other backend files (routes, middleware, other controllers)
- package.json files
- .env files
