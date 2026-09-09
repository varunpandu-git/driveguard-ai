"""
DriveGuard Flask Backend.

Endpoints:
  GET  /api/health   - backend health, model status, camera availability, uptime
  GET  /api/status   - latest real detection values
  POST /api/start    - start the camera + AI detection thread
  POST /api/stop     - stop the AI thread and release the camera

Run:
  python app.py

The server listens on http://127.0.0.1:5000
"""

from __future__ import annotations

import time
from datetime import datetime, timezone

from flask import Flask, jsonify
from flask_cors import CORS

from ai_engine import DriveGuardEngine

app = Flask(__name__)
CORS(app)  # allow the React/Vite frontend to call this API

# Single shared engine instance (camera index 0 = default webcam)
engine = DriveGuardEngine(camera_index=0)

# Track when the Flask process itself started
_process_start = time.time()


def _iso_now() -> str:
    """Return the current UTC time as an ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


@app.route("/api/health", methods=["GET"])
def health():
    """Return backend health: model status, camera availability, uptime."""
    if not engine.models_loaded:
        engine.load_models()

    return jsonify({
        "status": "online",
        "models_loaded": engine.models_loaded,
        "camera_available": engine.camera_available(),
        "monitoring": engine.is_running,
        "uptime": engine.uptime if engine.is_running else None,
        "process_uptime": round(time.time() - _process_start, 1),
        "timestamp": _iso_now(),
    })


@app.route("/api/status", methods=["GET"])
def status():
    """Return the latest real detection values from the AI engine."""
    return jsonify(engine.get_state())


@app.route("/api/start", methods=["POST"])
def start():
    """Start the camera and AI processing thread."""
    if engine.is_running:
        return jsonify({"message": "Monitoring already running"})

    if not engine.models_loaded:
        engine.load_models()

    engine.start()

    if not engine.is_running:
        return jsonify({
            "message": "Failed to start - camera may be unavailable"
        }), 500

    return jsonify({"message": "Monitoring started"})


@app.route("/api/stop", methods=["POST"])
def stop():
    """Stop the AI thread and release the camera safely."""
    if not engine.is_running:
        return jsonify({"message": "Monitoring not running"})

    engine.stop()
    return jsonify({"message": "Monitoring stopped"})


if __name__ == "__main__":
    # Load models at startup so /api/health reports accurate status immediately
    engine.load_models()
    print(f"[DriveGuard] Models loaded: {engine.models_loaded}")
    print("[DriveGuard] Starting Flask on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)
