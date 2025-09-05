import Class from '../models/class.model.js';

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
};
export const deleteAllClasses = async (req, res) => {
  try {
    await Class.deleteMany({});
    res.json({ message: 'All classes deleted' });
  } catch (error) {
    //console.error('Error deleting all classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//   try {
//     const { className, classNumber } = req.body;
//     const newClass = new Class({ className, classNumber });
//     await newClass.save();
//     res.status(201).json(newClass);
//   } catch (err) {
//     res.status(400).json({ message: 'Failed to create class' });
//   }
// };
export const createClass = async (req, res) => {
  try {
    console.log(req.body);
    const { className, classNumber, department_id, semester } = req.body;
     
     
    if (!className || !classNumber || !department_id || !semester) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newClass = new Class({
      className,
      classNumber,
      department_id,
      semester
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    console.error('Error creating class:', err);
    res.status(400).json({ message: 'Failed to create class' });
  }
};


export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, classNumber, department_id, semester } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(id, { className, classNumber, department_id, semester }, { new: true });
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update class' });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    await Class.findByIdAndDelete(id);
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete class' });
  }
};
