import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Scan, ShieldCheck } from 'lucide-react';

export default function CameraScan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  async function startCamera() {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access needs HTTPS or localhost. Open this site in Chrome.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (error) {
      const name = error instanceof Error ? error.name : '';
      setCameraError(name === 'NotAllowedError'
        ? 'Camera permission was blocked. Allow camera access in your browser settings.'
        : name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : 'Could not start the camera. Close other apps using it and try again.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Camera className="h-5 w-5 text-blue-600" /> Live Camera Feed
        </div>
        <span className={`flex items-center gap-2 text-sm font-medium ${cameraOn ? 'text-emerald-600' : 'text-slate-500'}`}>
          <span className={`h-2 w-2 rounded-full ${cameraOn ? 'animate-pulse bg-emerald-500' : 'bg-slate-300'}`} />
          {cameraOn ? 'Camera active' : 'Camera off'}
        </span>
      </div>
      <div className="relative aspect-video bg-slate-950">
        <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover ${cameraOn ? '' : 'hidden'}`} />
        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              <CameraOff className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold">Your camera preview will appear here</p>
            <p className="max-w-sm px-4 text-sm text-slate-300">Press Start Camera and allow browser permission when prompted.</p>
          </div>
        )}
        {cameraOn && (
          <>
            <div className="pointer-events-none absolute inset-6 rounded-xl border border-emerald-400/80">
              <span className="absolute -top-3 left-3 rounded bg-emerald-500 px-2 py-1 text-xs font-semibold text-white">CAMERA CONNECTED</span>
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-white">
              <Scan className="h-4 w-4 text-emerald-400" /> Live preview
            </div>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Camera preview stays in this browser
        </p>
        {!cameraOn ? (
          <button onClick={startCamera} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
            <Camera className="h-4 w-4" /> Start Camera
          </button>
        ) : (
          <button onClick={stopCamera} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <CameraOff className="h-4 w-4" /> Stop Camera
          </button>
        )}
      </div>
      {cameraError && <p role="alert" className="px-4 pb-4 text-sm text-red-600">{cameraError}</p>}
    </section>
  );
}
