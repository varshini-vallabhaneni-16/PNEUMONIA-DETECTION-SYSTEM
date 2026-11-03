import tensorflow as tf
import pickle
from data_loader import train_dataset, val_dataset
from model import create_model

EPOCHS = 10

print("Loading model...")

model = create_model()

print("Starting training...")

history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS
)

print("Training completed!")

# Save model
model.save("models/pneumonia_model.keras")
# Save training history
pickle.dump(history.history, open("models/history.pkl","wb"))

print("Model and history saved successfully!")