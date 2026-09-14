import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# Load dataset

data = pd.read_csv("../data/landslide_data.csv")


# Input features

X = data[
    [
        "rainfall",
        "rainfall_3day",
        "soil_moisture",
        "slope",
        "elevation",
        "historical_landslides"
    ]
]


# Target

y = data["risk"]


# Split dataset

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create Random Forest model

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# Train

model.fit(X_train, y_train)


# Test

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)


print("Model trained successfully!")
print("Accuracy:", round(accuracy * 100, 2), "%")


# Save model

joblib.dump(
    model,
    "landslide_model.pkl"
)


print("Model saved as landslide_model.pkl")