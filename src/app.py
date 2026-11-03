from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf


app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model("models/pneumonia_model.keras")
IMG_SIZE = 128


@app.route("/api/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
        
    file = request.files["file"]
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        image = Image.open(file).convert("RGB")
        img = np.array(image)
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = np.expand_dims(img, axis=0)

        pred = model.predict(img)[0][0]

        if pred > 0.5:
            prediction = "Pneumonia Detected"
        else:
            prediction = "Normal"

        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)