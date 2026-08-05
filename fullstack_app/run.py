#!/usr/bin/env python3
"""
NexusTask Launcher Script
Starts the FastAPI Backend server and opens the web application in your default browser.
"""
import sys
import subprocess
import webbrowser
import time

def check_and_install_dependencies():
    print("[1/3] Checking requirements...")
    try:
        import uvicorn
        import fastapi
        import sqlalchemy
    except ImportError:
        print("[!] Missing required packages. Installing dependencies from backend/requirements.txt...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])

def launch_server():
    print("[2/3] Starting NexusTask FastAPI backend server on http://localhost:8000 ...")
    print("[3/3] Opening dashboard in browser...")
    
    # Open browser after a 1.5s delay
    def open_browser():
        time.sleep(1.5)
        webbrowser.open("http://localhost:8000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    # Add backend directory to sys.path
    import os
    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    check_and_install_dependencies()
    launch_server()
