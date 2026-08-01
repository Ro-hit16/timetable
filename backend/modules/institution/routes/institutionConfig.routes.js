// backend/modules/institution/routes/institutionConfig.routes.js
//
// Route skeleton for InstitutionConfig. NOT mounted into server.js as
// part of this task — see NEXT_TASK.md for the follow-up integration
// step. Kept import-safe (no side effects on import) so it can be
// mounted later with a single `app.use(...)` line.

import express from 'express';
import {
  listInstitutionConfigs,
  getInstitutionConfigById,
  getInstitutionConfigByScope,
  getEffectiveInstitutionConfig,
  createInstitutionConfig,
  updateInstitutionConfig,
  deleteInstitutionConfig,
} from '../controller/institutionConfig.controller.js';

const router = express.Router();

router.get('/', listInstitutionConfigs);
router.get('/scope', getInstitutionConfigByScope); // ?departmentId=&academicYear=
router.get('/effective', getEffectiveInstitutionConfig); // ?departmentId=&academicYear= (merged w/ defaults)
router.get('/:id', getInstitutionConfigById);
router.post('/', createInstitutionConfig);
router.put('/:id', updateInstitutionConfig);
router.delete('/:id', deleteInstitutionConfig);

export default router;