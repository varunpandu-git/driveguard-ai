"""
DriveGuard AI Engine - reusable detection module.

Runs the OpenCV camera + cascade-classifier detection in a background thread
so Flask never freezes. This module reuses the detection logic from
driveguard_ai.py without importing it (avoiding the blocking while-True loop).

Required model files (must be in the same folder as this file):
  - face_model.xml
  - eye_model.xml
  - mouth_model.xml
"""

from __future__ import annotations

import os
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

import cv2


# --------------------------------------------------------------------------- #
#  Data model
# --------------------------------------------------------------------------- #
@dataclass
class DetectionState:
    camera_active: bool = False
    driver_detected: bool = False
    eyes_detected: int = 0
    drowsiness: bool = False
    yawning: bool = False
    risk_level: str = "SAFE"
    confidence: Optional[float] = None
    timestamp: Optional[str] = None


# --------------------------------------------------------------------------- #
#  Helper - find model files in the same folder as this script
# --------------------------------------------------------------------------- #
def _resolve_model_path(filename: str) -> str:
    """Return the absolute path to a model file in the same directory as this script."""
    here = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(here, filename)


# --------------------------------------------------------------------------- #
#  AI Engine
# --------------------------------------------------------------------------- #
class DriveGuardEngine:
    """Thread-safe wrapper around the OpenCV detection loop."""

    def __init__(self, camera_index: int = 0):
        self.camera_index = camera_index

        # Model paths - always resolved relative to this file's location
        self.face_cascade_path = _resolve_model_path("face_model.xml")
        self.eye_cascade_path = _resolve_model_path("eye_model.xml")
        self.mouth_cascade_path = _resolve_model_path("mouth_model.xml")

        # Cascade classifiers (loaded lazily on start or health check)
        self.face_cascade: Optional[cv2.CascadeClassifier] = None
        self.eye_cascade: Optional[cv2.CascadeClassifier] = None
        self.mouth_cascade: Optional[cv2.CascadeClassifier] = None

        # OpenCV camera capture
        self._cap: Optional[cv2.VideoCapture] = None

        # Background thread
        self._thread: Optional[threading.Thread] = None
        self._running = False
        self._lock = threading.Lock()

        # Current detection state
        self._state = DetectionState()
        self._start_time: Optional[float] = None

        # Timers for continuous detection (drowsiness / yawning)
        self._eyes_closed_since: Optional[float] = None
        self._mouth_open_since: Optional[float] = None

        # Whether all three model files loaded successfully
        self.models_loaded = False

    # ------------------------------------------------------------------ #
    #  Model loading
    # ------------------------------------------------------------------ #
    def load_models(self) -> dict:
        """Attempt to load all three Haar cascade classifiers.

        Returns a dict like {"face_model": True, "eye_model": False, ...}.
        """
        results: dict = {}

        self.face_cascade = self._load_cascade(self.face_cascade_path, "face")
        results["face_model"] = self.face_cascade is not None

        self.eye_cascade = self._load_cascade(self.eye_cascade_path, "eye")
        results["eye_model"] = self.eye_cascade is not None

        self.mouth_cascade = self._load_cascade(self.mouth_cascade_path, "mouth")
        results["mouth_model"] = self.mouth_cascade is not None

        self.models_loaded = all(results.values())
        return results

    @staticmethod
    def _load_cascade(path: str, label: str) -> Optional[cv2.CascadeClassifier]:
        """Load a single cascade file, returning None on failure."""
        if not os.path.isfile(path):
            print(f"[DriveGuard] WARNING: {label} model not found at {path}")
            return None
        cascade = cv2.CascadeClassifier(path)
        if cascade.empty():
            print(f"[DriveGuard] WARNING: {label} model loaded but is empty: {path}")
            return None
        print(f"[DriveGuard] Loaded {label} model from {path}")
        return cascade

    # ------------------------------------------------------------------ #
    #  Camera helpers
    # ------------------------------------------------------------------ #
    def _open_camera(self) -> bool:
        """Open the webcam. Returns True on success."""
        try:
            self._cap = cv2.VideoCapture(self.camera_index)
            if not self._cap.isOpened():
                print(
                    f"[DriveGuard] ERROR: cannot open camera index {self.camera_index}"
                )
                self._cap = None
                return False
            print(f"[DriveGuard] Camera opened (index {self.camera_index})")
            return True
        except Exception as exc:
            print(f"[DriveGuard] ERROR opening camera: {exc}")
            self._cap = None
            return False

    def _release_camera(self) -> None:
        """Safely release the camera and close any OpenCV windows."""
        if self._cap is not None:
            try:
                self._cap.release()
            except Exception:
                pass
            self._cap = None
        cv2.destroyAllWindows()

    def camera_available(self) -> bool:
        """Quick non-blocking check: can the camera be opened?"""
        cap = cv2.VideoCapture(self.camera_index)
        ok = cap.isOpened()
        cap.release()
        return ok

    # ------------------------------------------------------------------ #
    #  Start / Stop
    # ------------------------------------------------------------------ #
    def start(self) -> None:
        """Start the camera and the background detection thread."""
        if self._running:
            return

        if not self.models_loaded:
            self.load_models()

        if not self._open_camera():
            with self._lock:
                self._state.camera_active = False
            return

        self._running = True
        self._start_time = time.time()
        self._eyes_closed_since = None
        self._mouth_open_since = None

        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        """Stop the detection thread and release the camera safely."""
        self._running = False

        if self._thread is not None:
            self._thread.join(timeout=5)
            self._thread = None

        self._release_camera()

        with self._lock:
            self._state = DetectionState()

    @property
    def is_running(self) -> bool:
        return self._running

    @property
    def uptime(self) -> Optional[float]:
        if self._start_time is not None and self._running:
            return round(time.time() - self._start_time, 1)
        return None

    # ------------------------------------------------------------------ #
    #  Detection loop  (runs in background thread)
    # ------------------------------------------------------------------ #
    def _loop(self) -> None:
        """Main detection loop - reads frames and runs all classifiers."""
        while self._running:
            # Check camera is still usable
            if self._cap is None or not self._cap.isOpened():
                with self._lock:
                    self._state.camera_active = False
                time.sleep(0.5)
                continue

            ret, frame = self._cap.read()
            if not ret or frame is None:
                with self._lock:
                    self._state.camera_active = False
                time.sleep(0.3)
                continue

            with self._lock:
                self._state.camera_active = True

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # ---- 1. Face detection ----
            faces = []
            if self.face_cascade is not None:
                faces = self.face_cascade.detectMultiScale(
                    gray, scaleFactor=1.3, minNeighbors=5, minSize=(60, 60)
                )

            driver_detected = len(faces) > 0
            eyes_detected = 0
            mouth_detected = False

            # ---- 2 & 3. Eye and mouth detection (only if a face was found) ----
            if driver_detected and len(faces) > 0:
                # Use the first detected face
                fx, fy, fw, fh = faces[0]
                roi_gray = gray[fy: fy + fh, fx: fx + fw]

                # Eyes - search within the full face region
                if self.eye_cascade is not None:
                    eye_objects = self.eye_cascade.detectMultiScale(
                        roi_gray, scaleFactor=1.1, minNeighbors=5, minSize=(20, 20)
                    )
                    eyes_detected = len(eye_objects)

                # Mouth - search within the lower half of the face region
                if self.mouth_cascade is not None:
                    mouth_roi = roi_gray[fh // 2: fh, :]
                    if mouth_roi.size > 0:
                        mouth_objects = self.mouth_cascade.detectMultiScale(
                            mouth_roi, scaleFactor=1.3, minNeighbors=5,
                            minSize=(25, 15),
                        )
                        mouth_detected = len(mouth_objects) > 0

            # ---- 4. Drowsiness detection ----
            # Eyes closed (0 eyes detected) continuously for >= 2 seconds
            now = time.time()

            if driver_detected and eyes_detected == 0:
                if self._eyes_closed_since is None:
                    self._eyes_closed_since = now
                drowsiness = (now - self._eyes_closed_since) >= 2.0
            else:
                self._eyes_closed_since = None
                drowsiness = False

            # ---- 5. Yawning detection ----
            # Mouth detected continuously for >= 1.5 seconds
            if mouth_detected:
                if self._mouth_open_since is None:
                    self._mouth_open_since = now
                yawning = (now - self._mouth_open_since) >= 1.5
            else:
                self._mouth_open_since = None
                yawning = False

            # ---- 6. Risk level calculation ----
            if drowsiness:
                risk_level = "HIGH RISK"
            elif yawning:
                risk_level = "WARNING"
            elif driver_detected and eyes_detected == 0:
                risk_level = "WARNING"
            else:
                risk_level = "SAFE"

            # ---- 7. Confidence ----
            # Haar cascade classifiers do not produce a confidence score,
            # so we return None rather than inventing a fake value.
            confidence = None

            # ---- 8. Timestamp ----
            timestamp = datetime.now(timezone.utc).isoformat()

            # ---- Commit state atomically ----
            with self._lock:
                self._state.driver_detected = driver_detected
                self._state.eyes_detected = eyes_detected
                self._state.drowsiness = drowsiness
                self._state.yawning = yawning
                self._state.risk_level = risk_level
                self._state.confidence = confidence
                self._state.timestamp = timestamp

            # ~15 FPS - smooth detection without burning CPU
            time.sleep(0.066)

    # ------------------------------------------------------------------ #
    #  Public state accessor
    # ------------------------------------------------------------------ #
    def get_state(self) -> dict:
        """Return a snapshot of the current detection state (thread-safe)."""
        with self._lock:
            return {
                "camera_active": self._state.camera_active,
                "driver_detected": self._state.driver_detected,
                "eyes_detected": self._state.eyes_detected,
                "drowsiness": self._state.drowsiness,
                "yawning": self._state.yawning,
                "risk_level": self._state.risk_level,
                "confidence": self._state.confidence,
                "timestamp": self._state.timestamp,
            }
