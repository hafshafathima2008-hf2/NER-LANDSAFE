// ==========================================
// NER-LANDSAFE MULTILINGUAL TRANSLATION SYSTEM
// Languages: English (EN), Hindi (HI), Bengali (BN), Manipuri (MNI), Mizo (MIZ)
// ==========================================

const TRANSLATIONS = {
    EN: {
        app_title: "NER-LANDSAFE | AI Landslide Early Warning",
        problem_statement: "SIH26001 | Northeast India Hazard Intelligence",
        select_location: "Location:",
        select_language: "Language:",
        admin_portal: "Secret Admin Portal",
        
        // Navigation Tabs
        nav_overview: "Overview Dashboard",
        nav_map: "Risk Map & Radar",
        nav_report: "Report Incident",
        nav_safety: "Safety & Chatbot",

        // Offline Banner
        offline_mode: "📡 Offline Mode Active: Emergency guidelines and safety chatbot available.",
        
        // Cards
        risk_score_label: "AI Risk Probability",
        rainfall_label: "24h Live Precipitation",
        soil_moisture_label: "Soil Saturation",
        slope_label: "Terrain Slope",
        
        // Alert Center
        alert_center_title: "Emergency Alert Center",
        alert_priority: "Priority: HIGH",
        action_required: "Recommended Emergency Action:",
        
        // AI Analysis
        ai_analysis_title: "AI Landslide Hazard Assessment",
        model_confidence: "Model Confidence: 100% (Random Forest ML)",
        
        // AI Disclaimer
        disclaimer_title: "AI Model Disclaimer & Operational Notice",
        disclaimer_text: "NER-LANDSAFE is an AI-assisted early warning decision support tool integrated with live satellite weather feeds. Risk predictions are generated for emergency preparedness guidance. In critical weather situations, always follow official directives from NDRF, SDMA, and local district authorities.",

        // Map Control
        map_title: "Northeast India Spatial Hazard Map & Satellite Radar",
        
        // Incident Form
        report_title: "Report Citizen Landslide Incident",
        report_subtitle: "Help emergency services respond faster by reporting land movement, rockfalls, or road blockages.",
        label_location: "Select Location:",
        label_incident_type: "Incident Type:",
        label_severity: "Observed Severity:",
        label_description: "Description & Landmark Details:",
        label_photo: "Upload Photo Evidence:",
        btn_submit_report: "Submit Emergency Report",
        btn_export_csv: "Export CSV Data",
        
        // Chatbot
        chatbot_title: "Safety & Medical Prescription AI Assistant",
        chatbot_subtitle: "Ask for landslide safety precautions, first-aid instructions, or medical emergency advice.",
        chatbot_placeholder: "Ask emergency question (e.g. 'What to do in a landslide?', 'First aid for injuries')...",
        btn_send: "Send",
        
        // Quick Prompts
        prompt_precaution: "🌧️ Landslide Precautions",
        prompt_evacuation: "🚨 Evacuation Steps",
        prompt_firstaid: "🩹 First Aid Guidelines",
        prompt_medical: "💊 Medical Prescriptions",

        // Risk Levels
        risk_critical: "CRITICAL",
        risk_high: "HIGH",
        risk_moderate: "MODERATE",
        risk_low: "LOW"
    },

    HI: {
        app_title: "NER-LANDSAFE | एआई भूस्खलन पूर्व चेतावनी",
        problem_statement: "SIH26001 | पूर्वोत्तर भारत आपदा खुफिया प्रणाली",
        select_location: "स्थान चुनिए:",
        select_language: "भाषा:",
        admin_portal: "गुप्त व्यवस्थापक पोर्टल",
        
        nav_overview: "अवलोकन डैशबोर्ड",
        nav_map: "जोखिम मानचित्र एवं रडार",
        nav_report: "घटना की रिपोर्ट करें",
        nav_safety: "सुरक्षा एवं चैटबॉट",

        offline_mode: "📡 ऑफ़लाइन मोड सक्रिय: आपातकालीन निर्देश एवं चैटबॉट उपलब्ध हैं।",
        
        risk_score_label: "एआई जोखिम संभावना",
        rainfall_label: "24 घंटे की लाइव वर्षा",
        soil_moisture_label: "मिट्टी की नमी संतृप्ति",
        slope_label: "ढलान की प्रवणता",
        
        alert_center_title: "आपातकालीन चेतावनी केंद्र",
        alert_priority: "प्राथमिकता: उच्च",
        action_required: "अनुशंसित आपातकालीन कार्रवाई:",
        
        ai_analysis_title: "एआई भूस्खलन खतरा मूल्यांकन",
        model_confidence: "मॉडल सटीकता: 100% (रैंडम फ़ॉरेस्ट एमएल)",
        
        disclaimer_title: "एआई मॉडल अस्वीकरण एवं परिचालन सूचना",
        disclaimer_text: "NER-LANDSAFE लाइव उपग्रह मौसम डेटा के साथ एकीकृत एआई-सहायता प्राप्त प्रारंभिक चेतावनी निर्णय सहायता उपकरण है। आपातकालीन स्थिति में सदैव एनडीআরएफ, एसडीएमए तथा स्थानीय जिला प्रशासन के निर्देशों का पालन करें।",

        map_title: "पूर्वोत्तर भारत स्थानिक जोखिम मानचित्र एवं उपग्रह रडार",
        
        report_title: "नागरिक भूस्खलन घटना रिपोर्ट करें",
        report_subtitle: "भूमि खिसकने, चट्टान गिरने या सड़क मार्ग अवरुद्ध होने की रिपोर्ट देकर आपातकालीन सेवाओं की सहायता करें।",
        label_location: "स्थान चुनें:",
        label_incident_type: "घटना का प्रकार:",
        label_severity: "देखी गई गंभीरता:",
        label_description: "विवरण एवं स्थल की जानकारी:",
        label_photo: "साक्ष्य फोटो अपलोड करें:",
        btn_submit_report: "आपातकालीन रिपोर्ट जमा करें",
        btn_export_csv: "सीएसवी डेटा डाउनलोड करें",
        
        chatbot_title: "सुरक्षा एवं चिकित्सा आपातकालीन एआई सहायक",
        chatbot_subtitle: "भूस्खलन सुरक्षा सावधानियों, प्राथमिक चिकित्सा निर्देशों अथवा आपातकालीन चिकित्सा सलाह हेतु प्रश्न पूछें।",
        chatbot_placeholder: "आपातकालीन प्रश्न पूछें (जैसे 'भूस्खलन में क्या करें?', 'चोट का प्राथमिक उपचार')...",
        btn_send: "भेजें",
        
        prompt_precaution: "🌧️ भूस्खलन सावधानियां",
        prompt_evacuation: "🚨 निकासी कदम",
        prompt_firstaid: "🩹 प्राथमिक चिकित्सा",
        prompt_medical: "💊 चिकित्सा सलाह",

        risk_critical: "गंभीर (CRITICAL)",
        risk_high: "उच्च (HIGH)",
        risk_moderate: "मध्यम (MODERATE)",
        risk_low: "कम (LOW)"
    },

    BN: {
        app_title: "NER-LANDSAFE | এআই ভূমিধস পূর্বাভাস ব্যবস্থা",
        problem_statement: "SIH26001 | উত্তর-পূর্ব ভারত দুর্যোগ পূর্বাভাস",
        select_location: "স্থান নির্বাচন করুন:",
        select_language: "ভাষা:",
        admin_portal: "গোপন অ্যাডমিন পোর্টাল",
        
        nav_overview: "ড্যাশবোর্ড ওভারভিউ",
        nav_map: "ঝুঁকি মানচিত্র ও রাডার",
        nav_report: "ঘটনা রিপোর্ট করুন",
        nav_safety: "সুরক্ষা ও চ্যাটবট",

        offline_mode: "📡 অফলাইন মোড সক্রিয়: জরুরি নির্দেশিকা ও চ্যাটবট উপলব্ধ।",
        
        risk_score_label: "এআই ঝুঁকি সম্ভাবনা",
        rainfall_label: "২৪ ঘণ্টার লাইভ বৃষ্টিপাত",
        soil_moisture_label: "মাটির আর্দ্রতা",
        slope_label: "পাহাড়ের ঢাল",
        
        alert_center_title: "জরুরি সতর্কীকরণ কেন্দ্র",
        alert_priority: "অগ্রাধিকার: উচ্চ",
        action_required: "সুপারিশকৃত জরুরি পদক্ষেপ:",
        
        ai_analysis_title: "এআই ভূমিধস ঝুঁকি মূল্যায়ন",
        model_confidence: "মডেল নির্ভুলতা: ১০০% (র্যান্ডম ফরেস্ট এমএল)",
        
        disclaimer_title: "এআই মডেল সতর্কতা ও পরিচালনা নির্দেশিকা",
        disclaimer_text: "NER-LANDSAFE হলো লাইভ স্যাটেলাইট আবহাওয়া তথ্যের ওপর ভিত্তি করে তৈরি একটি এআই পূর্ব সতর্কীকরণ সহায়তা ব্যবস্থা। জরুরি পরিস্থিতিতে সর্বদাই NDRF, SDMA এবং স্থানীয় জেলা প্রশাসনের নির্দেশাবলী অনুসরণ করুন।",

        map_title: "উত্তর-পূর্ব ভারত ভৌগোলিক ঝুঁকি মানচিত্র ও স্যাটেলাইট রাডার",
        
        report_title: "নাগরিক ভূমিধস ঘটনা রিপোর্ট করুন",
        report_subtitle: "ভূমিধস, পাথর ধস বা রাস্তা অবরুদ্ধের খবর দিয়ে জরুরি সাহায্য টিমকে দ্রুত পৌঁছাতে সাহায্য করুন।",
        label_location: "স্থান নির্বাচন করুন:",
        label_incident_type: "ঘটনার ধরন:",
        label_severity: "তীব্রতা:",
        label_description: "বিবরণ ও স্থান বিবরণী:",
        label_photo: "প্রমাণস্বরূপ ছবি আপলোড করুন:",
        btn_submit_report: "জরুরি রিপোর্ট জমা দিন",
        btn_export_csv: "CSV তথ্য ডাউনলোড করুন",
        
        chatbot_title: "সুরক্ষা ও চিকিৎসা সেবা এআই সহকারী",
        chatbot_subtitle: "ভূমিধস সতর্কতা, প্রাথমিক চিকিৎসা নির্দেশিকা এবং জরুরি ওষুধপত্র সংক্রান্ত প্রশ্ন জিজ্ঞাসা করুন।",
        chatbot_placeholder: "প্রশ্ন লিখুন (যেমন 'ভূমিধসে করণীয় কী?', 'প্রাথমিক চিকিৎসা')...",
        btn_send: "পাঠান",
        
        prompt_precaution: "🌧️ ভূমিধস সতর্কতা",
        prompt_evacuation: "🚨 স্থানান্তরের পদক্ষেপ",
        prompt_firstaid: "🩹 প্রাথমিক চিকিৎসা",
        prompt_medical: "💊 জরুরি ওষুধপত্র",

        risk_critical: "অত্যন্ত সংকটজনক (CRITICAL)",
        risk_high: "উচ্চ ঝুঁকি (HIGH)",
        risk_moderate: "মাঝারি (MODERATE)",
        risk_low: "কম (LOW)"
    },

    MNI: {
        app_title: "NER-LANDSAFE | AI লৈবাক চিংশিং শুম্বগী চেপনবা পাও",
        problem_statement: "SIH26001 | অৱাং-নোংপোক্ষ ভারত লৈবাক চিংশিং চেকশিন পাও",
        select_location: "মফম খনবিয়ু:",
        select_language: "লোন খনবিয়ু:",
        admin_portal: "অশুকপা এডমিন পোর্তেল",
        
        nav_overview: "ওভরভিউ দেস্বোর্দ",
        nav_map: "ঝুঁকি মেপ অমসুং রাদার",
        nav_report: "থৌদোক পাওরোল থাবিয়ু",
        nav_safety: "চেকশিন থৌরাং অমসুং চেতবেৎ",

        offline_mode: "📡 অফলাইন মোদ চৎথরি: ইমর্জেন্সী চেকশিন পাও অমসুং চেতবেৎ ফংই।",
        
        risk_score_label: "AI ঝুঁকি চাং",
        rainfall_label: "২৪ পুংগী নোং চুবগী চাং",
        soil_moisture_label: "লৈমাইগী ঈশিং চাং",
        slope_label: "চিংগী চিংশিং চাং",
        
        alert_center_title: "ইমর্জেন্সী চেকশিন পাও কোল্লম",
        alert_priority: "মকোক থাক: ৱাংবা",
        action_required: "পীরিবা ইমর্জেন্সী চেকশিন থৌরাং:",
        
        ai_analysis_title: "AI লৈবাক শুম্বগী ঝুঁকি নৈনবা",
        model_confidence: "মডেল মচেৎ: ১০০% (রেন্দম ফোরেস্ত ML)",
        
        disclaimer_title: "AI মডেল চেকশিন পাও অমসুং রুলশিং",
        disclaimer_text: "NER-LANDSAFE সে লাইভ সেতেলাইত নোং-বাং পাওরোলগা লোয়ননা শেম্লবা AI চেপনবা পাও পীবগী উপাইনি। ইমর্জেন্সী মনুংদা NDRF, SDMA অমসুং জিলা লৈঙাক্কী পাওরোল ইলবিয়ু।",

        map_title: "অৱাং-নোংপোক্ষ ভারত লৈবাক শুম্বগী মেপ অমসুং সেতেলাইত রাদার",
        
        report_title: "প্রজাগী লৈবাক শুম্বগী থৌদোক পাও থাবিয়ু",
        report_subtitle: "লৈবাক শুম্বা, নুং শুংবা নত্রগা লম্বী থিংজিনবগী পাওরোল থারকতুনা ইমর্জেন্সী তীমদা মতেং পাংবিয়ু।",
        label_location: "মফম খনবিয়ু:",
        label_incident_type: "থৌদোক মখল:",
        label_severity: "উরিবা অরুবা চাং:",
        label_description: "অকুপ্পা মরোল:",
        label_photo: "ফোটো প্রুফ থাবিয়ু:",
        btn_submit_report: "ইমর্জেন্সী রিপোর্ট থাবিয়ু",
        btn_export_csv: "CSV ফংহনবিয়ু",
        
        chatbot_title: "চেকশিন থৌরাং অমসুং হিদাক-লাংথক AI চেতবেৎ",
        chatbot_subtitle: "লৈবাক শুম্বগী চেকশিন থৌরাং, অহানবা হিদাক লাইয়েং অমসুং মেদিকেল ইমর্জেন্সী পাও হাংবিয়ু।",
        chatbot_placeholder: "ৱাহং হাংবিয়ু (যেমন 'লৈবাক শুম্বদা করি তৌগনি?', 'অহানবা লাইয়েং')...",
        btn_send: "থাবিয়ু",
        
        prompt_precaution: "🌧️ লৈবাক শুম্বগী চেকশিন থৌরাং",
        prompt_evacuation: "🚨 নানথোকপগী থৌরাং",
        prompt_firstaid: "🩹 অহানবা লাইয়েং",
        prompt_medical: "💊 মেদিকেল চেকশিন পাও",

        risk_critical: "অত্যন্ত অরুবা (CRITICAL)",
        risk_high: "ৱাংবা (HIGH)",
        risk_moderate: "ময়াই চানবা (MODERATE)",
        risk_low: "নেম্বা (LOW)"
    },

    MIZ: {
        app_title: "NER-LANDSAFE | AI Min Lait Hma Hre Lawkna",
        problem_statement: "SIH26001 | Hmar Chhak India Chhiatrup Hre Lawkna",
        select_location: "Hmun Thlang Rawh:",
        select_language: "Tawng:",
        admin_portal: "Admin Thup Portal",
        
        nav_overview: "Dashboard Enna",
        nav_map: "Map & Radar",
        nav_report: "Chhiatrup Report Na",
        nav_safety: "Himna & Chatbot",

        offline_mode: "📡 Offline Mode: Chhiatrup kaihhnawh ruahmanna leh chatbot a hman theih.",
        
        risk_score_label: "AI Min Lait Dinhmun",
        rainfall_label: "Darkar 24 Ruah Sur Zawng",
        soil_moisture_label: "Lei Tuisip Dan",
        slope_label: "Tlang Awmchhoh Dan",
        
        alert_center_title: "Chhiatrup Vaukhan Hmun",
        alert_priority: "Thupui: SANG",
        action_required: "Zawm Tur Hma lakna:",
        
        ai_analysis_title: "AI Min Lait Dinhmun Chhutna",
        model_confidence: "Model Rintlak Dan: 100% (Random Forest ML)",
        
        disclaimer_title: "AI Model Hriattirna Leh Dan",
        disclaimer_text: "NER-LANDSAFE hi live satellite ruahsur dinhmun thleng nen AI bawk thila hriattirna a ni. Chhiatna a thlenin NDRF, SDMA leh sorkar thuneitute thuchhuah zawm tlat tur a ni.",

        map_title: "Hmar Chhak India Min Lait Map Leh Satellite Radar",
        
        report_title: "Min Lait Thleng Mipuite Report Na",
        report_subtitle: "Min lait, lung tawlh, leh kawng ping te report in emergency team te tanpui rawh.",
        label_location: "Hmun Thlang Rawh:",
        label_incident_type: "Chhiatrup Chu:",
        label_severity: "A Nasat Dan:",
        label_description: "A Chipchiar Leh Hmun Tawi:",
        label_photo: "Thlalak Thawn Rawh:",
        btn_submit_report: "Report Thawn Rawh",
        btn_export_csv: "CSV Data La Chhuak Rawh",
        
        chatbot_title: "Himna Leh Damdawi Lam AI Chatbot",
        chatbot_subtitle: "Min lait laka fihlim dan, hliam enkawl dan leh damdawi hman dan zawt rawh.",
        chatbot_placeholder: "Chhiatrup zawhna zawt rawh (entirnan 'Min lait in engtin nge tih tur?')...",
        btn_send: "Thawn",
        
        prompt_precaution: "🌧️ Min Lait Inbuatsaih Dan",
        prompt_evacuation: "🚨 Tlan Chhiatna Kalphung",
        prompt_firstaid: "🩹 Hliam Enkawlna",
        prompt_medical: "💊 Damdawi Lam Thurawn",

        risk_critical: "HLUAMAH (CRITICAL)",
        risk_high: "SANG (HIGH)",
        risk_moderate: "CHAWKANA (MODERATE)",
        risk_low: "HNIAM (LOW)"
    }
};
