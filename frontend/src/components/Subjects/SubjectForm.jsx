// import React, { useState, useEffect } from 'react';

// const SubjectForm = ({ subject = {}, onSave, onCancel, semesters = [], departments = [], teachers = [] }) => {
//   const [subjectName, setSubjectName] = useState(subject.subject_name || '');
//   const [subjectCode, setSubjectCode] = useState(subject.subject_code || '');
//   const [semesterId, setSemesterId] = useState(subject.sem_id || '');
//   const [departmentId, setDepartmentId] = useState(subject.department_id || '');
//   const [teacherId, setTeacherId] = useState(subject.teacher_id || '');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = {
//       subject_name: subjectName,
//       subject_code: subjectCode,
//       sem_id: semesterId,
//       department_id: departmentId,
//       teacher_id: teacherId,
//     };
//     onSave(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 space-y-4">
//       <div>
//         <label className="block">Subject Name</label>
//         <input
//           type="text"
//           value={subjectName}
//           onChange={(e) => setSubjectName(e.target.value)}
//           required
//           className="border rounded px-2 py-1 w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Subject Code</label>
//         <input
//           type="text"
//           value={subjectCode}
//           onChange={(e) => setSubjectCode(e.target.value)}
//           required
//           className="border rounded px-2 py-1 w-full"
//         />
//       </div>
//       <div>
//         <label className="block">Semester</label>
//         <select
//           value={semesterId}
//           onChange={(e) => setSemesterId(e.target.value)}
//           required
//           className="border rounded px-2 py-1 w-full"
//         >
//           <option value="">Select Semester</option>
//           {semesters.map((sem) => (
//             <option key={sem._id} value={sem._id}>
//               {sem.semester_name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label className="block">Department</label>
//         <select
//           value={departmentId}
//           onChange={(e) => setDepartmentId(e.target.value)}
//           required
//           className="border rounded px-2 py-1 w-full"
//         >
//           <option value="">Select Department</option>
//           {departments.map((dept) => (
//             <option key={dept._id} value={dept._id}>
//               {dept.department_name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label className="block">Teacher</label>
//         <select
//           value={teacherId}
//           onChange={(e) => setTeacherId(e.target.value)}
//           required
//           className="border rounded px-2 py-1 w-full"
//         >
//           <option value="">Select Teacher</option>
//           {teachers.map((teacher) => (
//             <option key={teacher._id} value={teacher._id}>
//               {teacher.teacher_name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="flex justify-end gap-2">
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Save
//         </button>
//         <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SubjectForm;

// import React, { useState, useEffect } from 'react';
// import { RefreshCw } from 'lucide-react';

// const SubjectForm = ({ onSubmit, initialData, departments, semesters, teachers }) => {
//   const [formData, setFormData] = useState({
//     subjectName: '',
//     subject_code: '',
//     sem_id: '',
//     department_id: '',
//     teacher_id: '',
//     lecturePerWeek: '',
//     type: '',
//     credits: '',
//     syllabus: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         subjectName: initialData.subjectName || '',
//         subject_code: initialData.subject_code || '',
//         sem_id: initialData.sem_id?._id || '',
//         department_id: initialData.department_id?._id || '',
//         teacher_id: initialData.teacher_id?._id || '',
//         lecturePerWeek: initialData.lecturePerWeek || '',
//         type: initialData.type || '',
//         credits: initialData.credits || '',
//         syllabus: initialData.syllabus || ''
//       });
//     }
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.subjectName.trim()) {
//       newErrors.subjectName = 'Subject name is required';
//     }

//     if (!formData.subject_code.trim()) {
//       newErrors.subject_code = 'Subject code is required';
//     }

//     if (!formData.sem_id) {
//       newErrors.sem_id = 'Semester is required';
//     }

//     if (!formData.department_id) {
//       newErrors.department_id = 'Department is required';
//     }

//     if (!formData.teacher_id) {
//       newErrors.teacher_id = 'Teacher is required';
//     }

//     if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
//       newErrors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
//     }

//     if (!formData.type) {
//       newErrors.type = 'Subject type is required';
//     }

//     if (formData.credits && (formData.credits < 1 || formData.credits > 10)) {
//       newErrors.credits = 'Credits must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Form submission error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       subjectName: '',
//       subject_code: '',
//       sem_id: '',
//       department_id: '',
//       teacher_id: '',
//       lecturePerWeek: '',
//       type: '',
//       credits: '',
//       syllabus: ''
//     });
//     setErrors({});
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Subject Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Subject Name *
//           </label>
//           <input
//             type="text"
//             name="subjectName"
//             value={formData.subjectName}
//             onChange={handleInputChange}
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.subjectName ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Enter subject name"
//           />
//           {errors.subjectName && (
//             <p className="text-red-500 text-xs mt-1">{errors.subjectName}</p>
//           )}
//         </div>

//         {/* Subject Code */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Subject Code *
//           </label>
//           <input
//             type="text"
//             name="subject_code"
//             value={formData.subject_code}
//             onChange={handleInputChange}
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.subject_code ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Enter subject code"
//             style={{ textTransform: 'uppercase' }}
//           />
//           {errors.subject_code && (
//             <p className="text-red-500 text-xs mt-1">{errors.subject_code}</p>
//           )}
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Department *
//           </label>
//           <select
//             name="department_id"
//             value={formData.department_id}
//             onChange={handleInputChange}
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.department_id ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="">Select Department</option>
//             {departments.map(dept => (
//               <option key={dept._id} value={dept._id}>
//                 {dept.departmentName}
//               </option>
//             ))}
//           </select>
//           {errors.department_id && (
//             <p className="text-red-500 text-xs mt-1">{errors.department_id}</p>
//           )}
//         </div>

//         {/* Semester */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Semester *
//           </label>
//           <select
//             name="sem_id"
//             value={formData.sem_id}
//             onChange={handleInputChange}
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.sem_id ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="">Select Semester</option>
//             {semesters.map(sem => (
//               <option key={sem._id} value={sem._id}>
//                 {sem.semesterName}
//               </option>
//             ))}
//           </select>
//           {errors.sem_id && (
//             <p className="text-red-500 text-xs mt-1">{errors.sem_id}</p>
//           )}
//         </div>

//         {/* Teacher */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Teacher *
//           </label>
//           <select
//             name="teacher_id"
//             value={formData.teacher_id}
//             onChange={handleInputChange}
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.teacher_id ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="">Select Teacher</option>
//             {teachers.map(teacher => (
//               <option key={teacher._id} value={teacher._id}>
//                 {teacher.name}
//               </option>
//             ))}
//           </select>
//           {errors.teacher_id && (
//             <p className="text-red-500 text-xs mt-1">{errors.teacher_id}</p>
//           )}
//         </div>

//         {/* Subject Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Subject Type *
//           </label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleInputChange}
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.type ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="">Select Type</option>
//             <option value="theory">Theory</option>
//             <option value="practical">Practical</option>
//             <option value="tutorial">Tutorial</option>
//           </select>
//           {errors.type && (
//             <p className="text-red-500 text-xs mt-1">{errors.type}</p>
//           )}
//         </div>

//         {/* Lectures Per Week */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Lectures Per Week *
//           </label>
//           <input
//             type="number"
//             name="lecturePerWeek"
//             value={formData.lecturePerWeek}
//             onChange={handleInputChange}
//             min="1"
//             max="20"
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.lecturePerWeek ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Enter lectures per week"
//           />
//           {errors.lecturePerWeek && (
//             <p className="text-red-500 text-xs mt-1">{errors.lecturePerWeek}</p>
//           )}
//         </div>

//         {/* Credits */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Credits
//           </label>
//           <input
//             type="number"
//             name="credits"
//             value={formData.credits}
//             onChange={handleInputChange}
//             min="1"
//             max="10"
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//               errors.credits ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Enter credits (optional)"
//           />
//           {errors.credits && (
//             <p className="text-red-500 text-xs mt-1">{errors.credits}</p>
//           )}
//         </div>
//       </div>

//       {/* Syllabus */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Syllabus
//         </label>
//         <textarea
//           name="syllabus"
//           value={formData.syllabus}
//           onChange={handleInputChange}
//           rows="4"
//           maxLength="2000"
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter syllabus details (optional)"
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           {formData.syllabus.length}/2000 characters
//         </p>
//       </div>

//       {/* Form Actions */}
//       <div className="flex justify-end gap-3 pt-4">
//         <button
//           type="button"
//           onClick={handleReset}
//           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
//         >
//           <RefreshCw size={16} /> Reset
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
//         >
//           {isSubmitting ? 'Saving...' : initialData ? 'Update Subject' : 'Create Subject'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default SubjectForm;


// import React, { useState, useEffect } from 'react';
// import { RefreshCw } from 'lucide-react';

// const SubjectForm = ({
//   onSubmit,
//   initialData,
//   departments = [],
//   semesters = [],
//   teachers = []
// }) => {
//   const [formData, setFormData] = useState({
//     subjectName: '',
//     subject_code: '',
//     sem_id: '',
//     department_id: '',
//     teacher_id: '',
//     lecturePerWeek: '',
//     type: '',
//     credits: '',
//     syllabus: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         subjectName: initialData.subjectName || '',
//         subject_code: initialData.subject_code || '',
//         sem_id: initialData.sem_id?._id || '',
//         department_id: initialData.department_id?._id || '',
//         teacher_id: initialData.teacher_id?._id || '',
//         lecturePerWeek: initialData.lecturePerWeek || '',
//         type: initialData.type || '',
//         credits: initialData.credits || '',
//         syllabus: initialData.syllabus || ''
//       });
//     }
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.subjectName.trim()) {
//       newErrors.subjectName = 'Subject name is required';
//     }
//     if (!formData.subject_code.trim()) {
//       newErrors.subject_code = 'Subject code is required';
//     }
//     if (!formData.sem_id) {
//       newErrors.sem_id = 'Semester is required';
//     }
//     if (!formData.department_id) {
//       newErrors.department_id = 'Department is required';
//     }
//     if (!formData.teacher_id) {
//       newErrors.teacher_id = 'Teacher is required';
//     }
//     if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
//       newErrors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
//     }
//     if (!formData.type) {
//       newErrors.type = 'Subject type is required';
//     }
//     if (formData.credits && (formData.credits < 1 || formData.credits > 10)) {
//       newErrors.credits = 'Credits must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Form submission error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       subjectName: '',
//       subject_code: '',
//       sem_id: '',
//       department_id: '',
//       teacher_id: '',
//       lecturePerWeek: '',
//       type: '',
//       credits: '',
//       syllabus: ''
//     });
//     setErrors({});
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Subject Name */}
//         <InputField
//           label="Subject Name *"
//           name="subjectName"
//           value={formData.subjectName}
//           error={errors.subjectName}
//           onChange={handleInputChange}
//           placeholder="Enter subject name"
//         />

//         {/* Subject Code */}
//         <InputField
//           label="Subject Code *"
//           name="subject_code"
//           value={formData.subject_code}
//           error={errors.subject_code}
//           onChange={handleInputChange}
//           placeholder="Enter subject code"
//           style={{ textTransform: 'uppercase' }}
//         />

//         {/* Department */}
//         <SelectField
//           label="Department *"
//           name="department_id"
//           value={formData.department_id}
//           error={errors.department_id}
//           onChange={handleInputChange}
//           options={departments.map(d => ({ value: d._id, label: d.departmentName }))}
//         />

//         {/* Semester */}
//         <SelectField
//           label="Semester *"
//           name="sem_id"
//           value={formData.sem_id}
//           error={errors.sem_id}
//           onChange={handleInputChange}
//           options={semesters.map(s => ({ value: s._id, label: s.semesterName }))}
//         />

//         {/* Teacher */}
//         <SelectField
//           label="Teacher *"
//           name="teacher_id"
//           value={formData.teacher_id}
//           error={errors.teacher_id}
//           onChange={handleInputChange}
//           options={teachers.map(t => ({ value: t._id, label: t.name }))}
//         />

//         {/* Subject Type */}
//         <SelectField
//           label="Subject Type *"
//           name="type"
//           value={formData.type}
//           error={errors.type}
//           onChange={handleInputChange}
//           options={[
//             { value: 'theory', label: 'Theory' },
//             { value: 'practical', label: 'Practical' },
//             { value: 'tutorial', label: 'Tutorial' }
//           ]}
//         />

//         {/* Lectures Per Week */}
//         <InputField
//           label="Lectures Per Week *"
//           name="lecturePerWeek"
//           type="number"
//           value={formData.lecturePerWeek}
//           error={errors.lecturePerWeek}
//           onChange={handleInputChange}
//           placeholder="Enter lectures per week"
//           min="1"
//           max="20"
//         />

//         {/* Credits */}
//         <InputField
//           label="Credits"
//           name="credits"
//           type="number"
//           value={formData.credits}
//           error={errors.credits}
//           onChange={handleInputChange}
//           placeholder="Enter credits (optional)"
//           min="1"
//           max="10"
//         />
//       </div>

//       {/* Syllabus */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus</label>
//         <textarea
//           name="syllabus"
//           value={formData.syllabus}
//           onChange={handleInputChange}
//           rows="4"
//           maxLength="2000"
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter syllabus details (optional)"
//         />
//         <p className="text-xs text-gray-500 mt-1">{formData.syllabus.length}/2000 characters</p>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-end gap-3 pt-4">
//         <button
//           type="button"
//           onClick={handleReset}
//           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
//         >
//           <RefreshCw size={16} /> Reset
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
//         >
//           {isSubmitting ? 'Saving...' : initialData ? 'Update Subject' : 'Create Subject'}
//         </button>
//       </div>
//     </form>
//   );
// };

// // Helper Input Field Component
// const InputField = ({ label, name, type = 'text', value, error, onChange, ...rest }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//         error ? 'border-red-500' : 'border-gray-300'
//       }`}
//       {...rest}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// // Helper Select Field Component
// const SelectField = ({ label, name, value, error, onChange, options = [] }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//         error ? 'border-red-500' : 'border-gray-300'
//       }`}
//     >
//       <option value="">Select</option>
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// export default SubjectForm;


// import React, { useState, useEffect } from 'react';
// import { RefreshCw } from 'lucide-react';

// const SubjectForm = ({
//   onSubmit,
//   initialData = null,
//   departments = [],
//   semesters = [],
//   teachers = []
// }) => {
//   const [formData, setFormData] = useState({
//     subjectName: '',
//     subject_code: '',
//     sem_id: '',
//     department_id: '',
//     teacher_id: '',
//     lecturePerWeek: '',
//     type: '',
//     credits: '',
//     syllabus: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Initialize form data when initialData changes
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         subjectName: initialData.subjectName || '',
//         subject_code: initialData.subject_code || '',
//         sem_id: initialData.sem_id?._id || initialData.sem_id || '',
//         department_id: initialData.department_id?._id || initialData.department_id || '',
//         teacher_id: initialData.teacher_id?._id || initialData.teacher_id || '',
//         lecturePerWeek: initialData.lecturePerWeek || '',
//         type: initialData.type || '',
//         credits: initialData.credits || '',
//         syllabus: initialData.syllabus || ''
//       });
//     }
//   }, [initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Required field validations
//     if (!formData.subjectName.trim()) {
//       newErrors.subjectName = 'Subject name is required';
//     }
    
//     if (!formData.subject_code.trim()) {
//       newErrors.subject_code = 'Subject code is required';
//     }
    
//     if (!formData.sem_id) {
//       newErrors.sem_id = 'Semester is required';
//     }
    
//     if (!formData.department_id) {
//       newErrors.department_id = 'Department is required';
//     }
    
//     if (!formData.teacher_id) {
//       newErrors.teacher_id = 'Teacher is required';
//     }
    
//     if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
//       newErrors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
//     }
    
//     if (!formData.type) {
//       newErrors.type = 'Subject type is required';
//     }
    
//     // Optional field validation
//     if (formData.credits && (formData.credits < 1 || formData.credits > 10)) {
//       newErrors.credits = 'Credits must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await onSubmit(formData);
//     } catch (error) {
//       console.error('Form submission error:', error);
//       // You might want to show an error message to the user here
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       subjectName: '',
//       subject_code: '',
//       sem_id: '',
//       department_id: '',
//       teacher_id: '',
//       lecturePerWeek: '',
//       type: '',
//       credits: '',
//       syllabus: ''
//     });
//     setErrors({});
//   };

//   // Safe array handling for dropdown options
//   const getDepartmentOptions = () => {
//     if (!Array.isArray(departments)) return [];
//     return departments.map(d => ({
//       value: d._id || d.id,
//       label: d.departmentName || d.name || 'Unknown Department'
//     }));
//   };

//   const getSemesterOptions = () => {
//     if (!Array.isArray(semesters)) return [];
//     return semesters.map(s => ({
//       value: s._id || s.id,
//       label: s.semesterName || s.name || 'Unknown Semester'
//     }));
//   };

//   const getTeacherOptions = () => {
//     if (!Array.isArray(teachers)) return [];
//     return teachers.map(t => ({
//       value: t._id || t.id,
//       label: t.name || 'Unknown Teacher'
//     }));
//   };

//   const subjectTypeOptions = [
//     { value: 'theory', label: 'Theory' },
//     { value: 'practical', label: 'Practical' },
//     { value: 'tutorial', label: 'Tutorial' }
//   ];

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Subject Name */}
//           <InputField
//             label="Subject Name *"
//             name="subjectName"
//             value={formData.subjectName}
//             error={errors.subjectName}
//             onChange={handleInputChange}
//             placeholder="Enter subject name"
//           />

//           {/* Subject Code */}
//           <InputField
//             label="Subject Code *"
//             name="subject_code"
//             value={formData.subject_code}
//             error={errors.subject_code}
//             onChange={handleInputChange}
//             placeholder="Enter subject code"
//             style={{ textTransform: 'uppercase' }}
//           />

//           {/* Department */}
//           <SelectField
//             label="Department *"
//             name="department_id"
//             value={formData.department_id}
//             error={errors.department_id}
//             onChange={handleInputChange}
//             options={getDepartmentOptions()}
//             placeholder="Select Department"
//           />

//           {/* Semester */}
//           <SelectField
//             label="Semester *"
//             name="sem_id"
//             value={formData.sem_id}
//             error={errors.sem_id}
//             onChange={handleInputChange}
//             options={getSemesterOptions()}
//             placeholder="Select Semester"
//           />

//           {/* Teacher */}
//           <SelectField
//             label="Teacher *"
//             name="teacher_id"
//             value={formData.teacher_id}
//             error={errors.teacher_id}
//             onChange={handleInputChange}
//             options={getTeacherOptions()}
//             placeholder="Select Teacher"
//           />

//           {/* Subject Type */}
//           <SelectField
//             label="Subject Type *"
//             name="type"
//             value={formData.type}
//             error={errors.type}
//             onChange={handleInputChange}
//             options={subjectTypeOptions}
//             placeholder="Select Subject Type"
//           />

//           {/* Lectures Per Week */}
//           <InputField
//             label="Lectures Per Week *"
//             name="lecturePerWeek"
//             type="number"
//             value={formData.lecturePerWeek}
//             error={errors.lecturePerWeek}
//             onChange={handleInputChange}
//             placeholder="Enter lectures per week"
//             min="1"
//             max="20"
//           />

//           {/* Credits */}
//           <InputField
//             label="Credits"
//             name="credits"
//             type="number"
//             value={formData.credits}
//             error={errors.credits}
//             onChange={handleInputChange}
//             placeholder="Enter credits (optional)"
//             min="1"
//             max="10"
//           />
//         </div>

//         {/* Syllabus */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Syllabus
//           </label>
//           <textarea
//             name="syllabus"
//             value={formData.syllabus}
//             onChange={handleInputChange}
//             rows="4"
//             maxLength="2000"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
//             placeholder="Enter syllabus details (optional)"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             {formData.syllabus.length}/2000 characters
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <button
//             type="button"
//             onClick={handleReset}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
//             disabled={isSubmitting}
//           >
//             <RefreshCw size={16} />
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
//           >
//             {isSubmitting && <RefreshCw size={16} className="animate-spin" />}
//             {isSubmitting ? 'Saving...' : initialData ? 'Update Subject' : 'Create Subject'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Reusable Input Field Component
// const InputField = ({ 
//   label, 
//   name, 
//   type = 'text', 
//   value, 
//   error, 
//   onChange, 
//   placeholder,
//   ...rest 
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//         error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
//       }`}
//       {...rest}
//     />
//     {error && (
//       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//         <span>⚠</span>
//         {error}
//       </p>
//     )}
//   </div>
// );

// // Reusable Select Field Component
// const SelectField = ({ 
//   label, 
//   name, 
//   value, 
//   error, 
//   onChange, 
//   options = [], 
//   placeholder = "Select an option" 
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//         error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
//       }`}
//     >
//       <option value="">{placeholder}</option>
//       {options.map((opt, index) => (
//         <option key={opt.value || index} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//         <span>⚠</span>
//         {error}
//       </p>
//     )}
//   </div>
// );

// export default SubjectForm;


// import React, { useState, useEffect } from 'react';
// import { RefreshCw } from 'lucide-react';
// import subjectService from '../../services/subjectService';
// import departmentService from '../../services/departmentService';
// import { semesterService } from '../../services/semesterService';
// import teacherService from '../../services/teacherService';

// const SubjectForm = ({
//   subject = null, // Changed from initialData to subject
//   onClose
// }) => {
//   const [formData, setFormData] = useState({
//     subjectName: '',
//     subject_code: '',
//     sem_id: '',
//     department_id: '',
//     teacher_id: '',
//     lecturePerWeek: '',
//     type: '',
//     credits: '',
//     syllabus: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // State for dropdown data
//   const [dropdownData, setDropdownData] = useState({
//     departments: [],
//     semesters: [],
//     teachers: []
//   });

//   // Initialize form data when subject changes
//   useEffect(() => {
//     if (subject) {
//       setFormData({
//         subjectName: subject.subjectName || '',
//         subject_code: subject.subject_code || subject.subjectCode || '',
//         sem_id: subject.sem_id?._id || subject.sem_id || '',
//         department_id: subject.department_id?._id || subject.department_id || '',
//         teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
//         lecturePerWeek: subject.lecturePerWeek || '',
//         type: subject.type || '',
//         credits: subject.credits || '',
//         syllabus: subject.syllabus || ''
//       });
//     } else {
//       // Reset form for new subject
//       setFormData({
//         subjectName: '',
//         subject_code: '',
//         sem_id: '',
//         department_id: '',
//         teacher_id: '',
//         lecturePerWeek: '',
//         type: '',
//         credits: '',
//         syllabus: ''
//       });
//     }
//   }, [subject]);

//   // Fetch dropdown data
//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       setIsLoading(true);
//       try {
//         const [departments, semesters, teachers] = await Promise.all([
//           departmentService.getDepartmentsForSelect(),
//           semesterService.getAllSemesters(),
//           teacherService.getAllTeachers()
//         ]);

//         console.log('Fetched data:', { departments, semesters, teachers }); // Debug log

//         setDropdownData({
//           departments: departments || [],
//           semesters: Array.isArray(semesters) ? semesters : semesters?.semesters || [],
//           teachers: Array.isArray(teachers) ? teachers : teachers?.teachers || []
//         });
//       } catch (error) {
//         console.error('Error fetching dropdown data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDropdownData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Required field validations
//     if (!formData.subjectName.trim()) {
//       newErrors.subjectName = 'Subject name is required';
//     }
    
//     if (!formData.subject_code.trim()) {
//       newErrors.subject_code = 'Subject code is required';
//     }
    
//     if (!formData.sem_id) {
//       newErrors.sem_id = 'Semester is required';
//     }
    
//     if (!formData.department_id) {
//       newErrors.department_id = 'Department is required';
//     }
    
//     if (!formData.teacher_id) {
//       newErrors.teacher_id = 'Teacher is required';
//     }
    
//     if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
//       newErrors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
//     }
    
//     if (!formData.type) {
//       newErrors.type = 'Subject type is required';
//     }
    
//     // Optional field validation
//     if (formData.credits && (formData.credits < 1 || formData.credits > 10)) {
//       newErrors.credits = 'Credits must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       if (subject) {
//         // Update existing subject
//         await subjectService.updateSubject(subject._id, formData);
//       } else {
//         // Create new subject
//         await subjectService.createSubject(formData);
//       }
//       onClose(); // Close modal and refresh data
//     } catch (error) {
//       console.error('Form submission error:', error);
//       // You might want to show an error message to the user here
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     if (subject) {
//       // Reset to original subject data
//       setFormData({
//         subjectName: subject.subjectName || '',
//         subject_code: subject.subject_code || subject.subjectCode || '',
//         sem_id: subject.sem_id?._id || subject.sem_id || '',
//         department_id: subject.department_id?._id || subject.department_id || '',
//         teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
//         lecturePerWeek: subject.lecturePerWeek || '',
//         type: subject.type || '',
//         credits: subject.credits || '',
//         syllabus: subject.syllabus || ''
//       });
//     } else {
//       // Reset to empty form
//       setFormData({
//         subjectName: '',
//         subject_code: '',
//         sem_id: '',
//         department_id: '',
//         teacher_id: '',
//         lecturePerWeek: '',
//         type: '',
//         credits: '',
//         syllabus: ''
//       });
//     }
//     setErrors({});
//   };

//   // Safe array handling for dropdown options
//   const getDepartmentOptions = () => {
//     if (!Array.isArray(dropdownData.departments)) return [];
//     return dropdownData.departments.map(d => ({
//       value: d.value || d._id || d.id,
//       label: d.label || d.departmentName || d.name || 'Unknown Department'
//     }));
//   };

//   const getSemesterOptions = () => {
//     if (!Array.isArray(dropdownData.semesters)) return [];
//     return dropdownData.semesters.map(s => ({
//       value: s._id || s.id,
//       label: s.semesterName || s.name || 'Unknown Semester'
//     }));
//   };

//   const getTeacherOptions = () => {
//     if (!Array.isArray(dropdownData.teachers)) return [];
//     return dropdownData.teachers.map(t => ({
//       value: t._id || t.id,
//       label: t.name || t.firstName + ' ' + t.lastName || 'Unknown Teacher'
//     }));
//   };

//   const subjectTypeOptions = [
//     { value: 'theory', label: 'Theory' },
//     { value: 'practical', label: 'Practical' },
//     { value: 'tutorial', label: 'Tutorial' }
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <RefreshCw className="animate-spin" size={24} />
//         <span className="ml-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Subject Name */}
//           <InputField
//             label="Subject Name *"
//             name="subjectName"
//             value={formData.subjectName}
//             error={errors.subjectName}
//             onChange={handleInputChange}
//             placeholder="Enter subject name"
//           />

//           {/* Subject Code */}
//           <InputField
//             label="Subject Code *"
//             name="subject_code"
//             value={formData.subject_code}
//             error={errors.subject_code}
//             onChange={handleInputChange}
//             placeholder="Enter subject code"
//             style={{ textTransform: 'uppercase' }}
//           />

//           {/* Department */}
//           <SelectField
//             label="Department *"
//             name="department_id"
//             value={formData.department_id}
//             error={errors.department_id}
//             onChange={handleInputChange}
//             options={getDepartmentOptions()}
//             placeholder="Select Department"
//           />

//           {/* Semester */}
//           <SelectField
//             label="Semester *"
//             name="sem_id"
//             value={formData.sem_id}
//             error={errors.sem_id}
//             onChange={handleInputChange}
//             options={getSemesterOptions()}
//             placeholder="Select Semester"
//           />

//           {/* Teacher */}
//           <SelectField
//             label="Teacher *"
//             name="teacher_id"
//             value={formData.teacher_id}
//             error={errors.teacher_id}
//             onChange={handleInputChange}
//             options={getTeacherOptions()}
//             placeholder="Select Teacher"
//           />

//           {/* Subject Type */}
//           <SelectField
//             label="Subject Type *"
//             name="type"
//             value={formData.type}
//             error={errors.type}
//             onChange={handleInputChange}
//             options={subjectTypeOptions}
//             placeholder="Select Subject Type"
//           />

//           {/* Lectures Per Week */}
//           <InputField
//             label="Lectures Per Week *"
//             name="lecturePerWeek"
//             type="number"
//             value={formData.lecturePerWeek}
//             error={errors.lecturePerWeek}
//             onChange={handleInputChange}
//             placeholder="Enter lectures per week"
//             min="1"
//             max="20"
//           />

//           {/* Credits */}
//           <InputField
//             label="Credits"
//             name="credits"
//             type="number"
//             value={formData.credits}
//             error={errors.credits}
//             onChange={handleInputChange}
//             placeholder="Enter credits (optional)"
//             min="1"
//             max="10"
//           />
//         </div>

//         {/* Syllabus */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Syllabus
//           </label>
//           <textarea
//             name="syllabus"
//             value={formData.syllabus}
//             onChange={handleInputChange}
//             rows="4"
//             maxLength="2000"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
//             placeholder="Enter syllabus details (optional)"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             {formData.syllabus.length}/2000 characters
//           </p>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleReset}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
//             disabled={isSubmitting}
//           >
//             <RefreshCw size={16} />
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
//           >
//             {isSubmitting && <RefreshCw size={16} className="animate-spin" />}
//             {isSubmitting ? 'Saving...' : subject ? 'Update Subject' : 'Create Subject'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// // Reusable Input Field Component
// const InputField = ({ 
//   label, 
//   name, 
//   type = 'text', 
//   value, 
//   error, 
//   onChange, 
//   placeholder,
//   ...rest 
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//         error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
//       }`}
//       {...rest}
//     />
//     {error && (
//       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//         <span>⚠</span>
//         {error}
//       </p>
//     )}
//   </div>
// );

// // Reusable Select Field Component
// const SelectField = ({ 
//   label, 
//   name, 
//   value, 
//   error, 
//   onChange, 
//   options = [], 
//   placeholder = "Select an option" 
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//         error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
//       }`}
//     >
//       <option value="">{placeholder}</option>
//       {options.map((opt, index) => (
//         <option key={opt.value || index} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//         <span>⚠</span>
//         {error}
//       </p>
//     )}
//   </div>
// );

// export default SubjectForm;


// import React, { useState, useEffect } from 'react';
// import { RefreshCw } from 'lucide-react';
// import subjectService from '../../services/subjectService';
// import departmentService from '../../services/departmentService';
// import teacherService from '../../services/teacherService';

// const SubjectForm = ({
//   subject = null,
//   onClose
// }) => {
//   const [formData, setFormData] = useState({
//     subjectName: '',
//     subject_code: '',
//     sem_id: '',
//     department_id: '',
//     teacher_id: '',
//     lecturePerWeek: '',
//     type: '',
//     credits: '',
//     syllabus: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const [dropdownData, setDropdownData] = useState({
//     departments: [],
//     teachers: []
//   });

//   useEffect(() => {
//     if (subject) {
//       setFormData({
//         subjectName: subject.subjectName || '',
//         subject_code: subject.subject_code || subject.subjectCode || '',
//         sem_id: subject.sem_id || '',
//         department_id: subject.department_id?._id || subject.department_id || '',
//         teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
//         lecturePerWeek: subject.lecturePerWeek || '',
//         type: subject.type || '',
//         credits: subject.credits || '',
//         syllabus: subject.syllabus || ''
//       });
//     } else {
//       setFormData({
//         subjectName: '',
//         subject_code: '',
//         sem_id: '',
//         department_id: '',
//         teacher_id: '',
//         lecturePerWeek: '',
//         type: '',
//         credits: '',
//         syllabus: ''
//       });
//     }
//   }, [subject]);

//   useEffect(() => {
//     const fetchDropdownData = async () => {
//       setIsLoading(true);
      
//       try {
//         const [departments, teachers] = await Promise.all([
//           departmentService.getDepartmentsForSelect(),
//           teacherService.getAllTeachers()
//         ]);
//         console.log("Fetched departments:", departments);
//       console.log("Fetched teachers:", teachers);

//         setDropdownData({
//           departments: departments || [],
//           teachers: Array.isArray(teachers) ? teachers : teachers?.teachers || []
//         });
//       } catch (error) {
//         console.error('Error fetching dropdown data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDropdownData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.subjectName.trim()) {
//       newErrors.subjectName = 'Subject name is required';
//     }

//     if (!formData.subject_code.trim()) {
//       newErrors.subject_code = 'Subject code is required';
//     }

//     if (!formData.sem_id) {
//       newErrors.sem_id = 'Semester is required';
//     }

//     if (!formData.department_id) {
//       newErrors.department_id = 'Department is required';
//     }

//     if (!formData.teacher_id) {
//       newErrors.teacher_id = 'Teacher is required';
//     }

//     if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
//       newErrors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
//     }

//     if (!formData.type) {
//       newErrors.type = 'Subject type is required';
//     }

//     if (formData.credits && (formData.credits < 1 || formData.credits > 10)) {
//       newErrors.credits = 'Credits must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       if (subject) {
//         await subjectService.updateSubject(subject._id, formData);
//       } else {
//         await subjectService.createSubject(formData);
//       }
//       onClose();
//     } catch (error) {
//       console.error('Form submission error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     if (subject) {
//       setFormData({
//         subjectName: subject.subjectName || '',
//         subject_code: subject.subject_code || subject.subjectCode || '',
//         sem_id: subject.sem_id || '',
//         department_id: subject.department_id?._id || subject.department_id || '',
//         teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
//         lecturePerWeek: subject.lecturePerWeek || '',
//         type: subject.type || '',
//         credits: subject.credits || '',
//         syllabus: subject.syllabus || ''
//       });
//     } else {
//       setFormData({
//         subjectName: '',
//         subject_code: '',
//         sem_id: '',
//         department_id: '',
//         teacher_id: '',
//         lecturePerWeek: '',
//         type: '',
//         credits: '',
//         syllabus: ''
//       });
//     }
//     setErrors({});
//   };

//   const getDepartmentOptions = () => {
//     if (!Array.isArray(dropdownData.departments)) return [];
//     return dropdownData.departments.map(d => ({
//       value: d._id || d.id,
//       label: d.departmentName || d.name || 'Unknown Department'
//     }));
//   };

//   const getSemesterOptions = () => {
//     return Array.from({ length: 8 }, (_, i) => ({
//       value: (i + 1).toString(),
//       label: `Semester ${i + 1}`
//     }));
//   };

//   const getTeacherOptions = () => {
//     if (!Array.isArray(dropdownData.teachers)) return [];
//     return dropdownData.teachers.map(t => ({
//       value: t._id || t.id,
//       label: t.name || `${t.firstName} ${t.lastName}` || 'Unknown Teacher'
//     }));
//   };

//   const subjectTypeOptions = [
//     { value: 'theory', label: 'Theory' },
//     { value: 'practical', label: 'Practical' },
//     { value: 'tutorial', label: 'Tutorial' }
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <RefreshCw className="animate-spin" size={24} />
//         <span className="ml-2">Loading form data...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField
//             label="Subject Name *"
//             name="subjectName"
//             value={formData.subjectName}
//             error={errors.subjectName}
//             onChange={handleInputChange}
//             placeholder="Enter subject name"
//           />

//           <InputField
//             label="Subject Code *"
//             name="subject_code"
//             value={formData.subject_code}
//             error={errors.subject_code}
//             onChange={handleInputChange}
//             placeholder="Enter subject code"
//             style={{ textTransform: 'uppercase' }}
//           />

//           <SelectField
//             label="Department *"
//             name="department_id"
//             value={formData.department_id}
//             error={errors.department_id}
//             onChange={handleInputChange}
//             options={getDepartmentOptions()}
//             placeholder="Select Department"
//           />

//           <SelectField
//             label="Semester *"
//             name="sem_id"
//             value={formData.sem_id}
//             error={errors.sem_id}
//             onChange={handleInputChange}
//             options={getSemesterOptions()}
//             placeholder="Select Semester"
//           />

//           <SelectField
//             label="Teacher *"
//             name="teacher_id"
//             value={formData.teacher_id}
//             error={errors.teacher_id}
//             onChange={handleInputChange}
//             options={getTeacherOptions()}
//             placeholder="Select Teacher"
//           />

//           <SelectField
//             label="Subject Type *"
//             name="type"
//             value={formData.type}
//             error={errors.type}
//             onChange={handleInputChange}
//             options={subjectTypeOptions}
//             placeholder="Select Subject Type"
//           />

//           <InputField
//             label="Lectures Per Week *"
//             name="lecturePerWeek"
//             type="number"
//             value={formData.lecturePerWeek}
//             error={errors.lecturePerWeek}
//             onChange={handleInputChange}
//             placeholder="Enter lectures per week"
//             min="1"
//             max="20"
//           />

//           <InputField
//             label="Credits"
//             name="credits"
//             type="number"
//             value={formData.credits}
//             error={errors.credits}
//             onChange={handleInputChange}
//             placeholder="Enter credits (optional)"
//             min="1"
//             max="10"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Syllabus
//           </label>
//           <textarea
//             name="syllabus"
//             value={formData.syllabus}
//             onChange={handleInputChange}
//             rows="4"
//             maxLength="2000"
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
//             placeholder="Enter syllabus details (optional)"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             {formData.syllabus.length}/2000 characters
//           </p>
//         </div>

//         <div className="flex justify-end gap-3 pt-4 border-t">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleReset}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
//             disabled={isSubmitting}
//           >
//             <RefreshCw size={16} />
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
//           >
//             {isSubmitting && <RefreshCw size={16} className="animate-spin" />}
//             {isSubmitting ? 'Saving...' : subject ? 'Update Subject' : 'Create Subject'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const InputField = ({
//   label,
//   name,
//   type = 'text',
//   value,
//   error,
//   onChange,
//   placeholder,
//   ...rest
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//         error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
//       }`}
//       {...rest}
//     />
//     {error && (
//       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//         <span>⚠</span>
//         {error}
//       </p>
//     )}
//   </div>
// );

// const SelectField = ({
//   label,
//   name,
//   value,
//   error,
//   onChange,
//   options = [],
//   placeholder = "Select an option"
// }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
//         error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
//       }`}
//     >
//       <option value="">{placeholder}</option>
//       {options.map((opt, index) => (
//         <option key={opt.value || index} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
//         <span>⚠</span>
//         {error}
//       </p>
//     )}
//   </div>
// );

// export default SubjectForm;


import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import subjectService from '../../services/subjectService';
import departmentService from '../../services/departmentService';
import teacherService from '../../services/teacherService';

const SubjectForm = ({
  subject = null,
  onClose
}) => {
  const [formData, setFormData] = useState({
    subjectName: '',
    subject_code: '',
    sem_id: '',
    department_id: '',
    teacher_id: '',
    lecturePerWeek: '',
    type: '',
    credits: '',
    syllabus: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [dropdownData, setDropdownData] = useState({
    departments: [],
    teachers: []
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        subjectName: subject.subjectName || '',
        subject_code: subject.subject_code || subject.subjectCode || '',
        sem_id: subject.sem_id || '',
        department_id: subject.department_id?._id || subject.department_id || '',
        teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
        lecturePerWeek: subject.lecturePerWeek || '',
        type: subject.type || '',
        credits: subject.credits || '',
        syllabus: subject.syllabus || ''
      });
    } else {
      setFormData({
        subjectName: '',
        subject_code: '',
        sem_id: '',
        department_id: '',
        teacher_id: '',
        lecturePerWeek: '',
        type: '',
        credits: '',
        syllabus: ''
      });
    }
  }, [subject]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      try {
        const [departments, teachers] = await Promise.all([
          departmentService.getDepartmentsForSelect(),
          teacherService.getAllTeachers()
        ]);

        console.log("Fetched departments: ", departments);
        console.log("Fetched teachers: ", teachers);

        setDropdownData({
          departments: departments || [],
          teachers: Array.isArray(teachers) ? teachers : teachers?.teachers || []
        });
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subjectName.trim()) {
      newErrors.subjectName = 'Subject name is required';
    }

    if (!formData.subject_code.trim()) {
      newErrors.subject_code = 'Subject code is required';
    }

    if (!formData.sem_id) {
      newErrors.sem_id = 'Semester is required';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }

    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Teacher is required';
    }

    if (!formData.lecturePerWeek || formData.lecturePerWeek < 1 || formData.lecturePerWeek > 20) {
      newErrors.lecturePerWeek = 'Lectures per week must be between 1 and 20';
    }

    if (!formData.type) {
      newErrors.type = 'Subject type is required';
    }

    if (formData.credits && (formData.credits < 1 || formData.credits > 10)) {
      newErrors.credits = 'Credits must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (subject) {
        await subjectService.updateSubject(subject._id, formData);
      } else {
        await subjectService.createSubject(formData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (subject) {
      setFormData({
        subjectName: subject.subjectName || '',
        subject_code: subject.subject_code || subject.subjectCode || '',
        sem_id: subject.sem_id || '',
        department_id: subject.department_id?._id || subject.department_id || '',
        teacher_id: subject.teacher_id?._id || subject.teacher_id || '',
        lecturePerWeek: subject.lecturePerWeek || '',
        type: subject.type || '',
        credits: subject.credits || '',
        syllabus: subject.syllabus || ''
      });
    } else {
      setFormData({
        subjectName: '',
        subject_code: '',
        sem_id: '',
        department_id: '',
        teacher_id: '',
        lecturePerWeek: '',
        type: '',
        credits: '',
        syllabus: ''
      });
    }
    setErrors({});
  };

  const getDepartmentOptions = () => dropdownData.departments || [];

  const getSemesterOptions = () => {
    return Array.from({ length: 8 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Semester ${i + 1}`
    }));
  };

  const getTeacherOptions = () => {
    return (dropdownData.teachers || []).map(t => ({
      value: t._id,
      label: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Unknown Teacher'
    }));
  };

  const subjectTypeOptions = [
    { value: 'theory', label: 'Theory' },
    { value: 'practical', label: 'Practical' },
    { value: 'tutorial', label: 'Tutorial' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin" size={24} />
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Subject Name *"
            name="subjectName"
            value={formData.subjectName}
            error={errors.subjectName}
            onChange={handleInputChange}
            placeholder="Enter subject name"
          />

          <InputField
            label="Subject Code *"
            name="subject_code"
            value={formData.subject_code}
            error={errors.subject_code}
            onChange={handleInputChange}
            placeholder="Enter subject code"
            style={{ textTransform: 'uppercase' }}
          />

          <SelectField
            label="Department *"
            name="department_id"
            value={formData.department_id}
            error={errors.department_id}
            onChange={handleInputChange}
            options={getDepartmentOptions()}
            placeholder="Select Department"
          />

          <SelectField
            label="Semester *"
            name="sem_id"
            value={formData.sem_id}
            error={errors.sem_id}
            onChange={handleInputChange}
            options={getSemesterOptions()}
            placeholder="Select Semester"
          />

          <SelectField
            label="Teacher *"
            name="teacher_id"
            value={formData.teacher_id}
            error={errors.teacher_id}
            onChange={handleInputChange}
            options={getTeacherOptions()}
            placeholder="Select Teacher"
          />

          <SelectField
            label="Subject Type *"
            name="type"
            value={formData.type}
            error={errors.type}
            onChange={handleInputChange}
            options={subjectTypeOptions}
            placeholder="Select Subject Type"
          />

          <InputField
            label="Lectures Per Week *"
            name="lecturePerWeek"
            type="number"
            value={formData.lecturePerWeek}
            error={errors.lecturePerWeek}
            onChange={handleInputChange}
            placeholder="Enter lectures per week"
            min="1"
            max="20"
          />

          <InputField
            label="Credits"
            name="credits"
            type="number"
            value={formData.credits}
            error={errors.credits}
            onChange={handleInputChange}
            placeholder="Enter credits (optional)"
            min="1"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Syllabus
          </label>
          <textarea
            name="syllabus"
            value={formData.syllabus}
            onChange={handleInputChange}
            rows="4"
            maxLength="2000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            placeholder="Enter syllabus details (optional)"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.syllabus.length}/2000 characters
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <RefreshCw size={16} />
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            {isSubmitting && <RefreshCw size={16} className="animate-spin" />}
            {isSubmitting ? 'Saving...' : subject ? 'Update Subject' : 'Create Subject'}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  error,
  onChange,
  placeholder,
  ...rest
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
      }`}
      {...rest}
    />
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span>
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  error,
  onChange,
  options = [],
  placeholder = "Select an option"
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt, index) => (
        <option key={opt.value || index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <span>⚠</span>
        {error}
      </p>
    )}
  </div>
);

export default SubjectForm;
