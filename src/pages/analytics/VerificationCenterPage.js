import React, { useEffect, useState } from 'react';
import { Shield, AlertCircle, CheckCircle2, UserX, Clock, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import toast from 'react-hot-toast';

const VerificationCenterPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/attendance/verification-logs');
        setLogs(data.logs);
      } catch (err) {
        toast.error('Failed to load verification logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="AI Verification Center">
        <LoadingSpinner fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="AI Verification Center">
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
          <Shield className="w-12 h-12 text-blue-400 z-10" />
          <div className="z-10">
            <h2 className="text-2xl font-bold">Verification Logs</h2>
            <p className="text-slate-300 mt-1">Review all AI decisions, including face mismatches and geolocation failures.</p>
          </div>
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="card p-0 overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4 text-slate-300" />
              <p>No verification logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Course</th>
                    <th className="px-6 py-4 font-semibold">Result</th>
                    <th className="px-6 py-4 font-semibold">AI Confidence</th>
                    <th className="px-6 py-4 font-semibold">Reason / Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {logs.map((log) => {
                    const isSuccess = log.status === 'present';
                    return (
                      <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(log.date).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {log.student?.profile?.fullName || log.student?.username || 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {log.course?.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold">
                              <UserX className="w-3.5 h-3.5" /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {log.confidence ? (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${log.confidence < 0.4 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                  style={{ width: `${Math.max(0, 100 - (log.confidence * 100))}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-500">
                                {log.confidence.toFixed(3)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                          {!isSuccess ? (
                            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {log.failureReason?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN FAILURE'}
                            </div>
                          ) : log.locationCaptured ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <MapPin className="w-3.5 h-3.5" />
                              {log.locationCaptured.lat.toFixed(4)}, {log.locationCaptured.lng.toFixed(4)}
                            </div>
                          ) : (
                            <span className="text-slate-400">No Location Data</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VerificationCenterPage;
