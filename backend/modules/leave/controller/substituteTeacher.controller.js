// backend/modules/leave/controller/substituteTeacher.controller.js
//
// Read-only endpoint exposing the Substitute Teacher Engine. Does not
// assign anything; only returns ranked suggestions.

import asyncHandler from '../../../utils/async-handler.js';
import { sendResponse } from '../../../utils/response.js';
import ApiError from '../../../utils/ApiError.js';
import substituteTeacherService from '../service/substituteTeacher.service.js';

// GET /api/leave/substitutes/slot?originalTeacherId=&subjectId=&day=&period=
export const suggestSubstitutesForSlot = asyncHandler(async (req, res) => {
  const { originalTeacherId, subjectId, day, period } = req.query;
  if (!originalTeacherId || !day || !period) {
    throw new ApiError(400, 'originalTeacherId, day, and period are required');
  }
  const candidates = await substituteTeacherService.suggestSubstitutesForSlot({
    originalTeacherId,
    subjectId,
    day,
    period: parseInt(period, 10),
  });
  return sendResponse(res, 200, true, 'Substitute suggestions fetched', candidates);
});

export default { suggestSubstitutesForSlot };