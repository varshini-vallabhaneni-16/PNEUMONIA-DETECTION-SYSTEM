import matplotlib.pyplot as plt
import pickle

history = pickle.load(open("models/history.pkl","rb"))

plt.plot(history['accuracy'])
plt.plot(history['val_accuracy'])

plt.title("Model Accuracy")
plt.ylabel("Accuracy")
plt.xlabel("Epoch")

plt.legend(["Train","Validation"])

plt.show()