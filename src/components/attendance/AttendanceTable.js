import React from 'react';

const statusStyles = {
  present: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  absent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  late: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const AttendanceTable = ({ records = [], showConfidence = false }) => {
  if (!records.length) {
    return (
      <div className="card py-12 text-center text-sm text-slate-400">No attendance records yet.</div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
              <th className="px-6 py-4 font-semibold text-slate-500">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Student</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Course</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Method</th>
              {showConfidence && <th className="px-6 py-4 font-semibold text-slate-500">AI Confidence</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r._id}
                className="border-b border-slate-100 transition hover:bg-rose-50/50 dark:border-slate-800 dark:hover:bg-slate-800/30"
              >
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {r.student?.profile?.fullName || r.student?.username || '—'}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  {r.course?.code || '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize text-slate-500">{r.method}</td>
                {showConfidence && (
                  <td className="px-6 py-4">
                    {r.confidence != null ? (
                      <span
                        className={`font-mono text-xs font-semibold ${
                          r.confidence >= 0.72 ? 'text-emerald-500' : 'text-amber-500'
                        }`}
                      >
                        {(r.confidence * 100).toFixed(0)}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
