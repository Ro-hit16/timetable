// backend/modules/institution/routes/index.js
//
// Aggregates every route sub-router in the institution module under one
// Express router, so a future integration step can mount the entire
// module with a single line, e.g.:
//
//   import institutionRoutes from './modules/institution/routes/index.js';
//   app.use('/api/institution', institutionRoutes);
//
// This file is NOT imported by server.js as part of this task — no
// route in this module is reachable over HTTP yet. See NEXT_TASK.md.

import express from 'express';
import institutionConfigRoutes from './institutionConfig.routes.js';
import teacherPreferenceRoutes from './teacherPreference.routes.js';
import departmentPreferenceRoutes from './departmentPreference.routes.js';
import gaProfileRoutes from './gaProfile.routes.js';

const router = express.Router();

router.use('/config', institutionConfigRoutes);
router.use('/teacher-preferences', teacherPreferenceRoutes);
router.use('/department-preferences', departmentPreferenceRoutes);
router.use('/ga-profile', gaProfileRoutes);

export default router;