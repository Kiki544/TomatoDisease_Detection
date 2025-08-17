from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from predict import predict
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=["*"],
)
@app.post("/predict/")
async def classify_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        result = predict (image_bytes)
        return result
    except Exception as e:
        return {"error": str(e)}