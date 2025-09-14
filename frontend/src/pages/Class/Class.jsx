// import React, { useState, useEffect } from 'react';
// import classService from '../../services/classService';
// import { toast } from 'react-toastify';

// const ClassPage = () => {
//   const [classes, setClasses] = useState([]);
//   const [form, setForm] = useState({ className: '', classNumber: '' ,department_id: '',
//   semester: ''});
//   const [editId, setEditId] = useState(null);

//   const fetchClasses = async () => {
//     try {
//       const { data } = await classService.getAll();
//       setClasses(data);
//     } catch {
//       toast.error('Failed to load classes');
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await classService.update(editId, form);
//         toast.success('Class updated');
//       } else {
//         await classService.create(form);
//         toast.success('Class created');
//       }
//       setForm({ className: '', classNumber: '' });
//       setEditId(null);
//       fetchClasses();
//     } catch {
//       toast.error('Failed to save class');
//     }
//   };

//   const handleEdit = (cls) => {
//     setForm({ className: cls.className, classNumber: cls.classNumber });
//     setEditId(cls._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure?')) {
//       try {
//         await classService.remove(id);
//         toast.success('Class deleted');
//         fetchClasses();
//       } catch {
//         toast.error('Failed to delete class');
//       }
//     }
//   };

//   const handleDeleteAll = async () => {
//     if (window.confirm('Are you sure you want to delete all classes?')) {
//       try {
//         await classService.removeAll();
//         toast.success('All classes deleted');
//         fetchClasses();
//       } catch {
//         toast.error('Failed to delete all classes');
//       }
//     }
//   };

//   return (
//     <div className="p-6 mx-auto max-w-4xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         {editId ? 'Edit Class' : 'Add Class'}
//       </h2>

//       <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow-md">
//         <div>
//           <input
//             type="text"
//             name="className"
//             value={form.className}
//             onChange={handleChange}
//             placeholder="Class Name"
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="classNumber"
//             value={form.classNumber}
//             onChange={handleChange}
//             placeholder="Class Number (e.g. F94)"
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700 focus:outline-none"
//         >
//           {editId ? 'Update' : 'Create'}
//         </button>
//       </form>

//       <button
//         onClick={handleDeleteAll}
//         className="mb-4 bg-red-600 text-white rounded p-3 hover:bg-red-700 focus:outline-none"
//       >
//         Delete All Classes
//       </button>

//       <table className="w-full border border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-4 text-left">Class Name</th>
//             <th className="border p-4 text-left">Class Number</th>
//             <th className="border p-4 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {classes.map((cls) => (
//             <tr key={cls._id} className="hover:bg-gray-100 transition duration-150">
//               <td className="border p-4">{cls.className}</td>
//               <td className="border p-4">{cls.classNumber}</td>
//               <td className="border p-4 flex space-x-2">
//                 <button
//                   onClick={() => handleEdit(cls)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(cls._id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClassPage;



//imp 
// import React, { useState, useEffect } from 'react';
// import classService from '../../services/classService';
// import departmentService from '../../services/departmentService';  // assuming you have this service
// import { toast } from 'react-toastify';

// const ClassPage = () => {
//   const [classes, setClasses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [form, setForm] = useState({
//     className: '',
//     classNumber: '',
//     department_id: '',
//     semester: ''
//   });
//   const [editId, setEditId] = useState(null);

//   const fetchClasses = async () => {
//     try {
//       const { data } = await classService.getAll();
//       setClasses(data);
//     } catch {
//       toast.error('Failed to load classes');
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const rawDepartments = await departmentService.getDepartmentsForSelect();
//       setDepartments(rawDepartments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to load departments');
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//     fetchDepartments();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!form.department_id || !form.semester) {
//         toast.error('Department and semester are required');
//         return;
//       }

//       if (editId) {
//         await classService.update(editId, form);
//         toast.success('Class updated');
//       } else {
//         await classService.create(form);
//         toast.success('Class created');
//       }
//       setForm({
//         className: '',
//         classNumber: '',
//         department_id: '',
//         semester: ''
//       });
//       setEditId(null);
//       fetchClasses();
//     } catch {
//       toast.error('Failed to save class');
//     }
//   };

//   const handleEdit = (cls) => {
//     setForm({
//       className: cls.className,
//       classNumber: cls.classNumber,
//       department_id: cls.department_id || '',
//       semester: cls.semester || ''
//     });
//     setEditId(cls._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure?')) {
//       try {
//         await classService.remove(id);
//         toast.success('Class deleted');
//         fetchClasses();
//       } catch {
//         toast.error('Failed to delete class');
//       }
//     }
//   };

//   const handleDeleteAll = async () => {
//     if (window.confirm('Are you sure you want to delete all classes?')) {
//       try {
//         await classService.removeAll();
//         toast.success('All classes deleted');
//         fetchClasses();
//       } catch {
//         toast.error('Failed to delete all classes');
//       }
//     }
//   };

//   return (
//     <div className="p-6 mx-auto max-w-4xl">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         {editId ? 'Edit Class' : 'Add Class'}
//       </h2>

//       <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow-md">
//         <div>
//           <input
//             type="text"
//             name="className"
//             value={form.className}
//             onChange={handleChange}
//             placeholder="Class Name"
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <input
//             type="text"
//             name="classNumber"
//             value={form.classNumber}
//             onChange={handleChange}
//             placeholder="Class Number (e.g. F94)"
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           {/* <select
//             name="department_id"
//             value={form.department_id}
//             onChange={handleChange}
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select> */}
//           <select
//             name="department_id"
//             value={form.department_id}
//             onChange={handleChange}
//             required
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept.value} value={dept.value}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>

//         </div>
//         {/* <div>
//           <input
//             type="text"
//             name="semester"
//             value={form.semester}
//             onChange={handleChange}
//             placeholder="Semester (e.g. 2)"
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div> */}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Semester *
//           </label>
//           <select
//             name="semester"
//             required
//             value={form.semester}
//             onChange={handleChange}
//             className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Semester</option>
//             {[...Array(8)].map((_, i) => (
//               <option key={i + 1} value={(i + 1).toString()}>
//                 Semester {i + 1}
//               </option>
//             ))}
//           </select>

//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700 focus:outline-none"
//         >
//           {editId ? 'Update' : 'Create'}
//         </button>
//       </form>

//       <button
//         onClick={handleDeleteAll}
//         className="mb-4 bg-red-600 text-white rounded p-3 hover:bg-red-700 focus:outline-none"
//       >
//         Delete All Classes
//       </button>

//       <table className="w-full border border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-4 text-left">Class Name</th>
//             <th className="border p-4 text-left">Class Number</th>
//             <th className="border p-4 text-left">Department</th>
//             <th className="border p-4 text-left">Semester</th>
//             <th className="border p-4 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {classes.map((cls) => (
//             <tr key={cls._id} className="hover:bg-gray-100 transition duration-150">
//               <td className="border p-4">{cls.className}</td>
//               <td className="border p-4">{cls.classNumber}</td>
//               {/* <td className="border p-4">{cls.department_id?.value || 'N/A'}</td> */}
//               <td className="border p-4">{departments.find(d => d.value === cls.department_id)?.name || 'N/A'}</td>
//               <td className="border p-4">{cls.semester || 'N/A'}</td>
//               <td className="border p-4 flex space-x-2">
//                 <button
//                   onClick={() => handleEdit(cls)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(cls._id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClassPage;



import React, { useState, useEffect } from 'react';
import classService from '../../services/classService';
import departmentService from '../../services/departmentService'; 
import { toast } from 'react-toastify';

const ClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    className: '',
    classNumber: '',
    department_id: '',
    semester: ''
  });
  const [editId, setEditId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null); // PDF state

  const fetchClasses = async () => {
    try {
      const { data } = await classService.getAll();
      setClasses(data);
    } catch {
      toast.error('Failed to load classes');
    }
  };

  const fetchDepartments = async () => {
    try {
      const rawDepartments = await departmentService.getDepartmentsForSelect();
      setDepartments(rawDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.department_id || !form.semester) {
        toast.error('Department and semester are required');
        return;
      }

      if (editId) {
        await classService.update(editId, form);
        toast.success('Class updated');
      } else {
        await classService.create(form);
        toast.success('Class created');
      }
      setForm({
        className: '',
        classNumber: '',
        department_id: '',
        semester: ''
      });
      setEditId(null);
      fetchClasses();
    } catch {
      toast.error('Failed to save class');
    }
  };

  const handleEdit = (cls) => {
    setForm({
      className: cls.className,
      classNumber: cls.classNumber,
      department_id: cls.department_id || '',
      semester: cls.semester || ''
    });
    setEditId(cls._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await classService.remove(id);
        toast.success('Class deleted');
        fetchClasses();
      } catch {
        toast.error('Failed to delete class');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all classes?')) {
      try {
        await classService.removeAll();
        toast.success('All classes deleted');
        fetchClasses();
      } catch {
        toast.error('Failed to delete all classes');
      }
    }
  };

  // ---------- PDF Upload ----------
  const handlePdfUpload = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      await classService.uploadPdf(formData);
      toast.success('Classes uploaded successfully!');
      setPdfFile(null);
      fetchClasses(); // Refresh class list
    } catch (error) {
      console.error('PDF upload error:', error);
      toast.error('Failed to upload PDF');
    }
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">

      {/* ---------- PDF Upload Section ---------- */}
      <div className="mb-6 p-4 bg-gray-100 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2">Bulk Upload Classes via PDF</h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={handlePdfUpload}
          disabled={!pdfFile}
          className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 disabled:opacity-50"
        >
          Upload PDF
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editId ? 'Edit Class' : 'Add Class'}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow-md">
        <div>
          <input
            type="text"
            name="className"
            value={form.className}
            onChange={handleChange}
            placeholder="Class Name"
            className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="classNumber"
            value={form.classNumber}
            onChange={handleChange}
            placeholder="Class Number (e.g. F94)"
            className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester *
          </label>
          <select
            name="semester"
            required
            value={form.semester}
            onChange={handleChange}
            className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>
                Semester {i + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700 focus:outline-none"
        >
          {editId ? 'Update' : 'Create'}
        </button>
      </form>

      <button
        onClick={handleDeleteAll}
        className="mb-4 bg-red-600 text-white rounded p-3 hover:bg-red-700 focus:outline-none"
      >
        Delete All Classes
      </button>

      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-4 text-left">Class Name</th>
            <th className="border p-4 text-left">Class Number</th>
            <th className="border p-4 text-left">Department</th>
            <th className="border p-4 text-left">Semester</th>
            <th className="border p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls._id} className="hover:bg-gray-100 transition duration-150">
              <td className="border p-4">{cls.className}</td>
              <td className="border p-4">{cls.classNumber}</td>
              <td className="border p-4">{departments.find(d => d.value === cls.department_id)?.name || 'N/A'}</td>
              <td className="border p-4">{cls.semester || 'N/A'}</td>
              <td className="border p-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(cls)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassPage;
