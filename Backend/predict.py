
from tensorflow import keras 
from PIL import Image 
import numpy as np
import io
# Load Keras model
model = keras.models.load_model ("final_tomato_disease_model.keras")
# Class names

class_names = ['Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']
def predict(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((128, 128))
    image = np.array(image) / 255.0
    # normalize if trained that way
    image = np.expand_dims(image, axis=0)
    # add batch dimension
    preds = model.predict(image)[0]
    # forward pass
    top1 = np.argmax(preds)
    #get class index
    confidence = float(np.max (preds))
    class_name = class_names[top1]
    return {"class": class_name, "confidence": confidence}