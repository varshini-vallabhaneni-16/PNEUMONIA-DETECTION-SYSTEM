import tensorflow as tf

# Load old H5 model
model = tf.keras.models.load_model("models/pneumonia_model.h5", compile=False)

# Save in new format
model.save("models/pneumonia_model.keras")

print("Model converted successfully")