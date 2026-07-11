// backend/modules/institution/routes/teacherPreference.routes.js
//
// Route skeleton for TeacherPreference. NOT mounted into server.js as
// part of this task.

import express from 'express';
import {
  listTeacherPreferences,
  getTeacherPreferenceById,
  getTeacherPreferenceByScope,
  createTeacherPreference,
  updateTeacherPreference,
  deleteTeacherPreference,
} from '../controller/teacherPreference.controller.js';

const router = express.Router();

router.get('/', listTeacherPreferences);
router.get('/scope', getTeacherPreferenceByScope); // ?teacherId=&academicYear=
router.get('/:id', getTeacherPreferenceById);
router.post('/', createTeacherPreference);
router.put('/:id', updateTeacherPreference);
router.delete('/:id', deleteTeacherPreference);

export default router;