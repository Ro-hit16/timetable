# AI Changelog — Timetable Generator

---

## Phase 2 — 2026-07-04 (This Session)

### timetableGenerator.js

#### Penalty Table
- Added `SUBJECT_CONSEC_DAY: -150`
- Added `TEACHER_CONSEC_LECTURE: -25`
- Added `TEACHER_IDLE_GAP: -30`
- Added `LAB_SAME_WEEK_CLUSTER: -80`
- Added `ROOM_INCONSISTENCY: -5`
- Added `SUBJECT_SPREAD_BONUS: +40`
- Added `TEACHER_COMPACT_BONUS: +20`
- Added `ROOM_CONSISTENT_BONUS: +8`
- Added `LAB_SPREAD_BONUS: +35`
- Added `DIVISION_FAIRNESS_BONUS: +50`
- Increased `WORKLOAD_DEVIATION: -500 -> -800`
- Increased `WORKLOAD_MATCH_BONUS: +50 -> +80`
- Increased `SUBJECT_OVERLOAD: -30 -> -60`
- Increased `LAB_NOT_CONSECUTIVE: -120 -> -200`
- Increased `UNWANTED_FREE: -15 -> -20`

#### fitness()
- Added pre-pass to build `teacherDaySlots` map for consecutive/gap analysis
- Added `subjectDayMap` and `roomSubjectMap` tracking per division
- Phase 2A: Subject consecutive-day penalty + spread bonus
- Phase 2B: Room consistency reward per subject
- Phase 2C: Teacher idle-gap penalty + consecutive-lecture penalty + compact bonus
- Phase 2D: Lab adjacent-day cluster penalty + spread bonus
- Phase 2E: Division fill variance fairness normalization
- Fixed: teacher workload checks now driven by `teacherDaySlots` (avoids double-fetching)

#### mutate()
- Added Type 4 (12%): Subject spacing repair operator
  - Detects consecutive-day violations per division
  - Moves victim occurrence to a non-adjacent day with a free slot
  - Lab-aware (skips lab slots to preserve pairs)
- Rebalanced operator probabilities: 30/28/20/12/10

#### computeQualityMetrics()
- Added `subjectConsecDayViolations` tracking
- Added `teacherIdleGaps` and `teacherConsecRuns` counting
- Added division fill variance computation
- Added three new output fields: `subjectSpread`, `teacherCompactness`, `divisionFairness`
- Updated quality score formula (7 weighted components + 10pt hard-clash bonus)

---

## Phase 1 — 2026-07-04 (Previous Session)

### teacher.model.js
- Added `maxWeeklyWorkload` (default 18)
- Added `maxDailyWorkload` (default 4)
- Added `unavailableSlots: [{ day, period }]`

### class.model.js
- Added `capacity` (default 60)

### timetables.controller.js
- Fixed classroom query: fetch all rooms under department (removed semester filter)
- Rewrote `validateTimetable()`:
  - Teacher clash detection (cross-division)
  - Room clash detection (cross-division)
  - Teacher unavailability check
  - Teacher weekly/daily overload check
  - Classroom capacity check
  - Lab consecutive period validation

### timetableGenerator.js
- Added `getLecturePerWeek(sub)` helper
- Added `getTeacherWorkload(schedule)` helper
- Added hard penalties: `TEACHER_CLASH: -15000`, `ROOM_CLASH: -15000`, `UNAVAILABLE_SLOT: -10000`
- Added soft penalties: `TEACHER_OVERLOAD: -1000`, `CAPACITY_CLASH: -1000`
- Updated `createRandomSchedule()`: global teacher/room slot tracking to avoid initial clashes
- Updated `fitness()`: teacher availability, room capacity, workload deviation, utilisation rewards
- Replaced roulette-wheel selection with tournament selection (k=3)
- Added multi-operator mutation (4 types)
- Added adaptive mutation rate (1.8x boost when stagnation > 60)
- Changed exit condition: stagnation-only (removed raw fitness threshold)
- Added `computeQualityMetrics()` with teacher/classroom/lab/slot utilization %
- Exposed quality metrics in `generateSchedule()` metadata

### backend/test.js (new file)
- 8-test verification suite
- Covers: teacher clashes, room clashes, unavailability, workload, lab pairs, quality score, structure
