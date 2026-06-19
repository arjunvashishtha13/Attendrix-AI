import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Camera, CheckCircle2, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ANGLES = [
  { id: 'front', label: 'Look Straight' },
  { id: 'left', label: 'Look Slightly Left' },
  { id: 'right', label: 'Look Slightly Right' },
  { id: 'up', label: 'Look Slightly Up' },
  { id: 'down', label: 'Look Slightly Down' },
];

export default function EnrollFacePage() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentAngleIdx, setCurrentAngleIdx] = useState(0);
  const [embeddings, setEmbeddings] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Failed to load models', err);
        toast.error('Failed to load face detection AI models');
      }
    };
    loadModels();
  }, []);

  const captureAndExtract = async () => {
    if (!webcamRef.current?.video) return;
    setIsProcessing(true);

    try {
      const video = webcamRef.current.video;
      const detection = await faceapi.detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error('No face detected. Please ensure your face is clearly visible.');
        setIsProcessing(false);
        return;
      }

      const descriptorArray = Array.from(detection.descriptor);
      setEmbeddings(prev => [...prev, descriptorArray]);

      if (currentAngleIdx < ANGLES.length - 1) {
        setCurrentAngleIdx(prev => prev + 1);
        toast.success('Captured! Now for the next angle.');
      } else {
        await submitEmbeddings([...embeddings, descriptorArray]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error processing face');
    } finally {
      setIsProcessing(false);
    }
  };

  const submitEmbeddings = async (finalEmbeddings) => {
    try {
      const res = await authApi.enrollFace({ embeddings: finalEmbeddings });
      if (res.data.success) {
        toast.success('Face Enrollment Complete!');
        await refreshUser(); // Update context
        navigate('/profile');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save enrollment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Face Enrollment</h1>
        <p className="text-slate-500 dark:text-slate-400">
          To ensure accurate attendance tracking, we need 5 pictures of your face from different angles.
        </p>
      </div>

      {!modelsLoaded ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-12 h-12 text-attendrix-rose animate-spin mb-4" />
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Loading AI Models...</h2>
          <p className="text-sm text-slate-500 mt-2">This happens locally in your browser.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay guidelines */}
              <div className="absolute inset-0 border-2 border-white/20 border-dashed m-12 rounded-[100%] pointer-events-none" />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
                  {ANGLES[currentAngleIdx].label}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={captureAndExtract}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-attendrix-rose hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing Face...</>
                ) : (
                  <><Camera className="w-5 h-5" /> Capture Photo {currentAngleIdx + 1} of 5</>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Enrollment Progress</h3>
            
            <div className="space-y-4">
              {ANGLES.map((angle, idx) => (
                <div key={angle.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                  idx < currentAngleIdx ? 'border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10' :
                  idx === currentAngleIdx ? 'border-attendrix-rose bg-rose-50 dark:border-rose-900/50 dark:bg-rose-900/10' :
                  'border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx < currentAngleIdx ? 'bg-green-100 text-green-600' :
                      idx === currentAngleIdx ? 'bg-rose-100 text-attendrix-rose' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {idx < currentAngleIdx ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`font-medium ${
                      idx < currentAngleIdx ? 'text-green-700 dark:text-green-400' :
                      idx === currentAngleIdx ? 'text-attendrix-rose' :
                      'text-slate-500'
                    }`}>
                      {angle.label}
                    </span>
                  </div>
                  {idx === currentAngleIdx && <ChevronRight className="w-5 h-5 text-attendrix-rose" />}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">
                Ensure you are in a well-lit room. Remove any masks or heavy sunglasses. These embeddings are mathematically converted and securely stored.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
