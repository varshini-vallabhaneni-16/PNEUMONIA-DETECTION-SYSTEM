import tensorflow as tf
import numpy as np
import cv2

IMG_SIZE = 128

# Load trained model
model = tf.keras.models.load_model("models/pneumonia_model.h5")

def predict_image(image_path):

    img = cv2.imread(image_path)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0

    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)

    if prediction[0][0] > 0.5:
        print("Prediction: Pneumonia")
    else:
        print("Prediction: Normal")

    print("Confidence:", prediction[0][0])


# Example test image
predict_image("test_image.png")