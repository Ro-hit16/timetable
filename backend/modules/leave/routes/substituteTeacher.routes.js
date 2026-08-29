import express from 'express';
import { suggestSubstitutesForSlot } from '../controller/substituteTeacher.controller.js';

const router = express.Router();

router.get('/slot', suggestSubstitutesForSlot);

export default router;