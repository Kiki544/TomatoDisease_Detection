from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
