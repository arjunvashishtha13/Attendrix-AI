import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Camera, RefreshCw, CheckCircle2, MapPin, Loader2, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceApi } from '../../services/api';


const CHALLENGES = [
  { id: 'blink', label: 'Blink Your Eyes' },
  { id: 'smile', label: 'Smile' },
  { id: 'turnRight', label: 'Turn Head Right' },
  { id: 'turnLeft', label: 'Turn Head Left' },
];

const WebcamCapture = ({ sessionId, onSuccess }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [state, setState] = useState('idle');
  const [locationData, setLocationData] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  
  // ML interval ref
  const intervalRef = useRef(null);

  // Load Models
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
        console.error('Failed to load ML models', err);
        toast.error('Failed to load face detection models. Refresh the page.');
      }
    };
    loadModels();
    
    return () => clearInterval(intervalRef.current);
  }, []);

  const startProcess = () => {
    if (!sessionId) {
      toast.error('Select an active session first');
      return;
    }
    setLastResult(null);
    setState('locating');

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setState('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        // Random challenge
        const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
        setCurrentChallenge(challenge);
        setState('challenging');
        startLivenessDetection(challenge);
      },
      (error) => {
        toast.error('Unable to retrieve your location. Please enable GPS.');
        setState('idle');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const calculateEAR = (eye) => {
    // eye is array of 6 points
    const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
    const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
    const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
    return (v1 + v2) / (2.0 * h);
  };

  const startLivenessDetection = (challenge) => {
    let challengePassed = false;
    let isProcessingFrame = false;

    intervalRef.current = setInterval(async () => {
      if (!webcamRef.current?.video || challengePassed || isProcessingFrame) return;
      isProcessingFrame = true;
      
      try {
        const video = webcamRef.current.video;
        
        // OPTIMIZATION: Only compute landmarks during the challenge, not descriptors!
        const detection = await faceapi.detectSingleFace(video)
          .withFaceLandmarks();

        if (!detection) {
          isProcessingFrame = false;
          return; // No face found this frame
        }

        const landmarks = detection.landmarks;
        const nose = landmarks.getNose();
        const mouth = landmarks.getMouth();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        if (challenge.id === 'blink') {
          const leftEAR = calculateEAR(leftEye);
          const rightEAR = calculateEAR(rightEye);
          if (leftEAR < 0.35 && rightEAR < 0.35) {
            challengePassed = true;
          }
        } else if (challenge.id === 'smile') {
          const mouthWidth = Math.hypot(mouth[0].x - mouth[6].x, mouth[0].y - mouth[6].y);
          const mouthHeight = Math.hypot(mouth[3].x - mouth[9].x, mouth[3].y - mouth[9].y);
          if (mouthHeight / mouthWidth > 0.18) {
            challengePassed = true;
          }
        } else if (challenge.id === 'turnLeft') {
          const jaw = landmarks.getJawOutline();
          if (nose[3].x < jaw[3].x) { 
            challengePassed = true;
          }
        } else if (challenge.id === 'turnRight') {
          const jaw = landmarks.getJawOutline();
          if (nose[3].x > jaw[13].x) {
            challengePassed = true;
          }
        }

        if (challengePassed) {
          clearInterval(intervalRef.current);
          setState('verifying');
          
          // NOW we extract the heavy face descriptor just once for verification
          const finalDetection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
          if (finalDetection) {
            await sendToBackend(Array.from(finalDetection.descriptor));
          } else {
            setState('idle');
            toast.error('Face lost during final verification step');
          }
        }
      } catch (err) {
        console.error('Error during liveness detection:', err);
      } finally {
        isProcessingFrame = false;
      }
    }, 80);
  };

  const sendToBackend = async (descriptorArray) => {
    try {
      const { data } = await attendanceApi.markLive({
        sessionId,
        liveEmbedding: descriptorArray,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
      });
      
      setLastResult(data);
      toast.success(`Verified Identity!`);
      onSuccess?.(data);
    } catch (err) {
      setLastResult({ success: false, message: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setState('idle');
    }
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Realtime AI Attendance</h3>
          <p className="text-sm text-slate-500">Face recognition with liveness & location</p>
        </div>
        <Camera className="h-6 w-6 text-attendrix-rose" />
      </div>

      {!modelsLoaded ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-10 h-10 text-attendrix-rose animate-spin mb-4" />
          <p className="text-sm font-medium">Loading ML Models...</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black dark:border-slate-700 aspect-video">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className={`w-full h-full object-cover transition-opacity ${state !== 'challenging' ? 'opacity-50' : 'opacity-100'}`}
            videoConstraints={{ facingMode: 'user' }}
          />
          
          {state === 'locating' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/60 backdrop-blur-sm">
              <MapPin className="h-10 w-10 animate-bounce mb-3 text-emerald-400" />
              <p className="font-semibold text-lg">Acquiring GPS Location...</p>
            </div>
          )}

          {state === 'challenging' && currentChallenge && (
            <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-attendrix-rose text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-pulse">
                <Activity className="w-5 h-5" />
                LIVENESS CHECK: {currentChallenge.label.toUpperCase()}
              </div>
            </div>
          )}

          {state === 'verifying' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/60 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin mb-3 text-attendrix-rose" />
              <p className="font-semibold text-lg">Matching Face to Database...</p>
            </div>
          )}
        </div>
      )}

      {state === 'idle' && modelsLoaded && (
        <button 
          onClick={startProcess} 
          className="btn-primary w-full py-3"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Start Attendance Scan
        </button>
      )}

      {lastResult && state === 'idle' && (
        <div
          className={`rounded-xl p-4 text-sm ${
            lastResult.success !== false
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-base mb-1">
            <CheckCircle2 className="h-5 w-5" />
            {lastResult.message || 'Result'}
          </div>
          {lastResult.confidence != null && (
            <p>Mathematical Distance: {(lastResult.confidence).toFixed(3)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
