// ==========================================
// NER-LANDSAFE FRONTEND SCRIPT
// ==========================================

// Backend URL
const API_URL = "http://127.0.0.1:5000";

// Map variables
let map;
let allLocations = [];
let markers = [];
let riskZones = [];
let reportMarkers = [];


// Current active location
let currentSelectedLocation = "Churachandpur";

// Handle topbar location change
function onLocationChange(locationName) {
    currentSelectedLocation = locationName;
    loadRiskData(locationName);
}

// ==========================================
// 1. LOAD MAIN RISK DATA
// ==========================================

async function loadRiskData(locationName) {
    if (!locationName) locationName = currentSelectedLocation;

    try {
        const response = await fetch(`${API_URL}/api/risk?location=${encodeURIComponent(locationName)}`);
        const data = await response.json();

        console.log("Risk Data:", data);

        const selectElem = document.getElementById("topLocationSelect");
        if (selectElem) selectElem.value = data.location;


        // ------------------------------
        // Dashboard cards
        // ------------------------------

        const riskScoreElement = document.getElementById("riskScore");

        if (riskScoreElement) {
            riskScoreElement.textContent = data.risk_score + "%";
        }


        const rainfallElement = document.getElementById("rainfall");

        if (rainfallElement) {
            rainfallElement.textContent = data.rainfall + " mm";
        }


        const soilElement = document.getElementById("soilMoisture");

        if (soilElement) {
            soilElement.textContent = data.soil_moisture + "%";
        }


        const slopeElement = document.getElementById("slope");

        if (slopeElement) {
            slopeElement.textContent = data.slope + "°";
        }


        // ------------------------------
        // Location
        // ------------------------------

        const locationElement = document.getElementById("location");

        if (locationElement) {
            locationElement.textContent = data.location;
        }


        // ------------------------------
        // Model name
        // ------------------------------

        const modelElement = document.getElementById("modelName");

        if (modelElement) {
            modelElement.textContent = data.model;
        }


        // ------------------------------
        // AI Risk Analysis
        // ------------------------------

        updateAIAnalysis(data);


        // ------------------------------
        // Alert Center
        // ------------------------------

        updateAlertCenter(data);


    } catch (error) {

        console.error("Risk data error:", error);

    }
}



// ==========================================
// 2. AI RISK ANALYSIS
// ==========================================

function updateAIAnalysis(data) {

    const rainfall = document.getElementById("analysisRainfall");

    if (rainfall) {
        rainfall.textContent = data.rainfall + " mm";
    }


    const soil = document.getElementById("analysisSoil");

    if (soil) {
        soil.textContent = data.soil_moisture + "%";
    }


    const slope = document.getElementById("analysisSlope");

    if (slope) {
        slope.textContent = data.slope + "°";
    }


    const elevation = document.getElementById("analysisElevation");

    if (elevation) {
        elevation.textContent = data.elevation + " m";
    }


    const history = document.getElementById("analysisHistory");

    if (history) {
        history.textContent = data.historical_landslides;
    }


    const risk = document.getElementById("analysisRisk");

    if (risk) {
        risk.textContent = data.risk_score + "%";
    }


    const riskLevel = document.getElementById("analysisRiskLevel");

    if (riskLevel) {
        riskLevel.textContent = data.risk_level;
    }

}


// ==========================================
// 3. ALERT CENTER
// ==========================================

function updateAlertCenter(data) {

    const alert = data.alert;


    const alertTitle = document.getElementById("alertTitle");

    if (alertTitle) {
        alertTitle.textContent =
            getAlertIcon(alert.level) + " " + alert.level + " RISK";
    }


    const alertMessage = document.getElementById("alertMessage");

    if (alertMessage) {
        alertMessage.textContent = alert.message;
    }


    const alertRiskScore = document.getElementById("alertRiskScore");

    if (alertRiskScore) {
        alertRiskScore.textContent = data.risk_score + "%";
    }


    const alertAction = document.getElementById("alertAction");

    if (alertAction) {
        alertAction.textContent = alert.action;
    }


    const alertPriority = document.getElementById("alertPriority");

    if (alertPriority) {
        alertPriority.textContent =
            "Priority: " + alert.priority;
    }


    const alertStatus = document.getElementById("alertStatus");

    if (alertStatus) {
        alertStatus.textContent =
            alert.level + " ALERT";
    }


    // Change alert box class
    const mainAlert = document.getElementById("mainAlert");

    if (mainAlert) {

        mainAlert.classList.remove(
            "critical",
            "high",
            "moderate",
            "low"
        );

        mainAlert.classList.add(
            alert.level.toLowerCase()
        );
    }

}



// ==========================================
// 4. ALERT ICON
// ==========================================

function getAlertIcon(level) {

    if (level === "CRITICAL") {
        return "🚨";
    }

    if (level === "HIGH") {
        return "⚠️";
    }

    if (level === "MODERATE") {
        return "🟡";
    }

    return "🟢";
}



// ==========================================
// 5. RISK COLOR
// ==========================================

function getRiskColor(level) {

    if (level === "CRITICAL") {
        return "#dc2626";
    }

    if (level === "HIGH") {
        return "#ea580c";
    }

    if (level === "MODERATE") {
        return "#eab308";
    }

    return "#16a34a";
}



let radarLayer;
let heatMapLayer;

function initializeMap() {

    map = L.map("riskMap").setView(
        [25.0, 92.5],
        6
    );

    // OpenStreetMap tiles
    const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    // Live Satellite Precipitation Radar Layer
    radarLayer = L.tileLayer(
        "https://tilecache.rainviewer.com/v2/radar/nowcast_5min/256/{z}/{x}/{y}/2/1_1.png",
        {
            opacity: 0.65,
            attribution: '&copy; RainViewer Satellite Radar'
        }
    );

    // Spatial Landslide Risk Heatmap Layer
    if (typeof L.heatLayer === "function") {
        heatMapLayer = L.heatLayer([], {
            radius: 35,
            blur: 20,
            maxZoom: 10,
            gradient: {
                0.2: '#16a34a',
                0.4: '#eab308',
                0.7: '#ea580c',
                1.0: '#dc2626'
            }
        }).addTo(map);
    }

    const baseMaps = {
        "Base Map": osm
    };

    const overlayMaps = {
        "Landslide Risk Heatmap 🔥": heatMapLayer,
        "Live Weather Satellite Radar 📡": radarLayer
    };

    L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);

    // Load AI risk locations
    loadLocations();
}



// ==========================================
// 7. LOAD LOCATIONS
// ==========================================

async function loadLocations() {

    try {

        const response =
            await fetch(`${API_URL}/api/locations`);

        const data = await response.json();

        console.log("Locations:", data);

        allLocations = Array.isArray(data)
    ? data
    : (data.locations || []);

console.log("Locations loaded:", allLocations);

updateRiskSummary(allLocations);

populateLocationFilter();

displayLocations(allLocations);

    } catch (error) {

        console.error(
            "Location loading error:",
            error
        );

    }

}



// ==========================================
// 8. LOCATION FILTER
// ==========================================

function populateLocationFilter() {

    const filter =
        document.getElementById("locationFilter");

    if (!filter) {
        return;
    }


    // Keep All Locations option

    filter.innerHTML =
        '<option value="ALL">All Locations</option>';


    allLocations.forEach(function(location) {

        const option =
            document.createElement("option");

        option.value = location.name;

        option.textContent = location.name;

        filter.appendChild(option);

    });


    // Filter change

    filter.addEventListener(
        "change",
        function() {

            const selected =
                filter.value;


            if (selected === "ALL") {

                displayLocations(allLocations);

                map.setView(
                    [25.0, 92.5],
                    6
                );

            } else {

                const selectedLocation =
                    allLocations.find(
                        function(location) {
                            return location.name === selected;
                        }
                    );


                if (selectedLocation) {

                    displayLocations(
                        [selectedLocation]
                    );


                    map.setView(
                        [
                            selectedLocation.lat,
                            selectedLocation.lon
                        ],
                        9
                    );

                }

            }

        }
    );

}



// ==========================================
// 9. DISPLAY AI RISK LOCATIONS
// ==========================================

function displayLocations(locations) {

    clearMap();

    // Update Spatial Risk Heatmap Layer
    if (heatMapLayer && typeof heatMapLayer.setLatLngs === "function") {
        const heatPoints = locations.map(loc => [
            loc.lat,
            loc.lon,
            (loc.risk_score || 50) / 100
        ]);
        heatMapLayer.setLatLngs(heatPoints);
    }

    locations.forEach(function(location) {

        const color =
            getRiskColor(
                location.risk_level
            );


        // ------------------------------
        // Risk Zone
        // ------------------------------

        const zone =
            L.circle(
                [
                    location.lat,
                    location.lon
                ],
                {
                    radius: 18000,

                    color: color,

                    fillColor: color,

                    fillOpacity: 0.15,

                    weight: 2
                }
            ).addTo(map);


        riskZones.push(zone);


        // ------------------------------
        // Location Marker
        // ------------------------------

        const marker =
            L.circleMarker(
                [
                    location.lat,
                    location.lon
                ],
                {
                    radius: 9,

                    color: color,

                    fillColor: color,

                    fillOpacity: 0.9,

                    weight: 2
                }
            ).addTo(map);


        marker.bindPopup(`

            <div style="min-width:240px;">

                <h3>
                    📍 ${location.name}
                </h3>

                <hr>

                <p>
                    <strong>Risk Score:</strong>
                    ${location.risk_score}%
                </p>

                <p>
                    <strong>Risk Level:</strong>
                    ${location.risk_level}
                </p>

                <p>
                    <strong>Rainfall:</strong>
                    ${location.rainfall} mm
                </p>

                <p>
                    <strong>Soil Moisture:</strong>
                    ${location.soil_moisture}%
                </p>

                <p>
                    <strong>Slope:</strong>
                    ${location.slope}°
                </p>

                <p>
                    <strong>Elevation:</strong>
                    ${location.elevation} m
                </p>

                <p>
                    <strong>Historical Landslides:</strong>
                    ${location.historical_landslides}
                </p>

                <hr>

                <p>
                    <strong>Priority:</strong>
                    ${location.alert.priority}
                </p>

                <p>
                    <strong>Action:</strong>
                    ${location.alert.action}
                </p>

                <p>
                    <strong>AI Model:</strong>
                    ${location.model || "Random Forest"}
                </p>

            </div>

        `);


        markers.push(marker);

    });


    // Load incident reports after
    // displaying AI locations

    loadReportsOnMap();

}

// ==========================================
// LIVE RISK SUMMARY
// ==========================================

function updateRiskSummary(locations) {

    const mapElement = document.getElementById("riskMap");

    if (!mapElement || !mapElement.parentElement) {
        return;
    }

    let summary = document.getElementById("riskSummary");

    // Create summary box if it does not exist
    if (!summary) {

        summary = document.createElement("div");

        summary.id = "riskSummary";

        summary.style.cssText = `
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin: 10px 0;
            padding: 12px;
            background: #ffffff;
            border: 1px solid #dbe3ef;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            font-family: Arial, sans-serif;
        `;

        mapElement.parentElement.insertBefore(
            summary,
            mapElement
        );
    }

    // Count risk levels
    let critical = 0;
    let high = 0;
    let moderate = 0;
    let low = 0;

    locations.forEach(function(location) {

        const level =
            String(location.risk_level || "").toUpperCase();

        if (level === "CRITICAL") {
            critical++;
        }
        else if (level === "HIGH") {
            high++;
        }
        else if (level === "MODERATE") {
            moderate++;
        }
        else if (level === "LOW") {
            low++;
        }

    });

    const total = locations.length;

    summary.innerHTML = `

        <div style="
            text-align:center;
            padding:8px;
            border-right:1px solid #e5e7eb;
        ">
            <div style="font-size:20px;">📍</div>
            <strong style="font-size:18px;">
                ${total}
            </strong>
            <div style="font-size:10px;color:#64748b;">
                MONITORED
            </div>
        </div>

        <div style="
            text-align:center;
            padding:8px;
            border-right:1px solid #e5e7eb;
        ">
            <div style="font-size:20px;">🚨</div>
            <strong style="font-size:18px;color:#dc2626;">
                ${critical}
            </strong>
            <div style="font-size:10px;color:#64748b;">
                CRITICAL
            </div>
        </div>

        <div style="
            text-align:center;
            padding:8px;
            border-right:1px solid #e5e7eb;
        ">
            <div style="font-size:20px;">⚠️</div>
            <strong style="font-size:18px;color:#ea580c;">
                ${high}
            </strong>
            <div style="font-size:10px;color:#64748b;">
                HIGH
            </div>
        </div>

        <div style="
            text-align:center;
            padding:8px;
            border-right:1px solid #e5e7eb;
        ">
            <div style="font-size:20px;">🟡</div>
            <strong style="font-size:18px;color:#ca8a04;">
                ${moderate}
            </strong>
            <div style="font-size:10px;color:#64748b;">
                MODERATE
            </div>
        </div>

        <div style="
            text-align:center;
            padding:8px;
        ">
            <div style="font-size:20px;">🟢</div>
            <strong style="font-size:18px;color:#16a34a;">
                ${low}
            </strong>
            <div style="font-size:10px;color:#64748b;">
                LOW
            </div>
        </div>

    `;
}



// ==========================================
// 10. CLEAR AI MAP LAYERS
// ==========================================

function clearMap() {

    markers.forEach(function(marker) {

        map.removeLayer(marker);

    });


    riskZones.forEach(function(zone) {

        map.removeLayer(zone);

    });


    markers = [];

    riskZones = [];

}



// ==========================================
// 11. SUBMIT INCIDENT REPORT
// ==========================================

// ==========================================
// 11. SUBMIT INCIDENT REPORT
// ==========================================

async function submitIncidentReport() {

    const location = document.getElementById("reportLocation").value.trim();
    const severity = document.getElementById("reportSeverity").value;
    const type = document.getElementById("reportType").value;
    const description = document.getElementById("reportDescription").value.trim();
    const photoFile = document.getElementById("reportPhoto").files[0];

    // Validation
    if (!location) {
        alert("Please select the incident location.");
        return;
    }

    if (!description) {
        alert("Please enter an incident description.");
        return;
    }

    const submitBtn = document.getElementById("submitReportBtn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    }

    try {
        let response;
        if (photoFile) {
            const formData = new FormData();
            formData.append("location", location);
            formData.append("severity", severity);
            formData.append("incident_type", type);
            formData.append("description", description);
            formData.append("photo", photoFile);

            response = await fetch(`${API_URL}/api/report`, {
                method: "POST",
                body: formData
            });
        } else {
            response = await fetch(`${API_URL}/api/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location: location,
                    severity: severity,
                    incident_type: type,
                    description: description
                })
            });
        }

        const data = await response.json();

        if (response.ok) {
            alert("Incident report submitted successfully!");

            document.getElementById("reportLocation").value = "";
            document.getElementById("reportDescription").value = "";
            document.getElementById("reportPhoto").value = "";

            loadIncidentReports();
            loadReportsOnMap();
        } else {
            alert(data.message || "Unable to submit the report.");
        }
    } catch (error) {
        console.error("Report submission error:", error);
        alert("Cannot connect to the backend server.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Incident Report';
        }
    }
}


// ==========================================
// 12. LOAD INCIDENT REPORTS
// ==========================================

async function loadIncidentReports() {
    try {
        const response = await fetch(`${API_URL}/api/reports`);
        const data = await response.json();
        displayIncidentReports(data.reports || []);
    } catch (error) {
        console.error("Incident reports error:", error);
    }
}


// ==========================================
// 13. DISPLAY INCIDENT REPORTS
// ==========================================

function displayIncidentReports(reports) {
    const container = document.getElementById("reportsContainer");
    const count = document.getElementById("reportCount");

    if (!container || !count) return;

    count.textContent = reports.length;

    if (reports.length === 0) {
        container.innerHTML = `
            <div class="no-reports">
                <i class="fa-solid fa-inbox"></i>
                <strong>No incident reports submitted yet.</strong>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    reports.forEach(function(report) {
        const severityClass = "severity-" + (report.severity || "moderate").toLowerCase();
        const card = document.createElement("div");
        card.className = "report-card";

       const photoHtml = report.photo_url
    ? `<div class="report-photo" style="margin-top:10px;">
         <img src="${API_URL}${report.photo_url}"
              alt="Report Photo"
              style="max-width:100%; max-height:200px; border-radius:8px; object-fit:cover; border:1px solid #e2e8f0;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
         <div style="display:none; color:#dc2626; font-size:12px; margin-top:5px;">
             ⚠️ Unable to load report photo
         </div>
       </div>`
    : (report.photo_name
        ? `<div class="report-photo" style="margin-top:8px; font-size:12px; color:#64748b;">
             📸 Photo: ${escapeHtml(report.photo_name)}
           </div>`
        : '');

        card.innerHTML = `
            <div class="report-card-header">
                <div>
                    <h3>📍 ${escapeHtml(report.location)}</h3>
                    <span class="report-id">Report #${escapeHtml(report.id)}</span>
                </div>
                <span class="severity-badge ${severityClass}">${escapeHtml(report.severity)}</span>
            </div>

            <div class="report-details">
                <div class="report-detail">
                    <strong>INCIDENT TYPE</strong>
                    <span>${formatIncidentType(report.incident_type)}</span>
                </div>
                <div class="report-detail">
                    <strong>REPORTED AT</strong>
                    <span>${formatReportDate(report.reported_at)}</span>
                </div>
                <div class="report-detail">
                    <strong>STATUS</strong>
                    <span style="color:#16a34a; font-weight:600;">${escapeHtml(report.status || "Reported")}</span>
                </div>
            </div>

            <div class="report-description" style="margin-top:10px; font-size:13px; color:#334155;">
                <strong>Description:</strong><br>
                ${escapeHtml(report.description)}
            </div>

            ${photoHtml}
        `;

        container.appendChild(card);
    });
}

// Delete single report
async function deleteSingleReport(reportId) {
    if (!confirm(`Are you sure you want to delete report #${reportId}?`)) return;

    try {
        const response = await fetch(`${API_URL}/api/report/${reportId}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Report deleted successfully.");
            loadIncidentReports();
            loadReportsOnMap();
        } else {
            alert(data.message || "Failed to delete report.");
        }
    } catch (error) {
        console.error("Delete report error:", error);
        alert("Cannot connect to server.");
    }
}

// Delete all reports
async function clearAllIncidentReports() {
    if (!confirm("Are you sure you want to delete ALL incident reports? This action cannot be undone.")) return;

    try {
        const response = await fetch(`${API_URL}/api/reports`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (response.ok) {
            alert("All incident reports have been cleared.");
            loadIncidentReports();
            loadReportsOnMap();
        } else {
            alert(data.message || "Failed to clear reports.");
        }
    } catch (error) {
        console.error("Clear reports error:", error);
        alert("Cannot connect to server.");
    }
}


// ==========================================
// 14. FORMAT INCIDENT TYPE
// ==========================================

function formatIncidentType(type) {
    if (!type) return "Other";
    return type.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}


// ==========================================
// 15. SHOW INCIDENT REPORTS ON MAP
// ==========================================

async function loadReportsOnMap() {
    if (!map) return;
    try {
        const response = await fetch(`${API_URL}/api/reports`);
        const data = await response.json();
        const reports = Array.isArray(data) ? data : (data.reports || []);
        displayReportsOnMap(reports);
    } catch (error) {
        console.error("Map reports error:", error);
    }
}


// ==========================================
// 16. DISPLAY REPORT MARKERS
// ==========================================

function displayReportsOnMap(reports) {
    reportMarkers.forEach(marker => map.removeLayer(marker));
    reportMarkers = [];

    reports.forEach(report => {
        if (report.latitude === null || report.longitude === null || report.latitude === undefined) return;

        let markerColor = "#eab308";
        const severity = String(report.severity || "").toLowerCase();

        if (severity === "critical") markerColor = "#dc2626";
        else if (severity === "high") markerColor = "#ea580c";
        else if (severity === "moderate") markerColor = "#eab308";
        else if (severity === "low") markerColor = "#16a34a";

        const marker = L.circleMarker([report.latitude, report.longitude], {
            radius: 9,
            fillColor: markerColor,
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        });

        const imageHtml = report.photo_url
            ? `<div style="margin-top:6px;"><img src="${API_URL}${report.photo_url}" style="width:100%; height:100px; object-fit:cover; border-radius:6px;" /></div>`
            : '';

        const popupContent = `
            <div style="min-width:220px;">
                <div style="font-size:9px; font-weight:800; color:#2563eb; letter-spacing:0.8px; margin-bottom:4px;">
                    CITIZEN INCIDENT REPORT
                </div>
                <h3 style="margin:0 0 7px 0; font-size:15px; color:#172033;">
                    📍 ${escapeHtml(report.location)}
                </h3>
                <div style="font-size:10px; color:#68768a; line-height:1.7;">
                    <strong>Incident:</strong> ${escapeHtml(formatIncidentType(report.incident_type))}<br>
                    <strong>Severity:</strong> ${escapeHtml((report.severity || "").toUpperCase())}<br>
                    <strong>Status:</strong> ${escapeHtml(report.status || "Reported")}<br>
                    <strong>Reported:</strong> ${formatReportDate(report.reported_at)}
                </div>
                <div style="margin-top:8px; padding-top:6px; border-top:1px solid #e5eaf0; font-size:10px; color:#475569;">
                    ${escapeHtml(report.description)}
                </div>
                ${imageHtml}
            </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(map);
        reportMarkers.push(marker);
    });
}

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function formatReportDate(dateValue) {

    if (!dateValue) {
        return "Unknown";
    }

    try {

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleString();

    }
    catch (error) {

        return String(dateValue);

    }
}

// ==========================================
// 16.5 MULTILINGUAL SUPPORT ENGINE (EN, HI, BN, MNI, MIZ)
// ==========================================

let currentLang = "EN";

function setLanguage(langCode) {
    if (typeof TRANSLATIONS === "undefined" || !TRANSLATIONS[langCode]) return;
    currentLang = langCode;
    const t = TRANSLATIONS[langCode];

    const langSelect = document.getElementById("langSelect");
    if (langSelect) langSelect.value = langCode;

    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (t[key]) {
            elem.textContent = t[key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
        const key = elem.getAttribute("data-i18n-placeholder");
        if (t[key]) {
            elem.placeholder = t[key];
        }
    });
}

// Service Worker & PWA Offline Status Handling
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('PWA Service Worker active:', reg.scope))
            .catch(err => console.log('Service Worker notice:', err));
    });
}

function updateNetworkStatus() {
    const chip = document.getElementById("networkStatusChip");
    const dot = document.getElementById("networkStatusDot");
    const text = document.getElementById("networkStatusText");

    if (!chip || !dot || !text) return;

    if (navigator.onLine) {
        dot.style.background = "#22c55e";
        text.textContent = "Operational";
        chip.style.borderColor = "#22c55e44";
    } else {
        dot.style.background = "#ef4444";
        text.textContent = "Offline Mode";
        chip.style.borderColor = "#ef444444";
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);
updateNetworkStatus();

// ==========================================
// 17. START APPLICATION
// ==========================================

loadRiskData();

initializeMap();

loadIncidentReports();

setLanguage(currentLang);

// ==========================================
// 18. AUTO REFRESH (EVERY 30s)
// ==========================================
setInterval(function() {
    loadRiskData();
    if (typeof loadLocations === "function") loadLocations();
    loadIncidentReports();
}, 30000);

// ============================================
// AI IMAGE ANALYZER
// ============================================

async function analyzeUploadedImage() {

    const fileInput = document.getElementById("reportPhoto");
    const analyzeButton = document.getElementById("analyzeImageBtn");
    const resultBox = document.getElementById("imageAnalysisResult");

    if (!fileInput || !fileInput.files.length) {

        alert("Please upload a field photograph first.");

        return;
    }

    const imageFile = fileInput.files[0];

    const formData = new FormData();

    formData.append("image", imageFile);

    analyzeButton.disabled = true;

    analyzeButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Analyzing Image...
    `;

    try {

        const response = await fetch(
            `${API_URL}/api/analyze-image`,
           { 
                method: "POST",
                body: formData
           }
    ); 

        const result = await response.json();

        if (!result.success) {

            throw new Error(
                result.error || "Image analysis failed."
            );
        }

        // Show result box

        resultBox.style.display = "block";

        // Risk level

        document.getElementById(
            "visualRiskLevel"
        ).textContent = result.visual_risk;

        // Detected category

        document.getElementById(
            "visualCategory"
        ).textContent = result.top_category;

        // Confidence

        document.getElementById(
            "visualConfidence"
        ).textContent =
            result.confidence + "%";

        // Message

        document.getElementById(
            "visualMessage"
        ).textContent = result.message;

        // Indicators

        const indicatorsList =
            document.getElementById(
                "visualIndicators"
            );

        indicatorsList.innerHTML = "";

        result.indicators.forEach(
            function(indicator) {

                const li =
                    document.createElement("li");

                li.textContent = indicator;

                indicatorsList.appendChild(li);
            }
        );

    }
    catch (error) {

        console.error(
            "Image analysis error:",
            error
        );

        alert(
            "Image analysis failed: " +
            error.message
        );
    }
    finally {

        analyzeButton.disabled = false;

        analyzeButton.innerHTML = `
            <i class="fa-solid fa-magnifying-glass-chart"></i>
            Analyze Image with AI
        `;
    }
}