def generate_alert(risk_score, location):

    if risk_score >= 80:

        return {
            "level": "CRITICAL",
            "priority": "IMMEDIATE",
            "message": (
                f"Critical landslide risk detected in {location}."
            ),
            "action": (
                "Avoid vulnerable slopes and alert nearby communities."
            )
        }


    elif risk_score >= 60:

        return {
            "level": "HIGH",
            "priority": "HIGH",
            "message": (
                f"High landslide risk detected in {location}."
            ),
            "action": (
                "Increase monitoring and prepare emergency response teams."
            )
        }


    elif risk_score >= 40:

        return {
            "level": "MODERATE",
            "priority": "MEDIUM",
            "message": (
                f"Moderate landslide risk detected in {location}."
            ),
            "action": (
                "Continue monitoring rainfall and terrain conditions."
            )
        }


    else:

        return {
            "level": "LOW",
            "priority": "LOW",
            "message": (
                f"Low landslide risk detected in {location}."
            ),
            "action": (
                "Continue normal environmental monitoring."
            )
        }