import React, { useState } from 'react';
import axios from 'axios';
import './app.css'; // optional CSS for styling

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setResult(null);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
        const res = await axios.post(
            'https://tomatodisease-detection-backend.onrender.com/predict/',
            formData      
        );
      setResult(res.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Failed to upload or classify the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🍅 Tomato Disease Detector</h1>
      <p>Upload a tomato leaf image and let our AI detect diseases.</p>

      <div className="form-area">
        <input type="file" accept="image/*" onChange={handleChange} />
        {preview && <img src={preview} alt="Preview" className="preview" />}
        <button onClick={handleSubmit}>Identify Disease</button>
        {loading && <p>Loading prediction...</p>}
      </div>

      {result && (
        <div className="result">
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <>
              <h2>Diagnosis</h2>
              <p><strong>Disease:</strong> {result.class}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
