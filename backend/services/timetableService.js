// services/timetableService.js
import { Timetable, EnhancedSubject } from '../models/timetable.model.js';
import TimetableGeneticAlgorithm from '../utils/timetableGenerator.js';

class TimetableService {
  constructor() {
    this.timeSlots = [
      { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
      { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
      { period: 3, start: '13:15', end: '14:15', label: '3rd Period' },
      { period: 4, start: '14:15', end: '15:15', label: '4th Period' },
      { period: 5, start: '15:30', end: '16:30', label: '5th Period' },
      { period: 6, start: '16:30', end: '17:30', label: '6th Period' }
    ];
    
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
  }

  /**
   * Generate new timetable using genetic algorithm
   */
  async generateTimetable({ departmentId, semester, academicYear, divisions, subjects, teachers, classes })
 {
  console.log("Received in service:", { departmentId, semester, academicYear, divisions, subjects, teachers, classes });

    try {
      console.log(`Generating timetable for department: ${departmentId}, semester: ${semester}`);
      
      // Initialize genetic algorithm
      const ga = new TimetableGeneticAlgorithm({
        populationSize: 100,
        maxGenerations: 200,
        mutationRate: 0.15,
        crossoverRate: 0.85,
        elitismRate: 0.1
      });
      
      // Generate timetable using genetic algorithm
      //const result = await ga.generateTimetable(departmentId, semester);
      const result = await ga.generateTimetable({ departmentId, semester, subjects, teachers, classes });

      // Convert to database format
      const timetableData = {
        department_id: departmentId,
        semester: semester,
        academic_year: academicYear,
        divisions: divisions || this.divisions,
        schedule: result.timetable.map(assignment => ({
          day: assignment.day,
          period: assignment.period,
          start_time: assignment.start_time,
          end_time: assignment.end_time,
          subject_id: assignment._id,
          teacher_id: assignment.teacher_id._id,
          division: assignment.division,
          room_number: assignment.room_number || null,
          is_lab: assignment.type === 'Lab',
          duration: assignment.duration
        })),
        generation_metadata: result.metadata,
        status: 'draft'
      };
      
      // Save to database
      const timetable = new Timetable(timetableData);
      await timetable.save();
      
      console.log(`Timetable generated successfully with ID: ${timetable._id}`);
      
      return {
        success: true,
        timetable: await this.getTimetableById(timetable._id),
        metadata: result.metadata
      };
      
    } catch (error) {
      console.error('Error generating timetable:', error);
      throw new Error(`Failed to generate timetable: ${error.message}`);
    }
  }
// async generateTimetable(departmentId, semester, academicYear, divisions = null) {
//   try {
//     console.log(`Generating timetable for department: ${departmentId}, semester: ${semester}`);
    
//     // Initialize genetic algorithm
//     const ga = new TimetableGeneticAlgorithm({
//       populationSize: 100,
//       maxGenerations: 200,
//       mutationRate: 0.15,
//       crossoverRate: 0.85,
//       elitismRate: 0.1
//     });
    
//     // Generate timetable using genetic algorithm
//     const result = await ga.generateTimetable(departmentId, semester);
//     console.log("✅ Generated timetable result:", result.timetable);
//     console.log("✅ Timetable saving to DB:", timetableData);
//     console.log("✅ GA result:", result);

//     // Build schedule map per division
//     const scheduleMap = {};
//     result.timetable.forEach(assignment => {
//       const division = assignment.division;

//       if (!scheduleMap[division]) {
//         scheduleMap[division] = [];
//       }

//       scheduleMap[division].push({
//         day: assignment.day,
//         period: assignment.period,
//         start_time: assignment.start_time,
//         end_time: assignment.end_time,
//         subject_id: assignment._id,
//         teacher_id: assignment.teacher_id._id,
//         room_number: assignment.room_number || null,
//         is_lab: assignment.type === 'Lab',
//         duration: assignment.duration
//       });
//     });

//     // Convert to database format
//     const timetableData = {
//       department_id: departmentId,
//       semester: semester,
//       academic_year: academicYear,
//       divisions: divisions || this.divisions,
//       schedule: scheduleMap,
//       generation_metadata: result.metadata,
//       status: 'draft'
//     };
    
//     // Save to database
//     const timetable = new Timetable(timetableData);
//     await timetable.save();
    
//     console.log(`Timetable generated successfully with ID: ${timetable._id}`);
    
//     return {
//       success: true,
//       timetable: await this.getTimetableById(timetable._id),
//       metadata: result.metadata
//     };
    
//   } catch (error) {
//     console.error('Error generating timetable:', error);
//     throw new Error(`Failed to generate timetable: ${error.message}`);
//   }
// }

  /**
   * Get timetable by ID with populated data
   */
  async getTimetableById(timetableId) {
    try {
      const timetable = await Timetable.findById(timetableId)
        .populate({
          path: 'schedule.subject_id',
          select: 'subjectName subject_code type credits'
        })
        .populate({
          path: 'schedule.teacher_id',
          select: 'name email'
        })
        .populate('department_id', 'name')
        .lean();
      
      if (!timetable) {
        throw new Error('Timetable not found');
      }
      
      return timetable;
    } catch (error) {
      console.error('Error fetching timetable:', error);
      throw error;
    }
  }

  /**
   * Get formatted timetable for frontend display
   */
  async getFormattedTimetable(timetableId) {
    try {
      const timetable = await this.getTimetableById(timetableId);
      
      // Group schedule by division and day
      const formattedSchedule = {};
      
      // Initialize structure
      this.divisions.forEach(division => {
        formattedSchedule[division] = {};
        this.days.forEach(day => {
          formattedSchedule[division][day] = {};
          this.timeSlots.forEach(slot => {
            formattedSchedule[division][day][slot.period] = {
              period: slot.period,
              start_time: slot.start,
              end_time: slot.end,
              label: slot.label,
              subject: null,
              teacher: null,
              type: 'Empty',
              is_lab: false,
              duration: 1
            };
          });
        });
      });
      
      // Fill with actual schedule data
      timetable.schedule.forEach(slot => {
        if (formattedSchedule[slot.division] && formattedSchedule[slot.division][slot.day]) {
          const targetSlot = formattedSchedule[slot.division][slot.day][slot.period];
          
          targetSlot.subject = slot.subject_id;
          targetSlot.teacher = slot.teacher_id;
          targetSlot.type = slot.is_lab ? 'Lab' : (slot.subject_id?.type || 'Theory');
          targetSlot.is_lab = slot.is_lab;
          targetSlot.duration = slot.duration;
          targetSlot.room_number = slot.room_number;
          
          // For 2-hour labs, mark the next slot as occupied
          if (slot.duration === 2 && slot.period < 6) {
            const nextSlot = formattedSchedule[slot.division][slot.day][slot.period + 1];
            if (nextSlot) {
              nextSlot.subject = slot.subject_id;
              nextSlot.teacher = slot.teacher_id;
              nextSlot.type = 'Lab_Continue';
              nextSlot.is_lab = true;
              nextSlot.duration = 0; // Mark as continuation
              nextSlot.room_number = slot.room_number;
            }
          }
        }
      });
      // 🪵 Debugging: Log schedule for each division
Object.entries(formattedSchedule).forEach(([division, schedule]) => {
  console.log(`🗓️ Division Schedule for ${division}:`, schedule);
});

      return {
        ...timetable,
        formatted_schedule: formattedSchedule,
        statistics: this.calculateTimetableStatistics(timetable)
      };
      
    } catch (error) {
      console.error('Error formatting timetable:', error);
      throw error;
    }
  }

  /**
   * Get all timetables for a department
   */
  async getTimetablesByDepartment(departmentId, semester = null, academicYear = null) {
    try {
      const query = { department_id: departmentId };
      
      if (semester) query.semester = semester;
      if (academicYear) query.academic_year = academicYear;
      
      const timetables = await Timetable.find(query)
        .populate('department_id', 'name')
        .select('-schedule') // Exclude schedule for list view
        .sort({ createdAt: -1 })
        .lean();
      
      return timetables;
    } catch (error) {
      console.error('Error fetching timetables:', error);
      throw error;
    }
  }

  /**
   * Update timetable status
   */
  async updateTimetableStatus(timetableId, status) {
    try {
      const validStatuses = ['draft', 'published', 'archived'];
      
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }
      
      const timetable = await Timetable.findByIdAndUpdate(
        timetableId,
        { status: status },
        { new: true }
      );
      
      if (!timetable) {
        throw new Error('Timetable not found');
      }
      
      return timetable;
    } catch (error) {
      console.error('Error updating timetable status:', error);
      throw error;
    }
  }

  /**
   * Delete timetable
   */
  async deleteTimetable(timetableId) {
    try {
      const timetable = await Timetable.findByIdAndDelete(timetableId);
      
      if (!timetable) {
        throw new Error('Timetable not found');
      }
      
      return { success: true, message: 'Timetable deleted successfully' };
    } catch (error) {
      console.error('Error deleting timetable:', error);
      throw error;
    }
  }

  /**
   * Validate timetable for conflicts
   */
  async validateTimetable(timetableId) {
    try {
      const timetable = await this.getTimetableById(timetableId);
      const conflicts = [];
      
      // Check for teacher conflicts
      const teacherSlots = new Map();
      const divisionSlots = new Map();
      
      timetable.schedule.forEach((slot, index) => {
        const periods = slot.duration === 2 ? 
          [slot.period, slot.period + 1] : [slot.period];
        
        periods.forEach(period => {
          const teacherKey = `${slot.teacher_id._id}_${slot.day}_${period}`;
          const divisionKey = `${slot.division}_${slot.day}_${period}`;
          
          // Check teacher conflict
          if (teacherSlots.has(teacherKey)) {
            conflicts.push({
              type: 'teacher_conflict',
              message: `Teacher ${slot.teacher_id.name} has conflicting classes`,
              details: {
                slot1: teacherSlots.get(teacherKey),
                slot2: slot
              }
            });
          } else {
            teacherSlots.set(teacherKey, slot);
          }
          
          // Check division conflict
          if (divisionSlots.has(divisionKey)) {
            conflicts.push({
              type: 'division_conflict',
              message: `Division ${slot.division} has conflicting classes`,
              details: {
                slot1: divisionSlots.get(divisionKey),
                slot2: slot
              }
            });
          } else {
            divisionSlots.set(divisionKey, slot);
          }
        });
      });
      
      return {
        isValid: conflicts.length === 0,
        conflicts: conflicts,
        conflictCount: conflicts.length
      };
      
    } catch (error) {
      console.error('Error validating timetable:', error);
      throw error;
    }
  }

  /**
   * Calculate timetable statistics
   */
  calculateTimetableStatistics(timetable) {
    const stats = {
      total_slots: 0,
      filled_slots: 0,
      empty_slots: 0,
      lab_slots: 0,
      theory_slots: 0,
      divisions_count: new Set(),
      teachers_count: new Set(),
      subjects_count: new Set(),
      utilization_percentage: 0
    };
    
    // Calculate total possible slots
    const totalPossibleSlots = this.divisions.length * this.days.length * this.timeSlots.length;
    stats.total_slots = totalPossibleSlots;
    
    // Analyze schedule
    timetable.schedule.forEach(slot => {
      stats.filled_slots++;
      stats.divisions_count.add(slot.division);
      stats.teachers_count.add(slot.teacher_id._id || slot.teacher_id);
      stats.subjects_count.add(slot.subject_id._id || slot.subject_id);
      
      if (slot.is_lab) {
        stats.lab_slots++;
      } else {
        stats.theory_slots++;
      }
    });
    
    stats.empty_slots = totalPossibleSlots - stats.filled_slots;
    stats.utilization_percentage = ((stats.filled_slots / totalPossibleSlots) * 100).toFixed(2);
    
    // Convert sets to counts
    stats.divisions_count = stats.divisions_count.size;
    stats.teachers_count = stats.teachers_count.size;
    stats.subjects_count = stats.subjects_count.size;
    
    return stats;
  }

  /**
   * Export timetable to different formats
   */
  async exportTimetable(timetableId, format = 'json') {
    try {
      const timetable = await this.getFormattedTimetable(timetableId);
      
      switch (format.toLowerCase()) {
        case 'json':
          return {
            format: 'json',
            data: timetable
          };
          
        case 'csv':
          return {
            format: 'csv',
            data: this.convertToCSV(timetable)
          };
          
        case 'pdf':
          // This would require a PDF generation library
          throw new Error('PDF export not implemented yet');
          
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting timetable:', error);
      throw error;
    }
  }

  /**
   * Convert timetable to CSV format
   */
  convertToCSV(timetable) {
    const csvRows = [];
    const headers = ['Division', 'Day', 'Period', 'Start Time', 'End Time', 'Subject', 'Teacher', 'Type', 'Room'];
    csvRows.push(headers.join(','));
    
    timetable.schedule.forEach(slot => {
      const row = [
        slot.division,
        slot.day,
        slot.period,
        slot.start_time,
        slot.end_time,
        slot.subject_id?.subjectName || 'N/A',
        slot.teacher_id?.name || 'N/A',
        slot.is_lab ? 'Lab' : 'Theory',
        slot.room_number || 'N/A'
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  /**
   * Get teacher's schedule across all divisions
   */
  async getTeacherSchedule(teacherId, departmentId, semester) {
    try {
      const timetables = await Timetable.find({
        department_id: departmentId,
        semester: semester,
        status: 'published'
      }).populate({
        path: 'schedule.subject_id',
        select: 'subjectName subject_code type'
      }).lean();
      
      const teacherSchedule = [];
      
      timetables.forEach(timetable => {
        timetable.schedule.forEach(slot => {
          if (slot.teacher_id.toString() === teacherId) {
            teacherSchedule.push({
              ...slot,
              timetable_id: timetable._id
            });
          }
        });
      });
      
      // Sort by day and period
      teacherSchedule.sort((a, b) => {
        const dayOrder = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
        if (dayOrder[a.day] !== dayOrder[b.day]) {
          return dayOrder[a.day] - dayOrder[b.day];
        }
        return a.period - b.period;
      });
      
      return teacherSchedule;
    } catch (error) {
      console.error('Error fetching teacher schedule:', error);
      throw error;
    }
  }

  /**
   * Get division-wise workload distribution
   */
  async getDivisionWorkload(departmentId, semester) {
    try {
      const timetables = await Timetable.find({
        department_id: departmentId,
        semester: semester,
        status: 'published'
      }).populate({
        path: 'schedule.teacher_id',
        select: 'name'
      }).populate({
        path: 'schedule.subject_id',
        select: 'subjectName type'
      }).lean();
      
      const workload = {};
      
      this.divisions.forEach(division => {
        workload[division] = {
          total_hours: 0,
          theory_hours: 0,
          lab_hours: 0,
          teachers: new Set(),
          subjects: new Set()
        };
      });
      
      timetables.forEach(timetable => {
        timetable.schedule.forEach(slot => {
          const division = slot.division;
          if (workload[division]) {
            workload[division].total_hours += slot.duration;
            workload[division].teachers.add(slot.teacher_id.name);
            workload[division].subjects.add(slot.subject_id.subjectName);
            
            if (slot.is_lab) {
              workload[division].lab_hours += slot.duration;
            } else {
              workload[division].theory_hours += slot.duration;
            }
          }
        });
      });
      
      // Convert sets to arrays
      Object.keys(workload).forEach(division => {
        workload[division].teachers = Array.from(workload[division].teachers);
        workload[division].subjects = Array.from(workload[division].subjects);
        workload[division].teacher_count = workload[division].teachers.length;
        workload[division].subject_count = workload[division].subjects.length;
      });
      
      return workload;
    } catch (error) {
      console.error('Error calculating division workload:', error);
      throw error;
    }
  }
}

export default new TimetableService();