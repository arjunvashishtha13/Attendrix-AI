import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, PlayCircle, StopCircle, Clock, Users } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { attendanceApi, courseApi, sessionApi, profileApi } from '../../services/api';

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [useGeofence, setUseGeofence] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, aRes, sRes] = await Promise.all([
          courseApi.get(id),
          attendanceApi.byCourse(id),
          sessionApi.getActive(id).catch(() => ({ data: { session: null } })),
        ]);
        setCourse(cRes.data.course);
        setRecords(aRes.data.records);
        setActiveSession(sRes.data.session);
      } catch (err) {
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    let intervalId;
    if (activeSession) {
      intervalId = setInterval(async () => {
        try {
          const { data } = await attendanceApi.byCourse(id);
          setRecords(data.records);
        } catch (err) {
          // silent fail
        }
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [activeSession, id]);

  const startSession = async () => {
    setSessionLoading(true);
    let locationData = null;

    if (useGeofence) {
      if (!navigator.geolocation) {
        toast.error('Geolocation not supported by browser');
        setSessionLoading(false);
        return;
      }
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
        locationData = { lat: pos.coords.latitude, lng: pos.coords.longitude, radius: 50 };
      } catch (err) {
        toast.error('Could not get location. Ensure GPS is enabled.');
        setSessionLoading(false);
        return;
      }
    }

    try {
      const { data } = await sessionApi.create({
        courseId: id,
        durationMinutes: 60,
        location: locationData,
      });
      setActiveSession(data.session);
      toast.success('Attendance Session Started');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start session');
    } finally {
      setSessionLoading(false);
    }
  };

  const closeSession = async () => {
    if (!activeSession) return;
    setSessionLoading(true);
    try {
      await sessionApi.close(activeSession._id);
      setActiveSession(null);
      toast.success('Attendance Session Closed');
      
      // Refresh records
      const aRes = await attendanceApi.byCourse(id);
      setRecords(aRes.data.records);
    } catch (err) {
      toast.error('Failed to close session');
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1) {
      setIsSearching(true);
      try {
        const { data } = await profileApi.searchUsers({ role: 'student', search: e.target.value });
        setSearchResults(data.users.filter(u => !course.students.find(s => s._id === u._id)));
      } catch {
        // ignore
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleEnroll = async (studentId) => {
    try {
      await courseApi.enroll(id, studentId);
      toast.success('Student enrolled');
      const { data } = await courseApi.get(id);
      setCourse(data.course);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      toast.error('Failed to enroll student');
    }
  };

  return (
    <DashboardLayout title={course ? `${course.code} — ${course.name}` : 'Course'}>
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`card border-2 ${activeSession ? 'border-green-500/20 bg-green-50/50 dark:bg-green-900/10 dark:border-green-500/30' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Attendance Session
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {activeSession 
                      ? 'Students can currently mark their attendance using AI verification.'
                      : 'Start a session to allow students to mark attendance.'}
                  </p>
                </div>
                {activeSession && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">ACTIVE</span>
                )}
              </div>

              {activeSession ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {records.filter(r => r.session === activeSession._id && r.status === 'present').length}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Verified</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                        {Math.max(0, (course?.students?.length || 0) - records.filter(r => r.session === activeSession._id && r.status === 'present').length)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Pending</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-rose-200 dark:border-rose-800 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        {records.filter(r => r.session === activeSession._id && r.status === 'failed').length}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase mt-1">Rejected</span>
                    </div>
                  </div>

                  {activeSession.location && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      Geofence Active
                    </div>
                  )}
                  <button 
                    onClick={closeSession} 
                    disabled={sessionLoading}
                    className="w-full btn-secondary flex items-center justify-center gap-2 text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    {sessionLoading ? 'Closing...' : <><StopCircle className="w-5 h-5" /> End Session</>}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <input 
                      type="checkbox" 
                      checked={useGeofence} 
                      onChange={(e) => setUseGeofence(e.target.checked)}
                      className="rounded border-slate-300 text-attendrix-rose focus:ring-attendrix-rose"
                    />
                    Require students to be in my current physical location
                  </label>
                  <button 
                    onClick={startSession} 
                    disabled={sessionLoading}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {sessionLoading ? 'Starting...' : <><PlayCircle className="w-5 h-5" /> Start New Session</>}
                  </button>
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                Enrolled Students
              </h3>
              
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search to enroll a student..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="input-field text-sm"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                    {searchResults.map(u => (
                      <div key={u._id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{u.profile?.fullName || u.username}</span>
                        <button 
                          onClick={() => handleEnroll(u._id)}
                          className="text-xs bg-attendrix-rose text-white px-3 py-1 rounded-full font-semibold hover:bg-rose-600"
                        >
                          Enroll
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {course.students?.length === 0 && <span className="text-sm text-slate-500">No students enrolled</span>}
                {course.students?.map((s) => (
                  <span key={s._id} className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {s.profile?.fullName || s.username}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white mb-4">Attendance Records</h3>
            <AttendanceTable records={records} showConfidence />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseDetailPage;
