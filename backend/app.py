from flask import Flask, jsonify, request, send_from_directory, Response, session
from image_analyzer import analyze_image
from flask_cors import CORS

from risk_engine import predict_risk
from alerts import generate_alert

from datetime import datetime
from werkzeug.utils import secure_filename

import random
import os
import csv
import io
import json
import urllib.request

from db import get_connection


# ============================================
# FLASK APP SETUP
# ============================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))
UPLOAD_FOLDER = os.path.join(FRONTEND_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.secret_key = "ner_landsafe_secret_admin_key_2026"

CORS(app, supports_credentials=True)

# ============================================
# IMAGE ANALYSIS API
# ============================================

@app.route("/api/analyze-image", methods=["POST"])
def analyze_uploaded_image():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "error": "No image uploaded"
        }), 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify({
            "success": False,
            "error": "No image selected"
        }), 400

    try:

        result = analyze_image(image_file)

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ============================================
# MYSQL DATABASE
# ============================================

def get_db():
    """
    Connect to MySQL database using db.py
    """
    return get_connection()


# ============================================
# DEMO / BASELINE LOCATIONS
# ============================================

locations = [
    {
        "name": "Churachandpur",
        "state": "Manipur",
        "lat": 24.333,
        "lon": 93.683,
        "rainfall": 182,
        "rainfall_3day": 380,
        "soil_moisture": 78,
        "slope": 34,
        "elevation": 1200,
        "historical_landslides": 1
    },
    {
        "name": "Imphal",
        "state": "Manipur",
        "lat": 24.817,
        "lon": 93.936,
        "rainfall": 145,
        "rainfall_3day": 260,
        "soil_moisture": 65,
        "slope": 18,
        "elevation": 790,
        "historical_landslides": 0
    },
    {
        "name": "Aizawl",
        "state": "Mizoram",
        "lat": 23.727,
        "lon": 92.717,
        "rainfall": 210,
        "rainfall_3day": 435,
        "soil_moisture": 82,
        "slope": 42,
        "elevation": 1132,
        "historical_landslides": 3
    },
    {
        "name": "Shillong",
        "state": "Meghalaya",
        "lat": 25.578,
        "lon": 91.893,
        "rainfall": 195,
        "rainfall_3day": 410,
        "soil_moisture": 80,
        "slope": 35,
        "elevation": 1496,
        "historical_landslides": 2
    },
    {
        "name": "Gangtok",
        "state": "Sikkim",
        "lat": 27.338,
        "lon": 88.606,
        "rainfall": 175,
        "rainfall_3day": 350,
        "soil_moisture": 74,
        "slope": 40,
        "elevation": 1650,
        "historical_landslides": 2
    },
    {
        "name": "Kohima",
        "state": "Nagaland",
        "lat": 25.675,
        "lon": 94.108,
        "rainfall": 160,
        "rainfall_3day": 315,
        "soil_moisture": 70,
        "slope": 38,
        "elevation": 1261,
        "historical_landslides": 1
    },
    {
        "name": "Itanagar",
        "state": "Arunachal Pradesh",
        "lat": 27.084,
        "lon": 93.605,
        "rainfall": 220,
        "rainfall_3day": 460,
        "soil_moisture": 85,
        "slope": 45,
        "elevation": 750,
        "historical_landslides": 3
    },
    {
        "name": "Agartala",
        "state": "Tripura",
        "lat": 23.831,
        "lon": 91.286,
        "rainfall": 130,
        "rainfall_3day": 240,
        "soil_moisture": 60,
        "slope": 12,
        "elevation": 16,
        "historical_landslides": 0
    }
]


# ============================================
# LOAD LOCATIONS FROM MYSQL
# ============================================

def load_locations_from_mysql():

    conn = None
    cursor = None

    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                l.id,
                l.name,
                l.state,
                l.latitude,
                l.longitude,
                e.rainfall,
                e.soil_moisture,
                e.slope,
                e.elevation,
                e.historical_landslides,
                e.recorded_at
            FROM locations l
            LEFT JOIN environmental_data e
                ON l.id = e.location_id
            AND e.id = (
                SELECT MAX(e2.id)
                FROM environmental_data e2
                WHERE e2.location_id = l.id
            )
            ORDER BY l.id
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = []

        for row in rows:

            rainfall = float(row["rainfall"] or 0)
            soil_moisture = float(row["soil_moisture"] or 0)
            slope = float(row["slope"] or 0)
            elevation = float(row["elevation"] or 0)
            historical_landslides = int(
                row["historical_landslides"] or 0
            )

            result.append({
                "id": row["id"],
                "name": row["name"],
                "state": row["state"],
                "lat": float(row["latitude"]),
                "lon": float(row["longitude"]),
                "rainfall": rainfall,
                "rainfall_3day": rainfall * 2,
                "soil_moisture": soil_moisture,
                "slope": slope,
                "elevation": elevation,
                "historical_landslides": historical_landslides
            })

        return result

    except Exception as e:

        print("MySQL location loading error:", e)

        return locations

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# GET LOCATION BY NAME
# ============================================

def get_location_by_name(name):

    if not name:
        return None

    mysql_locations = load_locations_from_mysql()

    for location in mysql_locations:

        if location["name"].lower() == name.lower():
            return location

    # Fallback to demo data
    for location in locations:

        if location["name"].lower() == name.lower():
            return location

    return None


# ============================================
# HOME ROUTE
# ============================================

@app.route("/")
def home():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


# ============================================
# API INFO
# ============================================

@app.route("/api/info")
def api_info():

    return jsonify({
        "success": True,
        "message": "NER-LANDSAFE Backend is running",
        "problem_statement": "SIH26001",
        "server": "http://127.0.0.1:5000",
        "database": "MySQL (ner_landsafe)"
    })


# ============================================
# LIVE OPEN-METEO WEATHER API
# ============================================

def get_live_weather(lat, lon):

    try:

        url = (
            "https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}"
            f"&longitude={lon}"
            "&current=precipitation,rain,relative_humidity_2m"
            "&hourly=precipitation"
        )

        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "NER-LANDSAFE/1.0"
            }
        )

        with urllib.request.urlopen(
            req,
            timeout=5
        ) as resp:

            data = json.loads(
                resp.read().decode()
            )

        current = data.get(
            "current",
            {}
        )

        hourly = data.get(
            "hourly",
            {}
        )

        precip_hourly = hourly.get(
            "precipitation",
            []
        )

        rain_24h = (
            round(sum(precip_hourly[:24]), 1)
            if precip_hourly
            else float(
                current.get(
                    "precipitation",
                    0.0
                )
            )
        )

        rain_3day = (
            round(sum(precip_hourly[:72]), 1)
            if len(precip_hourly) >= 72
            else round(
                rain_24h * 2.5,
                1
            )
        )

        soil_moisture = min(
            98.0,
            max(
                25.0,
                round(
                    float(
                        current.get(
                            "relative_humidity_2m",
                            70
                        )
                    ),
                    1
                )
            )
        )

        return {
            "live": True,
            "rainfall_24h": rain_24h,
            "rainfall_3day": rain_3day,
            "soil_moisture": soil_moisture,
            "precip_hourly": precip_hourly
        }

    except Exception as e:

        print(
            f"Live weather fetch fallback "
            f"for ({lat}, {lon}): {e}"
        )

        return None


# ============================================
# RISK API
# ============================================

@app.route(
    "/api/risk",
    methods=["GET"]
)
def risk():

    location_name = request.args.get(
        "location"
    )

    target_location = (
        get_location_by_name(location_name)
        if location_name
        else None
    )

    if not target_location:

        mysql_locations = load_locations_from_mysql()

        if mysql_locations:
            target_location = mysql_locations[0]
        else:
            target_location = locations[0]

    live_w = get_live_weather(
        target_location["lat"],
        target_location["lon"]
    )

    if live_w and live_w["rainfall_24h"] > 0:

        rainfall = live_w["rainfall_24h"]
        rainfall_3day = live_w["rainfall_3day"]
        soil_moisture = live_w["soil_moisture"]

        data_source = (
            "Live Open-Meteo Weather API"
        )

    else:

        rainfall = target_location["rainfall"]

        rainfall_3day = target_location.get(
            "rainfall_3day",
            rainfall * 2
        )

        soil_moisture = target_location[
            "soil_moisture"
        ]

        data_source = (
            "MySQL Baseline Calibration Data"
        )

    slope = target_location["slope"]
    elevation = target_location["elevation"]

    historical_landslides = target_location[
        "historical_landslides"
    ]

    risk_result = predict_risk(
        rainfall=rainfall,
        rainfall_3day=rainfall_3day,
        soil_moisture=soil_moisture,
        slope=slope,
        elevation=elevation,
        historical_landslides=historical_landslides
    )

    prediction = risk_result[
        "prediction"
    ]

    risk_score = risk_result[
        "risk_score"
    ]

    risk_level = risk_result[
        "risk_level"
    ]

    alert = generate_alert(
        risk_score,
        target_location["name"]
    )

    return jsonify({

        "success": True,

        "location": target_location["name"],

        "state": target_location["state"],

        "latitude": target_location["lat"],

        "longitude": target_location["lon"],

        "rainfall": rainfall,

        "rainfall_3day": rainfall_3day,

        "soil_moisture": soil_moisture,

        "slope": slope,

        "elevation": elevation,

        "historical_landslides":
            historical_landslides,

        "prediction": prediction,

        "risk_score": risk_score,

        "risk_level": risk_level,

        "alert": alert,

        "data_source": data_source,

        "model":
            "Random Forest (Live Weather Integrated)"
    })


# ============================================
# ALL LOCATIONS API
# ============================================

@app.route(
    "/api/locations",
    methods=["GET"]
)
def get_locations():

    mysql_locations = load_locations_from_mysql()

    if mysql_locations:

        current_locations = mysql_locations

    else:

        current_locations = locations

    result = []

    for location in current_locations:

        risk_result = predict_risk(

            rainfall=location["rainfall"],

            rainfall_3day=location.get(
                "rainfall_3day",
                location["rainfall"] * 2
            ),

            soil_moisture=
                location["soil_moisture"],

            slope=location["slope"],

            elevation=location["elevation"],

            historical_landslides=
                location["historical_landslides"]
        )

        prediction = risk_result[
            "prediction"
        ]

        risk_score = risk_result[
            "risk_score"
        ]

        risk_level = risk_result[
            "risk_level"
        ]

        alert = generate_alert(
            risk_score,
            location["name"]
        )

        result.append({

            "name": location["name"],

            "state": location["state"],

            "lat": location["lat"],

            "lon": location["lon"],

            "rainfall": location["rainfall"],

            "rainfall_3day":
                location.get(
                    "rainfall_3day",
                    location["rainfall"] * 2
                ),

            "soil_moisture":
                location["soil_moisture"],

            "slope": location["slope"],

            "elevation": location["elevation"],

            "historical_landslides":
                location["historical_landslides"],

            "prediction": prediction,

            "risk_score": risk_score,

            "risk_level": risk_level,

            "alert": alert,

            "model": "Random Forest"
        })

    return jsonify({

        "success": True,

        "count": len(result),

        "locations": result
    })


# ============================================
# INCIDENT REPORT API
# ============================================

@app.route(
    "/api/report",
    methods=["POST"]
)
def report_incident():

    photo_name = None
    photo_url = None

    # ----------------------------------------
    # JSON REQUEST
    # ----------------------------------------

    if request.is_json:

        data = request.get_json() or {}

        location_name = data.get(
            "location"
        )

        severity = data.get(
            "severity"
        )

        incident_type = data.get(
            "incident_type"
        )

        description = data.get(
            "description"
        )

        photo_name = data.get(
            "photo_name"
        )

    # ----------------------------------------
    # FORM / FILE REQUEST
    # ----------------------------------------

    else:

        data = request.form

        location_name = data.get(
            "location"
        )

        severity = data.get(
            "severity"
        )

        incident_type = data.get(
            "incident_type"
        )

        description = data.get(
            "description"
        )

        if "photo" in request.files:

            file = request.files["photo"]

            if file and file.filename != "":

                original_filename = secure_filename(
                    file.filename
                )

                unique_filename = (
                    datetime.now().strftime(
                        "%Y%m%d%H%M%S"
                    )
                    + "_"
                    + str(random.randint(100, 999))
                    + "_"
                    + original_filename
                )

                file_path = os.path.join(
                    app.config["UPLOAD_FOLDER"],
                    unique_filename
                )

                file.save(file_path)

                photo_name = unique_filename

                photo_url = (
                    "/uploads/"
                    + unique_filename
                )

    # ----------------------------------------
    # VALIDATE LOCATION
    # ----------------------------------------

    location = get_location_by_name(
        location_name
    )

    if not location:

        return jsonify({

            "success": False,

            "message":
                "Invalid location selected"

        }), 400

    # ----------------------------------------
    # VALIDATE DESCRIPTION
    # ----------------------------------------

    if not description or not description.strip():

        return jsonify({

            "success": False,

            "message":
                "Description is required"

        }), 400

    # ----------------------------------------
    # DEFAULT VALUES
    # ----------------------------------------

    severity = severity or "Moderate"

    incident_type = (
        incident_type or "Other"
    )

    description = description.strip()

    # ----------------------------------------
    # MYSQL INSERT
    # ----------------------------------------

    conn = None
    cursor = None

    try:

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO incident_reports
            (
                location_id,
                severity,
                incident_type,
                description,
                photo_name,
                status
            )
            VALUES
            (%s, %s, %s, %s, %s, %s)
            """,
            (
                location.get("id", None),
                severity,
                incident_type,
                description,
                photo_name,
                "Reported"
            )
        )

        conn.commit()

        database_id = cursor.lastrowid

        incident_id = (
            "INC-"
            + datetime.now().strftime(
                "%Y%m%d"
            )
            + "-"
            + str(database_id).zfill(4)
        )

        reported_at = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        # If no photo URL was explicitly generated,
        # derive it from the stored filename.
        if photo_name:

            photo_url = (
                "/uploads/"
                + photo_name
            )

        report = {

            "id": incident_id,

            "database_id": database_id,

            "location":
                location["name"],

            "state":
                location["state"],

            "latitude":
                location["lat"],

            "longitude":
                location["lon"],

            "severity":
                severity,

            "incident_type":
                incident_type,

            "description":
                description,

            "photo_name":
                photo_name,

            "photo_url":
                photo_url,

            "status":
                "Reported",

            "reported_at":
                reported_at
        }

        return jsonify({

            "success": True,

            "message":
                "Incident reported successfully and saved to MySQL database",

            "report":
                report

        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Incident report database error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to save incident report",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# GET INCIDENT REPORTS
# ============================================

@app.route(
    "/api/reports",
    methods=["GET"]
)
def get_reports():

    conn = None
    cursor = None

    try:

        conn = get_db()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                ir.id AS database_id,
                ir.location_id,
                l.name AS location,
                l.state,
                l.latitude,
                l.longitude,
                ir.severity,
                ir.incident_type,
                ir.description,
                ir.photo_name,
                ir.status,
                ir.reported_at
            FROM incident_reports ir
            INNER JOIN locations l
                ON ir.location_id = l.id
            ORDER BY ir.reported_at DESC
            """
        )

        rows = cursor.fetchall()

        reports = []

        for row in rows:

            photo_url = None

            if row["photo_name"]:

                photo_url = (
                    "/uploads/"
                    + row["photo_name"]
                )

            incident_id = (
                "INC-"
                + str(row["reported_at"].strftime(
                    "%Y%m%d"
                ))
                + "-"
                + str(row["database_id"]).zfill(4)
            )

            reports.append({

                "id": incident_id,

                "database_id":
                    row["database_id"],

                "location":
                    row["location"],

                "state":
                    row["state"],

                "latitude":
                    float(row["latitude"]),

                "longitude":
                    float(row["longitude"]),

                "severity":
                    row["severity"],

                "incident_type":
                    row["incident_type"],

                "description":
                    row["description"],

                "photo_name":
                    row["photo_name"],

                "photo_url":
                    photo_url,

                "status":
                    row["status"],

                "reported_at":
                    str(row["reported_at"])
            })

        return jsonify({

            "success": True,

            "count":
                len(reports),

            "reports":
                reports
        })

    except Exception as e:

        print(
            "Get reports database error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to retrieve reports",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# DELETE SINGLE REPORT
# ============================================

@app.route(
    "/api/report/<report_id>",
    methods=["DELETE"]
)
def delete_report(report_id):

    if not session.get(
        "admin_logged_in"
    ):

        return jsonify({

            "success": False,

            "message":
                "Unauthorized: Only logged in admins can delete reports"

        }), 401

    conn = None
    cursor = None

    try:

        # Accept either:
        # INC-20260906-0001
        # or database integer ID

        if report_id.startswith("INC-"):

            database_id = int(
                report_id.split("-")[-1]
            )

        else:

            database_id = int(
                report_id
            )

        conn = get_db()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT photo_name
            FROM incident_reports
            WHERE id = %s
            """,
            (database_id,)
        )

        row = cursor.fetchone()

        if not row:

            return jsonify({

                "success": False,

                "message":
                    "Report not found"

            }), 404

        # ------------------------------------
        # DELETE PHOTO
        # ------------------------------------

        if row["photo_name"]:

            photo_path = os.path.join(

                app.config[
                    "UPLOAD_FOLDER"
                ],

                os.path.basename(
                    row["photo_name"]
                )
            )

            if os.path.exists(
                photo_path
            ):

                try:

                    os.remove(
                        photo_path
                    )

                except Exception as e:

                    print(
                        "Failed to delete photo:",
                        e
                    )

        # ------------------------------------
        # DELETE DATABASE RECORD
        # ------------------------------------

        cursor.execute(
            """
            DELETE FROM incident_reports
            WHERE id = %s
            """,
            (database_id,)
        )

        conn.commit()

        return jsonify({

            "success": True,

            "message":
                f"Report #{report_id} deleted successfully"

        })

    except ValueError:

        return jsonify({

            "success": False,

            "message":
                "Invalid report ID"

        }), 400

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Delete report error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to delete report",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# DELETE ALL REPORTS
# ============================================

@app.route(
    "/api/reports",
    methods=["DELETE"]
)
def delete_all_reports():

    if not session.get(
        "admin_logged_in"
    ):

        return jsonify({

            "success": False,

            "message":
                "Unauthorized: Only logged in admins can clear all reports"

        }), 401

    conn = None
    cursor = None

    try:

        conn = get_db()

        cursor = conn.cursor(
            dictionary=True
        )

        # Get all photos first
        cursor.execute(
            """
            SELECT photo_name
            FROM incident_reports
            WHERE photo_name IS NOT NULL
            """
        )

        rows = cursor.fetchall()

        # Delete photo files
        for row in rows:

            if row["photo_name"]:

                photo_path = os.path.join(

                    app.config[
                        "UPLOAD_FOLDER"
                    ],

                    os.path.basename(
                        row["photo_name"]
                    )
                )

                if os.path.exists(
                    photo_path
                ):

                    try:

                        os.remove(
                            photo_path
                        )

                    except Exception as e:

                        print(
                            "Failed to delete photo:",
                            e
                        )

        # Delete all records
        cursor.execute(
            "DELETE FROM incident_reports"
        )

        conn.commit()

        return jsonify({

            "success": True,

            "message":
                "All incident reports cleared successfully"

        })

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Delete all reports error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to clear reports",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# EXPORT REPORTS TO CSV
# ============================================

@app.route(
    "/api/reports/export",
    methods=["GET"]
)
def export_reports():

    conn = None
    cursor = None

    try:

        conn = get_db()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                ir.id AS database_id,
                l.name AS location,
                l.state,
                l.latitude,
                l.longitude,
                ir.severity,
                ir.incident_type,
                ir.description,
                ir.photo_name,
                ir.status,
                ir.reported_at
            FROM incident_reports ir
            INNER JOIN locations l
                ON ir.location_id = l.id
            ORDER BY ir.reported_at DESC
            """
        )

        rows = cursor.fetchall()

        output = io.StringIO()

        writer = csv.writer(
            output
        )

        writer.writerow([

            "Incident ID",

            "Location",

            "State",

            "Latitude",

            "Longitude",

            "Severity",

            "Incident Type",

            "Description",

            "Photo Name",

            "Photo URL",

            "Status",

            "Reported At"
        ])

        for row in rows:

            incident_id = (
                "INC-"
                + str(
                    row["reported_at"].strftime(
                        "%Y%m%d"
                    )
                )
                + "-"
                + str(
                    row["database_id"]
                ).zfill(4)
            )

            photo_url = None

            if row["photo_name"]:

                photo_url = (
                    "/uploads/"
                    + row["photo_name"]
                )

            writer.writerow([

                incident_id,

                row["location"],

                row["state"],

                row["latitude"],

                row["longitude"],

                row["severity"],

                row["incident_type"],

                row["description"],

                row["photo_name"],

                photo_url,

                row["status"],

                row["reported_at"]
            ])

        output.seek(0)

        return Response(

            output.getvalue(),

            mimetype="text/csv",

            headers={
                "Content-Disposition":
                    "attachment;filename=ner_landsafe_incident_reports.csv"
            }
        )

    except Exception as e:

        print(
            "CSV export error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to export reports",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# ADMIN SETTINGS
# ============================================

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "password123"


# ============================================
# ADMIN PORTAL
# ============================================

@app.route("/admin")
@app.route("/secret-admin-portal")
def admin_portal():

    return send_from_directory(
        FRONTEND_DIR,
        "admin.html"
    )


# ============================================
# ADMIN LOGIN
# ============================================

@app.route(
    "/api/admin/login",
    methods=["POST"]
)
def admin_login():

    data = request.get_json() or {}

    username = data.get(
        "username",
        ""
    ).strip()

    password = data.get(
        "password",
        ""
    ).strip()

    if (
        username == ADMIN_USERNAME
        and password == ADMIN_PASSWORD
    ):

        session[
            "admin_logged_in"
        ] = True

        session[
            "admin_user"
        ] = username

        return jsonify({

            "success": True,

            "message":
                "Admin login successful",

            "user":
                username
        })

    return jsonify({

        "success": False,

        "message":
            "Invalid admin username or password"

    }), 401


# ============================================
# ADMIN LOGOUT
# ============================================

@app.route(
    "/api/admin/logout",
    methods=["POST"]
)
def admin_logout():

    session.pop(
        "admin_logged_in",
        None
    )

    session.pop(
        "admin_user",
        None
    )

    return jsonify({

        "success": True,

        "message":
            "Logged out successfully"
    })


# ============================================
# ADMIN AUTH CHECK
# ============================================

@app.route(
    "/api/admin/check_auth",
    methods=["GET"]
)
def check_admin_auth():

    is_authenticated = session.get(
        "admin_logged_in",
        False
    )

    return jsonify({

        "authenticated":
            is_authenticated,

        "user":
            session.get(
                "admin_user",
                None
            )
            if is_authenticated
            else None
    })


# ============================================
# ADMIN STATISTICS
# ============================================

@app.route(
    "/api/admin/stats",
    methods=["GET"]
)
def admin_stats():

    if not session.get(
        "admin_logged_in"
    ):

        return jsonify({

            "success": False,

            "message":
                "Unauthorized admin access"

        }), 401

    conn = None
    cursor = None

    try:

        conn = get_db()

        cursor = conn.cursor(
            dictionary=True
        )

        # Total reports
        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM incident_reports
            """
        )

        total_reports = cursor.fetchone()[
            "total"
        ]

        # Status counts
        cursor.execute(
            """
            SELECT
                status,
                COUNT(*) AS count
            FROM incident_reports
            GROUP BY status
            """
        )

        status_rows = cursor.fetchall()

        status_counts = {

            row["status"]:
                row["count"]

            for row in status_rows
        }

        # Severity counts
        cursor.execute(
            """
            SELECT
                severity,
                COUNT(*) AS count
            FROM incident_reports
            GROUP BY severity
            """
        )

        severity_rows = cursor.fetchall()

        severity_counts = {

            row["severity"]:
                row["count"]

            for row in severity_rows
        }

        # Location count
        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM locations
            """
        )

        monitored_locations = cursor.fetchone()[
            "total"
        ]

        return jsonify({

            "success": True,

            "total_reports":
                total_reports,

            "monitored_locations":
                monitored_locations,

            "status_counts":
                status_counts,

            "severity_counts":
                severity_counts,

            "active_model":
                "Random Forest (Scikit-Learn)"
        })

    except Exception as e:

        print(
            "Admin stats error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to load admin statistics",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# UPDATE REPORT STATUS
# ============================================

@app.route(
    "/api/admin/report/<report_id>/status",
    methods=["PUT"]
)
def update_report_status(report_id):

    if not session.get(
        "admin_logged_in"
    ):

        return jsonify({

            "success": False,

            "message":
                "Unauthorized admin access"

        }), 401

    data = request.get_json() or {}

    new_status = data.get(
        "status"
    )

    if not new_status:

        return jsonify({

            "success": False,

            "message":
                "New status is required"

        }), 400

    try:

        if report_id.startswith("INC-"):

            database_id = int(
                report_id.split("-")[-1]
            )

        else:

            database_id = int(
                report_id
            )

    except ValueError:

        return jsonify({

            "success": False,

            "message":
                "Invalid report ID"

        }), 400

    conn = None
    cursor = None

    try:

        conn = get_db()

        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE incident_reports
            SET status = %s
            WHERE id = %s
            """,
            (
                new_status,
                database_id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({

                "success": False,

                "message":
                    "Report not found"

            }), 404

        conn.commit()

        return jsonify({

            "success": True,

            "message":
                f"Report #{report_id} status updated to {new_status}"
        })

    except Exception as e:

        if conn:
            conn.rollback()

        print(
            "Status update error:",
            e
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to update report status",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================
# BROADCAST EMERGENCY ALERT
# ============================================

@app.route(
    "/api/admin/broadcast_alert",
    methods=["POST"]
)
def broadcast_emergency_alert():

    if not session.get(
        "admin_logged_in"
    ):

        return jsonify({

            "success": False,

            "message":
                "Unauthorized admin access"

        }), 401

    mysql_locations = load_locations_from_mysql()

    current_locations = (
        mysql_locations
        if mysql_locations
        else locations
    )

    critical_zones = []

    for loc in current_locations:

        live_w = get_live_weather(
            loc["lat"],
            loc["lon"]
        )

        if (
            live_w
            and live_w["rainfall_24h"] > 0
        ):

            rain = live_w[
                "rainfall_24h"
            ]

            rain_3day = live_w[
                "rainfall_3day"
            ]

            soil = live_w[
                "soil_moisture"
            ]

        else:

            rain = loc["rainfall"]

            rain_3day = loc.get(
                "rainfall_3day",
                rain * 2
            )

            soil = loc[
                "soil_moisture"
            ]

        res = predict_risk(

            rainfall=rain,

            rainfall_3day=rain_3day,

            soil_moisture=soil,

            slope=loc["slope"],

            elevation=loc["elevation"],

            historical_landslides=
                loc["historical_landslides"]
        )

        if res["risk_level"] in [
            "CRITICAL",
            "HIGH"
        ]:

            critical_zones.append({

                "location":
                    loc["name"],

                "state":
                    loc["state"],

                "risk_score":
                    res["risk_score"],

                "risk_level":
                    res["risk_level"]
            })

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    zone_names = ", ".join(
        z["location"]
        for z in critical_zones
    )

    broadcast_msg = (

        f"EMERGENCY ADVISORY "
        f"[{timestamp}]: "
        f"Landslide risk detected in "
        f"{len(critical_zones)} zone(s) "
        f"({zone_names}). "
        f"Authorities and residents are "
        f"advised to evacuate slope bases "
        f"immediately."
    )

    return jsonify({

        "success": True,

        "timestamp":
            timestamp,

        "critical_zones_count":
            len(critical_zones),

        "critical_zones":
            critical_zones,

        "sms_payload":
            broadcast_msg,

        "broadcast_status":
            "DISPATCHED TO LOCAL NDRF & EMERGENCY CONTROLS"
    })


# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":

    print("=" * 55)

    print(
        "        NER-LANDSAFE BACKEND SERVER"
    )

    print("=" * 55)

    print(
        "Problem Statement : SIH26001"
    )

    print(
        "Server            : http://127.0.0.1:5000"
    )

    print(
        "Database          : MySQL (ner_landsafe)"
    )

    print("=" * 55)

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True
    )