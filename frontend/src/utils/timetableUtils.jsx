import departmentService from '../services/departmentService.js';
import { toast } from 'react-toastify';

export const divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const timeSlots = [
  { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
  { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
  { period: 3, start: '1:15', end: '2:15', label: '3rd Period' },
  { period: 4, start: '2:15', end: '3:15', label: '4th Period' },
  { period: 5, start: '3:30', end: '4:30', label: '5th Period' },
  { period: 6, start: '4:30', end: '5:30', label: '6th Period' }
];

// Fetch departments
export const fetchDepartments = async (setDepartments) => {
  try {
    const formattedDepartments = await departmentService.getDepartmentsForSelect();
    setDepartments(formattedDepartments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    toast.error('Failed to load departments');
  }
};

// Fetch subjects
// export const fetchSubjects = async (setSubjects, setLoading) => {
//   try {
//     const response = await fetch('/api/subjects');
//     const data = await response.json();
//     if (data.success) {
//       setSubjects(data.data);
//     } else {
//       throw new Error('Failed to fetch subjects');
//     }
//   } catch (error) {
//     console.error('Error fetching subjects:', error);
//     toast.error('Error fetching subjects');
//   } finally {
//     setLoading && setLoading(false);
//   }
// };
// Replace the existing fetchSubjects function with this updated version
export const fetchSubjects = async (setSubjects, setLoading) => {
  try {
    setLoading && setLoading(true);
    
    const response = await fetch('/api/subjects');
    const data = await response.json();
    console.log('📚 Raw subjects data:', data.data); // Debug logging

    if (data.success) {
      // Extract subjects array from nested structure
      const subjectsList = data.data.subjects || data.data || [];
      console.log('✅ Formatted subjects list:', subjectsList); // Debug logging

      // Filter and format subjects if needed
      const formattedSubjects = subjectsList.map(subject => ({
        ...subject,
        name: subject.name || subject.subject_name || 'Unnamed Subject',
        type: subject.type || 'Theory'
      }));

      setSubjects(formattedSubjects);
    } else {
      throw new Error('Failed to fetch subjects');
    }
  } catch (error) {
    console.error('❌ Error fetching subjects:', error);
    setSubjects([]);
    toast.error('Error fetching subjects');
  } finally {
    setLoading && setLoading(false);
  }
};

// Fetch teachers
export const fetchTeachers = async (setTeachers) => {
  try {
    const response = await fetch('/api/teachers');
    const data = await response.json();
    if (data.success) {
      setTeachers(Array.isArray(data.data) ? data.data : data.data.teachers || []);
    }
  } catch (error) {
    console.error('Error fetching teachers:', error);
    setTeachers([]);
    toast.error('Failed to load teachers');
  }
};

// Fetch classes
export const fetchClasses = async (setClasses) => {
  try {
    const response = await fetch('/api/classes');
    const data = await response.json();
    if (data.success) {
      const classArray = Array.isArray(data.data) ? data.data : data.data.classes || [];
      setClasses(classArray);
    } else {
      setClasses([]);
    }
  } catch (error) {
    console.error('Error fetching classes:', error);
    setClasses([]);
    toast.error('Failed to load classes');
  }
};



//imp imp 
// export const renderTimetableGrid = (
//   divisionName,
//   schedule,
//   subjects = [],
//   classrooms = []
// ) => {
//   if (!schedule || typeof schedule !== "object") {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No timetable data available
//       </div>
//     );
//   }

//   const days = Object.keys(schedule);
//   const periodsPerDay = Math.max(...days.map(day => schedule[day]?.length || 0));

//   // safe subject-name
//   const getSubjectNameById = (id) => {
//     if (!id) return "Unnamed Subject";
//     const s = subjects.find(sub => sub._id === id);
//     return s ? (s.name || s.subjectName) : "Unnamed Subject";
//   };

//   const getClassroomNameById = (id) => {
//     if (!id) return "N/A";
//     const c = classrooms.find(cls => cls._id === id);
//     return c ? (c.name || c.room_number || c.classNumber) : `Room ${id?.slice?.(-4) || "N/A"}`;
//   };

//   return (
//     <table className="w-full table-auto border text-sm">
//       <thead>
//         <tr>
//           <th className="border px-2 py-1 text-left bg-gray-100">Day / Period</th>
//           {Array.from({ length: periodsPerDay }).map((_, p) => (
//             <th key={p} className="border px-2 py-1 bg-gray-100">{p + 1}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             <td className="border px-2 py-1 font-medium bg-gray-50">{day}</td>
//             {schedule[day].map((slot, periodIdx) => {
//               if (!slot) {
//                 return (
//                   <td key={periodIdx} className="border px-2 py-1 text-gray-400">
//                    Library
//                   </td>
//                 );
//               }

//               const subjectName =
//                 typeof slot.subject === "object"
//                   ? (slot.subject.name || slot.subject.subjectName || "Unnamed Subject")
//                   : getSubjectNameById(slot.subject);

//               const teacherName =
//                 typeof slot.teacher === "object"
//                   ? (slot.teacher.name || "Unknown")
//                   : (slot.teacher || "Unknown");

//               // SAFE classroom lookup
//               const classroomId = slot?.classroom?._id || slot?.classroom || null;
//               const classroomName = getClassroomNameById(classroomId);

//               return (
//                 <td key={periodIdx} className="border px-2 py-1">
//                   <div className="font-semibold">{subjectName}</div>
//                   <div className="text-xs text-gray-700">{teacherName}</div>
//                   <div className="text-xs text-gray-500">{classroomName}</div>
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export const renderTimetableGrid = (
//   divisionName,
//   schedule,
//   subjects = [],
//   classrooms = []
// ) => {
//   if (!schedule || typeof schedule !== "object") {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No timetable data available
//       </div>
//     );
//   }

//   const days = Object.keys(schedule);
//   const periodsPerDay = Math.max(...days.map(day => schedule[day]?.length || 0));

//   // safe subject-name
//   const getSubjectNameById = (id) => {
//     if (!id) return "Unnamed Subject";
//     const s = subjects.find(sub => sub._id === id);
//     return s ? (s.name || s.subjectName) : "Unnamed Subject";
//   };

//   const getClassroomNameById = (id) => {
//     if (!id) return "N/A";
//     const c = classrooms.find(cls => cls._id === id);
//     return c ? (c.name || c.room_number || c.classNumber) : `Room ${id?.slice?.(-4) || "N/A"}`;
//   };

//   // Helper to merge consecutive identical slots safely
//   const mergeConsecutiveSlots = (slots) => {
//     if (!slots || !slots.length) return [];

//     const merged = [];
//     let current = slots[0] ? { ...slots[0], span: 1 } : null;

//     for (let i = 1; i < slots.length; i++) {
//       const prev = current;
//       const curr = slots[i];

//       // If either prev or curr is null, push prev and continue
//       if (!prev || !curr) {
//         if (prev) merged.push(prev);
//         current = curr ? { ...curr, span: 1 } : null;
//         continue;
//       }

//       const prevClassroom = prev?.classroom?._id || prev?.classroom;
//       const currClassroom = curr?.classroom?._id || curr?.classroom;

//       const prevTeacher = typeof prev.teacher === "object" ? prev.teacher._id : prev.teacher;
//       const currTeacher = typeof curr.teacher === "object" ? curr.teacher._id : curr.teacher;

//       const prevSubject = typeof prev.subject === "object" ? prev.subject._id : prev.subject;
//       const currSubject = typeof curr.subject === "object" ? curr.subject._id : curr.subject;

//       if (prevSubject === currSubject && prevTeacher === currTeacher && prevClassroom === currClassroom) {
//         prev.span += 1; // merge into one block
//       } else {
//         merged.push(prev);
//         current = { ...curr, span: 1 };
//       }
//     }

//     if (current) merged.push(current);
//     return merged;
//   };

//   return (
//     <table className="w-full table-auto border text-sm">
//       <thead>
//         <tr>
//           <th className="border px-2 py-1 text-left bg-gray-100">Day / Period</th>
//           {Array.from({ length: periodsPerDay }).map((_, p) => (
//             <th key={p} className="border px-2 py-1 bg-gray-100">{p + 1}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             <td className="border px-2 py-1 font-medium bg-gray-50">{day}</td>
//             {mergeConsecutiveSlots(schedule[day]).map((slot, periodIdx) => {
//               if (!slot) {
//                 return (
//                   <td key={periodIdx} className="border px-2 py-1 text-gray-400 text-center">
//                     Library
//                   </td>
//                 );
//               }

//               const subjectName =
//                 typeof slot.subject === "object"
//                   ? (slot.subject.name || slot.subject.subjectName || "Unnamed Subject")
//                   : getSubjectNameById(slot.subject);

//               const teacherName =
//                 typeof slot.teacher === "object"
//                   ? (slot.teacher.name || "Unknown")
//                   : (slot.teacher || "Unknown");

//               const classroomId = slot?.classroom?._id || slot?.classroom || null;
//               const classroomName = getClassroomNameById(classroomId);

//               return (
//                 <td key={periodIdx} colSpan={slot.span} className="border px-2 py-1 text-center">
//                   <div className="font-semibold">{subjectName}</div>
//                   <div className="text-xs text-gray-700">{teacherName}</div>
//                   <div className="text-xs text-gray-500">{classroomName}</div>
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };


// export const renderTimetableGrid = (
//   divisionName,
//   schedule,
//   subjects = [],
//   classrooms = []
// ) => {
//   if (!schedule || typeof schedule !== "object") {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No timetable data available
//       </div>
//     );
//   }

//   const days = Object.keys(schedule);
//   const periodsPerDay = Math.max(...days.map(day => schedule[day]?.length || 0));

//   const getSubjectNameById = (id) => {
//     if (!id) return "Unnamed Subject";
//     const s = subjects.find(sub => sub._id === id);
//     return s ? (s.name || s.subjectName) : "Unnamed Subject";
//   };

//   const getClassroomNameById = (id) => {
//     if (!id) return "N/A";
//     const c = classrooms.find(cls => cls._id === id);
//     return c ? (c.name || c.room_number || c.classNumber) : `Room ${id?.slice?.(-4) || "N/A"}`;
//   };

//   const mergeConsecutiveSlots = (slots) => {
//     if (!slots || !slots.length) return [];

//     const merged = [];
//     let current = slots[0] ? { ...slots[0], span: 1 } : { span: 1, isFree: true };

//     for (let i = 1; i < slots.length; i++) {
//       const prev = current;
//       const curr = slots[i] ? { ...slots[i], span: 1 } : { span: 1, isFree: true };

//       const prevTeacher = prev?.teacher && (typeof prev.teacher === "object" ? prev.teacher._id : prev.teacher);
//       const currTeacher = curr?.teacher && (typeof curr.teacher === "object" ? curr.teacher._id : curr.teacher);

//       const prevSubject = prev?.subject && (typeof prev.subject === "object" ? prev.subject._id : prev.subject);
//       const currSubject = curr?.subject && (typeof curr.subject === "object" ? curr.subject._id : curr.subject);

//       const prevClassroom = prev?.classroom && (prev.classroom._id || prev.classroom);
//       const currClassroom = curr?.classroom && (curr.classroom._id || curr.classroom);

//       if (!prev.isFree && !curr.isFree &&
//           prevSubject === currSubject &&
//           prevTeacher === currTeacher &&
//           prevClassroom === currClassroom) {
//         prev.span += 1; // merge into one block
//       } else {
//         merged.push(prev);
//         current = curr;
//       }
//     }

//     merged.push(current);
//     return merged;
//   };

//   return (
//     <table className="w-full table-auto border text-sm">
//       <thead>
//         <tr>
//           <th className="border px-2 py-1 text-left bg-gray-100">Day / Period</th>
//           {Array.from({ length: periodsPerDay }).map((_, p) => (
//             <th key={p} className="border px-2 py-1 bg-gray-100">{p + 1}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {days.map((day) => {
//           const mergedSlots = mergeConsecutiveSlots(schedule[day]);
//           const cells = [];
//           let filled = 0;

//           mergedSlots.forEach((slot, idx) => {
//             const span = slot.span || 1;
//             filled += span;

//             if (slot.isFree) {
//               cells.push(
//                 <td key={idx} colSpan={span} className="border px-2 py-1 text-gray-400 text-center">
//                   Free / Library
//                 </td>
//               );
//             } else {
//               const subjectName =
//                 typeof slot.subject === "object"
//                   ? (slot.subject.name || slot.subject.subjectName || "Unnamed Subject")
//                   : getSubjectNameById(slot.subject);

//               const teacherName =
//                 typeof slot.teacher === "object"
//                   ? (slot.teacher.name || "Unknown")
//                   : (slot.teacher || "Unknown");

//               const classroomId = slot?.classroom?._id || slot?.classroom || null;
//               const classroomName = getClassroomNameById(classroomId);

//               cells.push(
//                 <td key={idx} colSpan={span} className="border px-2 py-1 text-center">
//                   <div className="font-semibold">{subjectName}</div>
//                   <div className="text-xs text-gray-700">{teacherName}</div>
//                   <div className="text-xs text-gray-500">{classroomName}</div>
//                 </td>
//               );
//             }
//           });

//           // Fill remaining empty slots if row has fewer than periodsPerDay
//           if (filled < periodsPerDay) {
//             const remaining = periodsPerDay - filled;
//             cells.push(
//               <td key="filler" colSpan={remaining} className="border px-2 py-1 text-gray-400 text-center">
//                 Free / Library
//               </td>
//             );
//           }

//           return (
//             <tr key={day}>
//               <td className="border px-2 py-1 font-medium bg-gray-50">{day}</td>
//               {cells}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// export const renderTimetableGrid = (
//   divisionName,
//   schedule,
//   subjects = [],
//   classrooms = []
// ) => {
//   if (!schedule || typeof schedule !== "object") {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No timetable data available
//       </div>
//     );
//   }

//   const days = Object.keys(schedule);
//   const periodsPerDay = Math.max(...days.map(day => schedule[day]?.length || 0));

//   const getSubjectNameById = (id) => {
//     if (!id) return "Unnamed Subject";
//     const s = subjects.find(sub => sub._id === id);
//     return s ? (s.name || s.subjectName) : "Unnamed Subject";
//   };

//   const getClassroomNameById = (id) => {
//     if (!id) return "N/A";
//     const c = classrooms.find(cls => cls._id === id);
//     return c ? (c.name || c.room_number || c.classNumber) : `Room ${id?.slice?.(-4) || "N/A"}`;
//   };

//   const mergeConsecutiveSlots = (slots) => {
//     if (!slots || !slots.length) return [];

//     const merged = [];
//     let current = slots[0] ? { ...slots[0], span: 1 } : { span: 1, isFree: true };

//     for (let i = 1; i < slots.length; i++) {
//       const prev = current;
//       const curr = slots[i] ? { ...slots[i], span: 1 } : { span: 1, isFree: true };

//       const prevTeacher = prev?.teacher && (typeof prev.teacher === "object" ? prev.teacher._id : prev.teacher);
//       const currTeacher = curr?.teacher && (typeof curr.teacher === "object" ? curr.teacher._id : curr.teacher);

//       const prevSubject = prev?.subject && (typeof prev.subject === "object" ? prev.subject._id : prev.subject);
//       const currSubject = curr?.subject && (typeof curr.subject === "object" ? curr.subject._id : curr.subject);

//       const prevClassroom = prev?.classroom && (prev.classroom._id || prev.classroom);
//       const currClassroom = curr?.classroom && (curr.classroom._id || curr.classroom);

//       if (!prev.isFree && !curr.isFree &&
//           prevSubject === currSubject &&
//           prevTeacher === currTeacher &&
//           prevClassroom === currClassroom) {
//         prev.span += 1; // merge into one block
//       } else {
//         merged.push(prev);
//         current = curr;
//       }
//     }

//     merged.push(current);
//     return merged;
//   };

//   // Insert recess into header
//   // const buildHeader = () => {
//   //   const headers = [];
//   //   for (let i = 1; i <= periodsPerDay; i++) {
//   //     headers.push(
//   //       <th key={`p${i}`} className="border px-2 py-1 bg-gray-100">
//   //         {i}
//   //       </th>
//   //     );
//   //     if (i === 2) {
//   //       headers.push(
//   //         <th key="lunch" className="border px-2 py-1 bg-yellow-100">
//   //           Recess<br />12:30–1:15
//   //         </th>
//   //       );
//   //     }
//   //     if (i === 4) {
//   //       headers.push(
//   //         <th key="short" className="border px-2 py-1 bg-yellow-100">
//   //           Break<br />3:15–3:30
//   //         </th>
//   //       );
//   //     }
//   //   }
//   //   return headers;
//   // };

//   // Period timings (example – adjust as per your college timings)
// const periodTimings = {
//   1: "9:00–10:00",
//   2: "10:00–11:00",
//   3: "11:15–12:15",
//   4: "1:15–2:15",
//   5: "2:15–3:15",
//   6: "3:30–4:30",
// };

// const buildHeader = () => {
//   const headers = [];
//   for (let i = 1; i <= periodsPerDay; i++) {
//     headers.push(
//       <th key={`p${i}`} className="border px-2 py-1 bg-gray-100 w-28 h-16 text-center">
//         <div className="font-medium">Period {i}</div>
//         <div className="text-xs text-gray-600">{periodTimings[i]}</div>
//       </th>
//     );
//     if (i === 2) {
//       headers.push(
//         <th key="lunch" className="border px-2 py-1 bg-yellow-100 w-28 h-16 text-center">
//           <div className="font-medium">Recess</div>
//           <div className="text-xs text-gray-600">12:30–1:15</div>
//         </th>
//       );
//     }
//     if (i === 4) {
//       headers.push(
//         <th key="short" className="border px-2 py-1 bg-yellow-100 w-28 h-16 text-center">
//           <div className="font-medium">Break</div>
//           <div className="text-xs text-gray-600">3:15–3:30</div>
//         </th>
//       );
//     }
//   }
//   return headers;
// };

//   return (
//     <table className="w-full table-fixed border text-sm">
//       <thead>
//         <tr>
//           <th className="border px-2 py-1 text-left bg-gray-100">Day / Period</th>
//           {buildHeader()}
//         </tr>
//       </thead>
//       <tbody>
//         {days.map((day) => {
//           const mergedSlots = mergeConsecutiveSlots(schedule[day]);
//           const cells = [];
//           let filled = 0;

//           mergedSlots.forEach((slot, idx) => {
//             const span = slot.span || 1;
//             filled += span;

//             if (slot.isFree) {
//               cells.push(
//                 <td key={idx} colSpan={span} className="border px-2 py-1 text-gray-400 text-center">
//                   Free / Library
//                 </td>
//               );
//             } else {
//               const subjectName =
//                 typeof slot.subject === "object"
//                   ? (slot.subject.name || slot.subject.subjectName || "Unnamed Subject")
//                   : getSubjectNameById(slot.subject);

//               const teacherName =
//                 typeof slot.teacher === "object"
//                   ? (slot.teacher.name || "Unknown")
//                   : (slot.teacher || "Unknown");

//               const classroomId = slot?.classroom?._id || slot?.classroom || null;
//               const classroomName = getClassroomNameById(classroomId);

//               cells.push(
//                 <td key={idx} colSpan={span} className="border px-2 py-1 text-center">
//                   <div className="font-semibold">{subjectName}</div>
//                   <div className="text-xs text-gray-700">{teacherName}</div>
//                   <div className="text-xs text-gray-500">{classroomName}</div>
//                 </td>
//               );
//             }

//             // Insert recess columns after period 2 and 4
//             if (filled === 2) {
//               cells.push(
//                 <td key="lunch" className="border px-2 py-1 bg-yellow-50 text-center font-medium">
//                   Recess<br />12:30–1:15
//                 </td>
//               );
//             }
//             if (filled === 4) {
//               cells.push(
//                 <td key="short" className="border px-2 py-1 bg-yellow-50 text-center font-medium">
//                   Break<br />3:15–3:30
//                 </td>
//               );
//             }
//           });

//           return (
//             <tr key={day}>
//               <td className="border px-2 py-1 font-medium bg-gray-50">{day}</td>
//               {cells}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };


export const renderTimetableGrid = (
  divisionName,
  schedule,
  subjects = [],
  classrooms = [],
  timeConfig = null
) => {
  if (!schedule || typeof schedule !== "object") {
    return (
      <div className="text-center py-4 text-gray-500">
        No timetable data available
      </div>
    );
  }

  const days = Object.keys(schedule);
  const periodsPerDay = Math.max(...days.map(day => schedule[day]?.length || 0));

  const getSubjectNameById = (id) => {
    if (!id) return "Unnamed Subject";
    const s = subjects.find(sub => sub._id === id);
    return s ? (s.name || s.subjectName) : "Unnamed Subject";
  };

  const getClassroomNameById = (id) => {
    if (!id) return "N/A";
    const c = classrooms.find(cls => cls._id === id);
    return c ? (c.name || c.room_number || c.classNumber) : `Room ${id?.slice?.(-4) || "N/A"}`;
  };

  const mergeConsecutiveSlots = (slots) => {
    if (!slots || !slots.length) return [];

    const merged = [];
    let current = slots[0] ? { ...slots[0], span: 1 } : { span: 1, isFree: true };

    for (let i = 1; i < slots.length; i++) {
      const prev = current;
      const curr = slots[i] ? { ...slots[i], span: 1 } : { span: 1, isFree: true };

      const prevTeacher = prev?.teacher && (typeof prev.teacher === "object" ? prev.teacher._id : prev.teacher);
      const currTeacher = curr?.teacher && (typeof curr.teacher === "object" ? curr.teacher._id : curr.teacher);

      const prevSubject = prev?.subject && (typeof prev.subject === "object" ? prev.subject._id : prev.subject);
      const currSubject = curr?.subject && (typeof curr.subject === "object" ? curr.subject._id : curr.subject);

      const prevClassroom = prev?.classroom && (prev.classroom._id || prev.classroom);
      const currClassroom = curr?.classroom && (curr.classroom._id || curr.classroom);

      if (!prev.isFree && !curr.isFree &&
          prevSubject === currSubject &&
          prevTeacher === currTeacher &&
          prevClassroom === currClassroom) {
        prev.span += 1; // merge into one block
      } else {
        merged.push(prev);
        current = curr;
      }
    }

    merged.push(current);
    return merged;
  };

  // Period timings + breaks come from the institution's configured
  // timetable timings (backend/modules/institution — see
  // services/institutionConfigService.js's getEffectiveConfig). When no
  // config is passed in (e.g. fetch failed, or an older caller hasn't
  // been updated yet) we fall back to the previous hardcoded values so
  // existing timetables keep rendering exactly as before.
  const fallbackTimeSlots = [
    { index: 0, label: "Period 1", startTime: "10:30", endTime: "11:30" },
    { index: 1, label: "Period 2", startTime: "11:30", endTime: "12:30" },
    { index: 2, label: "Period 3", startTime: "13:15", endTime: "14:15" },
    { index: 3, label: "Period 4", startTime: "14:15", endTime: "15:15" },
    { index: 4, label: "Period 5", startTime: "15:30", endTime: "16:30" },
    { index: 5, label: "Period 6", startTime: "16:30", endTime: "17:30" },
  ];
  const fallbackBreaks = [
    { label: "Lunch Break", afterPeriodIndex: 1, startTime: "12:30", endTime: "13:15" },
    { label: "Tea Break", afterPeriodIndex: 3, startTime: "15:15", endTime: "15:30" },
  ];

  const timeSlots = (timeConfig?.timeSlots?.length ? timeConfig.timeSlots : fallbackTimeSlots);
  const breaks = (timeConfig?.breaks?.length ? timeConfig.breaks : fallbackBreaks);

  const formatRange = (slot) =>
    slot?.startTime && slot?.endTime ? `${slot.startTime}–${slot.endTime}` : "";

  // Map 1-based period number -> its configured time slot (falls back to
  // an empty label for any period beyond what's configured, e.g. if the
  // actual schedule has more periods than the resolved config expects).
  const periodTimings = {};
  for (let i = 1; i <= periodsPerDay; i++) {
    const slot = timeSlots[i - 1];
    periodTimings[i] = slot ? formatRange(slot) : "";
  }

  // Breaks keyed by "insert after this many periods placed" (1-based),
  // derived from each break's 0-based afterPeriodIndex.
  const breaksAfterCount = new Map();
  breaks.forEach((b) => {
    const count = (b.afterPeriodIndex ?? -1) + 1;
    if (count >= 1) breaksAfterCount.set(count, b);
  });

  const buildHeader = () => {
    const headers = [];
    for (let i = 1; i <= periodsPerDay; i++) {
      headers.push(
        <th
          key={`p${i}`}
          className="border w-32 h-16 px-2 py-1 bg-gray-100 text-center align-middle"
        >
          <div className="font-medium">{timeSlots[i - 1]?.label || `Period ${i}`}</div>
          <div className="text-xs text-gray-600">{periodTimings[i]}</div>
        </th>
      );
      const brk = breaksAfterCount.get(i);
      if (brk) {
        headers.push(
          <th
            key={`break-${i}`}
            className="border w-32 h-16 px-2 py-1 bg-yellow-100 text-center align-middle"
          >
            <div className="font-medium">{brk.label || "Break"}</div>
            <div className="text-xs text-gray-600">{formatRange(brk)}</div>
          </th>
        );
      }
    }
    return headers;
  };

  return (
    <table className="w-full table-fixed border text-sm">
      <thead>
        <tr>
          <th className="border w-32 h-16 px-2 py-1 text-left bg-gray-100">
            Day / Period
          </th>
          {buildHeader()}
        </tr>
      </thead>
      <tbody>
        {days.map((day) => {
          const mergedSlots = mergeConsecutiveSlots(schedule[day]);
          const cells = [];
          let filled = 0;

          mergedSlots.forEach((slot, idx) => {
            const span = slot.span || 1;
            filled += span;

            if (slot.isFree) {
              cells.push(
                <td
                  key={idx}
                  colSpan={span}
                  className="border w-32 h-16 px-2 py-1 text-gray-400 text-center align-middle"
                >
                  Free / Library
                </td>
              );
            } else {
              const subjectName =
                typeof slot.subject === "object"
                  ? (slot.subject.name || slot.subject.subjectName || "Unnamed Subject")
                  : getSubjectNameById(slot.subject);

              const teacherName =
                typeof slot.teacher === "object"
                  ? (slot.teacher.name || "Unknown")
                  : (slot.teacher || "Unknown");

              const classroomId = slot?.classroom?._id || slot?.classroom || null;
              const classroomName = getClassroomNameById(classroomId);

              cells.push(
                <td
                  key={idx}
                  colSpan={span}
                  className="border w-32 h-16 px-2 py-1 text-center align-middle"
                >
                  <div className="font-semibold">{subjectName}</div>
                  <div className="text-xs text-gray-700">{teacherName}</div>
                  <div className="text-xs text-gray-500">{classroomName}</div>
                </td>
              );
            }

            // Insert configured recess/break columns after the periods they follow.
            const rowBrk = breaksAfterCount.get(filled);
            if (rowBrk) {
              cells.push(
                <td
                  key={`break-${filled}`}
                  className="border w-32 h-16 px-2 py-1 bg-yellow-50 text-center font-medium align-middle"
                >
                  {rowBrk.label || "Break"}<br />{formatRange(rowBrk)}
                </td>
              );
            }
          });

          return (
            <tr key={day}>
              <td className="border w-32 h-16 px-2 py-1 font-medium bg-gray-50 align-middle">
                {day}
              </td>
              {cells}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};









export const loadTimetables = async (filters, api, setTimetables, setFormattedTimetable, setLoading) => {
  if (!filters.department) return;

  setLoading(true);
  try {
    const result = await api.getTimetables(filters.department, {
      semester: filters.semester,
      academicYear: filters.academicYear
    });

    if (result.success) {
      // Handle nested subjects structure in timetable data
      const timetablesWithFormattedSubjects = result.data.map(timetable => ({
        ...timetable,
        subjects: timetable.subjects?.subjects || timetable.subjects || [],
        metadata: {
          ...timetable.metadata,
          fitnessScore: timetable.metadata?.fitnessScore || 0,
          generations: timetable.metadata?.generations || 0,
          conflictsResolved: timetable.metadata?.conflictsResolved || 0
        }
      }));

      setTimetables(timetablesWithFormattedSubjects);
      formatTimetableData(timetablesWithFormattedSubjects, setFormattedTimetable);
    }
  } catch (error) {
    console.error('❌ Error loading timetables:', error);
    toast.error('Failed to load timetables');
  } finally {
    setLoading(false);
  }
};

// Format timetable data
// export const formatTimetableData = (timetables, setFormattedTimetable) => {
//   if (!Array.isArray(timetables) || timetables.length === 0) return;

//   const formatted = {};
//   timetables.forEach(timetable => {
//     if (!Array.isArray(timetable.divisions)) return;

//     timetable.divisions.forEach(div => {
//       if (div.division_name && div.schedule) {
//         formatted[div.division_name] = div.schedule;
//       }
//     });
//   });

//   setFormattedTimetable({
//     formatted_schedule2: formatted
//   });
// };

//imp
// export const formatTimetableData = (timetables, setFormattedTimetable) => {
//   if (!Array.isArray(timetables) || timetables.length === 0) {
//     setFormattedTimetable(null);
//     return;
//   }

//   const divisions = [];

//   timetables.forEach(timetable => {
//     if (!Array.isArray(timetable.divisions)) return;

//     timetable.divisions.forEach(div => {
//       if (div.division_name && div.schedule) {
//         divisions.push({
//           division_name: div.division_name,
//           schedule: div.schedule
//         });
//       }
//     });
//   });

//   setFormattedTimetable({
//     divisions,
//     semester: timetables[0]?.semester || null
//   });
// };


// export const formatTimetableData = (timetables, setFormattedTimetable) => {
//   console.log("📥 Raw timetables input:", timetables); // check incoming data

//   if (!Array.isArray(timetables) || timetables.length === 0) {
//     console.warn("⚠️ No timetables provided.");
//     setFormattedTimetable(null);
//     return;
//   }

//   const divisions = [];

//   timetables.forEach((timetable, index) => {
//     console.log(`🔍 Timetable[${index}] divisions:`, timetable.divisions);

//     if (!Array.isArray(timetable.divisions)) return;

//     timetable.divisions.forEach((div, divIndex) => {
//       console.log(`➡️ Div[${divIndex}]`, div);

//       if (div.division_name && div.schedule) {
//         divisions.push({
//           division_name: div.division_name,
//           schedule: div.schedule
//         });
//       }
//     });
//   });

//   console.log("✅ Final formatted divisions:", divisions);

//   if (divisions.length === 0) {
//     console.warn("❌ No valid divisions found");
//     setFormattedTimetable(null);
//     return;
//   }

//   setFormattedTimetable({
//     divisions,
//     semester: timetables[0]?.semester || null
//   });
// };


// export const formatTimetableData = (timetable, setFormattedTimetable) => {
//   if (!timetable || !Array.isArray(timetable.divisions)) {
//     setFormattedTimetable(null);
//     return;
//   }

//   const divisions = [];

//   timetable.divisions.forEach((div) => {
//     if (div.division_name && div.schedule) {
//       divisions.push({
//         division_name: div.division_name,
//         schedule: div.schedule,
//       });
//     }
//   });

//   if (divisions.length === 0) {
//     setFormattedTimetable(null);
//     return;
//   }

//   setFormattedTimetable({
//     divisions,
//     semester: timetable.semester || null,
//   });
// };


export const formatTimetableData = (timetables, setFormattedTimetable) => {
  //console.log("📥 Raw timetables input:", timetables);

  if (!Array.isArray(timetables) || timetables.length === 0) {
    console.log("❌ No timetables to format.");
    setFormattedTimetable(null);
    return;
  }

  const divisions = [];

  timetables.forEach((timetable, index) => {
    console.log(`📘 Timetable ${index + 1}:`, timetable);

    if (!Array.isArray(timetable.divisions)) {
      console.warn(`⚠️ Timetable ${index + 1} has no divisions array`);
      return;
    }

    timetable.divisions.forEach((div, i) => {
      if (div.division_name && div.schedule) {
        console.log(`✅ Added Division ${div.division_name}`, div.schedule);
        divisions.push({
          division_name: div.division_name,
          schedule: div.schedule
        });
      } else {
        console.warn(`⛔ Skipping invalid division at index ${i}`, div);
      }
    });
  });

  const formatted = {
    divisions,
    semester: timetables[0]?.semester || null,
  };

  console.log("✅ Final formatted timetable:", formatted);
  setFormattedTimetable(formatted);
};

