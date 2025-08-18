import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCameraCapture = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      handleFileSelect(selected);
    }
    // Reset the input so same file can be selected again
    e.target.value = '';
  };

  const handleGallerySelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      handleFileSelect(selected);
    }
    // Reset the input so same file can be selected again
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch(
        'https://tomatodisease-detection-backend.onrender.com/predict/',
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Failed to upload or classify the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#208fd0' }}>🍅 Tomato Disease Detector</h1>
      <p>Upload a tomato leaf image or take a picture to detect diseases.</p>

      <div style={{ margin: '20px auto', maxWidth: '90%' }}>
        
        {/* Camera input */}
        <div style={{ marginBottom: '15px' }}>
          <label 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#208fd0',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px',
              marginBottom: '10px'
            }}
          >
            📷 Take Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              style={{ display: 'none' }}
            />
          </label>

          {/* Gallery input */}
          <label 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🖼️ Choose from Gallery
            <input
              type="file"
              accept="image/*"
              onChange={handleGallerySelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div style={{ margin: '20px 0' }}>
            <img
              src={preview}
              alt="Preview"
              style={{ 
                width: '80%', 
                maxWidth: '300px', 
                borderRadius: '10px',
                border: '2px solid #208fd0'
              }}
            />
          </div>
        )}

        <div>
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            style={{
              backgroundColor: !file || loading ? '#ccc' : '#208fd0',
              color: 'white',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '8px',
              cursor: !file || loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Analyzing...' : 'Identify Disease'}
          </button>
        </div>

        {loading && (
          <div style={{ margin: '20px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #208fd0',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ color: '#208fd0', marginTop: '10px' }}>Analyzing image...</p>
          </div>
        )}
      </div>

      {result && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '1px solid #208fd0'
        }}>
          {result.error ? (
            <p style={{ color: '#dc3545' }}>Error: {result.error}</p>
          ) : (
            <>
              <h2 style={{ color: '#208fd0', marginBottom: '15px' }}>🔬 Diagnosis Results</h2>
              <div style={{ fontSize: '18px' }}>
                <p><strong>Disease:</strong> <span style={{ color: '#28a745' }}>{result.class}</span></p>
                <p><strong>Confidence:</strong> <span style={{ color: '#208fd0' }}>{(result.confidence * 100).toFixed(2)}%</span></p>
              </div>
            </>
          )}
        </div>
      )}

      <footer style={{ 
        marginTop: '50px', 
        padding: '20px', 
        backgroundColor: '#e8f5e9',
        borderRadius: '10px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#208fd0',
            borderRadius: '50%',
            margin: '0 auto 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>EU</div>
        </div>
        <p style={{ margin: '0', color: '#666' }}>
          <strong>John Kikiiyin Aboderin</strong> • <em>EU200303-2312</em>
        </p>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Elizade University</p>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}

export default App;