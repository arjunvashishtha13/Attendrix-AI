import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceApi } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';

const WebcamCapture = ({ courseId, onSuccess }) => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const capture = useCallback(async () => {
    if (!courseId) {
      toast.error('Select a course first');
      return;
    }
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      toast.error('Could not capture from webcam');
      return;
    }

    setCapturing(true);
    try {
      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();
      formData.append('photo', blob, 'capture.jpg');
      formData.append('courseId', courseId);

      const { data } = await attendanceApi.webcam(formData);
      setLastResult(data);
      toast.success(`Marked present — ${(data.confidence * 100).toFixed(0)}% confidence`);
      onSuccess?.(data);
    } catch (err) {
      setLastResult({ success: false, message: err.message });
      toast.error(err.message);
    } finally {
      setCapturing(false);
    }
  }, [courseId, onSuccess]);

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Realtime AI Attendance</h3>
          <p className="text-sm text-slate-500">Face recognition with confidence threshold</p>
        </div>
        <Camera className="h-6 w-6 text-attendrix-rose" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full"
          videoConstraints={{ facingMode: 'user', width: 1280, height: 720 }}
        />
      </div>

      {capturing ? (
        <LoadingSpinner label="Analyzing face..." />
      ) : (
        <button onClick={capture} className="btn-primary w-full">
          <RefreshCw className="h-4 w-4" />
          Capture & Mark Attendance
        </button>
      )}

      {lastResult && (
        <div
          className={`rounded-xl p-4 text-sm ${
            lastResult.success !== false
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            {lastResult.message || lastResult.record?.student?.profile?.fullName || 'Result'}
          </div>
          {lastResult.confidence != null && (
            <p className="mt-1">Confidence: {(lastResult.confidence * 100).toFixed(1)}% (min {(lastResult.threshold * 100).toFixed(0)}%)</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
