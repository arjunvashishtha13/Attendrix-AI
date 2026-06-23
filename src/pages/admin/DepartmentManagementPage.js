import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', code: '', description: ''
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments');
      setDepartments(res.data.departments);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/departments', formData);
      toast.success('Department created');
      setIsModalOpen(false);
      setFormData({ name: '', code: '', description: '' });
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <DashboardLayout title="Department Management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">All Departments</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Department
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
            <div key={dept._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{dept.name}</h3>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{dept.code}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-attendrix-rose"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDeleteDepartment(dept._id)} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-6 flex-1">{dept.description || 'No description provided.'}</p>
              
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{dept.totalStudents || 0}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Students</p>
                </div>
                <div className="text-center border-l border-r border-slate-100 dark:border-slate-800">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{dept.totalTeachers || 0}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Faculty</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{dept.totalCourses || 0}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Courses</p>
                </div>
              </div>
            </div>
          ))}
          {departments.length === 0 && (
            <p className="text-slate-500 col-span-full">No departments found.</p>
          )}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create Department</h3>
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department Name</label>
                <input required type="text" className="input-field" placeholder="e.g. Computer Science" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input required type="text" className="input-field uppercase" placeholder="e.g. CSE" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="input-field" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DepartmentManagementPage;
