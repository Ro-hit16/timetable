// import Department from '../models/department.model.js';

// // Add a new department
// export const addDepartment = async (req, res) => {
//     const { departmentName } = req.body;

//     try {
//         const existingDepartment = await Department.findOne({ departmentName });
//         if (existingDepartment) {
//             return res.status(400).json({ message: 'This department already exists' });
//         }

//         const newDepartment = new Department({ departmentName });
//         await newDepartment.save();
//         res.status(201).json({ message: 'Congrats! Your data has been saved!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error saving department', error });
//     }
// };

// // Get departments for AJAX
// export const getDepartments = async (req, res) => {
//     const { id } = req.params; // from /ajax/:id
//     try {
//         const departments = await Department.find({ department_id: id });
//         res.status(200).json(departments);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching departments', error });
//     }
// };


// controllers/departments.controller.js

// import Department from '../models/department.model.js';

// // Get all departments with optional pagination and filters
// export const getAllDepartments = async (req, res) => {
//   console.log('TEST_3: getAllDepartments called');

//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = parseInt(req.query.skip) || 0;
//     console.log(`TEST_4: limit=${limit}, skip=${skip}`);

//     const departments = await Department.find()
//       .skip(skip)
//       .limit(limit);

//     console.log(`TEST_5: departments found: ${departments.length}`);

//     res.status(200).json(departments);
//   } catch (error) {
//     console.error('TEST_6: Error in getAllDepartments:', error);
//     res.status(500).json({ message: 'Error fetching departments', error });
//   }
// };



// // Get department by ID
// export const getDepartmentById = async (req, res) => {
//   try {
//     const department = await Department.findById(req.params.id);

//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     res.status(200).json(department);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching department', error });
//   }
// };

// // Create a new department
// // export const createDepartment = async (req, res) => {
// //   const { departmentName } = req.body;

// //   try {
// //     const existingDepartment = await Department.findOne({ departmentName });

// //     if (existingDepartment) {
// //       return res.status(400).json({ message: 'This department already exists' });
// //     }

// //     const newDepartment = new Department({ departmentName });
// //     await newDepartment.save();

// //     res.status(201).json({ message: 'Department created successfully', department: newDepartment });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error creating department', error });
// //   }
// // };

// // Add department (alternative logic if needed)
// export const addDepartment = async (req, res) => {
//   const { departmentName } = req.body;

//   try {
//     const existingDepartment = await Department.findOne({ departmentName });
//     if (existingDepartment) {
//       return res.status(400).json({ message: 'This department already exists' });
//     }

//     const newDepartment = new Department({ departmentName });
//     await newDepartment.save();

//     res.status(201).json({ message: 'Congrats! Your data has been saved!', department: newDepartment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving department', error });
//   }
// };

// // Update department by ID
// export const updateDepartment = async (req, res) => {
//   const { departmentName } = req.body;

//   try {
//     const department = await Department.findById(req.params.id);
//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     // Check for duplicate department name if changed
//     if (department.departmentName !== departmentName) {
//       const duplicate = await Department.findOne({ departmentName });
//       if (duplicate) {
//         return res.status(400).json({ message: 'Department name already exists' });
//       }
//     }

//     department.departmentName = departmentName || department.departmentName;

//     await department.save();

//     res.status(200).json({ message: 'Department updated successfully', department });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating department', error });
//   }
// };

// // Soft delete department by ID
// export const deleteDepartment = async (req, res) => {
//   try {
//     const department = await Department.findById(req.params.id);
//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     // Assuming soft delete means setting an `active` flag false
//     department.active = false;
//     await department.save();

//     res.status(200).json({ message: 'Department deleted (soft delete) successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting department', error });
//   }
// };

// // Get active departments only
// export const getActiveDepartments = async (req, res) => {
//   try {
//     const departments = await Department.find({ active: true });
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching active departments', error });
//   }
// };

// // Get department stats (example: total count)
// export const getDepartmentStats = async (req, res) => {
//   try {
//     const totalDepartments = await Department.countDocuments();
//     const activeDepartments = await Department.countDocuments({ active: true });

//     res.status(200).json({
//       totalDepartments,
//       activeDepartments,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching department stats', error });
//   }
// };

// // Get departments for AJAX or frontend by some param (example using department_id)
// export const getDepartments = async (req, res) => {
//   const { id } = req.params; // from /ajax/:id

//   try {
//     // Adjust the query depending on your schema; assuming department_id field exists
//     const departments = await Department.find({ department_id: id });
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching departments', error });
//   }
// };

// export const createDepartment = async (req, res) => {
//   const { name } = req.body; // ✅ changed from departmentName to name

//   try {
//     const existingDepartment = await Department.findOne({ departmentName: name });

//     if (existingDepartment) {
//       return res.status(400).json({ message: 'This department already exists' });
//     }

//     const newDepartment = new Department({ departmentName: name }); // still stored as departmentName in DB
//     await newDepartment.save();

//     res.status(201).json({ message: 'Department created successfully', department: newDepartment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating department', error });
//   }
// };

// import Department from '../models/department.model.js';

// // Get all departments with optional pagination and filters
// export const getAllDepartments = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = parseInt(req.query.skip) || 0;

//     const departments = await Department.find()
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching departments', error });
//   }
// };

// // Get department by ID
// export const getDepartmentById = async (req, res) => {
//   try {
//     const department = await Department.findById(req.params.id)
//       .populate('hodDetails', 'name email');

//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     res.status(200).json(department);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching department', error });
//   }
// };

// // Create a new department
// export const createDepartment = async (req, res) => {
//   const {
//     departmentName,
//     departmentCode,
//     description,
//     establishedYear,
//     headOfDepartment,
//     contactEmail,
//     contactPhone,
//   } = req.body;

//   try {
//     const existing = await Department.findOne({
//       $or: [
//         { departmentName },
//         { departmentCode: departmentCode.toUpperCase() }
//       ]
//     });

//     if (existing) {
//       return res.status(400).json({ message: 'Department name or code already exists' });
//     }

//     const newDepartment = new Department({
//       departmentName,
//       departmentCode,
//       description,
//       establishedYear,
//       headOfDepartment,
//       contactEmail,
//       contactPhone
//     });

//     await newDepartment.save();
//     res.status(201).json({ message: 'Department created successfully', department: newDepartment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating department', error });
//   }
// };

// // Update department
// export const updateDepartment = async (req, res) => {
//   const updates = req.body;

//   try {
//     const department = await Department.findById(req.params.id);
//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     if (updates.departmentCode && updates.departmentCode !== department.departmentCode) {
//       const duplicate = await Department.findOne({ departmentCode: updates.departmentCode.toUpperCase() });
//       if (duplicate) {
//         return res.status(400).json({ message: 'Department code already exists' });
//       }
//     }

//     Object.assign(department, updates);
//     await department.save();

//     res.status(200).json({ message: 'Department updated successfully', department });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating department', error });
//   }
// };

// // Soft delete
// export const deleteDepartment = async (req, res) => {
//   try {
//     const department = await Department.findById(req.params.id);
//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     department.isActive = false;
//     await department.save();

//     res.status(200).json({ message: 'Department deleted (soft)' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting department', error });
//   }
// };

// // Get only active departments
// export const getActiveDepartments = async (req, res) => {
//   try {
//     const departments = await Department.findActiveDepartments();
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching active departments', error });
//   }
// };

// // Get department statistics
// export const getDepartmentStats = async (req, res) => {
//   try {
//     const total = await Department.countDocuments();
//     const active = await Department.countDocuments({ isActive: true });

//     res.status(200).json({ totalDepartments: total, activeDepartments: active });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching stats', error });
//   }
// };

// // AJAX-style department fetch (if required)
// export const getDepartments = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const departments = await Department.find({ department_id: id });
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching departments', error });
//   }
// };


// // controllers/departments.controller.js
// import Department from '../models/department.model.js';

// // Get all departments with optional pagination and filters
// export const getAllDepartments = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = parseInt(req.query.skip) || 0;

//     const departments = await Department.find()
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching departments', error });
//   }
// };

// // Get department by ID
// export const getDepartmentById = async (req, res) => {
//   try {
//     const department = await Department.findById(req.params.id)
//       .populate('hodDetails', 'name email');

//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     res.status(200).json(department);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching department', error });
//   }
// };

// // Create a new department
// export const createDepartment = async (req, res) => {
//   const {
//     departmentName,
//     departmentCode,
//     description,
//     establishedYear,
//     headOfDepartment,
//     contactEmail,
//     contactPhone,
//   } = req.body;

//   try {
//     const existing = await Department.findOne({
//       $or: [
//         { departmentName },
//         { departmentCode: departmentCode.toUpperCase() }
//       ]
//     });

//     if (existing) {
//       return res.status(400).json({ message: 'Department name or code already exists' });
//     }

//     const newDepartment = new Department({
//       departmentName,
//       departmentCode,
//       description,
//       establishedYear,
//       headOfDepartment,
//       contactEmail,
//       contactPhone
//     });

//     await newDepartment.save();
//     res.status(201).json({ message: 'Department created successfully', department: newDepartment });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating department', error });
//   }
// };

// // Update department
// export const updateDepartment = async (req, res) => {
//   const updates = req.body;

//   try {
//     const department = await Department.findById(req.params.id);
//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     if (updates.departmentCode && updates.departmentCode !== department.departmentCode) {
//       const duplicate = await Department.findOne({ departmentCode: updates.departmentCode.toUpperCase() });
//       if (duplicate) {
//         return res.status(400).json({ message: 'Department code already exists' });
//       }
//     }

//     Object.assign(department, updates);
//     await department.save();

//     res.status(200).json({ message: 'Department updated successfully', department });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating department', error });
//   }
// };

// // Soft delete
// export const deleteDepartment = async (req, res) => {
//   try {
//     const department = await Department.findById(req.params.id);
//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     department.isActive = false;
//     await department.save();

//     res.status(200).json({ message: 'Department deleted (soft)' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting department', error });
//   }
// };

// // Get only active departments
// export const getActiveDepartments = async (req, res) => {
//   try {
//     const departments = await Department.findActiveDepartments();
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching active departments', error });
//   }
// };

// // Get department statistics
// export const getDepartmentStats = async (req, res) => {
//   try {
//     const total = await Department.countDocuments();
//     const active = await Department.countDocuments({ isActive: true });

//     res.status(200).json({ totalDepartments: total, activeDepartments: active });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching stats', error });
//   }
// };

// // Get departments by optional id for AJAX-style fetch
// export const getDepartments = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const query = id ? { _id: id } : {};
//     const departments = await Department.find(query);
//     res.status(200).json(departments);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching departments', error });
//   }
// };

// controllers/departments.controller.js
import Department from '../models/department.model.js';

// Get all departments with optional pagination, filters, and search
export const getAllDepartments = async (req, res) => {
  try {
    const { 
      limit = 10, 
      skip = 0, 
      search = '', 
      isActive = 'true',
      sortBy = 'departmentName',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Active filter
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }
    
    // Search functionality
    if (search.trim()) {
      filter.$or = [
        { departmentName: { $regex: search, $options: 'i' } },
        { departmentCode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const departments = await Department.find(filter)
      .populate('hodDetails', 'name email')
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Department.countDocuments(filter);

    res.status(200).json({
      departments,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hodDetails', 'name email contactPhone')
      .populate('teachers', 'name email subject')
      .populate('students', 'name email rollNumber');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Get related counts
    const stats = {
      teacherCount: await department.getTeacherCount(),
      studentCount: await department.getStudentCount(),
      semesterCount: await department.getSemesterCount(),
      subjectCount: await department.getSubjectCount()
    };

    res.status(200).json({ ...department.toObject(), stats });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Error fetching department', error: error.message });
  }
};

// Create a new department
export const createDepartment = async (req, res) => {
  const {
    departmentName,
    departmentCode,
    description,
    establishedYear,
    headOfDepartment,
    contactEmail,
    contactPhone,
  } = req.body;

  try {
    // Check for existing department
    const existing = await Department.findOne({
      $or: [
        { departmentName: { $regex: `^${departmentName}$`, $options: 'i' } },
        { departmentCode: departmentCode.toUpperCase() }
      ]
    });

    if (existing) {
      return res.status(400).json({ 
        message: 'Department name or code already exists',
        field: existing.departmentName.toLowerCase() === departmentName.toLowerCase() ? 'departmentName' : 'departmentCode'
      });
    }

    const newDepartment = new Department({
      departmentName: departmentName.trim(),
      departmentCode: departmentCode.trim().toUpperCase(),
      description: description?.trim(),
      establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
      headOfDepartment: headOfDepartment || undefined,
      contactEmail: contactEmail?.trim().toLowerCase(),
      contactPhone: contactPhone?.trim()
    });

    const savedDepartment = await newDepartment.save();
    await savedDepartment.populate('hodDetails', 'name email');

    res.status(201).json({ 
      message: 'Department created successfully', 
      department: savedDepartment 
    });
  } catch (error) {
    console.error('Error creating department:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    res.status(500).json({ message: 'Error creating department', error: error.message });
  }
};

// Update department
export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check for duplicate department code if being updated
    if (updates.departmentCode && updates.departmentCode !== department.departmentCode) {
      const duplicate = await Department.findOne({ 
        departmentCode: updates.departmentCode.toUpperCase(),
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(400).json({ 
          message: 'Department code already exists',
          field: 'departmentCode'
        });
      }
    }

    // Check for duplicate department name if being updated
    if (updates.departmentName && updates.departmentName !== department.departmentName) {
      const duplicate = await Department.findOne({ 
        departmentName: { $regex: `^${updates.departmentName}$`, $options: 'i' },
        _id: { $ne: id }
      });
      if (duplicate) {
        return res.status(400).json({ 
          message: 'Department name already exists',
          field: 'departmentName'
        });
      }
    }

    // Clean and update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        if (typeof updates[key] === 'string') {
          updates[key] = updates[key].trim();
        }
        department[key] = updates[key];
      }
    });

    const updatedDepartment = await department.save();
    await updatedDepartment.populate('hodDetails', 'name email');

    res.status(200).json({ 
      message: 'Department updated successfully', 
      department: updatedDepartment 
    });
  } catch (error) {
    console.error('Error updating department:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    res.status(500).json({ message: 'Error updating department', error: error.message });
  }
};

// Soft delete department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if department has active students or teachers
    const studentCount = await department.getStudentCount();
    const teacherCount = await department.getTeacherCount();
    
    if (studentCount > 0 || teacherCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with active students or teachers',
        counts: { students: studentCount, teachers: teacherCount }
      });
    }

    department.isActive = false;
    await department.save();

    res.status(200).json({ 
      message: 'Department deleted successfully',
      department: department 
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Error deleting department', error: error.message });
  }
};

// Get only active departments
export const getActiveDepartments = async (req, res) => {
  try {
    const departments = await Department.findActiveDepartments();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching active departments:', error);
    res.status(500).json({ message: 'Error fetching active departments', error: error.message });
  }
};

// Get department statistics
export const getDepartmentStats = async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const activeDepartments = await Department.countDocuments({ isActive: true });
    const inactiveDepartments = totalDepartments - activeDepartments;

    // Get departments with counts
    const departmentsWithStats = await Department.find({ isActive: true })
      .populate('hodDetails', 'name email')
      .lean();

    for (let dept of departmentsWithStats) {
      const department = await Department.findById(dept._id);
      dept.stats = {
        teacherCount: await department.getTeacherCount(),
        studentCount: await department.getStudentCount(),
        semesterCount: await department.getSemesterCount(),
        subjectCount: await department.getSubjectCount()
      };
    }

    res.status(200).json({ 
      summary: {
        totalDepartments,
        activeDepartments,
        inactiveDepartments
      },
      departments: departmentsWithStats
    });
  } catch (error) {
    console.error('Error fetching department stats:', error);
    res.status(500).json({ message: 'Error fetching department statistics', error: error.message });
  }
};

// Get departments with optional filtering (for dropdowns, etc.)
export const getDepartments = async (req, res) => {
  try {
    const { active = 'true', search = '', fields = '' } = req.query;
    
    const filter = {};
    if (active !== 'all') {
      filter.isActive = active === 'true';
    }
    
    if (search.trim()) {
      filter.$or = [
        { departmentName: { $regex: search, $options: 'i' } },
        { departmentCode: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Department.find(filter).sort({ departmentName: 1 });
    
    // Select specific fields if requested
    if (fields.trim()) {
      query = query.select(fields);
    }
    
    const departments = await query.populate('hodDetails', 'name email');
    
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
};

// Bulk operations
export const bulkUpdateDepartments = async (req, res) => {
  try {
    const { operations } = req.body; // Array of { id, updates }
    
    if (!Array.isArray(operations)) {
      return res.status(400).json({ message: 'Operations must be an array' });
    }

    const results = [];
    
    for (const operation of operations) {
      try {
        const department = await Department.findByIdAndUpdate(
          operation.id,
          operation.updates,
          { new: true, runValidators: true }
        );
        results.push({ id: operation.id, success: true, department });
      } catch (error) {
        results.push({ id: operation.id, success: false, error: error.message });
      }
    }

    res.status(200).json({ 
      message: 'Bulk update completed',
      results 
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ message: 'Error in bulk update', error: error.message });
  }
};
