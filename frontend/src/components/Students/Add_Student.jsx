// import React, { useState } from 'react';
// import axios from 'axios';

// const AddStudent = () => {
//     const [formData, setFormData] = useState({
//         stname: '',
//         eid: '',
//         p: '',
//         mobile: '',
//         address: '',
//         courseid: '',
//         s: '',
//         dob: '',
//         gen: '',
//         status: '',
//         pic: null
//     });
//     const [message, setMessage] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         setFormData({ ...formData, pic: e.target.files[0] });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = new FormData();
//         Object.keys(formData).forEach(key => {
//             data.append(key, formData[key]);
//         });

//         try {
//             const response = await axios.post('/api/students', data, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             setMessage(response.data.message);
//         } catch (error) {
//             setMessage(error.response.data.message);
//         }
//     };

//     return (
//         <div className="row">
//             <div className="col-md-12">
//                 <h2>Add Student</h2>
//                 <form onSubmit={handleSubmit} encType="multipart/form-data">
//                     <table border="0" className="table">
//                         <tr>
//                             <td colSpan="2">{message}</td>
//                         </tr>
//                         <tr>
//                             <th>Select Department</th>
//                             <td>
//                                 <select name="courseid" className="form-control" onChange={handleChange}>
//                                     <option disabled selected>Select Department</option>
//                                     {/* Fetch departments from API */}
//                                 </select>
//                             </td>
//                         </tr>
//                         <tr>
//                             <th>Select Semester</th>
//                             <td>
//                                 <select name="s" className="form-control" onChange={handleChange}>
//                                     <option disabled selected>Select Semester</option>
//                                     {/* Fetch semesters from API */}
//                                 </select>
//                             </td>
//                         </tr>
//                         <tr>
//                             <th>Student Name</th>
//                             <td><input type="text" name="stname" className="form-control" onChange={handleChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>Email</th>
//                             <td><input type="email" name="eid" className="form-control" onChange={handleChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>Password</th>
//                             <td><input type="password" name="p" className="form-control" onChange={handleChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>Mobile</th>
//                             <td><input type="number" name="mobile" className="form-control" onChange={handleChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>Address</th>
//                             <td><input type="text" name="address" className="form-control" onChange={handleChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>D.O.B</th>
//                             <td><input type="date" name="dob" className="form-control" onChange={handleChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>Upload Your Pic</th>
//                             <td><input type="file" name="pic" className="form-control" onChange={handleFileChange} /></td>
//                         </tr>
//                         <tr>
//                             <th>Gender</th>
//                             <td>
//                                 Male <input type="radio" value="m" name="gen" onChange={handleChange} />
//                                 Female <input type="radio" value="f" name="gen" onChange={handleChange} />
//                             </td>
//                         </tr>
//                         <tr>
//                             <th>Status</th>
//                             <td>
//                                 <select name="status" className="form-control" onChange={handleChange}>
//                                     <option value="" selected disabled>Select Status</option>
//                                     <option value="ON">ON</option>
//                                     <option value="OFF">OFF</option>
//                                 </select>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td colSpan="2">
//                                 <input type="submit" value="Add Student" className="btn btn-success" />
//                                 <input type="reset" value="Reset" className="btn btn-success" />
//                             </td>
//                         </tr>
//                     </table>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddStudent;
// // This code defines a React component for adding a new student. It includes a form with fields for student details,
// // such as name, email, password, mobile, address, department, semester, date of birth

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import departmentService from '../services/departmentService';
import semesterService from '../services/semesterService';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        stname: '',
        eid: '',
        p: '',
        mobile: '',
        address: '',
        courseid: '',
        s: '',
        dob: '',
        gen: '',
        status: '',
        pic: null
    });

    const [message, setMessage] = useState('');
    const [departments, setDepartments] = useState([]);
    const [semesters, setSemesters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const depRes = await departmentService.getAllDepartments();
                setDepartments(depRes.data); // Assuming API response has { data: [...] }

                const semRes = await semesterService.getAllSemesters();
                setSemesters(semRes.data); // Assuming API response has { data: [...] }
            } catch (err) {
                console.error("Error fetching department or semester data", err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, pic: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axios.post('/api/students', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding student');
        }
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <h2>Add Student</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <table border="0" className="table">
                        <tbody>
                            <tr>
                                <td colSpan="2">{message}</td>
                            </tr>
                            <tr>
                                <th>Select Department</th>
                                <td>
                                    <select name="courseid" className="form-control" onChange={handleChange} required>
                                        <option disabled selected value="">Select Department</option>
                                        {departments.map(dep => (
                                            <option key={dep._id} value={dep._id}>{dep.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Select Semester</th>
                                <td>
                                    <select name="s" className="form-control" onChange={handleChange} required>
                                        <option disabled selected value="">Select Semester</option>
                                        {semesters.map(sem => (
                                            <option key={sem._id} value={sem._id}>{sem.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Student Name</th>
                                <td><input type="text" name="stname" className="form-control" onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td><input type="email" name="eid" className="form-control" onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <th>Password</th>
                                <td><input type="password" name="p" className="form-control" onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <th>Mobile</th>
                                <td><input type="number" name="mobile" className="form-control" onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td><input type="text" name="address" className="form-control" onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <th>D.O.B</th>
                                <td><input type="date" name="dob" className="form-control" onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <th>Upload Your Pic</th>
                                <td><input type="file" name="pic" className="form-control" onChange={handleFileChange} /></td>
                            </tr>
                            <tr>
                                <th>Gender</th>
                                <td>
                                    Male <input type="radio" value="Male" name="gen" onChange={handleChange} required />
                                    Female <input type="radio" value="Female" name="gen" onChange={handleChange} />
                                </td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>
                                    <select name="status" className="form-control" onChange={handleChange} required>
                                        <option value="" disabled selected>Select Status</option>
                                        <option value="ON">ON</option>
                                        <option value="OFF">OFF</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <input type="submit" value="Add Student" className="btn btn-success" />
                                    <input type="reset" value="Reset" className="btn btn-secondary" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
