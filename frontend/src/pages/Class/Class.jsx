import React, { useState, useEffect } from 'react';
import classService from '../../services/classService';
import departmentService from '../../services/departmentService';
import { toast } from 'react-toastify';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Layers,
  UploadCloud,
  FileText,
  Search,
  Pencil,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Inbox,
} from 'lucide-react';

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

  // --- Presentational-only state (does not touch data flow) ---
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const { data } = await classService.getAll();
      setClasses(data);
    } catch {
      toast.error('Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setIsLoadingDepts(true);
    try {
      const rawDepartments = await departmentService.getDepartmentsForSelect();
      setDepartments(rawDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setIsLoadingDepts(false);
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
    setIsFormOpen(true);
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

  const cancelEdit = () => {
    setForm({ className: '', classNumber: '', department_id: '', semester: '' });
    setEditId(null);
  };

  // Pure display filter — does not mutate `classes` or trigger any request
  const filteredClasses = classes.filter((cls) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      cls.className?.toLowerCase().includes(q) ||
      cls.classNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* ---------- Page header ---------- */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Academic Setup
          </p>
          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">Classes</h1>
            <button
              onClick={() => {
                if (isFormOpen && editId) cancelEdit();
                setIsFormOpen((v) => !v);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isFormOpen ? 'Close' : 'Add class'}
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage the classes available to the timetable generator.
          </p>
        </div>

        {/* ---------- PDF Upload Section ---------- */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <UploadCloud className="h-4.5 w-4.5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-800">Bulk upload via PDF</h3>
          </div>

          <label
            htmlFor="pdf-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40"
          >
            <FileText className="h-6 w-6 text-slate-400" />
            <span className="text-sm text-slate-600">
              {pdfFile ? (
                <span className="font-medium text-slate-800">{pdfFile.name}</span>
              ) : (
                <>
                  <span className="font-medium text-indigo-600">Click to choose</span> a PDF file
                </>
              )}
            </span>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <div className="mt-3 flex justify-end">
            <button
              onClick={handlePdfUpload}
              disabled={!pdfFile}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <UploadCloud className="h-4 w-4" />
              Upload PDF
            </button>
          </div>
        </div>

        {/* ---------- Add / Edit Form ---------- */}
        {isFormOpen && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                {editId ? 'Edit class' : 'New class'}
              </h2>
              {editId && (
                <button
                  onClick={cancelEdit}
                  className="text-xs font-medium text-slate-400 hover:text-slate-600"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <BookOpen className="h-3.5 w-3.5" /> Class name
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                    placeholder="e.g. Data Structures"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Layers className="h-3.5 w-3.5" /> Class number
                  </label>
                  <input
                    type="text"
                    name="classNumber"
                    value={form.classNumber}
                    onChange={handleChange}
                    placeholder="e.g. F94"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Building2 className="h-3.5 w-3.5" /> Department
                  </label>
                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <GraduationCap className="h-3.5 w-3.5" /> Semester
                  </label>
                  <select
                    name="semester"
                    required
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select semester</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString()}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {editId ? 'Update class' : 'Create class'}
              </button>
            </form>
          </div>
        )}

        {/* ---------- Toolbar: search + delete all ---------- */}
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {classes.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:self-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete all classes
            </button>
          )}
        </div>

        {/* ---------- Table ---------- */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-5 py-3 text-left font-medium text-slate-500">
                    Class name
                  </th>
                  <th className="border-b border-slate-200 px-5 py-3 text-left font-medium text-slate-500">
                    Class number
                  </th>
                  <th className="border-b border-slate-200 px-5 py-3 text-left font-medium text-slate-500">
                    Department
                  </th>
                  <th className="border-b border-slate-200 px-5 py-3 text-left font-medium text-slate-500">
                    Semester
                  </th>
                  <th className="border-b border-slate-200 px-5 py-3 text-right font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      {[...Array(5)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-3.5 w-24 animate-pulse rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Inbox className="h-8 w-8" />
                        <p className="text-sm font-medium text-slate-600">
                          {classes.length === 0 ? 'No classes yet' : 'No matches found'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {classes.length === 0
                            ? 'Add a class above or bulk-upload a PDF to get started.'
                            : 'Try a different search term.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((cls) => (
                    <tr
                      key={cls._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0"
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-800">{cls.className}</td>
                      <td className="px-5 py-3.5 text-slate-600">{cls.classNumber}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {departments.find((d) => d.value === cls.department_id)?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                          {cls.semester ? `Semester ${cls.semester}` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(cls)}
                            title="Edit"
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cls._id)}
                            title="Delete"
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;