import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ name: '', address: '', lat: '', lng: '', radius: 300 });

  const fetchCampuses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/campuses');
      setCampuses(res.data.campuses);
    } catch (error) {
      toast.error('Failed to load campuses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const handleAddCampus = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/campuses', {
        name: formData.name,
        address: formData.address,
        location: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
          radius: parseInt(formData.radius, 10)
        }
      });
      toast.success('Campus added');
      setFormData({ name: '', address: '', lat: '', lng: '', radius: 300 });
      fetchCampuses();
    } catch (error) {
      toast.error('Failed to add campus');
    }
  };

  const handleDeleteCampus = async (id) => {
    if (!window.confirm('Delete this campus?')) return;
    try {
      await api.delete(`/admin/campuses/${id}`);
      toast.success('Campus deleted');
      fetchCampuses();
    } catch (error) {
      toast.error('Failed to delete campus');
    }
  };

  return (
    <DashboardLayout title="System Settings">
      <div className="space-y-8">
        
        {/* Geolocation Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-attendrix-rose" />
            <h2 className="text-xl font-bold">Campus Geolocation Policies</h2>
          </div>
          <p className="text-slate-500 mb-6">Define campus boundaries to enforce geolocation restrictions for attendance marking.</p>

          <form onSubmit={handleAddCampus} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium mb-1">Campus Name</label>
              <input required type="text" className="input-field" placeholder="e.g. Main Campus" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Latitude</label>
              <input required type="number" step="any" className="input-field" placeholder="28.609" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Longitude</label>
              <input required type="number" step="any" className="input-field" placeholder="77.034" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Radius (m)</label>
              <div className="flex gap-2">
                <input required type="number" className="input-field" value={formData.radius} onChange={e => setFormData({...formData, radius: e.target.value})} />
                <button type="submit" className="btn-primary px-3"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="space-y-4">
              {campuses.map(campus => (
                <div key={campus._id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <div>
                    <h3 className="font-bold">{campus.name}</h3>
                    <p className="text-sm text-slate-500 font-mono">Lat: {campus.location.lat}, Lng: {campus.location.lng} | Radius: {campus.location.radius}m</p>
                  </div>
                  <button onClick={() => handleDeleteCampus(campus._id)} className="p-2 text-slate-400 hover:text-red-500 transition">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {campuses.length === 0 && <p className="text-sm text-slate-500">No campuses configured.</p>}
            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
