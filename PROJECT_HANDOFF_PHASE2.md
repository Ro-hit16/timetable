# PROJECT HANDOFF — Phase 2 Completed

## Project
Automatic Timetable Generator System
Branch: `phase2-soft-constraints`

## Tech Stack
- Frontend: React + Tailwind + Shadcn UI
- Backend: Node.js + Express
- Database: MongoDB
- Algorithm: Genetic Algorithm (ES Module, `backend/utils/timetableGenerator.js`)

---

## Phase 1 Summary (Previously Completed)
- MongoDB schema upgrades: `maxWeeklyWorkload`, `maxDailyWorkload`, `unavailableSlots`, `capacity`
- Hard constraint enforcement: teacher clashes, room clashes, teacher unavailability
- Soft constraint penalties: workload deviation, lab consecutive, room capacity
- Tournament selection (k=3), multi-operator mutation (4 types), adaptive mutation rate
- Stagnation-based exit (maxStagnation=150), global conflict-avoiding initialization
- Quality metrics v1: teacher/classroom/lab/slot utilization%, qualityScore

---

## Phase 2 Summary (This Session — Completed)

### Files Modified
- `backend/utils/timetableGenerator.js` — all changes below

### New Penalties Added
| Key | Value | Purpose |
|---|---|---|
| `SUBJECT_CONSEC_DAY` | -150 | same subject on back-to-back days |
| `TEACHER_CONSEC_LECTURE` | -25 | each lecture beyond 2 consecutive in a row |
| `TEACHER_IDLE_GAP` | -30 | gap period between teacher's lectures same day |
| `LAB_SAME_WEEK_CLUSTER` | -80 | lab on adjacent days in the same week |
| `ROOM_INCONSISTENCY` | -5 | different room used for same subject across days |

### New Rewards Added
| Key | Value | Purpose |
|---|---|---|
| `SUBJECT_SPREAD_BONUS` | +40 | subject spread with no adjacent-day clusters |
| `TEACHER_COMPACT_BONUS` | +20 | teacher's lectures are compact (no idle gaps) |
| `ROOM_CONSISTENT_BONUS` | +8 | same room used for subject consistently |
| `LAB_SPREAD_BONUS` | +35 | lab sessions on non-adjacent days |
| `DIVISION_FAIRNESS_BONUS` | +50 | all divisions have similar slot density |

### fitness() Changes (Phase 2A–2E)
- **2A** Subject consecutive-day spacing: penalise adjacent-day repeats, reward spread
- **2B** Room consistency: reward consistent room per subject, penalise scattered rooms
- **2C** Teacher consecutive-lecture & idle-gap: per-period analysis of teacher compactness
- **2D** Lab spread: reward labs scheduled on non-adjacent days
- **2E** Division fairness: penalise fill variance across divisions; bonus for balanced fills

### mutate() Changes — 5th Operator Added
- **Type 4 (12%)**: Subject spacing repair — detects consecutive-day violations and moves one occurrence to a non-adjacent free day slot (lab-aware)
- Operator probabilities rebalanced: 30/28/20/12/10

### computeQualityMetrics() Changes
- Added `subjectSpread: { violations, score }`
- Added `teacherCompactness: { idleGaps, consecRuns, score }`
- Added `divisionFairness: { fillVariance, score }`
- Updated quality score formula (7 weighted components + hard-clash bonus)

---

## Verification Results

```
Phase 1 baseline:  fitness=-5240  qualityScore=87/100  slotUtil=37%
Phase 2 result:    fitness=-3720  qualityScore=91/100  slotUtil=42%

All 8 tests passed:
  ✓ 0 teacher clashes
  ✓ 0 room clashes
  ✓ 0 unavailability violations
  ✓ 0 weekly overload violations
  ✓ All labs consecutive
  ✓ Quality score 91/100
  ✓ Hard clashes = 0
  ✓ Structure intact (2 divs x 5 days x 6 periods)
```

---

## Remaining Work (Phase 3)

### Priority 1 — Frontend Dashboard
- [ ] Display `qualityScore` as a gauge/card on Timetables page
- [ ] Show `teacherUtilization`, `classroomUtilization`, `labUtilization` as stat cards
- [ ] Show `subjectSpread.score`, `teacherCompactness.score` as quality indicators
- [ ] Add conflict list panel using `validateTimetable` response (severity-colour coded)

### Priority 2 — UI Polish
- [ ] Timetable grid: colour-code slots by subject type (theory/lab/tutorial)
- [ ] Hover tooltip showing teacher name + room on each slot
- [ ] Print/export timetable as PDF or image

### Priority 3 — Deployment
- [ ] `.env` review for production (CORS, JWT secret, MongoDB URI)
- [ ] Add `NODE_ENV=production` build config
- [ ] Write README with project setup + algorithm description

---

## Key File Locations
| File | Purpose |
|---|---|
| `backend/utils/timetableGenerator.js` | Core GA engine (all changes) |
| `backend/controllers/timetables.controller.js` | API controller + validateTimetable |
| `backend/models/teacher.model.js` | Teacher schema with workload fields |
| `backend/models/class.model.js` | Classroom schema with capacity |
| `backend/test.js` | Verification test suite |
