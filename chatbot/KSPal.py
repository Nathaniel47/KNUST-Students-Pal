# Import necessary libraries
import tflearn
import tensorflow as tf
import numpy as np
import pandas as pd
import json
import string
from sklearn.preprocessing import LabelEncoder
from tflearn.data_utils import pad_sequences

# # Load dataset
# with open('dataset.json') as content:
#     data1 = json.load(content)

# Load dataset with error handling
try:
    with open('dataset.json') as content:
        data1 = json.load(content)
        print("Dataset loaded successfully!")
except json.JSONDecodeError as e:
    print(f"Error loading JSON: {e}")
    exit()

# Extract inputs and responses
tags = []
inputs = []
responses = {}

for intent in data1["intents"]:
    responses[intent["tag"]] = intent["responses"]
    for lines in intent["input"]:
        inputs.append(lines)
        tags.append(intent["tag"])

# Convert to DataFrame
data_df = pd.DataFrame({"inputs": inputs, "tags": tags})

# Preprocessing - Remove punctuation and lowercase
data_df["inputs"] = data_df["inputs"].apply(
    lambda wrd: " ".join(
        [ltrs.lower() for ltrs in wrd.split() if ltrs not in string.punctuation]
    )
)

# Tokenization
from tflearn.data_utils import VocabularyProcessor

max_document_length = max([len(text.split()) for text in data_df["inputs"]])
vocab_processor = VocabularyProcessor(max_document_length)
x_train = np.array(list(vocab_processor.fit_transform(data_df["inputs"])))

# Encode labels
le = LabelEncoder()
y_train = le.fit_transform(data_df["tags"])
y_train = tflearn.data_utils.to_categorical(y_train, len(le.classes_))

# Define Model
tf.reset_default_graph()

net = tflearn.input_data(shape=[None, max_document_length])
net = tflearn.embedding(net, input_dim=len(vocab_processor.vocabulary_), output_dim=10)
net = tflearn.lstm(net, 10, return_seq=False)
net = tflearn.fully_connected(net, len(le.classes_), activation="softmax")
net = tflearn.regression(net)

# Train Model
model = tflearn.DNN(net)
model.fit(x_train, y_train, n_epoch=200, batch_size=8, show_metric=True)

# Save the trained model
model.save("model.tfl")
print("✅ Model saved as model.tfl")

# Save the VocabularyProcessor
import pickle

with open("vocab_processor.pkl", "wb") as f:
    pickle.dump(vocab_processor, f)
print("✅ VocabularyProcessor saved as vocab_processor.pkl")

# Save the LabelEncoder
with open("label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)
print("✅ LabelEncoder saved as label_encoder.pkl")

# Save the responses dictionary
with open("responses.pkl", "wb") as f:
    pickle.dump(responses, f)
print("✅ Responses saved as responses.pkl")


# Chatbot Interaction
import random

while True:
    texts_p = []
    prediction_input = input("You: ")

    # Preprocess input
    prediction_input = " ".join(
        [letters.lower() for letters in prediction_input.split() if letters not in string.punctuation]
    )
    texts_p.append(prediction_input)

    # Tokenize & pad input
    prediction_input = np.array(list(vocab_processor.transform(texts_p)))
    
    # Predict response
    output = model.predict(prediction_input)
    output_index = np.argmax(output)

    # Find corresponding tag
    response_tag = le.inverse_transform([output_index])[0]
    print("KSPA:", random.choice(responses.get(response_tag, ["I'm sorry, I didn't understand that."])))

    if response_tag.lower() == "goodbye":
        break  
