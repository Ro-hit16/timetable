// backend/modules/institution/routes/departmentPreference.routes.js
//
// Route skeleton for DepartmentPreference. NOT mounted into server.js as
// part of this task.

import express from 'express';
import {
  listDepartmentPreferences,
  getDepartmentPreferenceById,
  getDepartmentPreferenceByScope,
  createDepartmentPreference,
  updateDepartmentPreference,
  deleteDepartmentPreference,
} from '../controller/departmentPreference.controller.js';

const router = express.Router();

router.get('/', listDepartmentPreferences);
router.get('/scope', getDepartmentPreferenceByScope); // ?departmentId=&academicYear=
router.get('/:id', getDepartmentPreferenceById);
router.post('/', createDepartmentPreference);
router.put('/:id', updateDepartmentPreference);
router.delete('/:id', deleteDepartmentPreference);

export default router;