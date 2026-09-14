import pandas as pd
import joblib
import os


# ============================================
# LOAD TRAINED MACHINE LEARNING MODEL
# ============================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "landslide_model.pkl"
)

model = joblib.load(MODEL_PATH)


# ============================================
# LANDSLIDE RISK PREDICTION
# ============================================

def predict_risk(
    rainfall,
    soil_moisture,
    slope,
    elevation,
    historical_landslides,
    rainfall_3day=None
):
    """
    Predict landslide risk using the trained ML model.

    Parameters:
        rainfall: 24h rainfall amount (mm)
        soil_moisture: Soil moisture percentage (%)
        slope: Slope angle (degrees)
        elevation: Elevation (m)
        historical_landslides: Historical landslide count
        rainfall_3day: Cumulative 3-day rainfall amount (mm)

    Returns:
        Dictionary containing prediction, risk_score, and risk_level.
    """

    if rainfall_3day is None:
        rainfall_3day = round(rainfall * 2.1, 1)

    # ----------------------------------------
    # Prepare input data
    # ----------------------------------------

    data = pd.DataFrame([
        {
            "rainfall": rainfall,
            "rainfall_3day": rainfall_3day,
            "soil_moisture": soil_moisture,
            "slope": slope,
            "elevation": elevation,
            "historical_landslides": historical_landslides
        }
    ])

    # ----------------------------------------
    # ML Prediction
    # ----------------------------------------

    prediction = model.predict(data)[0]

    # ----------------------------------------
    # Probability of high-risk class
    # ----------------------------------------

    probability = model.predict_proba(data)[0][1]

    # Convert probability to percentage
    risk_score = round(float(probability * 100), 2)

    # ----------------------------------------
    # Determine risk level
    # ----------------------------------------

    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    # ----------------------------------------
    # Return prediction result
    # ----------------------------------------

    return {
    "prediction": int(prediction),
    "risk_score": risk_score,
    "risk_level": risk_level,
    "rainfall_3day": rainfall_3day
}