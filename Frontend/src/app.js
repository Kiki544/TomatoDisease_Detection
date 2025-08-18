import React, { useState } from "react";
import axios from "axios";
import "./app.css"; // optional CSS for styling

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
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post(
        "https://tomatodisease-detection-backend.onrender.com/predict/",
        formData
      );
      setResult(res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload or classify the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: "#208fd0" }}>🍅 Tomato Disease Detector</h1>
      <p>Upload or take a picture of a tomato leaf for AI diagnosis.</p>

      <div className="form-area">
        {/* File input with camera capture */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          style={{ maxWidth: "90%", margin: "10px" }}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "90%",
              marginTop: "20px",
              border: "2px solid #208fd0",
              borderRadius: "10px",
            }}
          />
        )}
        <br />
        <button onClick={handleSubmit} style={{ marginTop: "15px" }}>
          Identify Disease
        </button>
        {loading && <p>Loading prediction...</p>}
      </div>

      {result && (
        <div
          className="result"
          style={{
            marginTop: "20px",
            fontWeight: "bold",
            color: "#208fd0",
            whiteSpace: "pre-line",
          }}
        >
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <>
              <h2>Diagnosis</h2>
              <p>
                <strong>Disease:</strong> {result.class}
              </p>
              <p>
                <strong>Confidence:</strong>{" "}
                {(result.confidence * 100).toFixed(2)}%
              </p>
            </>
          )}
        </div>
      )}

      <footer
        style={{
          marginTop: "50px",
          padding: "20px",
          backgroundColor: "#e8f5e9",
          color: "#208fd0",
          textAlign: "center",
        }}
      >
        <img src="elizade-logo.png" alt="Elizade University Logo" style={{ height: "60px", marginBottom: "10px" }} />
        <p>
          <strong>John Kikiiyin Aboderin</strong> • <em>EU200303-2312</em> •
          Elizade University
        </p>
      </footer>
    </div>
  );
}

export default App;
