from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel


# ==========================================
# LOAD CLIP VISION MODEL
# ==========================================

MODEL_NAME = "openai/clip-vit-base-patch32"

print("Loading image analysis AI...")

processor = CLIPProcessor.from_pretrained(MODEL_NAME)
model = CLIPModel.from_pretrained(MODEL_NAME)

model.eval()

print("Image analysis AI loaded successfully!")


# ==========================================
# VISUAL CATEGORIES
# ==========================================

CATEGORIES = [
    {
        "name": "LANDSLIDE / SLOPE FAILURE",
        "description": "an active landslide, slope collapse, or large soil movement",
        "risk": "HIGH"
    },
    {
        "name": "GROUND CRACK",
        "description": "ground cracks or cracks caused by unstable soil or slope movement",
        "risk": "HIGH"
    },
    {
        "name": "SOIL EROSION / UNSTABLE SLOPE",
        "description": "severe soil erosion, exposed unstable soil, or an unstable hillside",
        "risk": "MODERATE"
    },
    {
        "name": "ROCKFALL / DEBRIS",
        "description": "rocks, stones, or landslide debris falling or accumulated on a road",
        "risk": "HIGH"
    },
    {
        "name": "NORMAL TERRAIN",
        "description": "normal stable mountain terrain without obvious landslide warning signs",
        "risk": "LOW"
    }
]


# ==========================================
# IMAGE ANALYSIS
# ==========================================

def analyze_image(image_file):

    image = Image.open(image_file).convert("RGB")

    descriptions = [
        item["description"]
        for item in CATEGORIES
    ]

    inputs = processor(
        text=descriptions,
        images=image,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():

        outputs = model(**inputs)

        logits_per_image = outputs.logits_per_image

        probabilities = logits_per_image.softmax(
            dim=1
        )[0]

    results = []

    for index, probability in enumerate(probabilities):

        results.append({
            "category": CATEGORIES[index]["name"],
            "risk": CATEGORIES[index]["risk"],
            "confidence": round(
                float(probability) * 100,
                2
            )
        })

    # Highest confidence category
    results.sort(
        key=lambda x: x["confidence"],
        reverse=True
    )

    top_result = results[0]

    # --------------------------------------
    # Determine visual risk
    # --------------------------------------

    category = top_result["category"]
    confidence = top_result["confidence"]

    if category == "LANDSLIDE / SLOPE FAILURE":

        visual_risk = "HIGH"

        message = (
            "Potential landslide or slope failure "
            "signs detected in the image."
        )

        indicators = [
            "Possible slope failure",
            "Visible soil movement",
            "Exposed unstable terrain"
        ]

    elif category == "GROUND CRACK":

        visual_risk = "HIGH"

        message = (
            "Potential ground instability indicators "
            "detected."
        )

        indicators = [
            "Possible ground cracking",
            "Potential slope movement",
            "Possible structural instability"
        ]

    elif category == "ROCKFALL / DEBRIS":

        visual_risk = "HIGH"

        message = (
            "Rockfall or landslide debris indicators "
            "detected."
        )

        indicators = [
            "Rock/debris accumulation",
            "Possible rockfall",
            "Possible road obstruction"
        ]

    elif category == "SOIL EROSION / UNSTABLE SLOPE":

        visual_risk = "MODERATE"

        message = (
            "Possible soil erosion or unstable "
            "slope conditions detected."
        )

        indicators = [
            "Exposed soil",
            "Possible erosion",
            "Potential slope instability"
        ]

    else:

        visual_risk = "LOW"

        message = (
            "No strong visual landslide indicators "
            "were detected."
        )

        indicators = [
            "No obvious landslide",
            "No strong debris indicator",
            "Terrain appears relatively stable"
        ]

    return {
        "success": True,

        "visual_risk": visual_risk,

        "top_category": category,

        "confidence": confidence,

        "message": message,

        "indicators": indicators,

        "all_predictions": results,

        "model": "CLIP Vision Model"
    }