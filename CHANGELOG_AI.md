# CHANGELOG AI

All notable changes made by the AI pair programmer in Phase 3 & 4.

## [Phase 4] - 2026-07-04

### Added
- Modular scheduling engines:
  - `backend/utils/timetable/config.js` (parameters and penalty metrics)
  - `backend/utils/timetable/utils.js` (helper workload routines)
  - `backend/utils/timetable/qualityEngine.js` (evaluation metrics processor)
  - `backend/utils/timetable/fitnessCalculator.js` (modular fitness evaluator)
  - `backend/utils/timetable/geneticOperators.js` (selection, crossover, mutation routines)
- Handoff file `PROJECT_HANDOFF_PHASE4.md`

### Changed
- Refactored `backend/utils/timetableGenerator.js` to inherit modular engine components.

---

## [Phase 3] - 2026-07-04

### Added
- Quality dashboard Circular Gauge, Resource Utilization widgets, and Integrity Conflict Panel in `frontend/src/pages/Timetables/Timetables.jsx`.
- Click-to-print export formats.
- Handoff file `PROJECT_HANDOFF_PHASE3.md`

### Changed
- Mongoose schema additions to `backend/models/timetable.model.js`.
- Custom cell colors and tooltip details in `frontend/src/utils/timetableUtils.jsx`.
