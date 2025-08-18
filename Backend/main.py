import os
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict/")
async def classify_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        return predict(image_bytes)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Use Render's dynamic port, default to 8000 locally
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
