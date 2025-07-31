
// // TimetableUtils.js
// import departmentService from '../services/departmentService.js';
// import subjectService from '../services/subjectService.js'
// import { toast } from 'react-toastify';

// export const divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
// export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// export const timeSlots = [
//   { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//   { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//   { period: 3, start: '1:15', end: '2:15', label: '3rd Period' },
//   { period: 4, start: '2:15', end: '3:15', label: '4th Period' },
//   { period: 5, start: '3:30', end: '4:30', label: '5th Period' },
//   { period: 6, start: '4:30', end: '5:30', label: '6th Period' }
// ];

// // Fetch departments
// export const fetchDepartments = async (setDepartments) => {
//   try {
//     const formattedDepartments = await departmentService.getDepartmentsForSelect();
//     setDepartments(formattedDepartments);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     toast.error('Failed to load departments');
//   }
// };

// // Fetch subjects
// // export const fetchSubjects = async (setSubjects, setLoading) => {
// //   try {
// //     setLoading(true);
// //     const response = await subjectService.getAllSubjects();
// //     if (response.success && response.data) {
// //       const subjectsArray = Array.isArray(response.data)
// //         ? response.data
// //         : response.data.subjects || [];
// //       setSubjects(subjectsArray);
// //     } else {
// //       setSubjects([]);
// //       toast.error('Failed to fetch subjects');
// //     }
// //   } catch (error) {
// //     console.error('Error fetching subjects:', error);
// //     setSubjects([]);
// //     toast.error('Error fetching subjects');
// //   } finally {
// //     setLoading(false);
// //   }
// // };

//    export const fetchSubjects = async (setSubjects, setLoading) => {
//      try {
//        const response = await fetch('/api/subjects');
//        const data = await response.json();
//        if (data.success) {
//          setSubjects(data.data);
//        } else {
//          throw new Error('Failed to fetch subjects');
//        }
//      } catch (error) {
//        console.error('Error fetching subjects:', error);
//        toast.error('Error fetching subjects');
//      } finally {
//        setLoading(false);
//      }
//    };
   

// // Fetch teachers
// export const fetchTeachers = async (setTeachers) => {
//   try {
//     const response = await fetch('/api/teachers');
//     const data = await response.json();
//     console.log(data);

//     if (data.success) {
//       setTeachers(Array.isArray(data.data) ? data.data : data.data.teachers || []);
//     }
//   } catch (error) {
//     console.error('Error fetching teachers:', error);
//     setTeachers([]);
//     toast.error('Failed to load teachers');
//   }
// };

// // Fetch classes
// export const fetchClasses = async (setClasses) => {
//   try {
//     const response = await fetch('/api/classes');
//     const data = await response.json();
//     console.log("class data:", data);
//     if (data.success) {
//       setClasses(Array.isArray(data.data) ? data.data : data.data.classes || []);
//     }
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     setClasses([]);
//     toast.error('Failed to load classes');
//   }
// };

// // Render timetable grid with teacher names
// export const renderTimetableGrid = (division, formattedTimetable) => {
//   const schedule = formattedTimetable?.formatted_schedule2?.[division];
//   if (!schedule) {
//     return <div className="text-center py-4 text-gray-500">No schedule available</div>;
//   }

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periods = [1, 2, 3, 4, 5, 6, 7];

//   return (
//     <div className="border rounded-lg p-4 mb-6">
//       <h2 className="text-xl font-semibold mb-2">Division {division}</h2>
//       <table className="min-w-full table-auto border">
//         <thead>
//           <tr>
//             <th className="border px-2 py-1">Day / Period</th>
//             {periods.map((p) => (
//               <th key={p} className="border px-2 py-1">P{p}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => (
//             <tr key={day}>
//               <td className="border px-2 py-1 font-medium">{day}</td>
//               {periods.map((period) => {
//                 const cell = schedule[day]?.[period] || { subject: "Free", teacher: "" };
//                 return (
//                   <td key={period} className="border px-2 py-1 text-center">
//                     {cell.subject} <br/>
//                     <span className="text-sm text-gray-500">{cell.teacher}</span>
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Load timetables function
// export const loadTimetables = async (filters, api, setTimetables, setFormattedTimetable, setLoading) => {
//   if (!filters.department) return;

//   setLoading(true);
//   try {
//     const result = await api.getTimetables(filters.department, {
//       semester: filters.semester,
//       academicYear: filters.academicYear
//     });

//     if (result.success) {
//         console.log("🟢 Full fetched data:", result.data);
//         console.log("📌 One full timetable:", result.data[0]);
//       setTimetables(result.data);

//       // 👇 Format data for renderTimetableGrid
//       const formatted = {};
//       result.data.forEach(timetable => {
//           console.log("📌 Timetable:", timetable);
//         timetable.divisions.forEach(div => {
//             console.log("📌 Division inside timetable:", div);
//           if (div.division_name && div.schedule) {
//             formatted[div.division_name] = div.schedule;
//           }
//         });
//       });

//       console.log("✅ Formatted for render:", formatted);
//       setFormattedTimetable({
//         formatted_schedule2: formatted
//       });
//     }
//   } catch (error) {
//     console.error('Error loading timetables:', error);
//     toast.error('Failed to load timetables');
//   } finally {
//     setLoading(false);
//   }
// };

// // Format timetable data for display
// export const formatTimetableData = (timetables, setFormattedTimetable) => {
//   if (timetables.length > 0) {
//     const formatted = {};
//     timetables.forEach(timetable => {
//       // YAHAN YEH LOG LAGAO
//       console.log("📌 Timetable:", timetable);
//       console.log("📝 Timetable Schedule:", timetable.schedule);
      
//       timetable.divisions.forEach(divisionName => {
//         console.log("👉 Checking division:", divisionName);
        
//         if (
//           divisionName &&
//           timetable.schedule &&
//           timetable.schedule[divisionName]
//         ) {
//           console.log("✅ Found schedule for:", divisionName);
//           formatted[divisionName] = timetable.schedule[divisionName];
//         } else {
//           console.log("❌ No schedule for:", divisionName, timetable.schedule ? Object.keys(timetable.schedule) : "No schedule present");
//         }
//       });
//     });

//     console.log("🎯 Final Formatted Data:", formatted);
//     setFormattedTimetable({
//       formatted_schedule2: formatted
//     });
//   }
// };

// // Process schedule data
// export const processScheduleData = (timetables) => {
//   console.log("📌 Timetable:", timetables);
//   const scheduleMap = {};

//   if (timetables && Array.isArray(timetables.schedule)) {
//     timetables.schedule.forEach(item => {
//       if (item.division) {
//         if (!scheduleMap[item.division]) {
//           scheduleMap[item.division] = [];
//         }
//         scheduleMap[item.division].push(item);
//       }
//     });
//   } else if (timetables && typeof timetables.schedule === 'object' && timetables.schedule !== null) {
//     Object.assign(scheduleMap, timetables.schedule);
//   } else {
//     console.warn("⚠ No valid schedule present in timetable.");
//   }

//   console.log("🎯 Final Formatted Data:", scheduleMap);
//   return scheduleMap;
// };



// // TimetableUtils.js
// import departmentService from '../services/departmentService.js';
// import subjectService from '../services/subjectService.js'
// import { toast } from 'react-toastify';

// export const divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
// export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// export const timeSlots = [
//   { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//   { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//   { period: 3, start: '1:15', end: '2:15', label: '3rd Period' },
//   { period: 4, start: '2:15', end: '3:15', label: '4th Period' },
//   { period: 5, start: '3:30', end: '4:30', label: '5th Period' },
//   { period: 6, start: '4:30', end: '5:30', label: '6th Period' }
// ];

// // Fetch departments
// export const fetchDepartments = async (setDepartments) => {
//   try {
//     const formattedDepartments = await departmentService.getDepartmentsForSelect();
//     setDepartments(formattedDepartments);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     toast.error('Failed to load departments');
//   }
// };

// // Fetch subjects
// // export const fetchSubjects = async (setSubjects, setLoading) => {
// //   try {
// //     setLoading(true);
// //     const response = await subjectService.getAllSubjects();
// //     if (response.success && response.data) {
// //       const subjectsArray = Array.isArray(response.data)
// //         ? response.data
// //         : response.data.subjects || [];
// //       setSubjects(subjectsArray);
// //     } else {
// //       setSubjects([]);
// //       toast.error('Failed to fetch subjects');
// //     }
// //   } catch (error) {
// //     console.error('Error fetching subjects:', error);
// //     setSubjects([]);
// //     toast.error('Error fetching subjects');
// //   } finally {
// //     setLoading(false);
// //   }
// // };

//    export const fetchSubjects = async (setSubjects) => {
//      try {
//        const response = await fetch('/api/subjects');
//        const data = await response.json();
//        if (data.success) {
//          setSubjects(data.data);
//        } else {
//          throw new Error('Failed to fetch subjects');
//        }
//      } catch (error) {
//        console.error('Error fetching subjects:', error);
//        toast.error('Error fetching subjects');
//      }
//    };
   

// // Fetch teachers
// export const fetchTeachers = async (setTeachers) => {
//   try {
//     const response = await fetch('/api/teachers');
//     const data = await response.json();
//     console.log(data);

//     if (data.success) {
//       setTeachers(Array.isArray(data.data) ? data.data : data.data.teachers || []);
//     }
//   } catch (error) {
//     console.error('Error fetching teachers:', error);
//     setTeachers([]);
//     toast.error('Failed to load teachers');
//   }
// };

// // Fetch classes
// // export const fetchClasses = async (setClasses) => {
// //   try {
// //     console.log("class api called");
// //     const response = await fetch('/api/classes');
// //     const data = await response.json();
// //     console.log("class data:", data);
// //     if (data.success) {
// //       setClasses(Array.isArray(data.data) ? data.data : data.data.classes || []);
// //     }
// //   } catch (error) {
// //     console.error('Error fetching classes:', error);
// //     setClasses([]);
// //     toast.error('Failed to load classes');
// //   }
// // };

// // src/services/classService.js
// export const fetchClasses = async (setClasses) => {
//   try {
//     console.log("class api called");
//     const response = await fetch('/api/classes');
//     const data = await response.json();
//     console.log("class data:", data);
//     if (data.success) {
//       const classArray = Array.isArray(data.data) ? data.data : data.data.classes || [];
//       setClasses(classArray);
//       console.log("✅ CLASSES SET:", classArray);
//     } else {
//       setClasses([]);
//     }
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     setClasses([]);
//     toast.error('Failed to load classes');
//   }
// };


// // Render timetable grid with teacher names
// // export const renderTimetableGrid = (division, formattedTimetable) => {
 
// //    console.log("🔍 renderTimetableGrid called with schedule:", schedule);
// //   console.log("🔢 divisionName:", divisionName);


// //   const schedule = formattedTimetable?.formatted_schedule2?.[division];

// //   if (!schedule) {
// //     return <div className="text-center py-4 text-gray-500">No schedule available</div>;
// //   }

// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periods = [1, 2, 3, 4, 5, 6, 7];

// //   return (
// //     <div className="border rounded-lg p-4 mb-6">
// //       <h2 className="text-xl font-semibold mb-2">Division {division}</h2>
// //       <table className="min-w-full table-auto border">
// //         <thead>
// //           <tr>
// //             <th className="border px-2 py-1">Day / Period</th>
// //             {periods.map((p) => (
// //               <th key={p} className="border px-2 py-1">P{p}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="border px-2 py-1 font-medium">{day}</td>
// //               {periods.map((period) => {
// //                 const cell = schedule[day]?.[period] || { subject: "Free", teacher: "" };
// //                 console.log(`📆 ${division} | ${day} P${period}:`, cell);

// //                 return (
// //                   <td key={period} className="border px-2 py-1 text-center">
// //                     {cell.subject} <br/>
// //                     <span className="text-sm text-gray-500">{cell.teacher}</span>
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export const renderTimetableGrid = (division, formattedTimetable) => {
// //   console.log("🔍 renderTimetableGrid called with schedule:", formattedTimetable);
// //   console.log("🔢 divisionName:", division);
// //   console.log("🔍 renderTimetableGrid called with division:", divisionName);
// //   console.log("📅 schedule:", schedule);
// //   const schedule = formattedTimetable?.formatted_schedule2?.[division];

// //   if (!schedule) {
// //     return <div className="text-center py-4 text-gray-500">No schedule available</div>;
// //   }

// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periods = [1, 2, 3, 4, 5, 6, 7];

// //   return (
// //     <div className="border rounded-lg p-4 mb-6">
// //       <h2 className="text-xl font-semibold mb-2">Division {division}</h2>
// //       <table className="min-w-full table-auto border">
// //         <thead>
// //           <tr>
// //             <th className="border px-2 py-1">Day / Period</th>
// //             {periods.map((p) => (
// //               <th key={p} className="border px-2 py-1">P{p}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="border px-2 py-1 font-medium">{day}</td>
// //               {periods.map((period) => {
// //                 const cell = schedule[day]?.[period] || { subject: "Free", teacher: "" };
// //                 console.log(`📆 ${division} | ${day} P${period}:`, cell);

// //                 return (
// //                   <td key={period} className="border px-2 py-1 text-center">
// //                     {cell.subject} <br/>
// //                     <span className="text-sm text-gray-500">{cell.teacher}</span>
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };
// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   if (!schedule) {
// //     return <div className="text-center py-4 text-gray-500">No schedule available</div>;
// //   }

// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periods = [1, 2, 3, 4, 5, 6];

// //   return (
// //     <div className="border rounded-lg p-4 mb-6">
// //       <h2 className="text-xl font-semibold mb-2">Division {divisionName}</h2>
// //       <table className="min-w-full table-auto border">
// //         <thead>
// //           <tr>
// //             <th className="border px-2 py-1">Day / Period</th>
// //             {periods.map((p) => (
// //               <th key={p} className="border px-2 py-1">P{p}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="border px-2 py-1 font-medium">{day}</td>
// //               {periods.map((period) => {
// //                 const cell = schedule[day]?.[period] || { subject: "Free", teacher: "" };
// //                 return (
// //                   <td key={period} className="border px-2 py-1 text-center">
// //                     {cell.subject} <br />
// //                     <span className="text-sm text-gray-500">{cell.teacher}</span>
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };


// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   if (!schedule) {
// //     return <div className="text-center py-4 text-gray-500">No schedule available</div>;
// //   }

// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periods = [1, 2, 3, 4, 5, 6];

// //   return (
// //     <div className="border rounded-lg p-4 mb-6">
// //       <h2 className="text-xl font-semibold mb-2">Division {divisionName}</h2>
// //       <table className="min-w-full table-auto border">
// //         <thead>
// //           <tr>
// //             <th className="border px-2 py-1">Day / Period</th>
// //             {periods.map((p) => (
// //               <th key={p} className="border px-2 py-1">P{p}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="border px-2 py-1 font-medium">{day}</td>
// //               {periods.map((period) => {
// //                 const cell = schedule[day]?.[period - 1] || { subject: "Free", teacher: "" };
// //                 return (
// //                   <td key={period} className="border px-2 py-1 text-center">
// //                     {cell.subject?.name || cell.subject} <br />
// //                     <span className="text-sm text-gray-500">{cell.teacher?.name || cell.teacher}</span>
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

//  export const renderTimetableGrid = (divisionName, schedule) => (
//   <table className="w-full border">
//     <thead>
//       <tr>
//         <th className="border p-2">Day</th>
//         {['1', '2', '3', '4', '5', '6',].map((period) => (
//           <th key={period} className="border p-2">P{period}</th>
//         ))}
//       </tr>
//     </thead>
//     <tbody>
//       {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', ].map((day) => (
//         <tr key={day}>
//           <td className="border p-2 font-semibold">{day}</td>
//           {['1', '2', '3', '4', '5', '6', '7'].map((period) => {
//             const lecture = schedule?.[day]?.[period];
//             return (
//               <td key={period} className="border p-2 text-sm text-center">
//                 {lecture ? (
//                   <>
//                     <div>{lecture.subject_name}</div>
//                     <div className="text-xs text-gray-500">{lecture.teacher_name}</div>
//                     <div className="text-xs text-gray-400">{lecture.classroom}</div>
//                   </>
//                 ) : 'Free'}
//               </td>
//             );
//           })}
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );

//   export const formatSchedule = (lecturesArray) => {
//   const schedule = {};
//   for (const lecture of lecturesArray) {
//     const { day, period, subject_name, teacher_name, classroom } = lecture;

//     if (!schedule[day]) schedule[day] = {};
//     schedule[day][period] = { subject_name, teacher_name, classroom };
//   }
//   return schedule;
// };


// // Load timetables function
// export const loadTimetables = async (filters, api, setTimetables, setFormattedTimetable, setLoading) => {
//   if (!filters.department) return;

//   setLoading(true);
//   try {
//     const result = await api.getTimetables(filters.department, {
//       semester: filters.semester,
//       academicYear: filters.academicYear
//     });

//     if (result.success) {
//         console.log("🟢 Full fetched data:", result.data);
//         console.log("📌 One full timetable:", result.data[0]);
//       setTimetables(result.data);

//       // 👇 Format data for renderTimetableGrid
//       const formatted = {};
//       result.data.forEach(timetable => {
//           console.log("📌 Timetable:", timetable);
//         timetable.divisions.forEach(div => {
//             console.log("📌 Division inside timetable:", div);
//           if (div.division_name && div.schedule) {
//             formatted[div.division_name] = div.schedule;
//           }
//         });
//       });

//       console.log("✅ Formatted for render:", formatted);
//       setFormattedTimetable({
//         formatted_schedule2: formatted
//       });
//     }
//   } catch (error) {
//     console.error('Error loading timetables:', error);
//     toast.error('Failed to load timetables');
//   } finally {
//     setLoading(false);
//   }
// };

// // Format timetable data for display
// export const formatTimetableData = (timetables, setFormattedTimetable) => {
//   if (timetables.length > 0) {
//     const formatted = {};
//     timetables.forEach(timetable => {
//       // YAHAN YEH LOG LAGAO
//       console.log("📌 Timetable:", timetable);
//       console.log("📝 Timetable Schedule:", timetable.schedule);
      
//       timetable.divisions.forEach(divisionName => {
//         console.log("👉 Checking division:", divisionName);
        
//         if (
//           divisionName &&
//           timetable.schedule &&
//           timetable.schedule[divisionName]
//         ) {
//           console.log("✅ Found schedule for:", divisionName);
//           formatted[divisionName] = timetable.schedule[divisionName];
//         } else {
//           console.log("❌ No schedule for:", divisionName, timetable.schedule ? Object.keys(timetable.schedule) : "No schedule present");
//         }
//       });
//     });

//     console.log("🎯 Final Formatted Data:", formatted);
//     setFormattedTimetable({
//       formatted_schedule2: formatted
//     });
//   }
// };

// // Process schedule data
// export const processScheduleData = (timetables) => {
//   console.log("📌 Timetable:", timetables);
//   const scheduleMap = {};

//   if (timetables && Array.isArray(timetables.schedule)) {
//     timetables.schedule.forEach(item => {
//       if (item.division) {
//         if (!scheduleMap[item.division]) {
//           scheduleMap[item.division] = [];
//         }
//         scheduleMap[item.division].push(item);
//       }
//     });
//   } else if (timetables && typeof timetables.schedule === 'object' && timetables.schedule !== null) {
//     Object.assign(scheduleMap, timetables.schedule);
//   } else {
//     console.warn("⚠ No valid schedule present in timetable.");
//   }

//   console.log("🎯 Final Formatted Data:", scheduleMap);
//   return scheduleMap;
// };




// // TimetableUtils.js
// import departmentService from '../services/departmentService.js';
// import subjectService from '../services/subjectService.js'
// import { toast } from 'react-toastify';

// export const divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
// export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// export const timeSlots = [
//   { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//   { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//   { period: 3, start: '1:15', end: '2:15', label: '3rd Period' },
//   { period: 4, start: '2:15', end: '3:15', label: '4th Period' },
//   { period: 5, start: '3:30', end: '4:30', label: '5th Period' },
//   { period: 6, start: '4:30', end: '5:30', label: '6th Period' }
// ];

// // Fetch departments
// export const fetchDepartments = async (setDepartments) => {
//   try {
//     const formattedDepartments = await departmentService.getDepartmentsForSelect();
//     setDepartments(formattedDepartments);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     toast.error('Failed to load departments');
//   }
// };

// export const fetchSubjects = async (setSubjects) => {
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
//   }
// };

// // Fetch teachers
// export const fetchTeachers = async (setTeachers) => {
//   try {
//     const response = await fetch('/api/teachers');
//     const data = await response.json();
//     console.log(data);

//     if (data.success) {
//       setTeachers(Array.isArray(data.data) ? data.data : data.data.teachers || []);
//     }
//   } catch (error) {
//     console.error('Error fetching teachers:', error);
//     setTeachers([]);
//     toast.error('Failed to load teachers');
//   }
// };

// export const fetchClasses = async (setClasses) => {
//   try {
//     console.log("class api called");
//     const response = await fetch('/api/classes');
//     const data = await response.json();
//     console.log("class data:", data);
//     if (data.success) {
//       const classArray = Array.isArray(data.data) ? data.data : data.data.classes || [];
//       setClasses(classArray);
//       console.log("✅ CLASSES SET:", classArray);
//     } else {
//       setClasses([]);
//     }
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     setClasses([]);
//     toast.error('Failed to load classes');
//   }
// };

// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   if (!schedule) {
// //     return (
// //       <div className="text-center py-4 text-gray-500">
// //         No schedule available for {divisionName}
// //       </div>
// //     );
// //   }

// //   return (
// //     <table className="w-full border">
// //       <thead>
// //         <tr>
// //           <th className="border p-2 bg-gray-50">Day</th>
// //           {['1', '2', '3', '4', '5', '6', ].map((period) => (
// //             <th key={period} className="border p-2 bg-gray-50">P{period}</th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
// //           <tr key={day}>
// //             <td className="border p-2 font-semibold bg-gray-50">{day}</td>
// //             {[ '1', '2', '3', '4', '5', '6', ].map((periodIndex) => {
// //               const lecture = schedule?.[day]?.[periodIndex];
// //               return (
// //                 <td key={periodIndex} className="border p-2 text-sm text-center">
// //                   {lecture ? (
// //                     <>
// //                       <div className="font-medium text-blue-900">
// //                         {lecture.subject?.name || lecture.subject_name || 'N/A'}
// //                       </div>
// //                       <div className="text-xs text-gray-600 mt-1">
// //                         {lecture.teacher?.name || lecture.teacher_name || 'N/A'}
// //                       </div>
// //                       <div className="text-xs text-gray-400 mt-1">
// //                         {lecture.classroom || 'TBA'}
// //                       </div>
// //                     </>
// //                   ) : (
// //                     <span className="text-gray-400 italic">Free</span>
// //                   )}
// //                 </td>
// //               );
// //             })}
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   );
// // };


// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   if (!schedule) {
// //     return (
// //       <div className="text-center py-4 text-gray-500">
// //         No schedule available for {divisionName}
// //       </div>
// //     );
// //   }

// //   return (
// //     <table className="w-full border">
// //       <thead>
// //         <tr>
// //           <th className="border p-2 bg-gray-50">Day</th>
// //           {[0, 1, 2, 3, 4, 5].map((index) => (
// //             <th key={index} className="border p-2 bg-gray-50">P{index + 1}</th>
// //           ))}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
// //           <tr key={day}>
// //             <td className="border p-2 font-semibold bg-gray-50">{day}</td>
// //             {[0, 1, 2, 3, 4, 5].map((periodIndex) => {
// //               const lecture = schedule?.[day]?.[periodIndex];
// //               return (
// //                 <td key={periodIndex} className="border p-2 text-sm text-center">
// //                   {lecture ? (
// //                     <>
// //                       <div className="font-medium text-blue-900">
// //                         {lecture.subject?.name || lecture.subject_name || 'N/A'}
// //                       </div>
// //                       <div className="text-xs text-gray-600 mt-1">
// //                         {lecture.teacher?.name || lecture.teacher_name || 'N/A'}
// //                       </div>
// //                       <div className="text-xs text-gray-400 mt-1">
// //                         {lecture.classroom || 'TBA'}
// //                       </div>
// //                     </>
// //                   ) : (
// //                     <span className="text-gray-400 italic">Free</span>
// //                   )}
// //                 </td>
// //               );
// //             })}
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   );
// // };

//  export const renderTimetableGrid = (divisionName, schedule) => {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periods = ["P1", "P2", "P3", "P4", "P5", "P6"];

//   return (
//     <div className="mb-10">
//       <h3 className="text-xl font-semibold mb-2 text-center">
//         Division: {divisionName}
//       </h3>
//       <table className="table table-bordered w-full text-center border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th>Day / Period</th>
//             {periods.map((period) => (
//               <th key={period}>{period}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => (
//             <tr key={day}>
//               <td className="font-semibold">{day}</td>
//               {periods.map((period) => {
//                 const lecture = schedule?.[day]?.[period];

//                 return (
//                   <td key={period} className="p-2">
//                     {lecture ? (
//                       <>
//                         <div className="font-medium">{lecture.subject}</div>
//                         <div className="text-sm">{lecture.teacher}</div>
//                         <div className="text-xs text-gray-500">{lecture.classroom}</div>
//                       </>
//                     ) : (
//                       <em className="text-gray-400">Free</em>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };



// export const formatSchedule = (lecturesArray) => {
//   const schedule = {};
//   for (const lecture of lecturesArray) {
//     const { day, period, subject_name, teacher_name, classroom } = lecture;

//     if (!schedule[day]) schedule[day] = {};
//     schedule[day][period] = { subject_name, teacher_name, classroom };
//   }
//   return schedule;
// };

// // Load timetables function
// export const loadTimetables = async (filters, api, setTimetables, setFormattedTimetable, setLoading) => {
//   if (!filters.department) return;

//   setLoading(true);
//   try {
//     const result = await api.getTimetables(filters.department, {
//       semester: filters.semester,
//       academicYear: filters.academicYear
//     });

//     if (result.success) {
//       console.log("🟢 Full fetched data:", result.data);
//       console.log("📌 One full timetable:", result.data[0]);
//       setTimetables(result.data);

//       // Format data for renderTimetableGrid
//       const formatted = {};
//       result.data.forEach(timetable => {
//         console.log("📌 Timetable:", timetable);
//         timetable.divisions.forEach(div => {
//           console.log("📌 Division inside timetable:", div);
//           if (div.division_name && div.schedule) {
//             formatted[div.division_name] = div.schedule;
//           }
//         });
//       });

//       console.log("✅ Formatted for render:", formatted);
//       setFormattedTimetable({
//         formatted_schedule2: formatted
//       });
//     }
//   } catch (error) {
//     console.error('Error loading timetables:', error);
//     toast.error('Failed to load timetables');
//   } finally {
//     setLoading(false);
//   }
// };

// // Format timetable data for display
// export const formatTimetableData = (timetables, setFormattedTimetable) => {
//   if (timetables.length > 0) {
//     const formatted = {};
//     timetables.forEach(timetable => {
//       console.log("📌 Timetable:", timetable);
//       console.log("📝 Timetable Schedule:", timetable.schedule);
      
//       timetable.divisions.forEach(divisionData => {
//         const divisionName = divisionData.division_name;
//         console.log("👉 Checking division:", divisionName);
        
//         if (divisionName && divisionData.schedule) {
//           console.log("✅ Found schedule for:", divisionName);
//           formatted[divisionName] = divisionData.schedule;
//         } else {
//           console.log("❌ No schedule for:", divisionName);
//         }
//       });
//     });

//     console.log("🎯 Final Formatted Data:", formatted);
//     setFormattedTimetable({
//       formatted_schedule2: formatted
//     });
//   }
// };

// // Process schedule data
// export const processScheduleData = (timetables) => {
//   console.log("📌 Timetable:", timetables);
//   const scheduleMap = {};

//   if (timetables && Array.isArray(timetables.schedule)) {
//     timetables.schedule.forEach(item => {
//       if (item.division) {
//         if (!scheduleMap[item.division]) {
//           scheduleMap[item.division] = [];
//         }
//         scheduleMap[item.division].push(item);
//       }
//     });
//   } else if (timetables && typeof timetables.schedule === 'object' && timetables.schedule !== null) {
//     Object.assign(scheduleMap, timetables.schedule);
//   } else {
//     console.warn("⚠ No valid schedule present in timetable.");
//   }

//   console.log("🎯 Final Formatted Data:", scheduleMap);
//   return scheduleMap;
// };




// // TimetableUtils.js
// import departmentService from '../services/departmentService.js';
// //import subjectService from '../services/subjectService.js'
// import { toast } from 'react-toastify';
// import subjectService from '../services/subjectService.js';

// export const divisions = ['SYA', 'SYB', 'TYA', 'TYB', 'BTechA', 'BTechB'];
// export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
// export const timeSlots = [
//   { period: 1, start: '10:30', end: '11:30', label: '1st Period' },
//   { period: 2, start: '11:30', end: '12:30', label: '2nd Period' },
//   { period: 3, start: '1:15', end: '2:15', label: '3rd Period' },
//   { period: 4, start: '2:15', end: '3:15', label: '4th Period' },
//   { period: 5, start: '3:30', end: '4:30', label: '5th Period' },
//   { period: 6, start: '4:30', end: '5:30', label: '6th Period' }
// ];

// // Fetch departments
// export const fetchDepartments = async (setDepartments) => {
//   try {
//     const formattedDepartments = await departmentService.getDepartmentsForSelect();
//     setDepartments(formattedDepartments);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     toast.error('Failed to load departments');
//   }
// };

// export const fetchSubjects = async (setSubjects) => {
//   try {
//     const response = await fetch('/api/subjects');
//     const data = await response.json();
//     console.log("subject data",data);
//     if (data.success) {
//       setSubjects(data.data);
//     } else {
//       throw new Error('Failed to fetch subjects');
//     }
//   } catch (error) {
//     console.error('Error fetching subjects:', error);
//     toast.error('Error fetching subjects');
//   }
// };

// // Fetch teachers
// export const fetchTeachers = async (setTeachers) => {
//   try {
//     const response = await fetch('/api/teachers');
//     const data = await response.json();
//     //console.log(data);

//     if (data.success) {
//       setTeachers(Array.isArray(data.data) ? data.data : data.data.teachers || []);
//     }
//   } catch (error) {
//     //console.error('Error fetching teachers:', error);
//     setTeachers([]);
//     toast.error('Failed to load teachers');
//   }
// };

// export const fetchClasses = async (setClasses) => {
//   try {
//     //console.log("class api called");
//     const response = await fetch('/api/classes');
//     const data = await response.json();
//     //console.log("class data:", data);
//     if (data.success) {
//       const classArray = Array.isArray(data.data) ? data.data : data.data.classes || [];
//       setClasses(classArray);
//       //console.log("✅ CLASSES SET:", classArray);
//     } else {
//       setClasses([]);
//     }
//   } catch (error) {
//     console.error('Error fetching classes:', error);
//     setClasses([]);
//     toast.error('Failed to load classes');
//   }
// };

// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periodCount = 6; // Changed to 6 periods as per your controller

// //   console.log("🟦 Division Name:", divisionName);
// //   console.log("📅 Schedule Object:", schedule);

// //   if (!schedule || typeof schedule !== 'object') {
// //      console.warn("❌ Invalid or missing schedule for", divisionName);
// //     return (
// //       <div className="text-center py-4 text-gray-500">
// //         No schedule available for {divisionName}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mb-10">
// //       <h3 className="text-xl font-semibold mb-2 text-center">
// //         Division: {divisionName}
// //       </h3>
// //       <table className="table table-bordered w-full text-center border border-gray-300">
// //         <thead className="bg-gray-200">
// //           <tr>
// //             <th className="border p-2">Day / Period</th>
// //             {Array.from({ length: periodCount }, (_, i) => (
// //               <th key={i} className="border p-2">P{i + 1}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="font-semibold border p-2 bg-gray-50">{day}</td>
// //               {Array.from({ length: periodCount }, (_, periodIndex) => {
// //                 // schedule[day] should be an array where index 0 = period 1
// //                 const lecture = schedule[day] && schedule[day][periodIndex];

// //                 return (
// //                   <td key={periodIndex} className="p-2 border text-sm">
// //                     {lecture && lecture.subject ? (
// //                       <>
// //                         <div className="font-medium text-blue-900">
// //                           {lecture.subject.name || lecture.subject_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-600 mt-1">
// //                           {lecture.teacher?.name || lecture.teacher_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-400 mt-1">
// //                           {lecture.classroom || 'TBA'}
// //                         </div>
// //                       </>
// //                     ) : (
// //                       <em className="text-gray-400">Free</em>
// //                     )}
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };


// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periodCount = schedule?.Monday?.length || 6;
// //   console.log("⏰ Periods per day:", periodCount);


// //   console.log("🟦 Division Name:", divisionName);
// //   console.log("📅 Schedule Object:", schedule);

// //   if (!schedule || typeof schedule !== 'object') {
// //     console.warn("❌ Invalid or missing schedule for", divisionName);
// //     return (
// //       <div className="text-center py-4 text-gray-500">
// //         No schedule available for {divisionName}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mb-10">
// //       <h3 className="text-xl font-semibold mb-2 text-center">
// //         Division: {divisionName}
// //       </h3>
// //       <table className="table table-bordered w-full text-center border border-gray-300">
// //         <thead className="bg-gray-200">
// //           <tr>
// //             <th className="border p-2">Day / Period</th>
// //             {Array.from({ length: periodCount }, (_, i) => (
// //               <th key={i} className="border p-2">P{i + 1}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="font-semibold border p-2 bg-gray-50">{day}</td>
// //               {Array.from({ length: periodCount }, (_, periodIndex) => {
// //                 const lecture = schedule[day]?.[periodIndex];

// //                 // 🔍 Log each lecture for clarity
// //                 console.log(`📌 ${divisionName} - ${day} P${periodIndex + 1}:`, lecture);

// //                 return (
// //                   <td key={periodIndex} className="p-2 border text-sm">
// //                     {lecture && lecture.subject ? (
// //                       <>
// //                         <div className="font-medium text-blue-900">
// //                           {lecture.subject.name || lecture.subject_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-600 mt-1">
// //                           {lecture.teacher?.name || lecture.teacher_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-400 mt-1">
// //                           {lecture.classroom || 'TBA'}
// //                         </div>
// //                       </>
// //                     ) : (
// //                       <em className="text-gray-400">Free</em>
// //                     )}
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };


// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periodCount = schedule?.Monday?.length || 6;

// //   if (!schedule || typeof schedule !== "object") {
// //     console.warn("❌ Invalid or missing schedule for", divisionName);
// //     return (
// //       <div className="text-center py-4 text-gray-500">
// //         No schedule available for {divisionName}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mb-10">
// //       <h3 className="text-xl font-semibold mb-2 text-center">
// //         Division: {divisionName}
// //       </h3>
// //       <table className="table table-bordered w-full text-center border border-gray-300">
// //         <thead className="bg-gray-200">
// //           <tr>
// //             <th className="border p-2">Day / Period</th>
// //             {Array.from({ length: periodCount }, (_, i) => (
// //               <th key={i} className="border p-2">P{i + 1}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="font-semibold border p-2 bg-gray-50">{day}</td>
// //               {Array.from({ length: periodCount }, (_, periodIndex) => {
// //                 const lecture = schedule[day]?.[periodIndex];

// //                 if (!lecture || typeof lecture !== "object") {
// //                   // ⛔ Logging to debug unexpected types
// //                   if (lecture !== undefined) {
// //                     console.warn(
// //                       `📛 Invalid lecture entry on ${day}, P${periodIndex + 1}:`,
// //                       lecture
// //                     );
// //                   }

// //                   return (
// //                     <td key={periodIndex} className="p-2 border text-sm">
// //                       <em className="text-gray-400">Free</em>
// //                     </td>
// //                   );
// //                 }

// //                 return (
// //                   <td key={periodIndex} className="p-2 border text-sm">
// //                     <div className="font-medium text-blue-900">
// //                       {lecture.subject?.name || lecture.subject_name || 'N/A'}
// //                     </div>
// //                     <div className="text-xs text-gray-600 mt-1">
// //                       {lecture.teacher?.name || lecture.teacher_name || 'N/A'}
// //                     </div>
// //                     <div className="text-xs text-gray-400 mt-1">
// //                       {lecture.classroom || 'TBA'}
// //                     </div>
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export const renderTimetableGrid = (divisionName, schedule) => {
// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// //   const periodCount = schedule?.Monday?.length || 6;
// //   console.log("📚 Lecture for", divisionName, "->", days, "P", periodIndex + 1, ":", lecture);


// //   if (!schedule || typeof schedule !== "object") {
// //     console.warn("❌ Invalid or missing schedule for", divisionName);
// //     return (
// //       <div className="text-center py-4 text-gray-500">
// //         No schedule available for {divisionName}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mb-10">
// //       <h3 className="text-xl font-semibold mb-2 text-center">
// //         Division: {divisionName}
// //       </h3>
// //       <table className="table table-bordered w-full text-center border border-gray-300">
// //         <thead className="bg-gray-200">
// //           <tr>
// //             <th className="border p-2">Day / Period</th>
// //             {Array.from({ length: periodCount }, (_, i) => (
// //               <th key={i} className="border p-2">P{i + 1}</th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {days.map((day) => (
// //             <tr key={day}>
// //               <td className="font-semibold border p-2 bg-gray-50">{day}</td>
// //               {Array.from({ length: periodCount }, (_, periodIndex) => {
// //                 const lecture = schedule[day]?.[periodIndex];

// //                 return (
// //                   <td key={periodIndex} className="p-2 border text-sm">
// //                     {lecture && typeof lecture === "object" ? (
// //                       <>
// //                         <div className="font-medium text-blue-900">
// //                           {typeof lecture.subject === 'string'
// //                             ? lecture.subject
// //                             : lecture.subject?.name || lecture.subject_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-600 mt-1">
// //                           {typeof lecture.teacher === 'string'
// //                             ? lecture.teacher
// //                             : lecture.teacher?.name || lecture.teacher_name || 'N/A'}
// //                         </div>
// //                         <div className="text-xs text-gray-400 mt-1">
// //                           {lecture.classroom || 'TBA'}
// //                         </div>
// //                       </>
// //                     ) : (
// //                       <em className="text-gray-400">Free</em>
// //                     )}
// //                   </td>
// //                 );
// //               })}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// export const renderTimetableGrid = (divisionName, schedule) => {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periodCount = schedule?.Monday?.length || 6;

//   //console.log(`🧪 Rendering timetable for ${divisionName}`);
//   console.log("🧾 Schedule received:", schedule);

//   if (!schedule || typeof schedule !== "object") {
//    // console.warn("❌ Invalid or missing schedule for", divisionName);
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No schedule available for {divisionName}
//       </div>
//     );
//   }

//   return (
//     <div className="mb-10">
//       <h3 className="text-xl font-semibold mb-2 text-center">
//         Division: {divisionName}
//       </h3>
//       <table className="table table-bordered w-full text-center border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="border p-2">Day / Period</th>
//             {Array.from({ length: periodCount }, (_, i) => (
//               <th key={i} className="border p-2">P{i + 1}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => (
//             <tr key={day}>
//               <td className="font-semibold border p-2 bg-gray-50">{day}</td>
//               {Array.from({ length: periodCount }, (_, periodIndex) => {
//                 const lecture = schedule[day]?.[periodIndex];

//                 console.log(`📌 ${divisionName} — ${day} — P${periodIndex + 1}:`, lecture);

//                 return (
//                   <td key={periodIndex} className="p-2 border text-sm">
//                     {lecture && typeof lecture === "object" ? (
//                       <>
//                         <div className="font-medium text-blue-900">
//                           {typeof lecture.subject === 'string'
//                             ? lecture.subject
//                             : lecture.subject?.name || lecture.subject_name || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-600 mt-1">
//                           {typeof lecture.teacher === 'string'
//                             ? lecture.teacher
//                             : lecture.teacher?.name || lecture.teacher_name || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-400 mt-1">
//                           {lecture.classroom || 'TBA'}
//                         </div>
//                       </>
//                     ) : (
//                       <em className="text-gray-400">Free</em>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };




// export const formatSchedule = (lecturesArray) => {
//   const schedule = {};
//   for (const lecture of lecturesArray) {
//     const { day, period, subject_name, teacher_name, classroom } = lecture;

//     if (!schedule[day]) schedule[day] = {};
//     schedule[day][period] = { subject_name, teacher_name, classroom };
//   }
//   return schedule;
// };

// // Load timetables function
// export const loadTimetables = async (filters, api, setTimetables, setFormattedTimetable, setLoading) => {
//   if (!filters.department) return;

//   setLoading(true);
//   try {
//     const result = await api.getTimetables(filters.department, {
//       semester: filters.semester,
//       academicYear: filters.academicYear
//     });

//     if (result.success) {
//       console.log("🟢 Full fetched data:", result.data);
//       console.log("📌 One full timetable:", result.data[0]);
//       setTimetables(result.data);

//       // Format data for renderTimetableGrid
//       const formatted = {};
//       result.data.forEach(timetable => {
//         console.log("📌 Timetable:", timetable);
//         timetable.divisions.forEach(div => {
//           console.log("📌 Division inside timetable:", div);
//           if (div.division_name && div.schedule) {
//             formatted[div.division_name] = div.schedule;
//           }
//         });
//       });

//       console.log("✅ Formatted for render:", formatted);
//       setFormattedTimetable({
//         formatted_schedule2: formatted
//       });
//     }
//   } catch (error) {
//     console.error('Error loading timetables:', error);
//     toast.error('Failed to load timetables');
//   } finally {
//     setLoading(false);
//   }
// };

// // Format timetable data for display
// // export const formatTimetableData = (timetables, setFormattedTimetable) => {
// //   if (timetables.length > 0) {
// //     const formatted = {};
// //     timetables.forEach(timetable => {
// //       console.log("📌 Timetable:", timetable);
// //       console.log("📝 Timetable Schedule:", timetable.schedule);
      
// //       timetable.divisions.forEach(divisionData => {
// //         const divisionName = divisionData.division_name;
// //         console.log("👉 Checking division:", divisionName);
        
// //         if (divisionName && divisionData.schedule) {
// //           console.log("✅ Found schedule for:", divisionName);
// //           formatted[divisionName] = divisionData.schedule;
// //         } else {
// //           console.log("❌ No schedule for:", divisionName);
// //         }
// //       });
// //     });

// //     console.log("🎯 Final Formatted Data:", formatted);
// //     setFormattedTimetable({
// //       formatted_schedule2: formatted
// //     });
// //   }
// // };

// export const formatTimetableData = (timetables) => {
//   if (!Array.isArray(timetables)) return [];

//   return timetables.map((tt) => {
//     const formattedDivisions = tt.divisions.map((div) => {
//       const { division_name, schedule } = div;
//      // console.log("👉 Checking division:", division_name);

//       if (schedule && Object.keys(schedule).length > 0) {
//         //console.log("✅ Found schedule for:", division_name);
//       } else {
//         //console.warn("⚠️ No schedule found for:", division_name);
//       }

//       return {
//         division_name,
//         schedule: schedule || {}, // safely default to empty object
//       };
//     });

//     return {
//       _id: tt._id,
//       departmentId: tt.departmentId,
//       semester: tt.semester,
//       academicYear: tt.academicYear,
//       divisions: formattedDivisions, // now includes schedule inside each
//     };
//   });
// };


// // Process schedule data
// export const processScheduleData = (timetables) => {
//   //console.log("📌 Timetable:", timetables);
//   const scheduleMap = {};

//   if (timetables && Array.isArray(timetables.schedule)) {
//     timetables.schedule.forEach(item => {
//       if (item.division) {
//         if (!scheduleMap[item.division]) {
//           scheduleMap[item.division] = [];
//         }
//         scheduleMap[item.division].push(item);
//       }
//     });
//   } else if (timetables && typeof timetables.schedule === 'object' && timetables.schedule !== null) {
//     Object.assign(scheduleMap, timetables.schedule);
//   } else {
//     console.warn("⚠ No valid schedule present in timetable.");
//   }

//  // console.log("🎯 Final Formatted Data:", scheduleMap);
//   return scheduleMap;
// };


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

// // Render timetable grid
// export const renderTimetableGrid = (division, formattedTimetable) => {
//   console.log("🔍 Rendering timetable for division:", division);
//   console.log("📊 Formatted timetable data:", formattedTimetable);

//   const schedule = formattedTimetable?.formatted_schedule2?.[division];

//   if (!schedule) {
//     return <div className="text-center py-4 text-gray-500">No schedule available</div>;
//   }

//   return (
//     <div className="border rounded-lg p-4 mb-6">
//       <h2 className="text-xl font-semibold mb-2">Division {division}</h2>
//       <table className="min-w-full table-auto border">
//         <thead>
//           <tr>
//             <th className="border px-2 py-1">Day / Period</th>
//             {timeSlots.map((slot) => (
//               <th key={slot.period} className="border px-2 py-1">
//                 P{slot.period}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => (
//             <tr key={day}>
//               <td className="border px-2 py-1 font-medium">{day}</td>
//               {timeSlots.map((slot) => {
//                 const cell = schedule[day]?.[slot.period - 1] || { subject: "Free", teacher: "" };
//                 return (
//                   <td key={slot.period} className="border px-2 py-1 text-center">
//                     {cell.subject} <br />
//                     <span className="text-sm text-gray-500">{cell.teacher}</span>
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export const renderTimetableGrid = (divisionName, schedule) => {
//   if (!schedule || typeof schedule !== 'object') {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No schedule available for {divisionName}
//       </div>
//     );
//   }

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periods = [...Array(6)].map((_, i) => i + 1);

//   return (
//     <table className="w-full border-collapse border">
//       <thead>
//         <tr>
//           <th className="border p-2 bg-gray-50">Day</th>
//           {periods.map(period => (
//             <th key={period} className="border p-2 bg-gray-50">P{period}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {days.map(day => (
//           <tr key={day}>
//             <td className="border p-2 font-semibold bg-gray-50">{day}</td>
//             {periods.map(period => {
//               const slot = schedule[day]?.[period-1];
//               return (
//                 <td key={period} className="border p-2 text-sm">
//                   {slot ? (
//                     <>
//                       <div className="font-medium text-blue-900">
//                         {slot.subject?.name || slot.subject}
//                       </div>
//                       <div className="text-xs text-gray-600">
//                         {slot.teacher?.name || slot.teacher}
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         {slot.classroom || 'TBA'}
//                       </div>
//                     </>
//                   ) : (
//                     <span className="text-gray-400">Free</span>
//                   )}
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export const renderTimetableGrid = (divisionName, formattedTimetable) => {
//   if (!formattedTimetable || !Array.isArray(formattedTimetable.divisions)) {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No timetable data available
//       </div>
//     );
//   }

//   const divisionData = formattedTimetable.divisions.find(
//     (d) => d.division_name === divisionName
//   );

//   if (!divisionData || !divisionData.schedule) {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No schedule available for {divisionName}
//       </div>
//     );
//   }

//   const schedule = divisionData.schedule;
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periods = [...Array(6)].map((_, i) => i + 1);

//   return (
//     <table className="w-full border-collapse border">
//       <thead>
//         <tr>
//           <th className="border p-2 bg-gray-50">Day</th>
//           {periods.map((period) => (
//             <th key={period} className="border p-2 bg-gray-50">P{period}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             <td className="border p-2 font-semibold bg-gray-50">{day}</td>
//             {periods.map((period) => {
//               const slot = schedule[day]?.[period - 1];
//               return (
//                 <td key={period} className="border p-2 text-sm">
//                   {slot ? (
//                     <>
//                       <div className="font-medium text-blue-900">
//                         {slot.subject?.name || slot.subject}
//                       </div>
//                       <div className="text-xs text-gray-600">
//                         {slot.teacher?.name || slot.teacher}
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         {slot.classroom || 'TBA'}
//                       </div>
//                     </>
//                   ) : (
//                     <span className="text-gray-400">Free</span>
//                   )}
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export const renderTimetableGrid = (divisionName, schedule) => {
//   if (!schedule || typeof schedule !== 'object') {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No schedule available for {divisionName}
//       </div>
//     );
//   }

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periods = [...Array(6)].map((_, i) => i + 1);

//   return (
//     <div className="overflow-x-auto">
//       <h2 className="text-lg font-bold mb-2 text-center text-blue-700">
//         Timetable for {divisionName}
//       </h2>
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr>
//             <th className="border p-2 bg-gray-100">Day</th>
//             {periods.map((period) => (
//               <th key={period} className="border p-2 bg-gray-100">P{period}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => (
//             <tr key={day}>
//               <td className="border p-2 font-semibold bg-gray-50">{day}</td>
//               {periods.map((period) => {
//                 const slot = schedule[day]?.[period - 1];
//                 return (
//                   <td key={period} className="border p-2 text-sm">
//                     {slot ? (
//                       <>
//                         <div className="font-medium text-blue-900">
//                           {slot.subject?.name || slot.subject}
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           {slot.teacher?.name || slot.teacher}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {slot.classroom || 'TBA'}
//                         </div>
//                       </>
//                     ) : (
//                       <span className="text-gray-400">Free</span>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

//imp
// export const renderTimetableGrid = (divisionName, schedule) => {
//     console.log("📅 Schedule received in renderTimetableGrid for", divisionName, schedule);
//   if (!schedule || typeof schedule !== 'object') {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         No schedule available for {divisionName}
//       </div>
//     );
//   }

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const periods = Array.from({ length: 6 }, (_, i) => i + 1);

//   return (
//     <div className="overflow-x-auto">
//       <h2 className="text-lg font-bold mb-2 text-center text-blue-700">
//         Timetable for {divisionName}
//       </h2>
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr>
//             <th className="border p-2 bg-gray-100">Day</th>
//             {periods.map((period) => (
//               <th key={period} className="border p-2 bg-gray-100">P{period}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day) => (
//             <tr key={day}>
//               <td className="border p-2 font-semibold bg-gray-50">{day}</td>
//               {periods.map((period) => {
//                 const slot = schedule?.[day]?.[period - 1];

//                 const subject =
//                   typeof slot?.subject === 'object'
//                     ? slot.subject?.name
//                     : slot?.subject;

//                 const teacher =
//                   typeof slot?.teacher === 'object'
//                     ? slot.teacher?.name
//                     : slot?.teacher;

//                 const classroom = slot?.classroom || 'TBA';

//                 return (
//                   <td key={period} className="border p-2 text-sm">
//                     {slot ? (
//                       <>
//                         <div className="font-medium text-blue-900">{subject}</div>
//                         <div className="text-xs text-gray-600">{teacher}</div>
//                         <div className="text-xs text-gray-400">{classroom}</div>
//                       </>
//                     ) : (
//                       <span className="text-gray-400">Free</span>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


// Load timetables
// export const loadTimetables = async (filters, api, setTimetables, setFormattedTimetable, setLoading) => {
//   if (!filters.department) return;

//   setLoading(true);
//   try {
//     const result = await api.getTimetables(filters.department, {
//       semester: filters.semester,
//       academicYear: filters.academicYear
//     });

//     if (result.success) {
//       setTimetables(result.data);
//       formatTimetableData(result.data, setFormattedTimetable);
//     }
//   } catch (error) {
//     console.error('Error loading timetables:', error);
//     toast.error('Failed to load timetables');
//   } finally {
//     setLoading(false);
//   }
// };
// Update the loadTimetables function to handle nested subjects


export const renderTimetableGrid = (divisionName, schedule) => {
  if (!schedule || typeof schedule !== 'object') {
    return (
      <div className="text-center py-4 text-gray-500">
        No schedule available for {divisionName}
      </div>
    );
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-bold mb-2 text-center text-blue-700">
        Timetable for {divisionName}
      </h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Day</th>
            {periods.map((period) => (
              <th key={period} className="border p-2 bg-gray-100">P{period}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="border p-2 font-semibold bg-gray-50">{day}</td>
              {periods.map((period) => {
                const slot = schedule?.[day]?.[period - 1];
                
                console.log("🧪 slot.subject object:", slot?.subject);

                const subject =
                  typeof slot?.subject === 'object'
                    ? slot.subject?.name || slot.subject?.subjectName || "Unknown Subject"
                    : slot?.subject || "Unknown Subject";

                const teacher =
                  typeof slot?.teacher === 'object'
                    ? slot.teacher?.name || "Unknown Teacher"
                    : slot?.teacher || "Unknown Teacher";

                const classroom = slot?.classroom || 'TBA';

                // Debug logs (optional)
                console.log(`📚 Subject for ${day} P${period}:`, subject);
                console.log(`👨‍🏫 Teacher for ${day} P${period}:`, teacher);

                return (
                  <td key={period} className="border p-2 text-sm">
                    {slot ? (
                      <>
                        <div className="font-medium text-blue-900">{subject}</div>
                        <div className="text-xs text-gray-600">{teacher}</div>
                        <div className="text-xs text-gray-400">{classroom}</div>
                      </>
                    ) : (
                      <span className="text-gray-400">Free</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

