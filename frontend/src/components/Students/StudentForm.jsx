// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const StudentForm = () => {
//   const [formData, setFormData] = useState({
//     stname: '',
//     eid: '',
//     password: '',
//     mobile: '',
//     address: '',
//     courseid: '',
//     semester: '',
//     dob: '',
//     pic: null,
//     gender: '',
//     status: ''
//   });

//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   // Fetch departments on component mount
//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get('/api/departments');
//       setDepartments(response.data);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async (departmentId) => {
//     try {
//       const response = await axios.get(`/api/semesters?departmentId=${departmentId}`);
//       setSemesters(response.data);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, files } = e.target;
    
//     if (type === 'file') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: files[0]
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleDepartmentChange = (e) => {
//     const departmentId = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       courseid: departmentId,
//       semester: '' // Reset semester when department changes
//     }));
    
//     if (departmentId) {
//       fetchSemesters(departmentId);
//     } else {
//       setSemesters([]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check if student already exists
//     try {
//       const checkResponse = await axios.post('/api/check-student', {
//         eid: formData.eid,
//         mobile: formData.mobile
//       });
      
//       if (checkResponse.data.exists) {
//         setMessage('This Student already exists');
//         setMessageType('error');
//         return;
//       }
//     } catch (error) {
//       console.error('Error checking student:', error);
//     }

//     // Create FormData for file upload
//     const submitData = new FormData();
//     Object.keys(formData).forEach(key => {
//       if (formData[key] !== null && formData[key] !== '') {
//         submitData.append(key, formData[key]);
//       }
//     });

//     try {
//       const response = await axios.post('/api/students', submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       setMessage('Congrats Your Data Saved!!!');
//       setMessageType('success');
      
//       // Reset form
//       setFormData({
//         stname: '',
//         eid: '',
//         password: '',
//         mobile: '',
//         address: '',
//         courseid: '',
//         semester: '',
//         dob: '',
//         pic: null,
//         gender: '',
//         status: ''
//       });
//       setSemesters([]);
      
//     } catch (error) {
//       setMessage('Error saving student data');
//       setMessageType('error');
//       console.error('Error saving student:', error);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       stname: '',
//       eid: '',
//       password: '',
//       mobile: '',
//       address: '',
//       courseid: '',
//       semester: '',
//       dob: '',
//       pic: null,
//       gender: '',
//       status: ''
//     });
//     setSemesters([]);
//     setMessage('');
//   };

//   return (
//     <div className="row">
//       <div className="col-md-12">
//         <h2>Add Student</h2>
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <table border="0" className="table">
//             <tr>
//               <td colSpan="2">
//                 {message && (
//                   <font color={messageType === 'error' ? 'red' : 'blue'}>
//                     {message}
//                   </font>
//                 )}
//               </td>
//             </tr>
            
//             <tr>
//               <th width="237" scope="row">Select Department</th>
//               <td width="213">
//                 <select 
//                   name="courseid" 
//                   className="form-control" 
//                   value={formData.courseid}
//                   onChange={handleDepartmentChange}
//                   required
//                 >
//                   <option value="" disabled>Select Department</option>
//                   {departments.map(dept => (
//                     <option key={dept.department_id} value={dept.department_id}>
//                       {dept.department_name}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
            
//             <tr>
//               <th width="237" scope="row">Select Semester</th>
//               <td width="213">
//                 <select 
//                   name="semester" 
//                   className="form-control"
//                   value={formData.semester}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="" disabled>Select Semester</option>
//                   {semesters.map(sem => (
//                     <option key={sem.sem_id} value={sem.sem_id}>
//                       {sem.semester_name}
//                     </option>
//                   ))}
//                 </select>
//               </td>
//             </tr>
            
//             <tr>
//               <th width="237" scope="row">Student Name</th>
//               <td width="213">
//                 <input 
//                   type="text" 
//                   name="stname" 
//                   className="form-control" 
//                   placeholder="enter your name"
//                   value={formData.stname}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Enter Your Email</th>
//               <td>
//                 <input 
//                   type="email" 
//                   name="eid" 
//                   className="form-control" 
//                   placeholder="enter your email"
//                   value={formData.eid}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Enter Your Password</th>
//               <td>
//                 <input 
//                   type="password" 
//                   name="password" 
//                   className="form-control" 
//                   placeholder="enter your Password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Enter Your Mobile</th>
//               <td>
//                 <input 
//                   type="number" 
//                   name="mobile" 
//                   className="form-control" 
//                   placeholder="enter your mobile"
//                   value={formData.mobile}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Enter Your Address</th>
//               <td>
//                 <input 
//                   type="text" 
//                   name="address" 
//                   className="form-control" 
//                   placeholder="enter your address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Enter Your D.O.B</th>
//               <td>
//                 <input 
//                   type="date" 
//                   name="dob" 
//                   className="form-control" 
//                   placeholder="enter your D.O.B"
//                   value={formData.dob}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Upload Your Pic</th>
//               <td>
//                 <input 
//                   type="file" 
//                   name="pic" 
//                   className="form-control" 
//                   placeholder="Upload your Pic"
//                   onChange={handleInputChange}
//                   accept="image/*"
//                 />
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Enter Your Gender</th>
//               <td>
//                 <label>
//                   <input 
//                     type="radio" 
//                     value="m" 
//                     name="gender"
//                     checked={formData.gender === 'm'}
//                     onChange={handleInputChange}
//                   />
//                   Male
//                 </label>
//                 <label style={{ marginLeft: '10px' }}>
//                   <input 
//                     type="radio" 
//                     value="f" 
//                     name="gender"
//                     checked={formData.gender === 'f'}
//                     onChange={handleInputChange}
//                   />
//                   Female
//                 </label>
//               </td>
//             </tr>
            
//             <tr>
//               <th scope="row">Status</th>
//               <td>
//                 <select 
//                   name="status" 
//                   className="form-control"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="" disabled>Select Status</option>
//                   <option value="ON">ON</option>
//                   <option value="OFF">OFF</option>
//                 </select>
//               </td>
//             </tr>
            
//             <tr>
//               <th colSpan="1" scope="row"></th>
//               <td>
//                 <input 
//                   type="submit" 
//                   value="Add Student" 
//                   className="btn btn-success" 
//                 />
//                 <input 
//                   type="button" 
//                   value="Reset" 
//                   className="btn btn-success"
//                   onClick={handleReset}
//                   style={{ marginLeft: '10px' }}
//                 />
//               </td>
//             </tr>
//           </table>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentForm;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const StudentForm = () => {
//   const [formData, setFormData] = useState({
//     stname: '',
//     eid: '',
//     password: '',
//     mobile: '',
//     address: '',
//     courseid: '',
//     semester: '',
//     dob: '',
//     pic: null,
//     gender: '',
//     status: ''
//   });

//   const [departments, setDepartments] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [message, setMessage] = useState('');
//   const [messageType, setMessageType] = useState('');

//   // Fetch departments on component mount
//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get('/api/departments');
//       setDepartments(response.data);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

//   const fetchSemesters = async (departmentId) => {
//     try {
//       const response = await axios.get(`/api/semesters?departmentId=${departmentId}`);
//       setSemesters(response.data);
//     } catch (error) {
//       console.error('Error fetching semesters:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, files } = e.target;

//     if (type === 'file') {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: files[0]
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleDepartmentChange = (e) => {
//     const departmentId = e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       courseid: departmentId,
//       semester: '' // Reset semester when department changes
//     }));

//     if (departmentId) {
//       fetchSemesters(departmentId);
//     } else {
//       setSemesters([]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if student already exists
//     try {
//       const checkResponse = await axios.post('/api/check-student', {
//         eid: formData.eid,
//         mobile: formData.mobile
//       });

//       if (checkResponse.data.exists) {
//         setMessage('This Student already exists');
//         setMessageType('error');
//         return;
//       }
//     } catch (error) {
//       console.error('Error checking student:', error);
//     }

//     // Create FormData for file upload
//     const submitData = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== null && formData[key] !== '') {
//         submitData.append(key, formData[key]);
//       }
//     });

//     try {
//       const response = await axios.post('/api/students', submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setMessage('Congrats Your Data Saved!!!');
//       setMessageType('success');

//       // Reset form
//       setFormData({
//         stname: '',
//         eid: '',
//         password: '',
//         mobile: '',
//         address: '',
//         courseid: '',
//         semester: '',
//         dob: '',
//         pic: null,
//         gender: '',
//         status: ''
//       });
//       setSemesters([]);
//     } catch (error) {
//       setMessage('Error saving student data');
//       setMessageType('error');
//       console.error('Error saving student:', error);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       stname: '',
//       eid: '',
//       password: '',
//       mobile: '',
//       address: '',
//       courseid: '',
//       semester: '',
//       dob: '',
//       pic: null,
//       gender: '',
//       status: ''
//     });
//     setSemesters([]);
//     setMessage('');
//     setMessageType('');
//   };

//   return (
//     <div className="row">
//       <div className="col-md-12">
//         <h2>Add Student</h2>
//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <table border="0" className="table">
//             <tbody>
//               <tr>
//                 <td colSpan="2">
//                   {message && (
//                     <span style={{ color: messageType === 'error' ? 'red' : 'blue' }}>
//                       {message}
//                     </span>
//                   )}
//                 </td>
//               </tr>

//               <tr>
//                 <th width="237" scope="row">Select Department</th>
//                 <td width="213">
//                   <select
//                     name="courseid"
//                     className="form-control"
//                     value={formData.courseid}
//                     onChange={handleDepartmentChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Department
//                     </option>
//                     {departments.map((dept) => (
//                       <option key={dept.department_id} value={dept.department_id}>
//                         {dept.department_name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//               </tr>

//               <tr>
//                 <th width="237" scope="row">Select Semester</th>
//                 <td width="213">
//                   <select
//                     name="semester"
//                     className="form-control"
//                     value={formData.semester}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Semester
//                     </option>
//                     {semesters.map((sem) => (
//                       <option key={sem.sem_id} value={sem.sem_id}>
//                         {sem.semester_name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//               </tr>

//               <tr>
//                 <th width="237" scope="row">Student Name</th>
//                 <td width="213">
//                   <input
//                     type="text"
//                     name="stname"
//                     className="form-control"
//                     placeholder="enter your name"
//                     value={formData.stname}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Enter Your Email</th>
//                 <td>
//                   <input
//                     type="email"
//                     name="eid"
//                     className="form-control"
//                     placeholder="enter your email"
//                     value={formData.eid}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Enter Your Password</th>
//                 <td>
//                   <input
//                     type="password"
//                     name="password"
//                     className="form-control"
//                     placeholder="enter your Password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Enter Your Mobile</th>
//                 <td>
//                   <input
//                     type="number"
//                     name="mobile"
//                     className="form-control"
//                     placeholder="enter your mobile"
//                     value={formData.mobile}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Enter Your Address</th>
//                 <td>
//                   <input
//                     type="text"
//                     name="address"
//                     className="form-control"
//                     placeholder="enter your address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Enter Your D.O.B</th>
//                 <td>
//                   <input
//                     type="date"
//                     name="dob"
//                     className="form-control"
//                     placeholder="enter your D.O.B"
//                     value={formData.dob}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Upload Your Pic</th>
//                 <td>
//                   <input
//                     type="file"
//                     name="pic"
//                     className="form-control"
//                     placeholder="Upload your Pic"
//                     onChange={handleInputChange}
//                     accept="image/*"
//                   />
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Enter Your Gender</th>
//                 <td>
//                   <label htmlFor="gender-m">
//                     <input
//                       type="radio"
//                       id="gender-m"
//                       value="m"
//                       name="gender"
//                       checked={formData.gender === 'm'}
//                       onChange={handleInputChange}
//                     />
//                     Male
//                   </label>
//                   <label htmlFor="gender-f" style={{ marginLeft: '10px' }}>
//                     <input
//                       type="radio"
//                       id="gender-f"
//                       value="f"
//                       name="gender"
//                       checked={formData.gender === 'f'}
//                       onChange={handleInputChange}
//                     />
//                     Female
//                   </label>
//                 </td>
//               </tr>

//               <tr>
//                 <th scope="row">Status</th>
//                 <td>
//                   <select
//                     name="status"
//                     className="form-control"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Status
//                     </option>
//                     <option value="ON">ON</option>
//                     <option value="OFF">OFF</option>
//                   </select>
//                 </td>
//               </tr>

//               <tr>
//                 <th colSpan="1" scope="row"></th>
//                 <td>
//                   <input type="submit" value="Add Student" className="btn btn-success" />
//                   <input
//                     type="button"
//                     value="Reset"
//                     className="btn btn-success"
//                     onClick={handleReset}
//                     style={{ marginLeft: '10px' }}
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentForm;


import React, { useState, useEffect } from 'react';
import { Save, X, RotateCcw } from 'lucide-react';

const StudentForm = ({ student, mode, departments, semesters, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    eid: '',
    password: '',
    mobile: '',
    address: '',
    department: '',
    semester: '',
    dob: '',
    gender: '',
    status: 'active',
    pic: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && student) {
      setFormData({
        name: student.name || '',
        eid: student.eid || '',
        password: '', // Don't prefill password for security
        mobile: student.mobile || '',
        address: student.address || '',
        department: student.department_id?._id || '',
        semester: student.sem_id?._id || '',
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
        gender: student.gender || '',
        status: student.status || 'active',
        pic: null
      });
    }
  }, [student, mode]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'pic') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.eid.trim()) newErrors.eid = 'Email is required';
    if (!formData.eid.includes('@')) newErrors.eid = 'Please enter a valid email';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    if (mode === 'add' && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      eid: '',
      password: '',
      mobile: '',
      address: '',
      department: '',
      semester: '',
      dob: '',
      gender: '',
      status: 'active',
      pic: null
    });
    setErrors({});
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter full name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="eid"
            value={formData.eid}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.eid ? 'border-red-500' : ''}`}
            placeholder="Enter email address"
          />
          {errors.eid && <p className="text-red-500 text-xs mt-1">{errors.eid}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {mode === 'add' ? '*' : '(Leave blank to keep current)'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.mobile ? 'border-red-500' : ''}`}
            placeholder="Enter mobile number"
            maxLength="10"
          />
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className={`select select-bordered w-full ${errors.department ? 'border-red-500' : ''}`}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.department_name}
              </option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semester *
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className={`select select-bordered w-full ${errors.semester ? 'border-red-500' : ''}`}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semester_name}
              </option>
            ))}
          </select>
          {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.dob ? 'border-red-500' : ''}`}
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`select select-bordered w-full ${errors.gender ? 'border-red-500' : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            name="pic"
            onChange={handleInputChange}
            accept="image/*"
            className="file-input file-input-bordered w-full"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows="3"
          className={`textarea textarea-bordered w-full ${errors.address ? 'border-red-500' : ''}`}
          placeholder="Enter full address"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-outline flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Form
        </button>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Student' : 'Update Student'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudentForm;