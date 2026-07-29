// backend/modules/institution/routes/institutionConfig.routes.js
//
// Route table for InstitutionConfig. Mounted under /api/institution/config
// via modules/institution/routes/index.js -> server.js.
//
// IMPORTANT: '/scope' and '/effective' are literal paths and MUST be
// declared before the '/:id' param route below, or Express would match
// "scope"/"effective" as an :id value instead.

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
router.get('/effective', getEffectiveInstitutionConfig); // ?departmentId=&academicYear= — merged, read-only
router.get('/:id', getInstitutionConfigById);
router.post('/', createInstitutionConfig);
router.put('/:id', updateInstitutionConfig);
router.delete('/:id', deleteInstitutionConfig);

export default router;