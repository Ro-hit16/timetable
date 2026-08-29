// backend/modules/examination/service/examTimetable.service.js
//
// CRUD for ExamTimetable plus auto seat allocation. Auto seat allocation
// is a simple bin-packing pass across the given rooms in the order
// supplied — it is NOT the Genetic Algorithm and does not touch
// timetableGenerator.js.

import ApiError from '../../../utils/ApiError.js';
import examTimetableRepository from '../repository/examTimetable.repository.js';
import { validateExamTimetable } from './examValidation.service.js';

// Extracts the trailing numeric portion of a PRN so ranges like "CS2201"
// can be split across rooms without a real Student collection (none
// exists in this project yet).
const numericPart = (prn) => {
  const match = String(prn).match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

// Splits each student allocation's PRN range across the given rooms,
// filling one room's capacity before moving to the next. Pure function —
// no DB access, no mutation of the arguments passed in.
export const autoAllocateSeats = ({ studentAllocations = [], roomAllocations = [] }) => {
  const rooms = roomAllocations.map((r) => ({ ...r, allocatedSeats: 0 }));
  const allocatedStudentEntries = [];

  for (const entry of studentAllocations) {
    let remaining = entry.numberOfStudents;
    const startNum = numericPart(entry.prnStart);
    let cursor = startNum;

    for (const room of rooms) {
      if (remaining <= 0) break;
      const freeSeats = room.capacity - room.allocatedSeats;
      if (freeSeats <= 0) continue;

      const seatsForThisRoom = Math.min(freeSeats, remaining);
      const seatStart = room.allocatedSeats + 1;
      const seatEnd = seatStart + seatsForThisRoom - 1;

      allocatedStudentEntries.push({
        ...entry,
        roomId: room.roomId,
        seatStart,
        seatEnd,
        numberOfStudents: seatsForThisRoom,
        prnStart: cursor !== null ? String(cursor) : entry.prnStart,
        prnEnd: cursor !== null ? String(cursor + seatsForThisRoom - 1) : entry.prnEnd,
      });

      room.allocatedSeats += seatsForThisRoom;
      if (cursor !== null) cursor += seatsForThisRoom;
      remaining -= seatsForThisRoom;
    }

    if (remaining > 0) {
      throw new ApiError(
        422,
        `Not enough room capacity to seat all students for PRN range ${entry.prnStart}-${entry.prnEnd}`,
        [{ type: 'CAPACITY_OVERFLOW', shortfall: remaining }]
      );
    }
  }

  return { studentAllocations: allocatedStudentEntries, roomAllocations: rooms };
};

export const listExamTimetables = async (filter = {}) => examTimetableRepository.findAll(filter);

export const getExamTimetableById = async (id) => {
  const entry = await examTimetableRepository.findById(id);
  if (!entry) throw new ApiError(404, `ExamTimetable ${id} not found`);
  return entry;
};

export const listExamTimetablesByExamId = async (examId) =>
  examTimetableRepository.findByExamId(examId);

export const createExamTimetable = async (data) => {
  const { maxInvigilationsPerDay, ...payload } = data;

  let { studentAllocations, roomAllocations } = payload;
  if (studentAllocations?.length && roomAllocations?.length) {
    const autoAllocated = autoAllocateSeats({ studentAllocations, roomAllocations });
    studentAllocations = autoAllocated.studentAllocations;
    roomAllocations = autoAllocated.roomAllocations;
  }

  await validateExamTimetable({
    date: payload.date,
    timeSlot: payload.timeSlot,
    divisions: payload.divisions,
    roomAllocations,
    studentAllocations,
    invigilators: payload.invigilators,
    maxInvigilationsPerDay,
  });

  return examTimetableRepository.create({ ...payload, roomAllocations, studentAllocations });
};

export const updateExamTimetable = async (id, data) => {
  const existing = await examTimetableRepository.findById(id);
  if (!existing) throw new ApiError(404, `ExamTimetable ${id} not found`);

  const { maxInvigilationsPerDay, ...payload } = data;

  let studentAllocations = payload.studentAllocations ?? existing.studentAllocations;
  let roomAllocations = payload.roomAllocations ?? existing.roomAllocations;

  if (payload.studentAllocations && payload.roomAllocations) {
    const autoAllocated = autoAllocateSeats({ studentAllocations, roomAllocations });
    studentAllocations = autoAllocated.studentAllocations;
    roomAllocations = autoAllocated.roomAllocations;
  }

  await validateExamTimetable({
    date: payload.date ?? existing.date,
    timeSlot: payload.timeSlot ?? existing.timeSlot,
    divisions: payload.divisions ?? existing.divisions,
    roomAllocations,
    studentAllocations,
    invigilators: payload.invigilators ?? existing.invigilators,
    maxInvigilationsPerDay,
    excludeId: id,
  });

  return examTimetableRepository.updateById(id, { ...payload, roomAllocations, studentAllocations });
};

export const deleteExamTimetable = async (id) => {
  const deleted = await examTimetableRepository.deleteById(id);
  if (!deleted) throw new ApiError(404, `ExamTimetable ${id} not found`);
  return deleted;
};

export default {
  autoAllocateSeats,
  listExamTimetables,
  getExamTimetableById,
  listExamTimetablesByExamId,
  createExamTimetable,
  updateExamTimetable,
  deleteExamTimetable,
};