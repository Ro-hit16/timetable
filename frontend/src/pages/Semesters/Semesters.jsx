// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [semestersRes, departmentsRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments()
//       ]);

//       setSemesters(semestersRes.data);
//       setDepartments(departmentsRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester(semester);
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester.sem_id, currentSemester);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(currentSemester);
//         toast.success('Semester created successfully');
//       }
//       handleCloseModal();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving semester:', error);
//       toast.error('Failed to save semester');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting semester:', error);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (deptId) => {
//     const department = departments.find(dept => dept.department_id === deptId);
//     return department ? department.department_name : 'N/A';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button 
//                 variant="primary" 
//                 onClick={() => handleShowModal()}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaPlus /> Add New Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Sem ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {semesters.length > 0 ? (
//                       semesters.map((semester) => (
//                         <tr key={semester.sem_id}>
//                           <td>{semester.sem_id}</td>
//                           <td>{semester.semester_name}</td>
//                           <td>{getDepartmentName(semester.department_id)}</td>
//                           <td>
//                             <Button
//                               variant="outline-primary"
//                               size="sm"
//                               className="me-2 btn-action"
//                               onClick={() => handleShowModal(semester)}
//                             >
//                               <FaEdit />
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               className="btn-action"
//                               onClick={() => handleDelete(semester.sem_id)}
//                             >
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No semesters found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {isEditing ? 'Edit Semester' : 'Add New Semester'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester, Second Semester"
//                 required
//               />
//             </Form.Group>
            
//             <Form.Group className="mb-3">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((department) => (
//                   <option key={department.department_id} value={department.department_id}>
//                     {department.department_name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
            
//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit">
//                 {isEditing ? 'Update' : 'Create'} Semester
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [semestersRes, departmentsRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments()
//       ]);

//       setSemesters(semestersRes?.data || []);
//       setDepartments(departmentsRes?.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to fetch data');
//       setSemesters([]);
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester(semester);
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester.sem_id, currentSemester);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(currentSemester);
//         toast.success('Semester created successfully');
//       }
//       handleCloseModal();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving semester:', error);
//       toast.error('Failed to save semester');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting semester:', error);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (deptId) => {
//     if (!departments || departments.length === 0) return 'N/A';
//     const department = departments.find(dept => dept.department_id === deptId);
//     return department ? department.department_name : 'N/A';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button 
//                 variant="primary" 
//                 onClick={() => handleShowModal()}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaPlus /> Add New Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Sem ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map((semester) => (
//                         <tr key={semester.sem_id}>
//                           <td>{semester.sem_id}</td>
//                           <td>{semester.semester_name}</td>
//                           <td>{getDepartmentName(semester.department_id)}</td>
//                           <td>
//                             <Button
//                               variant="outline-primary"
//                               size="sm"
//                               className="me-2 btn-action"
//                               onClick={() => handleShowModal(semester)}
//                             >
//                               <FaEdit />
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               className="btn-action"
//                               onClick={() => handleDelete(semester.sem_id)}
//                             >
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No semesters found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {isEditing ? 'Edit Semester' : 'Add New Semester'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester, Second Semester"
//                 required
//               />
//             </Form.Group>
            
//             <Form.Group className="mb-3">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {Array.isArray(departments) && departments.map((department) => (
//                   <option key={department.department_id} value={department.department_id}>
//                     {department.department_name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
            
//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit">
//                 {isEditing ? 'Update' : 'Create'} Semester
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // Fetch semesters and departments in parallel
//       const [semestersRes, departmentsRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments()
//       ]);

//       setSemesters(semestersRes.data || []);
//       setDepartments(departmentsRes.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to fetch data');
//       setSemesters([]);
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester(semester);
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester.sem_id, currentSemester);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(currentSemester);
//         toast.success('Semester created successfully');
//       }
//       handleCloseModal();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving semester:', error);
//       toast.error('Failed to save semester');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting semester:', error);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (deptId) => {
//     if (!departments.length) return 'N/A';
//     const dept = departments.find(d => d.department_id === deptId);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button
//                 variant="primary"
//                 onClick={() => handleShowModal()}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaPlus /> Add New Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Sem ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map((semester) => (
//                         <tr key={semester.sem_id}>
//                           <td>{semester.sem_id}</td>
//                           <td>{semester.semester_name}</td>
//                           <td>{getDepartmentName(semester.department_id)}</td>
//                           <td>
//                             <Button
//                               variant="outline-primary"
//                               size="sm"
//                               className="me-2 btn-action"
//                               onClick={() => handleShowModal(semester)}
//                             >
//                               <FaEdit />
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               className="btn-action"
//                               onClick={() => handleDelete(semester.sem_id)}
//                             >
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No semesters found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add New Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="semesterName">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester, Second Semester"
//                 required
//                 disabled={submitLoading}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="departmentSelect">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//                 disabled={submitLoading}
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((department) => (
//                   <option key={department.department_id} value={department.department_id}>
//                     {department.departmentName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal} disabled={submitLoading}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" disabled={submitLoading}>
//                 {isEditing ? 'Update' : 'Create'} Semester
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // Fetch semesters and departments in parallel
//       const [semestersRes, departmentsRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments()
//       ]);

//       setSemesters(semestersRes.data || []);
//       setDepartments(departmentsRes.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to fetch data');
//       setSemesters([]);
//       setDepartments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       // When editing, map API fields properly
//       setCurrentSemester({
//         _id: semester._id,
//         semester_name: semester.semester_name,
//         department_id: semester.department_id
//       });
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       if (isEditing) {
//         // Update by _id
//         await semesterService.updateSemester(currentSemester._id, {
//           semester_name: currentSemester.semester_name,
//           department_id: currentSemester.department_id
//         });
//         toast.success('Semester updated successfully');
//       } else {
//         // Create new semester, send only required fields
//         await semesterService.createSemester({
//           semester_name: currentSemester.semester_name,
//           department_id: currentSemester.department_id
//         });
//         toast.success('Semester created successfully');
//       }
//       handleCloseModal();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving semester:', error);
//       toast.error('Failed to save semester');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting semester:', error);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (deptId) => {
//     if (!departments.length) return 'N/A';
//     const dept = departments.find(d => d._id === deptId);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button
//                 variant="primary"
//                 onClick={() => handleShowModal()}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaPlus /> Add New Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Sem ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map((semester) => (
//                         <tr key={semester._id}>
//                           <td>{semester._id}</td>
//                           <td>{semester.semester_name}</td>
//                           <td>{getDepartmentName(semester.department_id)}</td>
//                           <td>
//                             <Button
//                               variant="outline-primary"
//                               size="sm"
//                               className="me-2 btn-action"
//                               onClick={() => handleShowModal(semester)}
//                             >
//                               <FaEdit />
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               className="btn-action"
//                               onClick={() => handleDelete(semester._id)}
//                             >
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No semesters found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Add/Edit Modal */}
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add New Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="semesterName">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester, Second Semester"
//                 required
//                 disabled={submitLoading}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="departmentSelect">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//                 disabled={submitLoading}
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((department) => (
//                   <option key={department._id} value={department._id}>
//                     {department.departmentName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal} disabled={submitLoading}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" disabled={submitLoading}>
//                 {isEditing ? 'Update' : 'Create'} Semester
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import courseService from '../../services/courseService'; // import course service
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: '',
//     course_id: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [semestersRes, departmentsRes, coursesRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments(),
//         courseService.getAllCourses() // fetch all courses
//       ]);

//       setSemesters(semestersRes.data || []);
//       setDepartments(departmentsRes.data || []);
//       setCourses(coursesRes.data || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       toast.error('Failed to fetch data');
//       setSemesters([]);
//       setDepartments([]);
//       setCourses([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester({
//         _id: semester._id,
//         semester_name: semester.semester_name,
//         department_id: semester.department_id,
//         course_id: semester.course_id
//       });
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: '',
//         course_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: '',
//       course_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const payload = {
//         semester_name: currentSemester.semester_name,
//         department_id: currentSemester.department_id,
//         course_id: currentSemester.course_id
//       };

//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester._id, payload);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(payload);
//         toast.success('Semester created successfully');
//       }
//       handleCloseModal();
//       fetchData();
//     } catch (error) {
//       console.error('Error saving semester:', error);
//       toast.error('Failed to save semester');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting semester:', error);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (deptId) => {
//     const dept = departments.find(d => d._id === deptId);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button
//                 variant="primary"
//                 onClick={() => handleShowModal()}
//                 className="d-flex align-items-center gap-2"
//               >
//                 <FaPlus /> Add New Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Sem ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map((semester) => (
//                         <tr key={semester._id}>
//                           <td>{semester._id}</td>
//                           <td>{semester.semester_name}</td>
//                           <td>{getDepartmentName(semester.department_id)}</td>
//                           <td>
//                             <Button
//                               variant="outline-primary"
//                               size="sm"
//                               className="me-2 btn-action"
//                               onClick={() => handleShowModal(semester)}
//                             >
//                               <FaEdit />
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               className="btn-action"
//                               onClick={() => handleDelete(semester._id)}
//                             >
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="text-center">
//                           No semesters found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add New Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3" controlId="semesterName">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester"
//                 required
//                 disabled={submitLoading}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="departmentSelect">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//                 disabled={submitLoading}
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((department) => (
//                   <option key={department._id} value={department._id}>
//                     {department.departmentName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="courseSelect">
//               <Form.Label>Course</Form.Label>
//               <Form.Select
//                 name="course_id"
//                 value={currentSemester.course_id}
//                 onChange={handleInputChange}
//                 required
//                 disabled={submitLoading}
//               >
//                 <option value="">Select Course</option>
//                 {courses.map((course) => (
//                   <option key={course._id} value={course._id}>
//                     {course.courseName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal} disabled={submitLoading}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" disabled={submitLoading}>
//                 {isEditing ? 'Update' : 'Create'} Semester
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import courseService from '../../services/courseService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: '',
//     course_id: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [semRes, deptRes, courseRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments(),
//         courseService.getAllCourses()
//       ]);
//       setSemesters(semRes.data || []);
//       setDepartments(deptRes.data || []);
//       setCourses(courseRes || []);
//     } catch (err) {
//       console.error(err);
//       toast.error('Error fetching data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester({
//         _id: semester._id,
//         semester_name: semester.semester_name,
//         department_id: semester.department_id,
//         course_id: semester.course_id || ''
//       });
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: '',
//         course_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: '',
//       course_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const payload = {
//         semester_name: currentSemester.semester_name,
//         department_id: currentSemester.department_id,
//         course_id: currentSemester.course_id
//       };

//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester._id, payload);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(payload);
//         toast.success('Semester created successfully');
//       }

//       handleCloseModal();
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to save semester');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (id) => {
//     const dept = departments.find(d => d._id === id);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   const getCourseName = (id) => {
//     const course = courses.find(c => c._id === id);
//     return course ? course.courseName : 'N/A';
//   };

//   if (loading) return <Loader />;

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button onClick={() => handleShowModal()} variant="primary" className="d-flex align-items-center gap-2">
//                 <FaPlus /> Add Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Course</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map(sem => (
//                         <tr key={sem._id}>
//                           <td>{sem._id}</td>
//                           <td>{sem.semester_name}</td>
//                           <td>{getDepartmentName(sem.department_id)}</td>
//                           <td>{getCourseName(sem.course_id)}</td>
//                           <td>
//                             <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleShowModal(sem)}>
//                               <FaEdit />
//                             </Button>
//                             <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sem._id)}>
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="text-center">No semesters found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map(dept => (
//                   <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Course</Form.Label>
//               <Form.Select
//                 name="course_id"
//                 value={currentSemester.course_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Course</option>
//                 {Array.isArray(courses) && courses.map(course => (
//                   <option key={course._id} value={course._id}>{course.courseName}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
//               <Button variant="primary" type="submit" disabled={submitLoading}>
//                 {isEditing ? 'Update' : 'Create'}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// // src/pages/Semesters.jsx
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import courseService from '../../services/courseService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentSemester, setCurrentSemester] = useState({
//     semester_name: '',
//     department_id: '',
//     course_id: ''
//   });
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [semRes, deptRes, courseRes] = await Promise.all([
//         semesterService.getAllSemesters(),
//         departmentService.getAllDepartments(),
//         courseService.getAllCourses()
//       ]);

//       // Defensive extraction of semesters array
//       const semArray = semRes?.data || semRes || [];
//       setSemesters(Array.isArray(semArray) ? semArray : []);

//       const deptArray = deptRes?.data || deptRes || [];
//       setDepartments(Array.isArray(deptArray) ? deptArray : []);

//       const courseArray = courseRes?.data || courseRes || [];
//       setCourses(Array.isArray(courseArray) ? courseArray : []);
//     } catch (err) {
//       console.error(err);
//       toast.error('Error fetching data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester({
//         _id: semester._id,
//         semester_name: semester.semester_name,
//         department_id: semester.department_id,
//         course_id: semester.course_id || ''
//       });
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semester_name: '',
//         department_id: '',
//         course_id: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semester_name: '',
//       department_id: '',
//       course_id: ''
//     });
//     setIsEditing(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const payload = {
//         semester_name: currentSemester.semester_name,
//         department_id: currentSemester.department_id,
//         course_id: currentSemester.course_id
//       };

//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester._id, payload);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(payload);
//         toast.success('Semester created successfully');
//       }

//       handleCloseModal();
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to save semester');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (id) => {
//     const dept = departments.find(d => d._id === id);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   const getCourseName = (id) => {
//     const course = courses.find(c => c._id === id);
//     return course ? course.courseName : 'N/A';
//   };

//   if (loading) return <Loader />;

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button onClick={() => handleShowModal()} variant="primary" className="d-flex align-items-center gap-2">
//                 <FaPlus /> Add Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Semester</th>
//                       <th>Department</th>
//                       <th>Course</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map(sem => (
//                         <tr key={sem._id}>
//                           <td>{sem._id}</td>
//                           <td>{sem.semester_name}</td>
//                           <td>{getDepartmentName(sem.department_id)}</td>
//                           <td>{getCourseName(sem.course_id)}</td>
//                           <td>
//                             <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleShowModal(sem)}>
//                               <FaEdit />
//                             </Button>
//                             <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sem._id)}>
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="text-center">No semesters found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Semester Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="semester_name"
//                 value={currentSemester.semester_name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., First Semester"
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 name="department_id"
//                 value={currentSemester.department_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map(dept => (
//                   <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Course</Form.Label>
//               <Form.Select
//                 name="course_id"
//                 value={currentSemester.course_id}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Course</option>
//                 {Array.isArray(courses) && courses.map(course => (
//                   <option key={course._id} value={course._id}>{course.courseName}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <div className="d-flex justify-content-end gap-2">
//               <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
//               <Button variant="primary" type="submit" disabled={submitLoading}>
//                 {isEditing ? 'Update' : 'Create'}
//               </Button>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// // src/pages/Semesters.jsx
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import courseService from '../../services/courseService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
  
//   // Consistent field names with backend
//   const [currentSemester, setCurrentSemester] = useState({
//     semesterName: '',
//     departmentId: '',
//     course_id: '',
//     semesterNumber: '',
//     duration: 6,
//     startDate: '',
//     endDate: '',
//     description: ''
//   });
  
//   // Filters & Search
//   const [filters, setFilters] = useState({
//     search: '',
//     department: '',
//     page: 1,
//     limit: 10
//   });
  
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalSemesters: 0
//   });
  
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [semRes, deptRes, courseRes] = await Promise.all([
//         semesterService.getAllSemesters(filters),
//         departmentService.getAllDepartments(),
//         courseService.getAllCourses()
//       ]);

//       // Handle API response structure
//       if (semRes?.data) {
//         setSemesters(semRes.data.semesters || []);
//         setPagination(semRes.data.pagination || {});
//       } else {
//         setSemesters(Array.isArray(semRes) ? semRes : []);
//       }

//       const deptArray = deptRes?.data || deptRes || [];
//       setDepartments(Array.isArray(deptArray) ? deptArray : []);

//       const courseArray = courseRes?.data || courseRes || [];
//       setCourses(Array.isArray(courseArray) ? courseArray : []);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Error fetching data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       department: '',
//       page: 1,
//       limit: 10
//     });
//     toast.info('Filters cleared');
//   };

//   // Filter change handlers
//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value,
//       page: 1 // Reset to first page when filters change
//     }));
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester({
//         _id: semester._id,
//         semesterName: semester.semesterName,
//         departmentId: semester.departmentId,
//         course_id: semester.course_id || '',
//         semesterNumber: semester.semesterNumber || '',
//         duration: semester.duration || 6,
//         startDate: semester.startDate ? semester.startDate.split('T')[0] : '',
//         endDate: semester.endDate ? semester.endDate.split('T')[0] : '',
//         description: semester.description || ''
//       });
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semesterName: '',
//         departmentId: '',
//         course_id: '',
//         semesterNumber: '',
//         duration: 6,
//         startDate: '',
//         endDate: '',
//         description: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semesterName: '',
//       departmentId: '',
//       course_id: '',
//       semesterNumber: '',
//       duration: 6,
//       startDate: '',
//       endDate: '',
//       description: ''
//     });
//     setIsEditing(false);
//   };

//   // Reset form data
//   const handleResetForm = () => {
//     setCurrentSemester({
//       semesterName: '',
//       departmentId: '',
//       course_id: '',
//       semesterNumber: '',
//       duration: 6,
//       startDate: '',
//       endDate: '',
//       description: ''
//     });
//     toast.info('Form cleared');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const payload = {
//         semesterName: currentSemester.semesterName,
//         departmentId: currentSemester.departmentId,
//         course_id: currentSemester.course_id,
//         semesterNumber: parseInt(currentSemester.semesterNumber),
//         duration: parseInt(currentSemester.duration),
//         startDate: currentSemester.startDate,
//         endDate: currentSemester.endDate,
//         description: currentSemester.description
//       };

//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester._id, payload);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(payload);
//         toast.success('Semester created successfully');
//       }

//       handleCloseModal();
//       fetchData();
//     } catch (err) {
//       console.error('Error saving semester:', err);
//       toast.error('Failed to save semester');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (err) {
//         console.error('Error deleting semester:', err);
//         toast.error('Failed to delete semester');
//       }
//     }
//   };

//   const getDepartmentName = (id) => {
//     const dept = departments.find(d => d._id === id);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   const getCourseName = (id) => {
//     const course = courses.find(c => c._id === id);
//     return course ? course.courseName : 'N/A';
//   };

//   if (loading) return <Loader />;

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button onClick={() => handleShowModal()} variant="primary" className="d-flex align-items-center gap-2">
//                 <FaPlus /> Add Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               {/* Filters Section */}
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <InputGroup>
//                     <FormControl
//                       placeholder="Search semesters..."
//                       value={filters.search}
//                       onChange={(e) => handleFilterChange('search', e.target.value)}
//                     />
//                     <InputGroup.Text>
//                       <FaSearch />
//                     </InputGroup.Text>
//                   </InputGroup>
//                 </Col>
//                 <Col md={3}>
//                   <Form.Select
//                     value={filters.department}
//                     onChange={(e) => handleFilterChange('department', e.target.value)}
//                   >
//                     <option value="">All Departments</option>
//                     {departments.map(dept => (
//                       <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//                 <Col md={2}>
//                   <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
//                     <FaTimes /> Reset Filters
//                   </Button>
//                 </Col>
//               </Row>

//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Semester Name</th>
//                       <th>Department</th>
//                       <th>Course</th>
//                       <th>Semester No.</th>
//                       <th>Duration</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map(sem => (
//                         <tr key={sem._id}>
//                           <td>{sem.semesterName}</td>
//                           <td>{getDepartmentName(sem.departmentId)}</td>
//                           <td>{getCourseName(sem.course_id)}</td>
//                           <td>{sem.semesterNumber}</td>
//                           <td>{sem.duration} months</td>
//                           <td>
//                             <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleShowModal(sem)}>
//                               <FaEdit />
//                             </Button>
//                             <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sem._id)}>
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="text-center">No semesters found</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <div className="d-flex justify-content-center mt-3">
//                   <Button
//                     variant="outline-primary"
//                     disabled={!pagination.hasPrevPage}
//                     onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
//                     className="me-2"
//                   >
//                     Previous
//                   </Button>
//                   <span className="align-self-center mx-3">
//                     Page {pagination.currentPage} of {pagination.totalPages}
//                   </span>
//                   <Button
//                     variant="outline-primary"
//                     disabled={!pagination.hasNextPage}
//                     onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Semester Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="semesterName"
//                     value={currentSemester.semesterName}
//                     onChange={handleInputChange}
//                     placeholder="e.g., First Semester"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Semester Number</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="semesterNumber"
//                     value={currentSemester.semesterNumber}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 1"
//                     min="1"
//                     max="8"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Department</Form.Label>
//                   <Form.Select
//                     name="departmentId"
//                     value={currentSemester.departmentId}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map(dept => (
//                       <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Course</Form.Label>
//                   <Form.Select
//                     name="course_id"
//                     value={currentSemester.course_id}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Select Course</option>
//                     {Array.isArray(courses) && courses.map(course => (
//                       <option key={course._id} value={course._id}>{course.courseName}</option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Duration (months)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="duration"
//                     value={currentSemester.duration}
//                     onChange={handleInputChange}
//                     min="1"
//                     max="12"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Start Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="startDate"
//                     value={currentSemester.startDate}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>End Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="endDate"
//                     value={currentSemester.endDate}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={currentSemester.description}
//                 onChange={handleInputChange}
//                 placeholder="Optional description..."
//               />
//             </Form.Group>

//             <div className="d-flex justify-content-between">
//               <Button variant="warning" type="button" onClick={handleResetForm}>
//                 <FaTimes /> Reset Form
//               </Button>
//               <div className="d-flex gap-2">
//                 <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
//                 <Button variant="primary" type="submit" disabled={submitLoading}>
//                   {submitLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
//                 </Button>
//               </div>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// // src/pages/Semesters.jsx
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { semesterService } from '../../services/semesterService';
// import departmentService from '../../services/departmentService';
// import courseService from '../../services/courseService';
// import Loader from '../../components/Common/LoadingSpinner';

// const Semesters = () => {
//   const [semesters, setSemesters] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
  
//   // Consistent field names with backend
//   const [currentSemester, setCurrentSemester] = useState({
//     semesterName: '',
//     departmentId: '',
//     course_id: '',
//     semesterNumber: '',
//     duration: 6,
//     startDate: '',
//     endDate: '',
//     description: ''
//   });
  
//   // Filters & Search
//   const [filters, setFilters] = useState({
//     search: '',
//     department: '',
//     page: 1,
//     limit: 10
//   });
  
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalSemesters: 0
//   });
  
//   const [submitLoading, setSubmitLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch data with proper error handling for each service
//       const fetchPromises = [
//         semesterService.getAllSemesters(filters).catch(err => {
//           console.error('Error fetching semesters:', err);
//           return { data: { semesters: [], pagination: {} } };
//         }),
//         departmentService.getAllDepartments().catch(err => {
//           console.error('Error fetching departments:', err);
//           return { departments: [] };
//         }),
//         courseService.getAllCourses().catch(err => {
//           console.error('Error fetching courses:', err);
//           return [];
//         })
//       ];

//       const [semRes, deptRes, courseRes] = await Promise.all(fetchPromises);

//       // Handle semester response
//       if (semRes?.data) {
//         setSemesters(semRes.data.semesters || []);
//         setPagination(semRes.data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalSemesters: 0
//         });
//       } else {
//         setSemesters(Array.isArray(semRes) ? semRes : []);
//       }

//       // Handle department response - departmentService returns nested structure
//       let departmentArray = [];
//       if (deptRes?.departments) {
//         departmentArray = deptRes.departments;
//       } else if (deptRes?.data?.departments) {
//         departmentArray = deptRes.data.departments;
//       } else if (Array.isArray(deptRes?.data)) {
//         departmentArray = deptRes.data;
//       } else if (Array.isArray(deptRes)) {
//         departmentArray = deptRes;
//       }
      
//       setDepartments(Array.isArray(departmentArray) ? departmentArray : []);

//       // Handle course response - courseService returns array directly
//       const courseArray = Array.isArray(courseRes) ? courseRes : 
//                          courseRes?.data?.courses || 
//                          courseRes?.courses || 
//                          [];
      
//       setCourses(Array.isArray(courseArray) ? courseArray : []);

//       console.log('Fetched data:', {
//         semesters: Array.isArray(semRes?.data?.semesters) ? semRes.data.semesters.length : 0,
//         departments: departmentArray.length,
//         courses: courseArray.length
//       });

//     } catch (err) {
//       console.error('Error fetching data:', err);
//       toast.error('Error fetching data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset all filters
//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       department: '',
//       page: 1,
//       limit: 10
//     });
//     toast.info('Filters cleared');
//   };

//   // Filter change handlers
//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value,
//       page: 1 // Reset to first page when filters change
//     }));
//   };

//   const handleShowModal = (semester = null) => {
//     if (semester) {
//       setCurrentSemester({
//         _id: semester._id,
//         semesterName: semester.semesterName || '',
//         departmentId: semester.departmentId || '',
//         course_id: semester.course_id || '',
//         semesterNumber: semester.semesterNumber || '',
//         duration: semester.duration || 6,
//         startDate: semester.startDate ? semester.startDate.split('T')[0] : '',
//         endDate: semester.endDate ? semester.endDate.split('T')[0] : '',
//         description: semester.description || ''
//       });
//       setIsEditing(true);
//     } else {
//       setCurrentSemester({
//         semesterName: '',
//         departmentId: '',
//         course_id: '',
//         semesterNumber: '',
//         duration: 6,
//         startDate: '',
//         endDate: '',
//         description: ''
//       });
//       setIsEditing(false);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setCurrentSemester({
//       semesterName: '',
//       departmentId: '',
//       course_id: '',
//       semesterNumber: '',
//       duration: 6,
//       startDate: '',
//       endDate: '',
//       description: ''
//     });
//     setIsEditing(false);
//   };

//   // Reset form data
//   const handleResetForm = () => {
//     setCurrentSemester({
//       semesterName: '',
//       departmentId: '',
//       course_id: '',
//       semesterNumber: '',
//       duration: 6,
//       startDate: '',
//       endDate: '',
//       description: ''
//     });
//     toast.info('Form cleared');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentSemester(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!currentSemester.semesterName.trim()) {
//       toast.error('Semester name is required');
//       return;
//     }
    
//     if (!currentSemester.departmentId) {
//       toast.error('Please select a department');
//       return;
//     }
    
//     if (!currentSemester.course_id) {
//       toast.error('Please select a course');
//       return;
//     }
    
//     if (!currentSemester.semesterNumber) {
//       toast.error('Semester number is required');
//       return;
//     }

//     setSubmitLoading(true);
//     try {
//       const payload = {
//         semesterName: currentSemester.semesterName.trim(),
//         departmentId: currentSemester.departmentId,
//         course_id: currentSemester.course_id,
//         semesterNumber: parseInt(currentSemester.semesterNumber),
//         duration: parseInt(currentSemester.duration),
//         startDate: currentSemester.startDate || undefined,
//         endDate: currentSemester.endDate || undefined,
//         description: currentSemester.description.trim() || undefined
//       };

//       // Remove undefined values
//       Object.keys(payload).forEach(key => {
//         if (payload[key] === undefined || payload[key] === '') {
//           delete payload[key];
//         }
//       });

//       if (isEditing) {
//         await semesterService.updateSemester(currentSemester._id, payload);
//         toast.success('Semester updated successfully');
//       } else {
//         await semesterService.createSemester(payload);
//         toast.success('Semester created successfully');
//       }

//       handleCloseModal();
//       fetchData();
//     } catch (err) {
//       console.error('Error saving semester:', err);
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to save semester';
//       toast.error(errorMessage);
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this semester?')) {
//       try {
//         await semesterService.deleteSemester(id);
//         toast.success('Semester deleted successfully');
//         fetchData();
//       } catch (err) {
//         console.error('Error deleting semester:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to delete semester';
//         toast.error(errorMessage);
//       }
//     }
//   };

//   const getDepartmentName = (id) => {
//     if (!id) return 'N/A';
//     const dept = departments.find(d => d._id === id);
//     return dept ? dept.departmentName : 'N/A';
//   };

//   const getCourseName = (id) => {
//     if (!id) return 'N/A';
//     const course = courses.find(c => c._id === id);
//     return course ? course.courseName : 'N/A';
//   };

//   if (loading) return <Loader />;

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header className="d-flex justify-content-between align-items-center">
//               <h4 className="mb-0">Semesters Management</h4>
//               <Button onClick={() => handleShowModal()} variant="primary" className="d-flex align-items-center gap-2">
//                 <FaPlus /> Add Semester
//               </Button>
//             </Card.Header>
//             <Card.Body>
//               {/* Filters Section */}
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <InputGroup>
//                     <FormControl
//                       placeholder="Search semesters..."
//                       value={filters.search}
//                       onChange={(e) => handleFilterChange('search', e.target.value)}
//                     />
//                     <InputGroup.Text>
//                       <FaSearch />
//                     </InputGroup.Text>
//                   </InputGroup>
//                 </Col>
//                 <Col md={3}>
//                   <Form.Select
//                     value={filters.department}
//                     onChange={(e) => handleFilterChange('department', e.target.value)}
//                   >
//                     <option value="">All Departments</option>
//                     {departments.map(dept => (
//                       <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//                 <Col md={2}>
//                   <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
//                     <FaTimes /> Reset Filters
//                   </Button>
//                 </Col>
//                 <Col md={3}>
//                   <div className="text-muted small">
//                     Departments: {departments.length} | Courses: {courses.length}
//                   </div>
//                 </Col>
//               </Row>

//               <div className="table-responsive">
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Semester Name</th>
//                       <th>Department</th>
//                       <th>Course</th>
//                       <th>Semester No.</th>
//                       <th>Duration</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(semesters) && semesters.length > 0 ? (
//                       semesters.map(sem => (
//                         <tr key={sem._id}>
//                           <td>{sem.semesterName}</td>
//                           <td>{getDepartmentName(sem.departmentId)}</td>
//                           <td>{getCourseName(sem.course_id)}</td>
//                           <td>{sem.semesterNumber}</td>
//                           <td>{sem.duration} months</td>
//                           <td>
//                             <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleShowModal(sem)}>
//                               <FaEdit />
//                             </Button>
//                             <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sem._id)}>
//                               <FaTrash />
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="6" className="text-center">
//                           {loading ? 'Loading...' : 'No semesters found'}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <div className="d-flex justify-content-center mt-3">
//                   <Button
//                     variant="outline-primary"
//                     disabled={!pagination.hasPrevPage}
//                     onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
//                     className="me-2"
//                   >
//                     Previous
//                   </Button>
//                   <span className="align-self-center mx-3">
//                     Page {pagination.currentPage} of {pagination.totalPages}
//                   </span>
//                   <Button
//                     variant="outline-primary"
//                     disabled={!pagination.hasNextPage}
//                     onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Modal show={showModal} onHide={handleCloseModal} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditing ? 'Edit Semester' : 'Add Semester'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Semester Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="semesterName"
//                     value={currentSemester.semesterName}
//                     onChange={handleInputChange}
//                     placeholder="e.g., First Semester"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Semester Number</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="semesterNumber"
//                     value={currentSemester.semesterNumber}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 1"
//                     min="1"
//                     max="8"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Department ({departments.length} available)</Form.Label>
//                   <Form.Select
//                     name="departmentId"
//                     value={currentSemester.departmentId}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Select Department</option>
//                     {departments.map(dept => (
//                       <option key={dept._id} value={dept._id}>
//                         {dept.departmentName} {dept.departmentCode ? `(${dept.departmentCode})` : ''}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   {departments.length === 0 && (
//                     <Form.Text className="text-danger">
//                       No departments found. Please add departments first.
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Course ({courses.length} available)</Form.Label>
//                   <Form.Select
//                     name="course_id"
//                     value={currentSemester.course_id}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Select Course</option>
//                     {Array.isArray(courses) && courses.map(course => (
//                       <option key={course._id} value={course._id}>
//                         {course.courseName} {course.courseCode ? `(${course.courseCode})` : ''}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   {courses.length === 0 && (
//                     <Form.Text className="text-danger">
//                       No courses found. Please add courses first.
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Duration (months)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="duration"
//                     value={currentSemester.duration}
//                     onChange={handleInputChange}
//                     min="1"
//                     max="12"
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Start Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="startDate"
//                     value={currentSemester.startDate}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>End Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="endDate"
//                     value={currentSemester.endDate}
//                     onChange={handleInputChange}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={currentSemester.description}
//                 onChange={handleInputChange}
//                 placeholder="Optional description..."
//               />
//             </Form.Group>

//             <div className="d-flex justify-content-between">
//               <Button variant="warning" type="button" onClick={handleResetForm}>
//                 <FaTimes /> Reset Form
//               </Button>
//               <div className="d-flex gap-2">
//                 <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
//                 <Button variant="primary" type="submit" disabled={submitLoading}>
//                   {submitLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
//                 </Button>
//               </div>
//             </div>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default Semesters;


// src/pages/Semesters.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { semesterService } from '../../services/semesterService';
import departmentService from '../../services/departmentService';
import courseService from '../../services/courseService';
import Loader from '../../components/Common/LoadingSpinner';

const Semesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Consistent field names with backend
  const [currentSemester, setCurrentSemester] = useState({
    semesterName: '',
    departmentId: '',
    course_id: '',
    semesterNumber: '',
    duration: 6,
    startDate: '',
    endDate: '',
    description: ''
  });
  
  // Filters & Search
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    page: 1,
    limit: 10
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSemesters: 0
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch data with proper error handling for each service
      const fetchPromises = [
        semesterService.getAllSemesters(filters).catch(err => {
          console.error('Error fetching semesters:', err);
          return { data: { semesters: [], pagination: {} } };
        }),
        departmentService.getAllDepartments().catch(err => {
          console.error('Error fetching departments:', err);
          return { departments: [] };
        }),
        courseService.getAllCourses().catch(err => {
          console.error('Error fetching courses:', err);
          return [];
        })
      ];

      const [semRes, deptRes, courseRes] = await Promise.all(fetchPromises);

      // Handle semester response
      if (semRes?.data) {
        setSemesters(semRes.data.semesters || []);
        setPagination(semRes.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalSemesters: 0
        });
      } else {
        setSemesters(Array.isArray(semRes) ? semRes : []);
      }

      // Handle department response - departmentService returns nested structure
      let departmentArray = [];
      if (deptRes?.departments) {
        departmentArray = deptRes.departments;
      } else if (deptRes?.data?.departments) {
        departmentArray = deptRes.data.departments;
      } else if (Array.isArray(deptRes?.data)) {
        departmentArray = deptRes.data;
      } else if (Array.isArray(deptRes)) {
        departmentArray = deptRes;
      }
      
      setDepartments(Array.isArray(departmentArray) ? departmentArray : []);

      // Handle course response - courseService returns array directly
      const courseArray = Array.isArray(courseRes) ? courseRes : 
                         courseRes?.data?.courses || 
                         courseRes?.courses || 
                         [];
      
      setCourses(Array.isArray(courseArray) ? courseArray : []);

      console.log('Fetched data:', {
        semesters: Array.isArray(semRes?.data?.semesters) ? semRes.data.semesters.length : 0,
        departments: departmentArray.length,
        courses: courseArray.length
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: '',
      page: 1,
      limit: 10
    });
    toast.info('Filters cleared');
  };

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleShowModal = (semester = null) => {
    if (semester) {
      setCurrentSemester({
        _id: semester._id,
        semesterName: semester.semesterName || '',
        departmentId: semester.departmentId || '',
        course_id: semester.course_id || '',
        semesterNumber: semester.semesterNumber || '',
        duration: semester.duration || 6,
        startDate: semester.startDate ? semester.startDate.split('T')[0] : '',
        endDate: semester.endDate ? semester.endDate.split('T')[0] : '',
        description: semester.description || ''
      });
      setIsEditing(true);
    } else {
      setCurrentSemester({
        semesterName: '',
        departmentId: '',
        course_id: '',
        semesterNumber: '',
        duration: 6,
        startDate: '',
        endDate: '',
        description: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSemester({
      semesterName: '',
      departmentId: '',
      course_id: '',
      semesterNumber: '',
      duration: 6,
      startDate: '',
      endDate: '',
      description: ''
    });
    setIsEditing(false);
  };

  // Reset form data
  const handleResetForm = () => {
    setCurrentSemester({
      semesterName: '',
      departmentId: '',
      course_id: '',
      semesterNumber: '',
      duration: 6,
      startDate: '',
      endDate: '',
      description: ''
    });
    toast.info('Form cleared');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSemester(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation - removed course_id requirement
    if (!currentSemester.semesterName.trim()) {
      toast.error('Semester name is required');
      return;
    }
    
    if (!currentSemester.departmentId) {
      toast.error('Please select a department');
      return;
    }
    
    if (!currentSemester.semesterNumber) {
      toast.error('Semester number is required');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        semesterName: currentSemester.semesterName.trim(),
        departmentId: currentSemester.departmentId,
        semesterNumber: parseInt(currentSemester.semesterNumber),
        duration: parseInt(currentSemester.duration),
        startDate: currentSemester.startDate || undefined,
        endDate: currentSemester.endDate || undefined,
        description: currentSemester.description.trim() || undefined
      };

      // Only include course_id if it's selected
      if (currentSemester.course_id) {
        payload.course_id = currentSemester.course_id;
      }

      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });

      if (isEditing) {
        await semesterService.updateSemester(currentSemester._id, payload);
        toast.success('Semester updated successfully');
      } else {
        await semesterService.createSemester(payload);
        toast.success('Semester created successfully');
      }

      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error('Error saving semester:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save semester';
      toast.error(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await semesterService.deleteSemester(id);
        toast.success('Semester deleted successfully');
        fetchData();
      } catch (err) {
        console.error('Error deleting semester:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete semester';
        toast.error(errorMessage);
      }
    }
  };

  const getDepartmentName = (id) => {
    if (!id) return 'N/A';
    const dept = departments.find(d => d._id === id);
    return dept ? dept.departmentName : 'N/A';
  };

  const getCourseName = (id) => {
    if (!id) return 'N/A';
    const course = courses.find(c => c._id === id);
    return course ? course.courseName : 'N/A';
  };

  if (loading) return <Loader />;

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center mt-5">
              <h4 className="mb-0">Semesters Management</h4>
              <Button onClick={() => handleShowModal()} variant="primary" className="d-flex align-items-center gap-2">
                <FaPlus /> Add Semester
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Filters Section */}
              <Row className="mb-3">
                <Col md={4}>
                  <InputGroup>
                    <FormControl
                      placeholder="Search semesters..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.departmentName}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button variant="outline-secondary" onClick={handleResetFilters} className="w-100">
                    <FaTimes /> Reset Filters
                  </Button>
                </Col>
                <Col md={3}>
                  <div className="text-muted small">
                    Departments: {departments.length} | Courses: {courses.length}
                  </div>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Semester Name</th>
                      <th>Department</th>
                      <th>Course</th>
                      <th>Semester No.</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(semesters) && semesters.length > 0 ? (
                      semesters.map(sem => (
                        <tr key={sem._id}>
                          <td>{sem.semesterName}</td>
                          <td>{getDepartmentName(sem.departmentId)}</td>
                          <td>{getCourseName(sem.course_id)}</td>
                          <td>{sem.semesterNumber}</td>
                          <td>{sem.duration} months</td>
                          <td>
                            <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleShowModal(sem)}>
                              <FaEdit />
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sem._id)}>
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          {loading ? 'Loading...' : 'No semesters found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Button
                    variant="outline-primary"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                    className="me-2"
                  >
                    Previous
                  </Button>
                  <span className="align-self-center mx-3">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Semester' : 'Add Semester'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="semesterName"
                    value={currentSemester.semesterName}
                    onChange={handleInputChange}
                    placeholder="e.g., First Semester"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester Number</Form.Label>
                  <Form.Control
                    type="number"
                    name="semesterNumber"
                    value={currentSemester.semesterNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 1"
                    min="1"
                    max="8"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department ({departments.length} available)</Form.Label>
                  <Form.Select
                    name="departmentId"
                    value={currentSemester.departmentId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>
                        {dept.departmentName} {dept.departmentCode ? `(${dept.departmentCode})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                  {departments.length === 0 && (
                    <Form.Text className="text-danger">
                      No departments found. Please add departments first.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course ({courses.length} available) - Optional</Form.Label>
                  <Form.Select
                    name="course_id"
                    value={currentSemester.course_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Course (Optional)</option>
                    {Array.isArray(courses) && courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.courseName} {course.courseCode ? `(${course.courseCode})` : ''}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Course selection is optional. You can create a semester without selecting a specific course.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (months)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={currentSemester.duration}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={currentSemester.startDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={currentSemester.endDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentSemester.description}
                onChange={handleInputChange}
                placeholder="Optional description..."
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="warning" type="button" onClick={handleResetForm}>
                <FaTimes /> Reset Form
              </Button>
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={submitLoading}>
                  {submitLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Semesters;