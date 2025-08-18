import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict
import uvicorn

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def classify_image(file: UploadFile = File(...)):
    print("Request received")
    print("Filename:", file.filename)
    image_bytes = await file.read()
    try:
        result = predict(image_bytes)
        print("Prediction result:", result)
        return result
    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}

# Start Uvicorn with Render's dynamic port
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render assigns PORT dynamically
    uvicorn.run("main:app", host="0.0.0.0", port=port)
