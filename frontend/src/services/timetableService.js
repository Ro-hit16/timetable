// import api from './api';

// import timetableService from "../../../backend/services/timetableService";

// const timetableService = {
//   getAllTimetables: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return await api.get(`/timetables?${queryString}`);
//   },

//   getTimetableById: async (id) => {
//     return await api.get(`/timetables/${id}`);
//   },

//   createTimetable: async (timetableData) => {
//     return await api.post('/timetables', timetableData);
//   },

//   updateTimetable: async (id, timetableData) => {
//     return await api.put(`/timetables/${id}`, timetableData);
//   },

//   deleteTimetable: async (id) => {
//     return await api.delete(`/timetables/${id}`);
//   },

//   getTimetablesByClass: async (classId) => {
//     return await api.get(`/timetables/class/${classId}`);
//   },

//   getTimetablesByTeacher: async (teacherId) => {
//     return await api.get(`/timetables/teacher/${teacherId}`);
//   },

//   getTimetablesBySemester: async (semesterId) => {
//     return await api.get(`/timetables/semester/${semesterId}`);
//   },

//   getTimetablesByDepartment: async (departmentId) => {
//     return await api.get(`/timetables/department/${departmentId}`);
//   },

//   generateTimetable: async (parameters) => {
//     return await api.post('/timetables/generate', parameters);
//   },

//   validateTimetable: async (timetableData) => {
//     return await api.post('/timetables/validate', timetableData);
//   },

//   exportTimetable: async (id, format = 'pdf') => {
//     return await api.get(`/timetables/${id}/export?format=${format}`, {
//       responseType: 'blob',
//     });
//   },

//   getConflicts: async (timetableId) => {
//     return await api.get(`/timetables/${timetableId}/conflicts`);
//   }
// };

// export default timetableService;


// import api from './api';

// const timetableService = {
//   getAllTimetables: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/timetables?${queryString}`);
//     return res.data; // ✅ return only actual data
//   },

//   getTimetableById: async (id) => {
//     return await api.get(`/timetables/${id}`);
//   },

//   createTimetable: async (timetableData) => {
//     return await api.post('/timetables', timetableData);
//   },

//   updateTimetable: async (id, timetableData) => {
//     return await api.put(`/timetables/${id}`, timetableData);
//   },

//   deleteTimetable: async (id) => {
//     return await api.delete(`/timetables/${id}`);
//   },

//   getTimetablesByClass: async (classId) => {
//     return await api.get(`/timetables/class/${classId}`);
//   },

//   getTimetablesByTeacher: async (teacherId) => {
//     return await api.get(`/timetables/teacher/${teacherId}`);
//   },

//   getTimetablesBySemester: async (semesterId) => {
//     return await api.get(`/timetables/semester/${semesterId}`);
//   },

//   getTimetablesByDepartment: async (departmentId) => {
//     return await api.get(`/timetables/department/${departmentId}`);
//   },

//   generateTimetable: async (parameters) => {
//     return await api.post('/timetables/generate', parameters);
//   },

//   validateTimetable: async (timetableData) => {
//     return await api.post('/timetables/validate', timetableData);
//   },

//   exportTimetable: async (id, format = 'pdf') => {
//     return await api.get(`/timetables/${id}/export?format=${format}`, {
//       responseType: 'blob',
//     });
//   },

//   getConflicts: async (timetableId) => {
//     return await api.get(`/timetables/${timetableId}/conflicts`);
//   }
// };

// export default timetableService;


// timetableService.js
// import api from './api';

// const timetableService = {
//   getAllTimetables: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const res = await api.get(`/timetables?${queryString}`);
//     return Array.isArray(res.data) ? res.data : res.data.timetables || [];
//   },

//   getTimetableById: async (id) => await api.get(`/timetables/${id}`),
//   createTimetable: async (timetableData) => await api.post('/timetables', timetableData),
//   updateTimetable: async (id, timetableData) => await api.put(`/timetables/${id}`, timetableData),
//   deleteTimetable: async (id) => await api.delete(`/timetables/${id}`),

//   getTimetablesByClass: async (classId) => await api.get(`/timetables/class/${classId}`),
//   getTimetablesByTeacher: async (teacherId) => await api.get(`/timetables/teacher/${teacherId}`),
//   getTimetablesBySemester: async (semesterId) => await api.get(`/timetables/semester/${semesterId}`),
//   getTimetablesByDepartment: async (departmentId) => await api.get(`/timetables/department/${departmentId}`),

//   generateTimetable: async (parameters) => await api.post('/timetables/generate', parameters),
//   validateTimetable: async (timetableData) => await api.post('/timetables/validate', timetableData),
//   exportTimetable: async (id, format = 'pdf') => await api.get(`/timetables/${id}/export?format=${format}`, { responseType: 'blob' }),
//   getConflicts: async (timetableId) => await api.get(`/timetables/${timetableId}/conflicts`)
// };

// export default timetableService;

// import api from './api';

// const timetableService = {
//   // Main CRUD operations
//   getAllTimetables: async (params = {}) => {
//     try {
//       const queryString = new URLSearchParams(params).toString();
//       const response = await api.get(`/timetables?${queryString}`);
//       return {
//         success: true,
//         data: response.data?.data || [],
//         pagination: response.data?.pagination || {}
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error fetching timetables',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   getTimetableById: async (id) => {
//     try {
//       const response = await api.get(`/timetables/${id}`);
//       return {
//         success: true,
//         data: response.data?.data || {}
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error fetching timetable',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   createTimetable: async (timetableData) => {
//     try {
//       const response = await api.post('/timetables', timetableData);
//       return {
//         success: true,
//         data: response.data?.data || {},
//         message: response.data?.message || 'Timetable created successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error creating timetable',
//         error: error.response?.data?.error || error.message,
//         conflicts: error.response?.data?.conflicts || []
//       };
//     }
//   },

//   updateTimetable: async (id, timetableData) => {
//     try {
//       const response = await api.put(`/timetables/${id}`, timetableData);
//       return {
//         success: true,
//         data: response.data?.data || {},
//         message: response.data?.message || 'Timetable updated successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error updating timetable',
//         error: error.response?.data?.error || error.message,
//         conflicts: error.response?.data?.conflicts || []
//       };
//     }
//   },

//   deleteTimetable: async (id) => {
//     try {
//       const response = await api.delete(`/timetables/${id}`);
//       return {
//         success: true,
//         message: response.data?.message || 'Timetable deleted successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error deleting timetable',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   // Timetable generation
//   generateTimetable: async (parameters) => {
//     try {
//       const response = await api.post('/timetables/generate', parameters);
//       return {
//         success: true,
//         data: response.data?.data || {},
//         message: response.data?.message || 'Timetable generated successfully'
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error generating timetable',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   // Department-specific timetables
//   getTimetablesByDepartment: async (department_id) => {
//     try {
//       const response = await api.get(`/timetables/department/${department_id}`);
//       return {
//         success: true,
//         data: response.data?.data || []
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error fetching department timetables',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   // Dropdown data
//   getDepartments: async () => {
//     try {
//       const response = await api.get('/timetables/data/departments');
//       return {
//         success: true,
//         data: response.data?.data || []
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error fetching departments',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   getSemestersByDepartment: async (department_id) => {
//     try {
//       const response = await api.get(`/timetables/data/semesters/${department_id}`);
//       return {
//         success: true,
//         data: response.data?.data || []
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error fetching semesters',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   getSubjectsBySemester: async (sem_id) => {
//     try {
//       const response = await api.get(`/timetables/data/subjects/${sem_id}`);
//       return {
//         success: true,
//         data: response.data?.data || []
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error fetching subjects',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   // Conflict checking
//   checkConflicts: async (conflictData) => {
//     try {
//       const response = await api.post('/timetables/check-conflicts', conflictData);
//       return {
//         success: true,
//         hasConflicts: response.data?.hasConflicts || false,
//         conflicts: response.data?.conflicts || []
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error checking conflicts',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   // Export functionality
//   exportTimetable: async (id, format = 'pdf') => {
//     try {
//       const response = await api.get(`/timetables/${id}/export?format=${format}`, {
//         responseType: 'blob'
//       });
//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Error exporting timetable',
//         error: error.response?.data?.error || error.message
//       };
//     }
//   },

//   // Search functionality
//   searchTimetables: async (searchTerm, filters = {}) => {
//     try {
//       const params = {
//         search: searchTerm,
//         ...filters
//       };
//       return await timetableService.getAllTimetables(params);
//     } catch (error) {
//       return {
//         success: false,
//         message: 'Error searching timetables',
//         error: error.message
//       };
//     }
//   }
// };

// export default timetableService;




// //import api from'./api
// import api from './api';

// const timetableService = {
//   // Main CRUD operations
//   getAllTimetables: async (filters = {}) => {
//     try {
//       const queryParams = new URLSearchParams();
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value);
//       });
      
//       const response = await api.get(`/timetables?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching timetables:', error);
//       throw error;
//     }
//   },

//   getTimetableById: async (id) => {
//     try {
//       const response = await api.get(`/timetables/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching timetable:', error);
//       throw error;
//     }
//   },

//   generateTimetable: async (departmentId, semesterId) => {
//     try {
//       const response = await api.post('/timetables/generate', {
//         department_id: departmentId,
//         sem_id: semesterId
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error generating timetable:', error);
//       throw error;
//     }
//   },

//   updateTimetable: async (id, updateData) => {
//     try {
//       const response = await api.put(`/timetables/${id}`, updateData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating timetable:', error);
//       throw error;
//     }
//   },

//   deleteTimetable: async (id) => {
//     try {
//       const response = await api.delete(`/timetables/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting timetable:', error);
//       throw error;
//     }
//   },

//   deleteTimetableByDeptSem: async (departmentId, semesterId) => {
//     try {
//       const response = await api.delete('/timetables/bulk', {
//         data: {
//           department_id: departmentId,
//           sem_id: semesterId
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting timetables:', error);
//       throw error;
//     }
//   },

//   getFormattedTimetable: async (departmentId, semesterId) => {
//     try {
//       const response = await api.get('/timetables/formatted', {
//         params: {
//           department_id: departmentId,
//           sem_id: semesterId
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching formatted timetable:', error);
//       throw error;
//     }
//   },

//   // Time slots configuration matching backend
//   getTimeSlots: () => ({
//     lecture: [
//       { start: '10:30', end: '11:30', label: '1st Period' },
//       { start: '11:30', end: '12:30', label: '2nd Period' },
//       { start: '13:15', end: '14:15', label: '3rd Period' },
//       { start: '14:15', end: '15:15', label: '4th Period' },
//       { start: '15:30', end: '16:30', label: '5th Period' },
//       { start: '16:30', end: '17:30', label: '6th Period' }
//     ],
//     lab: [
//       { start: '10:30', end: '12:30', label: 'Lab Session 1' },
//       { start: '13:15', end: '15:15', label: 'Lab Session 2' },
//       { start: '15:30', end: '17:30', label: 'Lab Session 3' }
//     ],
//     breaks: [
//       { start: '12:30', end: '13:15', name: 'Lunch Break' },
//       { start: '15:15', end: '15:30', name: 'Tea Break' }
//     ]
//   }),

//   // Days of week - Monday to Friday only
//   getDaysOfWeek: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

//   // Format time for display
//   formatTime: (time) => {
//     const [hours, minutes] = time.split(':');
//     const hour24 = parseInt(hours);
//     const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
//     const ampm = hour24 >= 12 ? 'PM' : 'AM';
//     return `${hour12}:${minutes} ${ampm}`;
//   },

//   // Format time range for display
//   formatTimeRange: (startTime, endTime) => {
//     return `${timetableService.formatTime(startTime)} - ${timetableService.formatTime(endTime)}`;
//   },

//   // Validate time format
//   validateTimeFormat: (time) => {
//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     return timeRegex.test(time);
//   },

//   // Check if time slot conflicts
//   checkTimeConflict: (newStart, newEnd, existingSlots) => {
//     const newStartTime = new Date(`2000-01-01T${newStart}:00`);
//     const newEndTime = new Date(`2000-01-01T${newEnd}:00`);

//     return existingSlots.some(slot => {
//       const existingStart = new Date(`2000-01-01T${slot.start_time}:00`);
//       const existingEnd = new Date(`2000-01-01T${slot.end_time}:00`);

//       return (
//         (newStartTime < existingEnd && newEndTime > existingStart) ||
//         (newStartTime >= existingStart && newStartTime < existingEnd) ||
//         (newEndTime > existingStart && newEndTime <= existingEnd)
//       );
//     });
//   },

//   // Get available time slots for a day
//   getAvailableSlots: (day, existingTimetable) => {
//     const allSlots = timetableService.getTimeSlots();
//     const dayTimetable = existingTimetable.filter(entry => entry.day_of_week === day);
    
//     const availableSlots = [];
    
//     [...allSlots.lecture, ...allSlots.lab].forEach(slot => {
//       const isOccupied = dayTimetable.some(entry => 
//         entry.start_time === slot.start && entry.end_time === slot.end
//       );
      
//       if (!isOccupied) {
//         availableSlots.push(slot);
//       }
//     });

//     return availableSlots;
//   },

//   // Export timetable data
//   exportTimetable: (timetableData, format = 'json') => {
//     if (format === 'csv') {
//       return timetableService.convertToCSV(timetableData);
//     }
//     return JSON.stringify(timetableData, null, 2);
//   },

//   // Convert timetable to CSV format
//   convertToCSV: (data) => {
//     const headers = ['Day', 'Time', 'Subject', 'Teacher', 'Room', 'Type'];
//     const rows = [];

//     Object.entries(data).forEach(([day, daySchedule]) => {
//       daySchedule.forEach(entry => {
//         rows.push([
//           day,
//           entry.time,
//           entry.subject,
//           entry.teacher,
//           entry.room,
//           entry.type
//         ]);
//       });
//     });

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     return csvContent;
//   },

//   // Print timetable
//   printTimetable: (timetableData) => {
//     const printWindow = window.open('', '_blank');
//     const html = timetableService.generatePrintHTML(timetableData);
//     printWindow.document.write(html);
//     printWindow.document.close();
//     printWindow.print();
//   },

//   // Generate HTML for printing
//   generatePrintHTML: (data) => {
//     const timeSlots = timetableService.getTimeSlots();
//     const days = timetableService.getDaysOfWeek();
    
//     let html = `
//       <html>
//         <head>
//           <title>Timetable</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             h1 { text-align: center; color: #333; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
//             th { background-color: #f2f2f2; font-weight: bold; }
//             .break { background-color: #ffe6e6; font-style: italic; }
//             .lecture { background-color: #e6f3ff; }
//             .lab { background-color: #e6ffe6; }
//             .tutorial { background-color: #fff2e6; }
//           </style>
//         </head>
//         <body>
//           <h1>Weekly Timetable</h1>
//           <table>
//             <thead>
//               <tr>
//                 <th>Time</th>
//                 ${days.map(day => `<th>${day}</th>`).join('')}
//               </tr>
//             </thead>
//             <tbody>
//     `;

//     // Add all time slots
//     const allSlots = [...timeSlots.lecture, ...timeSlots.lab];
//     allSlots.forEach(slot => {
//       html += `<tr><td>${timetableService.formatTimeRange(slot.start, slot.end)}</td>`;
      
//       days.forEach(day => {
//         const dayData = data[day] || [];
//         const entry = dayData.find(e => e.time === `${slot.start} - ${slot.end}`);
        
//         if (entry) {
//           html += `<td class="${entry.type.toLowerCase()}">
//             <strong>${entry.subject}</strong><br>
//             ${entry.teacher}<br>
//             <small>${entry.room}</small>
//           </td>`;
//         } else {
//           html += '<td>-</td>';
//         }
//       });
      
//       html += '</tr>';
//     });

//     html += `
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     return html;
//   }
// };

// export default timetableService;




// import api from './api';

// const timetableService = {
//   // Main CRUD operations
//   getAllTimetables: async (filters = {}) => {
//     try {
//       const queryParams = new URLSearchParams();
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value);
//       });
      
//       const response = await api.get(`/timetables?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching timetables:', error);
//       throw error;
//     }
//   },

//   getTimetableById: async (id) => {
//     try {
//       const response = await api.get(`/timetables/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching timetable:', error);
//       throw error;
//     }
//   },

//   generateTimetable: async (departmentId, semesterId) => {
//     try {
//       const response = await api.post('/timetables/generate', {
//         department_id: departmentId,
//         sem_id: semesterId
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error generating timetable:', error);
//       throw error;
//     }
//   },

//   updateTimetable: async (id, updateData) => {
//     try {
//       const response = await api.put(`/timetables/${id}`, updateData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating timetable:', error);
//       throw error;
//     }
//   },

//   deleteTimetable: async (id) => {
//     try {
//       const response = await api.delete(`/timetables/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting timetable:', error);
//       throw error;
//     }
//   },

//   deleteTimetableByDeptSem: async (departmentId, semesterId) => {
//     try {
//       const response = await api.delete(`/timetables/department/${departmentId}/semester/${semesterId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting timetables:', error);
//       throw error;
//     }
//   },

//   getFormattedTimetable: async (departmentId, semesterId) => {
//     try {
//       const response = await api.get('/timetables/formatted', {
//         params: {
//           department_id: departmentId,
//           sem_id: semesterId
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching formatted timetable:', error);
//       throw error;
//     }
//   },

//   // Dropdown data fetching from backend
//   getDepartments: async () => {
//     try {
//       const response = await api.get('/timetables/data/departments');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       throw error;
//     }
//   },

//   getSemestersByDepartment: async (departmentId) => {
//     try {
//       const response = await api.get(`/timetables/data/semesters/${departmentId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//       throw error;
//     }
//   },

//   getSubjectsBySemester: async (semesterId) => {
//     try {
//       const response = await api.get(`/timetables/data/subjects/${semesterId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//       throw error;
//     }
//   },

//   getTeachers: async () => {
//     try {
//       const response = await api.get('/timetables/data/teachers');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching teachers:', error);
//       throw error;
//     }
//   },

//   // Time slots configuration
//   getTimeSlots: () => ({
//     lecture: [
//       { start: '10:30', end: '11:30', label: '1st Period' },
//       { start: '11:30', end: '12:30', label: '2nd Period' },
//       { start: '13:15', end: '14:15', label: '3rd Period' },
//       { start: '14:15', end: '15:15', label: '4th Period' },
//       { start: '15:30', end: '16:30', label: '5th Period' },
//       { start: '16:30', end: '17:30', label: '6th Period' }
//     ],
//     lab: [
//       { start: '10:30', end: '12:30', label: 'Lab Session 1' },
//       { start: '13:15', end: '15:15', label: 'Lab Session 2' },
//       { start: '15:30', end: '17:30', label: 'Lab Session 3' }
//     ],
//     breaks: [
//       { start: '12:30', end: '13:15', name: 'Lunch Break' },
//       { start: '15:15', end: '15:30', name: 'Tea Break' }
//     ]
//   }),

//   // Days of week - Monday to Friday only
//   getDaysOfWeek: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

//   // Format time for display
//   formatTime: (time) => {
//     const [hours, minutes] = time.split(':');
//     const hour24 = parseInt(hours);
//     const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
//     const ampm = hour24 >= 12 ? 'PM' : 'AM';
//     return `${hour12}:${minutes} ${ampm}`;
//   },

//   // Format time range for display
//   formatTimeRange: (startTime, endTime) => {
//     return `${timetableService.formatTime(startTime)} - ${timetableService.formatTime(endTime)}`;
//   },

//   // Validate time format
//   validateTimeFormat: (time) => {
//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     return timeRegex.test(time);
//   },

//   // Check if time slot conflicts
//   checkTimeConflict: (newStart, newEnd, existingSlots) => {
//     const newStartTime = new Date(`2000-01-01T${newStart}:00`);
//     const newEndTime = new Date(`2000-01-01T${newEnd}:00`);

//     return existingSlots.some(slot => {
//       const existingStart = new Date(`2000-01-01T${slot.start_time}:00`);
//       const existingEnd = new Date(`2000-01-01T${slot.end_time}:00`);

//       return (
//         (newStartTime < existingEnd && newEndTime > existingStart) ||
//         (newStartTime >= existingStart && newStartTime < existingEnd) ||
//         (newEndTime > existingStart && newEndTime <= existingEnd)
//       );
//     });
//   },

//   // Get available time slots for a day
//   getAvailableSlots: (day, existingTimetable) => {
//     const allSlots = timetableService.getTimeSlots();
//     const dayTimetable = existingTimetable.filter(entry => entry.day_of_week === day);
    
//     const availableSlots = [];
    
//     [...allSlots.lecture, ...allSlots.lab].forEach(slot => {
//       const isOccupied = dayTimetable.some(entry => 
//         entry.start_time === slot.start && entry.end_time === slot.end
//       );
      
//       if (!isOccupied) {
//         availableSlots.push(slot);
//       }
//     });

//     return availableSlots;
//   },

//   // Export timetable data
//   exportTimetable: (timetableData, format = 'json') => {
//     if (format === 'csv') {
//       return timetableService.convertToCSV(timetableData);
//     }
//     return JSON.stringify(timetableData, null, 2);
//   },

//   // Convert timetable to CSV format
//   convertToCSV: (data) => {
//     const headers = ['Day', 'Time', 'Subject', 'Teacher', 'Room', 'Type'];
//     const rows = [];

//     Object.entries(data).forEach(([day, daySchedule]) => {
//       daySchedule.forEach(entry => {
//         rows.push([
//           day,
//           entry.time,
//           entry.subject,
//           entry.teacher,
//           entry.room,
//           entry.type
//         ]);
//       });
//     });

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     return csvContent;
//   },

//   // Print timetable
//   printTimetable: (timetableData) => {
//     const printWindow = window.open('', '_blank');
//     const html = timetableService.generatePrintHTML(timetableData);
//     printWindow.document.write(html);
//     printWindow.document.close();
//     printWindow.print();
//   },

//   // Generate HTML for printing
//   generatePrintHTML: (data) => {
//     const timeSlots = timetableService.getTimeSlots();
//     const days = timetableService.getDaysOfWeek();
    
//     let html = `
//       <html>
//         <head>
//           <title>Timetable</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             h1 { text-align: center; color: #333; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
//             th { background-color: #f2f2f2; font-weight: bold; }
//             .break { background-color: #ffe6e6; font-style: italic; }
//             .lecture { background-color: #e6f3ff; }
//             .lab { background-color: #e6ffe6; }
//             .tutorial { background-color: #fff2e6; }
//           </style>
//         </head>
//         <body>
//           <h1>Weekly Timetable (Monday to Friday)</h1>
//           <table>
//             <thead>
//               <tr>
//                 <th>Time</th>
//                 ${days.map(day => `<th>${day}</th>`).join('')}
//               </tr>
//             </thead>
//             <tbody>
//     `;

//     // Add all time slots
//     const allSlots = [...timeSlots.lecture, ...timeSlots.lab];
//     allSlots.forEach(slot => {
//       html += `<tr><td>${timetableService.formatTimeRange(slot.start, slot.end)}</td>`;
      
//       days.forEach(day => {
//         const dayData = data[day] || [];
//         const entry = dayData.find(e => e.time === `${slot.start} - ${slot.end}`);
        
//         if (entry) {
//           html += `<td class="${entry.type.toLowerCase()}">
//             <strong>${entry.subject}</strong><br>
//             ${entry.teacher}<br>
//             <small>${entry.room}</small>
//           </td>`;
//         } else {
//           html += '<td>-</td>';
//         }
//       });
      
//       html += '</tr>';
//     });

//     html += `
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     return html;
//   }
// };

// export default timetableService;




// // TimetableAPI.js
//  const timetableService = {
//   generateTimetable: async (data) => {
//     console.log("📤 Sending timetable generate request with data:", data);

//     const response = await fetch('/api/timetables/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });

//     console.log("📥 Response received:", response);

//     // Optional: log additional data if needed
//     // console.log("Subjects found for sem 2:", subjects);
//     // console.log("Classes found:", classes);
//     // console.log("Teachers found:", teachers);

//     return await response.json();
//   },

//   getTimetables: async (departmentId, filters = {}) => {
//     const params = new URLSearchParams(filters);
//     const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
//     console.log(response);

//     return await response.json();
//   },

//   getTimetable: async (id, formatted = false) => {
//     const response = await fetch(`/api/timetables/${id}?formatted=${formatted}`);
//     return await response.json();
//   },

//   updateStatus: async (id, status) => {
//     const response = await fetch(`/api/timetables/${id}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status })
//     });
//     return await response.json();
//   },

//   deleteTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}`, {
//       method: 'DELETE'
//     });
//     return await response.json();
//   },

//   validateTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/validate`);
//     return await response.json();
//   },

//   exportTimetable: async (id, format) => {
//     const response = await fetch(`/api/timetables/${id}/export?format=${format}`);
//     if (format === 'csv') {
//       return response;
//     }
//     return await response.json();
//   },

//   getStatistics: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/statistics`);
//     return await response.json();
//   },

//   cloneTimetable: async (id, data) => {
//     const response = await fetch(`/api/timetables/${id}/clone`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     return await response.json();
//   }
// };
// export default timetableService;

// export const mockTimetableData = {
//   id: 1,
//   name: "Division SYA",
//   department: "Computer Science",
//   semester: "5th",
//   schedule: {
//     Monday: {
//       "Period 1": { subject: "Data Structures", teacher: "Dr. Smith", time: "10:30 - 11:30" },
//       "Period 2": { subject: "DBMS", teacher: "Prof. Johnson", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Web Development", teacher: "Dr. Brown", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Engineering", teacher: "Prof. Davis", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Computer Networks", teacher: "Dr. Wilson", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Machine Learning", teacher: "Prof. Taylor", time: "4:30 - 5:30" }
//     },
//     Tuesday: {
//       "Period 1": { subject: "Operating Systems", teacher: "Dr. Anderson", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Algorithms", teacher: "Prof. Thomas", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Computer Graphics", teacher: "Dr. Jackson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Artificial Intelligence", teacher: "Prof. White", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Cyber Security", teacher: "Dr. Harris", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Mobile Development", teacher: "Prof. Martin", time: "4:30 - 5:30" }
//     },
//     Wednesday: {
//       "Period 1": { subject: "Data Mining", teacher: "Dr. Clark", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Cloud Computing", teacher: "Prof. Lewis", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Human Computer Interaction", teacher: "Dr. Walker", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Testing", teacher: "Prof. Hall", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Project Management", teacher: "Dr. Allen", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Blockchain Technology", teacher: "Prof. Young", time: "4:30 - 5:30" }
//     },
//     Thursday: {
//       "Period 1": { subject: "Internet of Things", teacher: "Dr. King", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Big Data Analytics", teacher: "Prof. Wright", time: "11:30 - 12:30" },
//       "Period 3": { subject: "DevOps", teacher: "Dr. Lopez", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Digital Image Processing", teacher: "Prof. Hill", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Natural Language Processing", teacher: "Dr. Green", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Distributed Systems", teacher: "Prof. Adams", time: "4:30 - 5:30" }
//     },
//     Friday: {
//       "Period 1": { subject: "Compiler Design", teacher: "Dr. Baker", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Information Security", teacher: "Prof. Gonzalez", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Parallel Computing", teacher: "Dr. Nelson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Quantum Computing", teacher: "Prof. Carter", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Research Methodology", teacher: "Dr. Mitchell", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Seminar", teacher: "Prof. Perez", time: "4:30 - 5:30" }
//     }
//   }
// };



// // timetableService.js

// const timetableService = {
//   generateTimetable: async (data) => {
//     console.log("📤 Sending timetable generate request with data:", data);

//     const response = await fetch('/api/timetables/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });

//     console.log("📥 Response received:", response);
//     return await response.json();
//   },

//   getTimetables: async (departmentId, filters = {}) => {
//     const params = new URLSearchParams(filters);
//     const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
//     return await response.json();
//   },

//   getTimetable: async (id, formatted = false) => {
//     const response = await fetch(`/api/timetables/${id}?formatted=${formatted}`);
//     return await response.json();
//   },

//   updateStatus: async (id, status) => {
//     const response = await fetch(`/api/timetables/${id}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status }),
//     });
//     return await response.json();
//   },

//   deleteTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}`, {
//       method: 'DELETE',
//     });
//     return await response.json();
//   },

//   validateTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/validate`);
//     return await response.json();
//   },

//   exportTimetable: async (id, format) => {
//     const response = await fetch(`/api/timetables/${id}/export?format=${format}`);
//     if (format === 'csv') {
//       return response;
//     }
//     return await response.json();
//   },

//   getStatistics: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/statistics`);
//     return await response.json();
//   },

//   cloneTimetable: async (id, data) => {
//     const response = await fetch(`/api/timetables/${id}/clone`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return await response.json();
//   },
// };

// export default timetableService;

// export const mockTimetableData = {
//   id: 1,
//   name: "Division SYA",
//   department: "Computer Science",
//   semester: "5th",
//   schedule: {
//     Monday: {
//       "Period 1": { subject: "Data Structures", teacher: "Dr. Smith", time: "10:30 - 11:30" },
//       "Period 2": { subject: "DBMS", teacher: "Prof. Johnson", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Web Development", teacher: "Dr. Brown", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Engineering", teacher: "Prof. Davis", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Computer Networks", teacher: "Dr. Wilson", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Machine Learning", teacher: "Prof. Taylor", time: "4:30 - 5:30" },
//     },
//     Tuesday: {
//       "Period 1": { subject: "Operating Systems", teacher: "Dr. Anderson", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Algorithms", teacher: "Prof. Thomas", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Computer Graphics", teacher: "Dr. Jackson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Artificial Intelligence", teacher: "Prof. White", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Cyber Security", teacher: "Dr. Harris", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Mobile Development", teacher: "Prof. Martin", time: "4:30 - 5:30" },
//     },
//     Wednesday: {
//       "Period 1": { subject: "Data Mining", teacher: "Dr. Clark", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Cloud Computing", teacher: "Prof. Lewis", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Human Computer Interaction", teacher: "Dr. Walker", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Testing", teacher: "Prof. Hall", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Project Management", teacher: "Dr. Allen", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Blockchain Technology", teacher: "Prof. Young", time: "4:30 - 5:30" },
//     },
//     Thursday: {
//       "Period 1": { subject: "Internet of Things", teacher: "Dr. King", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Big Data Analytics", teacher: "Prof. Wright", time: "11:30 - 12:30" },
//       "Period 3": { subject: "DevOps", teacher: "Dr. Lopez", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Digital Image Processing", teacher: "Prof. Hill", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Natural Language Processing", teacher: "Dr. Green", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Distributed Systems", teacher: "Prof. Adams", time: "4:30 - 5:30" },
//     },
//     Friday: {
//       "Period 1": { subject: "Compiler Design", teacher: "Dr. Baker", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Information Security", teacher: "Prof. Gonzalez", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Parallel Computing", teacher: "Dr. Nelson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Quantum Computing", teacher: "Prof. Carter", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Research Methodology", teacher: "Dr. Mitchell", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Seminar", teacher: "Prof. Perez", time: "4:30 - 5:30" },
//     },
//   },
// };



// // timetableService.js

// const timetableService = {
//   generateTimetable: async (data) => {
//     console.log("📤 Sending timetable generation request with data:", data);

//     const response = await fetch('/api/timetables/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });

//     console.log("📥 Response received:", response);
//     return await response.json();
//   },

// //   getTimetables: async (departmentId, filters = {}) => {
// //     const params = new URLSearchParams(filters);
// //     const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
// //     return await response.json();
// //   },

// //   getTimetable: async (id, formatted = false) => {
// //     const response = await fetch(`/api/timetables/${id}?formatted=${formatted}`);
// //     return await response.json();
// //   },

//     getTimetables: async (departmentId, filters = {}) => {
//     const params = new URLSearchParams(filters);
//     const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await response.json();
//   },

//   updateStatus: async (id, status) => {
//     const response = await fetch(`/api/timetables/${id}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status }),
//     });
//     return await response.json();
//   },

//   deleteTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}`, {
//       method: 'DELETE',
//     });
//     return await response.json();
//   },

//   validateTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/validate`);
//     return await response.json();
//   },

//   exportTimetable: async (id, format) => {
//     const response = await fetch(`/api/timetables/${id}/export?format=${format}`);
//     if (format === 'csv') {
//       return response;
//     }
//     return await response.json();
//   },

//   getStatistics: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/statistics`);
//     return await response.json();
//   },

//   cloneTimetable: async (id, data) => {
//     const response = await fetch(`/api/timetables/${id}/clone`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return await response.json();
//   },
// };

// export default timetableService;

// export const mockTimetableData = {
//   id: 1,
//   name: "Division SYA",
//   department: "Computer Science",
//   semester: "5th",
//   schedule: {
//     Monday: {
//       "Period 1": { subject: "Data Structures", teacher: "Dr. Smith", time: "10:30 - 11:30" },
//       "Period 2": { subject: "DBMS", teacher: "Prof. Johnson", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Web Development", teacher: "Dr. Brown", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Engineering", teacher: "Prof. Davis", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Computer Networks", teacher: "Dr. Wilson", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Machine Learning", teacher: "Prof. Taylor", time: "4:30 - 5:30" },
//     },
//     Tuesday: {
//       "Period 1": { subject: "Operating Systems", teacher: "Dr. Anderson", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Algorithms", teacher: "Prof. Thomas", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Computer Graphics", teacher: "Dr. Jackson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Artificial Intelligence", teacher: "Prof. White", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Cyber Security", teacher: "Dr. Harris", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Mobile Development", teacher: "Prof. Martin", time: "4:30 - 5:30" },
//     },
//     Wednesday: {
//       "Period 1": { subject: "Data Mining", teacher: "Dr. Clark", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Cloud Computing", teacher: "Prof. Lewis", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Human Computer Interaction", teacher: "Dr. Walker", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Testing", teacher: "Prof. Hall", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Project Management", teacher: "Dr. Allen", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Blockchain Technology", teacher: "Prof. Young", time: "4:30 - 5:30" },
//     },
//     Thursday: {
//       "Period 1": { subject: "Internet of Things", teacher: "Dr. King", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Big Data Analytics", teacher: "Prof. Wright", time: "11:30 - 12:30" },
//       "Period 3": { subject: "DevOps", teacher: "Dr. Lopez", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Digital Image Processing", teacher: "Prof. Hill", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Natural Language Processing", teacher: "Dr. Green", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Distributed Systems", teacher: "Prof. Adams", time: "4:30 - 5:30" },
//     },
//     Friday: {
//       "Period 1": { subject: "Compiler Design", teacher: "Dr. Baker", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Information Security", teacher: "Prof. Gonzalez", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Parallel Computing", teacher: "Dr. Nelson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Quantum Computing", teacher: "Prof. Carter", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Research Methodology", teacher: "Dr. Mitchell", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Seminar", teacher: "Prof. Perez", time: "4:30 - 5:30" },
//     },
//   },
// };


// // timetableService.js

// const timetableService = {
//   generateTimetable: async (data) => {
//     console.log("📤 Sending timetable generation request with data:", data);

//     const response = await fetch('/api/timetables/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });

//     console.log("📥 Response received:", response);
//     return await response.json();
//   },

//   getTimetables: async (departmentId, filters = {}) => {
//     const params = new URLSearchParams(filters);
//     const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await response.json();
//   },

//   getTimetable: async (id, formatted = false) => {
//     const response = await fetch(`/api/timetables/${id}?formatted=${formatted}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await response.json();
//   },
   

//   updateStatus: async (id, status) => {
//     const response = await fetch(`/api/timetables/${id}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status }),
//     });
//     return await response.json();
//   },

//   deleteTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}`, {
//       method: 'DELETE',
//     });
//     return await response.json();
//   },

//   validateTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/validate`);
//     return await response.json();
//   },

//   exportTimetable: async (id, format) => {
//     const response = await fetch(`/api/timetables/${id}/export?format=${format}`);
//     if (format === 'csv') {
//       return response;
//     }
//     return await response.json();
//   },

//   getStatistics: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/statistics`);
//     return await response.json();
//   },

//   cloneTimetable: async (id, data) => {
//     const response = await fetch(`/api/timetables/${id}/clone`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return await response.json();
//   },
// };

// export default timetableService;

// export const mockTimetableData = {
//   id: 1,
//   name: "Division SYA",
//   department: "Computer Science",
//   semester: "5th",
//   schedule: {
//     Monday: {
//       "Period 1": { subject: "Data Structures", teacher: "Dr. Smith", time: "10:30 - 11:30" },
//       "Period 2": { subject: "DBMS", teacher: "Prof. Johnson", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Web Development", teacher: "Dr. Brown", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Engineering", teacher: "Prof. Davis", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Computer Networks", teacher: "Dr. Wilson", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Machine Learning", teacher: "Prof. Taylor", time: "4:30 - 5:30" },
//     },
//     Tuesday: {
//       "Period 1": { subject: "Operating Systems", teacher: "Dr. Anderson", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Algorithms", teacher: "Prof. Thomas", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Computer Graphics", teacher: "Dr. Jackson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Artificial Intelligence", teacher: "Prof. White", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Cyber Security", teacher: "Dr. Harris", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Mobile Development", teacher: "Prof. Martin", time: "4:30 - 5:30" },
//     },
//     Wednesday: {
//       "Period 1": { subject: "Data Mining", teacher: "Dr. Clark", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Cloud Computing", teacher: "Prof. Lewis", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Human Computer Interaction", teacher: "Dr. Walker", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Testing", teacher: "Prof. Hall", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Project Management", teacher: "Dr. Allen", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Blockchain Technology", teacher: "Prof. Young", time: "4:30 - 5:30" },
//     },
//     Thursday: {
//       "Period 1": { subject: "Internet of Things", teacher: "Dr. King", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Big Data Analytics", teacher: "Prof. Wright", time: "11:30 - 12:30" },
//       "Period 3": { subject: "DevOps", teacher: "Dr. Lopez", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Digital Image Processing", teacher: "Prof. Hill", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Natural Language Processing", teacher: "Dr. Green", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Distributed Systems", teacher: "Prof. Adams", time: "4:30 - 5:30" },
//     },
//     Friday: {
//       "Period 1": { subject: "Compiler Design", teacher: "Dr. Baker", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Information Security", teacher: "Prof. Gonzalez", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Parallel Computing", teacher: "Dr. Nelson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Quantum Computing", teacher: "Prof. Carter", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Research Methodology", teacher: "Dr. Mitchell", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Seminar", teacher: "Prof. Perez", time: "4:30 - 5:30" },
//     },
//   },
// };




// // timetableService.js

// const timetableService = {


// // generateTimetable: async (data) => {
// //   console.log("📤 Sending timetable generation request with data:", data);

// //   try {
// //     const response = await fetch('/api/timetables/generate', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify(data),
// //     });

// //     console.log("📥 Response received:", response.status, response.statusText);

// //     if (!response.ok) {
// //       const errorText = await response.text(); // Try to read error body
// //       console.error('❌ Server returned an error:', response.status, errorText);
// //       throw new Error(`Failed to generate timetable: ${response.statusText}`);
// //     }

// //     const json = await response.json();
// //     console.log("📦 Parsed response JSON:", json);

// //     return json;
// //   } catch (err) {
// //     console.error('❌ Exception in generateTimetable:', err);
// //     throw err; // Let the calling function handle it
// //   }
// // },




     
// //  getTimetables: async (departmentId, filters = {}) => {
// //     // Construct the URL with only the necessary parameters
// //     const params = new URLSearchParams(filters);
// //     const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
    
// //     if (!response.ok) {
// //       throw new Error('Network response was not ok');
// //     }
    
// //     return await response.json();
// //   },

// getTimetables: async (departmentId, filters = {}) => {
//     try {
//       const params = new URLSearchParams(filters);
//       const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch timetables');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       throw error;
//     }
//   },


// getTimetables: async (departmentId, filters = {}) => {
//     try {
//       const params = new URLSearchParams(filters);
//       const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch timetables');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       throw error;
//     }
//   },



//   getTimetable: async (id, formatted = false) => {
//     const response = await fetch(`/api/timetables/${id}?formatted=${formatted}`);
//     console.log("🧠 API Response for Timetable by ID:",response);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return await response.json();
//   },
   

//   updateStatus: async (id, status) => {
//     const response = await fetch(`/api/timetables/${id}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status }),
//     });
//     return await response.json();
//   },

//   deleteTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}`, {
//       method: 'DELETE',
//     });
//     return await response.json();
//   },

//   validateTimetable: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/validate`);
//     return await response.json();
//   },

//   exportTimetable: async (id, format) => {
//     const response = await fetch(`/api/timetables/${id}/export?format=${format}`);
//     if (format === 'csv') {
//       return response;
//     }
//     return await response.json();
//   },

//   getStatistics: async (id) => {
//     const response = await fetch(`/api/timetables/${id}/statistics`);
//     return await response.json();
//   },

//   cloneTimetable: async (id, data) => {
//     const response = await fetch(`/api/timetables/${id}/clone`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     return await response.json();
//   },
// };

// export default timetableService;

// export const mockTimetableData = {
//   id: 1,
//   name: "Division SYA",
//   department: "Computer Science",
//   semester: "5th",
//   schedule: {
//     Monday: {
//       "Period 1": { subject: "Data Structures", teacher: "Dr. Smith", time: "10:30 - 11:30" },
//       "Period 2": { subject: "DBMS", teacher: "Prof. Johnson", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Web Development", teacher: "Dr. Brown", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Engineering", teacher: "Prof. Davis", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Computer Networks", teacher: "Dr. Wilson", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Machine Learning", teacher: "Prof. Taylor", time: "4:30 - 5:30" },
//     },
//     Tuesday: {
//       "Period 1": { subject: "Operating Systems", teacher: "Dr. Anderson", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Algorithms", teacher: "Prof. Thomas", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Computer Graphics", teacher: "Dr. Jackson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Artificial Intelligence", teacher: "Prof. White", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Cyber Security", teacher: "Dr. Harris", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Mobile Development", teacher: "Prof. Martin", time: "4:30 - 5:30" },
//     },
//     Wednesday: {
//       "Period 1": { subject: "Data Mining", teacher: "Dr. Clark", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Cloud Computing", teacher: "Prof. Lewis", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Human Computer Interaction", teacher: "Dr. Walker", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Software Testing", teacher: "Prof. Hall", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Project Management", teacher: "Dr. Allen", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Blockchain Technology", teacher: "Prof. Young", time: "4:30 - 5:30" },
//     },
//     Thursday: {
//       "Period 1": { subject: "Internet of Things", teacher: "Dr. King", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Big Data Analytics", teacher: "Prof. Wright", time: "11:30 - 12:30" },
//       "Period 3": { subject: "DevOps", teacher: "Dr. Lopez", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Digital Image Processing", teacher: "Prof. Hill", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Natural Language Processing", teacher: "Dr. Green", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Distributed Systems", teacher: "Prof. Adams", time: "4:30 - 5:30" },
//     },
//     Friday: {
//       "Period 1": { subject: "Compiler Design", teacher: "Dr. Baker", time: "10:30 - 11:30" },
//       "Period 2": { subject: "Information Security", teacher: "Prof. Gonzalez", time: "11:30 - 12:30" },
//       "Period 3": { subject: "Parallel Computing", teacher: "Dr. Nelson", time: "1:15 - 2:15" },
//       "Period 4": { subject: "Quantum Computing", teacher: "Prof. Carter", time: "2:15 - 3:15" },
//       "Period 5": { subject: "Research Methodology", teacher: "Dr. Mitchell", time: "3:30 - 4:30" },
//       "Period 6": { subject: "Seminar", teacher: "Prof. Perez", time: "4:30 - 5:30" },
//     },
//   },
// // };
// import axios from "axios";
// const timetableService = {
//   // generateTimetable: async (data) => {
//   //   try {
//   //     console.log('📤 Sending generation request:', data);
      
//   //     const response = await fetch('/api/timetables/generate', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         departmentId: data.departmentId,
//   //         semester: data.semester,
//   //         academicYear: data.academicYear,
//   //         divisions: data.divisions,
//   //         subjects: Array.isArray(data.subjects) ? data.subjects : [],
//   //         teachers: Array.isArray(data.teachers) ? data.teachers : [],
//   //         classes: Array.isArray(data.classes) ? data.classes : []
//   //       })
//   //     });

//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(errorData.message || 'Failed to generate timetable');
//   //     }

//   //     const result = await response.json();
//   //     console.log('📥 Generation response:', result);
//   //     return result;

//   //   } catch (error) {
//   //     console.error('❌ Generation error:', error);
//   //     throw error;
//   //   }
//   // },
  

//   // generateTimetable: async (data) => {
//   //   try {
//   //     // Input validation
//   //     if (!data.departmentId || !data.semester || !data.academicYear || !data.divisions?.length) {
//   //       throw new Error('Missing required fields');
//   //     }

//   //     if (!data.subjects?.length || !data.teachers?.length || !data.classes?.length) {
//   //       throw new Error('Missing required data (subjects, teachers, or classes)');
//   //     }

//   //     // Format data for API
//   //     const formattedData = {
//   //       departmentId: data.departmentId,
//   //       semester: parseInt(data.semester),
//   //       academicYear: data.academicYear,
//   //       divisions: data.divisions,
//   //       subjects: data.subjects.map(s => ({
//   //         _id: s._id,
//   //         name: s.name,
//   //         type: s.type || 'Theory',
//   //         semester: parseInt(s.semester),
//   //         credits: s.credits || 0,
//   //         lectures_per_week: s.lectures_per_week || 0
//   //       })),
//   //       teachers: data.teachers.map(t => ({
//   //         _id: t._id,
//   //         name: t.name,
//   //         subjects: t.subjects || [],
//   //         semester: parseInt(t.semester)
//   //       })),
//   //       classes: data.classes.map(c => ({
//   //         _id: c._id,
//   //         name: c.name || c.classNumber,
//   //         capacity: c.capacity || 0,
//   //         type: c.type || 'Theory'
//   //       }))
//   //     };

//   //     // Log request data
//   //     console.log('📤 Sending generation request:', {
//   //       departmentId: formattedData.departmentId,
//   //       semester: formattedData.semester,
//   //       divisions: formattedData.divisions,
//   //       subjectsCount: formattedData.subjects.length,
//   //       teachersCount: formattedData.teachers.length,
//   //       classesCount: formattedData.classes.length
//   //     });

//   //     // Make API request
//   //     const response = await fetch('/api/timetables/generate', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(formattedData)
//   //     });

//   //     console.log('📥 Response status:', response.status);

//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       console.error('❌ Server error:', errorData);
        
//   //       // Return structured error response
//   //       return {
//   //         success: false,
//   //         error: errorData.message || `Server error: ${response.status}`,
//   //         details: errorData.errors || []
//   //       };
//   //     }

//   //     const result = await response.json();
//   //     console.log('✅ Generation successful:', result);

//   //     // Return success response
//   //     return {
//   //       success: true,
//   //       data: result.data,
//   //       message: 'Timetable generated successfully'
//   //     };

//   //   } catch (error) {
//   //     console.error('❌ Generation failed:', {
//   //       message: error.message,
//   //       error: error
//   //     });
      
//   //     // Return error response
//   //     return {
//   //       success: false,
//   //       error: error.message || 'Failed to generate timetable',
//   //       details: []
//   //     };
//   //   }
//   // },



 
// generateTimetable: async (inputData) => {
//   try {
//     console.log("📝 Raw input data:", inputData);

//     const { departmentId, semester, academicYear, divisions, subjects, teachers, classes } = inputData;

//     // ✅ Filter subjects by semester
//     const filteredSubjects = subjects.filter(
//       (subject) => String(subject.semester) === String(semester)
//     );

//     console.log("🎯 Filtered subjects:", {
//       semester,
//       total: subjects.length,
//       filtered: filteredSubjects.length,
//       subjects: filteredSubjects,
//     });

//     // ✅ Filter teachers by semester
//     const filteredTeachers = teachers.filter(
//       (teacher) => String(teacher.semester) === String(semester)
//     );

//     console.log("👨‍🏫 Filtered teachers:", {
//       semester,
//       total: teachers.length,
//       filtered: filteredTeachers.length,
//       teachers: filteredTeachers,
//     });

//     // ✅ Filter classes by semester
//     const filteredClasses = classes.filter(
//       (cls) => String(cls.semester) === String(semester)
//     );

//     console.log("🏫 Filtered classes:", {
//       semester,
//       total: classes.length,
//       filtered: filteredClasses.length,
//       classes: filteredClasses,
//     });

//     // ✅ Final payload to send
//     const payload = {
//       departmentId,
//       semester,
//       academicYear,
//       divisions,
//       subjects: filteredSubjects,
//       teachers: filteredTeachers,
//       classes: filteredClasses,
//     };

//     console.log("🧪 Final payload to generate:", payload);

//     const response = await axios.post(`/api/timetables/generate`, payload);
//     console.log("✅ API response from backend:", response.data); 
//     return response.data;
//   } catch (error) {
//     console.error("❌ Generation failed:", error?.response?.data?.message || error.message);
//     throw error;
//   }
// },






  





//   getTimetables: async (departmentId, filters = {}) => {
//     try {
//       const params = new URLSearchParams(filters);
//       const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       throw error;
//     }
//   },

//   getTimetable: async (id, includeStats = false) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}?stats=${includeStats}`);
//       //  const data = await response.json();
//       //  console.log("📥 Fetched timetable data:", data);
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       throw error;
//     }
//   },

//   getStatistics: async (id) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}/statistics`);
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Fetch error:', error);
//       throw error;
//     }
//   },

//   updateStatus: async (id, status) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status })
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Update error:', error);
//       throw error;
//     }
//   },

//   deleteTimetable: async (id) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}`, {
//         method: 'DELETE'
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Delete error:', error);
//       throw error;
//     }
//   },

//   exportTimetable: async (id, format) => {
//     try {
//       return await fetch(`/api/timetables/${id}/export?format=${format}`);
//     } catch (error) {
//       console.error('❌ Export error:', error);
//       throw error;
//     }
//   },

//   cloneTimetable: async (id, { newAcademicYear, newSemester }) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}/clone`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ newAcademicYear, newSemester })
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('❌ Clone error:', error);
//       throw error;
//     }
//   }
// };

// export default timetableService;


import axios from "axios";

const timetableService = {
  generateTimetable: async (inputData) => {
    try {
      console.log("📝 Raw input data:", inputData);

      const { departmentId, semester, academicYear, divisions, subjects, teachers, classes } = inputData;

      // ✅ Filter subjects by semester
      const filteredSubjects = subjects.filter(
        (subject) => String(subject.semester) === String(semester)
      );

      console.log("🎯 Filtered subjects:", {
        semester,
        total: subjects.length,
        filtered: filteredSubjects.length,
        subjects: filteredSubjects,
      });

      // ✅ Filter teachers by semester
      const filteredTeachers = teachers.filter(
        (teacher) => String(teacher.semester) === String(semester)
      );

      console.log("👨‍🏫 Filtered teachers:", {
        semester,
        total: teachers.length,
        filtered: filteredTeachers.length,
        teachers: filteredTeachers,
      });

      // ✅ Filter classes by semester
      const filteredClasses = classes.filter(
        (cls) => String(cls.semester) === String(semester)
      );

      console.log("🏫 Filtered classes:", {
        semester,
        total: classes.length,
        filtered: filteredClasses.length,
        classes: filteredClasses,
      });

      // ✅ Final payload
      const payload = {
        departmentId,
        semester,
        academicYear,
        divisions,
        subjects: filteredSubjects,
        teachers: filteredTeachers,
        classes: filteredClasses,
      };

      console.log("🧪 Final payload to generate:", payload);

      const response = await axios.post(`/api/timetables/generate`, payload);
      console.log("✅ API response from backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Generation failed:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  // ✅ New function for Active Timetables
  getActiveTimetables: async () => {
    try {
      console.log("📡 Fetching active timetables...");
      const response = await axios.get(`/api/timetables/active`);
      console.log("✅ Active timetables response:", response.data);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error("❌ Error fetching active timetables:", error?.response?.data?.message || error.message);
      return {
        success: false,
        data: [],
        error: error?.response?.data?.message || "Failed to fetch active timetables"
      };
    }
  },

  getTimetables: async (departmentId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
      return await response.json();
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  getTimetable: async (id, includeStats = false) => {
    try {
      const response = await fetch(`/api/timetables/${id}?stats=${includeStats}`);
      return await response.json();
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  getStatistics: async (id) => {
    try {
      const response = await fetch(`/api/timetables/${id}/statistics`);
      return await response.json();
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await fetch(`/api/timetables/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Update error:", error);
      throw error;
    }
  },

  deleteTimetable: async (id) => {
    try {
      const response = await fetch(`/api/timetables/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
  },

  exportTimetable: async (id, format) => {
    try {
      return await fetch(`/api/timetables/${id}/export?format=${format}`);
    } catch (error) {
      console.error("❌ Export error:", error);
      throw error;
    }
  },

  cloneTimetable: async (id, { newAcademicYear, newSemester }) => {
    try {
      const response = await fetch(`/api/timetables/${id}/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newAcademicYear, newSemester }),
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Clone error:", error);
      throw error;
    }
  },
};

export default timetableService;
