import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  
  // Synthetic metadata
  const [scanId, setScanId] = useState('—');
  const [timestamp, setTimestamp] = useState('—');

  useEffect(() => {
    setScanId('RX-' + Math.floor(100000 + Math.random() * 900000));
    setTimestamp(new Date().toLocaleString('en-US', {
      hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'
    }));
  }, []);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setPrediction(null); // reset prediction on new file
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.prediction) {
        setPrediction(data.prediction);
      } else if (data.error) {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
  };

  const isPositive = prediction && prediction.toLowerCase().includes('pneumonia');

  return (
    <>
      <div className="scanlines" aria-hidden="true"></div>

      <header className="topbar">
        <div className="topbar-left">
          <span className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 12h3l2-7 4 14 2-9 2 5h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="logo-text">PULMO<span className="logo-accent">SCAN</span></span>
        </div>
        <div className="topbar-right">
          <span className="status-dot"></span>
          <span className="status-text">MODEL ONLINE — CNN-v3.2</span>
        </div>
      </header>

      <main className="container">
        <div className="intro">
          <span className="eyebrow">Chest Radiograph Analysis</span>
          <h1>AI Pneumonia Detection</h1>
          <p className="subtitle">Upload a chest X-ray. The model flags radiographic patterns consistent with pneumonia in under a second — for screening support, not a standalone diagnosis.</p>
        </div>

        <div className="workstation">
          {/* LEFT: Viewer / Upload */}
          <section className="panel viewer-panel">
            <div className="panel-header">
              <span className="panel-title">01 — Image Input</span>
              <span className={`panel-tag ${file ? 'panel-tag--live' : ''}`}>
                {file ? (file.name.length > 22 ? file.name.slice(0, 19) + '…' : file.name) : 'No file selected'}
              </span>
            </div>

            <form onSubmit={handleSubmit} id="predictForm">
              <label 
                className={`dropzone ${isDragging ? 'dragging' : ''}`} 
                htmlFor="fileInput" 
                id="dropzone"
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!preview && (
                  <div className="dropzone-empty" id="dropzoneEmpty">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>Drop a chest X-ray here</p>
                    <span>or click to browse — JPG, PNG, DICOM-export</span>
                  </div>
                )}

                <div className={`preview-wrap ${preview ? 'active' : ''}`} id="previewWrap">
                  {preview && <img id="previewImg" src={preview} alt="Uploaded radiograph preview" />}
                  {!prediction && <div className="scan-sweep" aria-hidden="true"></div>}
                  <div className="corner tl"></div>
                  <div className="corner tr"></div>
                  <div className="corner bl"></div>
                  <div className="corner br"></div>
                </div>
              </label>
              <input type="file" name="file" id="fileInput" accept="image/*" required hidden onChange={(e) => handleFile(e.target.files[0])} />

              {prediction ? (
                <button type="button" className="predict-btn" onClick={handleReset} style={{ background: '#f1f5f9', color: '#334155', boxShadow: 'none', border: '1px solid #cbd5e1' }}>
                  <span>Upload New Scan</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button type="submit" className={`predict-btn ${loading ? 'loading' : ''}`} id="predictBtn">
                  <span>{loading ? 'Analyzing…' : 'Run Analysis'}</span>
                  {!loading && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )}
            </form>
          </section>

          {/* RIGHT: Results */}
          <section className="panel result-panel">
            <div className="panel-header">
              <span className="panel-title">02 — Diagnostic Readout</span>
              {prediction ? (
                <span className="panel-tag panel-tag--live">Analysis complete</span>
              ) : (
                <span className="panel-tag">Awaiting input</span>
              )}
            </div>

            {prediction ? (
              <div className={`result ${isPositive ? 'result--positive' : 'result--negative'}`}>
                <div className="result-top">
                  <div className="gauge">
                    <svg viewBox="0 0 120 120" className="gauge-svg">
                      <circle cx="60" cy="60" r="52" className="gauge-track" />
                      <circle cx="60" cy="60" r="52" className="gauge-value" />
                    </svg>
                    <div className="gauge-label">
                      <span className="gauge-icon">
                        {isPositive ? '⚠' : '✓'}
                      </span>
                    </div>
                  </div>

                  <div className="result-copy">
                    <span className="result-eyebrow">Prediction</span>
                    <h2>{prediction}</h2>
                    <p className="result-note">
                      {isPositive ? 
                        'Radiographic opacities consistent with pneumonia were detected. Recommend clinical correlation.' :
                        'No significant opacities consistent with pneumonia were detected in this scan.'
                      }
                    </p>
                  </div>
                </div>

                <div className="meta-grid">
                  <div className="meta-row">
                    <span className="meta-key">SCAN_ID</span>
                    <span className="meta-val">{scanId}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">MODEL</span>
                    <span className="meta-val">CNN-v3.2</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-key">TIMESTAMP</span>
                    <span className="meta-val">{timestamp}</span>
                  </div>
                </div>

                <p className="disclaimer">This tool assists screening and does not replace evaluation by a licensed radiologist or physician.</p>
              </div>
            ) : (
              <div className="result-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 9h10M7 13h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p>Results will appear here once a scan is analyzed.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
