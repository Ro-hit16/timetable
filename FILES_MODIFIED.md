# FILES MODIFIED

The following files were modified/created during Phase 3 & Phase 4:

## Backend
- `backend/models/timetable.model.js` (extended metadata schema)
- `backend/controllers/timetables.controller.js` (populated metrics in database)
- `backend/utils/timetableGenerator.js` (refactored to import modular engines)
- `backend/utils/timetable/config.js` [NEW] (decoupled configuration parameters)
- `backend/utils/timetable/utils.js` [NEW] (workload and spacing helper utilities)
- `backend/utils/timetable/qualityEngine.js` [NEW] (modular quality evaluation)
- `backend/utils/timetable/fitnessCalculator.js` [NEW] (modular fitness evaluator)
- `backend/utils/timetable/geneticOperators.js` [NEW] (genetic operators logic)

## Frontend
- `frontend/src/pages/Timetables/Timetables.jsx` (implemented quality score gauge, utilization bars, integrity panel, print exports)
- `frontend/src/utils/timetableUtils.jsx` (added dynamic cell coloring, hover tooltips)
