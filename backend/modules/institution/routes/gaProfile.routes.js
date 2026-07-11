// backend/modules/institution/routes/gaProfile.routes.js
//
// Route skeleton for GAProfile. NOT mounted into server.js as part of
// this task.

import express from 'express';
import {
  listGAProfiles,
  getGAProfileById,
  getGAProfileByScope,
  createGAProfile,
  updateGAProfile,
  deleteGAProfile,
} from '../controller/gaProfile.controller.js';

const router = express.Router();

router.get('/', listGAProfiles);
router.get('/scope', getGAProfileByScope); // ?departmentId=&academicYear=
router.get('/:id', getGAProfileById);
router.post('/', createGAProfile);
router.put('/:id', updateGAProfile);
router.delete('/:id', deleteGAProfile);

export default router;