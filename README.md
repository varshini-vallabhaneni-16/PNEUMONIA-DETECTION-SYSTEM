<div align="center">
  
# 🩺 PULMOSCAN
**AI-Powered Chest Radiograph Analysis Workstation**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](#)
[![Flask](https://img.shields.io/badge/Flask-API-000000?logo=flask&logoColor=white)](#)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-CNN-FF6F00?logo=tensorflow&logoColor=white)](#)

</div>

<br/>

PULMOSCAN is a modern, diagnostic-grade web application designed to assist in the screening of chest X-rays for pneumonia. Utilizing a Convolutional Neural Network (CNN) deep learning model, the system analyzes radiographic patterns and flags potential opacities consistent with pneumonia in under a second.

> **Disclaimer**: This tool is designed for **screening support only** and does not replace professional medical evaluation by a licensed radiologist or physician. 

---

## 🏗️ Architecture & Tech Stack

The system has been designed with a decoupled architecture, separating the deep learning inference engine from the client-side user interface.

### Frontend (`/frontend`)
- **React (Vite)**: Fast, modern UI rendering.
- **Vanilla CSS**: Custom design system featuring a premium dark mode, glassmorphism elements, micro-animations, and dynamic visual states.
- **Interactive UI**: Drag-and-drop file support, dynamic "scan sweep" animations, and medical-style diagnostic readout gauges.

### Backend API (`/src`)
- **Python Flask**: Lightweight RESTful API exposing the `/api/predict` endpoint.
- **TensorFlow / Keras**: Deep learning engine loading the pre-trained `pneumonia_model.keras`.
- **OpenCV & Pillow**: Image preprocessing and normalization pipeline prior to tensor evaluation.

---

## 🚀 Getting Started

Follow these instructions to run the application locally on your machine. You will need to run both the Python API and the React frontend simultaneously.

### Prerequisites
- Python 3.8+
- Node.js (v18+) and npm

### 1. Setup the Backend API

1. Open a terminal in the root directory of the project.
2. Activate your virtual environment (if you are using one):
   ```bash
  Command: .\venv\Scripts\python.exe src\app.py (Run from the project root)
It runs on http://127.0.0.1:5000

   ```
3. Ensure the dependencies are installed (including `flask-cors`):
   ```bash
   pip install -r requirements.txt
   # OR if missing: pip install flask flask-cors tensorflow opencv-python pillow numpy
   ```
4. Start the Flask server:
   ```bash
   python src/app.py
   ```
   > The backend API will start running at `http://127.0.0.1:5000`.

### 2. Setup the Frontend

1. Open a **new, separate terminal window**.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install the Node modules:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > The frontend application will start running at `http://localhost:5173`.

---

## 🖥️ Usage

1. Open your web browser and navigate to `http://localhost:5173`.
2. Drag and drop a chest X-ray image (JPG, PNG) into the **01 — Image Input** dropzone, or click to browse your files.
3. Click the **Run Analysis** button.
4. The backend will process the tensor payload and return a diagnostic readout in the **02 — Diagnostic Readout** panel, displaying either a Normal or Positive prediction alongside a confidence gauge.

---

## 📂 Project Structure

```text
├── frontend/               # React application (UI)
│   ├── src/
│   │   ├── App.jsx         # Main UI component & API integration
│   │   └── App.css         # Diagnostic workstation design system
│   └── package.json        # Node dependencies
├── models/
│   └── pneumonia_model.keras # Trained TensorFlow model weights
├── src/
│   ├── app.py              # Flask REST API implementation
│   ├── model.py            # CNN Model architecture definition
│   ├── train.py            # Script for training the model
│   └── data_loader.py      # Dataset preprocessing logic
├── dataset/                # Raw/processed image datasets
└── README.md
```
