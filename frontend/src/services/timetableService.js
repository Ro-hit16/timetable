

// import axios from "axios";

// const timetableService = {
//   generateTimetable: async (inputData) => {
//     try {
//       console.log("📝 Raw input data:", inputData);

//       const { departmentId, semester, academicYear, divisions, subjects, teachers, classes } = inputData;

//       // ✅ Filter subjects by semester
//       const filteredSubjects = subjects.filter(
//         (subject) => String(subject.semester) === String(semester)
//       );

//       console.log("🎯 Filtered subjects:", {
//         semester,
//         total: subjects.length,
//         filtered: filteredSubjects.length,
//         subjects: filteredSubjects,
//       });

//       // ✅ Filter teachers by semester
//       const filteredTeachers = teachers.filter(
//         (teacher) => String(teacher.semester) === String(semester)
//       );

//       console.log("👨‍🏫 Filtered teachers:", {
//         semester,
//         total: teachers.length,
//         filtered: filteredTeachers.length,
//         teachers: filteredTeachers,
//       });

//       // ✅ Filter classes by semester
//       const filteredClasses = classes.filter(
//         (cls) => String(cls.semester) === String(semester)
//       );

//       console.log("🏫 Filtered classes:", {
//         semester,
//         total: classes.length,
//         filtered: filteredClasses.length,
//         classes: filteredClasses,
//       });

//       // ✅ Final payload
//       const payload = {
//         departmentId,
//         semester,
//         academicYear,
//         divisions,
//         subjects: filteredSubjects,
//         teachers: filteredTeachers,
//         classes: filteredClasses,
//       };

//       console.log("🧪 Final payload to generate:", payload);

//       const response = await axios.post(`/api/timetables/generate`, payload);
//       console.log("✅ API response from backend:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Generation failed:", error?.response?.data?.message || error.message);
//       throw error;
//     }
//   },

//   // ✅ New function for Active Timetables
//   getActiveTimetables: async () => {
//     try {
//       console.log("📡 Fetching active timetables...");
//       const response = await axios.get(`/api/timetables/active`);
//       console.log("✅ Active timetables response:", response.data);
//       return {
//         success: true,
//         data: response.data.data || []
//       };
//     } catch (error) {
//       console.error("❌ Error fetching active timetables:", error?.response?.data?.message || error.message);
//       return {
//         success: false,
//         data: [],
//         error: error?.response?.data?.message || "Failed to fetch active timetables"
//       };
//     }
//   },

//   getTimetables: async (departmentId, filters = {}) => {
//     try {
//       const params = new URLSearchParams(filters);
//       const response = await fetch(`/api/timetables/department/${departmentId}?${params}`);
//       return await response.json();
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       throw error;
//     }
//   },

//   getTimetable: async (id, includeStats = false) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}?stats=${includeStats}`);
//       return await response.json();
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       throw error;
//     }
//   },

//   getStatistics: async (id) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}/statistics`);
//       return await response.json();
//     } catch (error) {
//       console.error("❌ Fetch error:", error);
//       throw error;
//     }
//   },

//   updateStatus: async (id, status) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("❌ Update error:", error);
//       throw error;
//     }
//   },

//   deleteTimetable: async (id) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}`, {
//         method: "DELETE",
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("❌ Delete error:", error);
//       throw error;
//     }
//   },

//   exportTimetable: async (id, format) => {
//     try {
//       return await fetch(`/api/timetables/${id}/export?format=${format}`);
//     } catch (error) {
//       console.error("❌ Export error:", error);
//       throw error;
//     }
//   },

//   cloneTimetable: async (id, { newAcademicYear, newSemester }) => {
//     try {
//       const response = await fetch(`/api/timetables/${id}/clone`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ newAcademicYear, newSemester }),
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("❌ Clone error:", error);
//       throw error;
//     }
//   },
// };

// export default timetableService;



import axios from "axios";

const timetableService = {
  // ✅ FIXED: Simplified - backend handles all data fetching
  generateTimetable: async (inputData) => {
    try {
      console.log("📝 Raw input data:", inputData);

      // =============================
      // ✅ CRITICAL FIX: Send ONLY 4 fields
      // Backend will fetch subjects/teachers/classes from database
      // =============================
      const payload = {
        departmentId: inputData.departmentId,
        semester: inputData.semester,
        academicYear: inputData.academicYear,
        divisions: inputData.divisions
        // ❌ DO NOT send subjects, teachers, or classes
      };

      console.log("🚀 Minimal payload to backend:", payload);

      const response = await axios.post(`/api/timetables/generate`, payload);
      console.log("✅ API response from backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Generation failed:", error?.response?.data?.message || error.message);
      
      // Return error in consistent format
      return {
        success: false,
        error: error?.response?.data?.message || error.message || "Failed to generate timetable"
      };
    }
  },

  // ✅ Get Active Timetables
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

  // ✅ Get Timetables with Filters
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

  // ✅ Get Single Timetable
  getTimetable: async (id, includeStats = false) => {
    try {
      const response = await fetch(`/api/timetables/${id}?stats=${includeStats}`);
      return await response.json();
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  // ✅ Get Statistics
  getStatistics: async (id) => {
    try {
      const response = await fetch(`/api/timetables/${id}/statistics`);
      return await response.json();
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  },

  // ✅ Update Status
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

  // ✅ Delete Timetable
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

  // ✅ Export Timetable
  exportTimetable: async (id, format) => {
    try {
      return await fetch(`/api/timetables/${id}/export?format=${format}`);
    } catch (error) {
      console.error("❌ Export error:", error);
      throw error;
    }
  },

  // ✅ Clone Timetable
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