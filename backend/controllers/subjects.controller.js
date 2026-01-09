
import Subject from '../models/subject.model.js';
import { creatActivity } from './activity.controller.js';
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    //add activity
    await creatActivity({
  type: 'subject',
  action: 'Subject updated',
  details: `${subject.name} syllabus modified`
});

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// export const getAllSubjects = async (req, res) => {
//   try {
//     const { search = '', department_id, sem_id, teacher_id, type, page = 1, limit = 10 } = req.query;
//     const query = {};
//     if (search) query.$or = [
//       { subjectName: new RegExp(search, 'i') },
//       { subject_code: new RegExp(search, 'i') }
//     ];
//     if (department_id) query.department_id = department_id;
//     if (sem_id) query.sem_id = sem_id;
//     if (teacher_id) query.teacher_id = teacher_id;
//     if (type) query.type = type;

//     const subjects = await Subject.find(query)
//       .populate('department_id')
//       .populate('teacher_id')
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await Subject.countDocuments(query);
//     res.json({
//       success: true,
//       data: {
//         subjects,
//         pagination: {
//           page: Number(page),
//           totalPages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching subjects:', error);
//     res.status(500).json({ success: false, message: 'Error fetching subjects' });
//   }
// };


export const getAllSubjects = async (req, res) => {
  try {
    const {
      search = '',
      department_id,
      sem_id,
      teacher_id,
      type,
      page,
      limit
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { subjectName: new RegExp(search, 'i') },
        { subject_code: new RegExp(search, 'i') }
      ];
    }

    if (department_id) query.department_id = department_id;
    if (sem_id) query.sem_id = sem_id;
    if (teacher_id) query.teacher_id = teacher_id;
    if (type) query.type = type;

    let subjectsQuery = Subject.find(query)
      .populate('department_id', 'departmentName')
      .populate('teacher_id', 'name');

    // 🔥 IMPORTANT:
    // If page & limit are provided → paginate
    // Else → return ALL (for timetable generation)
    if (page && limit) {
      const pageNum = Number(page);
      const limitNum = Number(limit);

      subjectsQuery = subjectsQuery
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      const subjects = await subjectsQuery;
      const total = await Subject.countDocuments(query);

      return res.json({
        success: true,
        data: {
          subjects,
          pagination: {
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalRecords: total
          }
        }
      });
    }

    // 🟢 NO pagination → return all subjects
    const subjects = await subjectsQuery;

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects'
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, data: subject });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ success: false, message: 'Error deleting subject' });
  }
};

export const getSubjectStats = async (req, res) => {
  try {
    const totalSubjects = await Subject.countDocuments();
    const subjectsByTypeAgg = await Subject.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const subjectsByType = {};
    subjectsByTypeAgg.forEach(t => {
      subjectsByType[t._id] = t.count;
    });
    res.json({ success: true, data: { totalSubjects, subjectsByType } });
  } catch (error) {
    console.error('Error fetching subject stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};
