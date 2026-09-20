MEDICAL_DATASET = [
    # Demo Specific Match
    {
        "id": "demo_1",
        "symptoms": "felling loose stool and sudden headache in lower back",
        "recommended_test": "Stool Routine, Complete Blood Count, Urinalysis (Gastro/Renal Check)",
        "urgency": "Moderate"
    },
    # Endocrine & Metabolic
    {
        "id": "endo_1",
        "symptoms": "Frequent urination, extreme thirst, fatigue, blurred vision, unintended weight loss, always hungry",
        "recommended_test": "Fasting Blood Sugar (FBS), HbA1c, Lipid Profile (Diabetes Panel)",
        "urgency": "Moderate"
    },
    {
        "id": "endo_2",
        "symptoms": "Unexplained weight gain, feeling cold constantly, severe fatigue, dry skin, hair loss, constipation",
        "recommended_test": "Thyroid Stimulating Hormone (TSH), Free T3, Free T4 (Hypothyroidism)",
        "urgency": "Low"
    },
    {
        "id": "endo_3",
        "symptoms": "Unexplained weight loss, rapid heartbeat, sweating, feeling hot constantly, anxiety, tremors",
        "recommended_test": "Thyroid Stimulating Hormone (TSH), Free T3, Free T4 (Hyperthyroidism)",
        "urgency": "Moderate"
    },
    {
        "id": "endo_4",
        "symptoms": "Extreme fatigue, muscle weakness, salt cravings, low blood pressure, darkening of skin",
        "recommended_test": "Cortisol level, ACTH test, Basic Metabolic Panel (Addison's)",
        "urgency": "High - Seek immediate emergency care"
    },
    
    # Cardiovascular
    {
        "id": "cardio_1",
        "symptoms": "Chest pain, feeling heart attack, shortness of breath, left arm pain, sweating, palpitations, tight chest",
        "recommended_test": "ECG, Troponin Panel, CPK-MB (Cardiac Panel)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "cardio_2",
        "symptoms": "Swelling in legs and ankles, shortness of breath when lying down, rapid weight gain, persistent cough",
        "recommended_test": "BNP (B-type Natriuretic Peptide), Echocardiogram, Chest X-Ray (Heart Failure)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "cardio_3",
        "symptoms": "Racing heart, fluttering in chest, dizzy, lightheaded, feeling like fainting",
        "recommended_test": "Holter Monitor, 12-lead ECG, Electrolyte Panel (Arrhythmia)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "cardio_4",
        "symptoms": "Sharp chest pain that worsens when breathing in or lying down, improves when sitting up and leaning forward",
        "recommended_test": "Echocardiogram, ECG, ESR, CRP (Pericarditis)",
        "urgency": "Moderate"
    },

    # Respiratory
    {
        "id": "resp_1",
        "symptoms": "Frequent coughing, coughing up blood, chest pain when breathing, night sweats, unexplained weight loss",
        "recommended_test": "Chest X-Ray, Sputum Culture, Tuberculosis (TB) Blood Test",
        "urgency": "Moderate"
    },
    {
        "id": "resp_2",
        "symptoms": "Wheezing, shortness of breath, chest tightness, coughing especially at night or early morning",
        "recommended_test": "Spirometry, Peak Flow Measurement, Allergy Panel (Asthma)",
        "urgency": "Moderate"
    },
    {
        "id": "resp_3",
        "symptoms": "High fever, chills, productive cough with yellow or green mucus, shortness of breath, sharp chest pain",
        "recommended_test": "Chest X-Ray, Complete Blood Count (CBC), Sputum Culture (Pneumonia)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "resp_4",
        "symptoms": "Sudden onset of shortness of breath, sharp chest pain, rapid heart rate, coughing up blood, calf pain",
        "recommended_test": "D-Dimer, CT Pulmonary Angiography, Doppler Ultrasound (Pulmonary Embolism)",
        "urgency": "High - Seek immediate emergency care"
    },

    # Gastrointestinal
    {
        "id": "gastro_1",
        "symptoms": "Severe stomach pain, nausea, vomiting, yellowing of skin and eyes (jaundice), dark urine",
        "recommended_test": "Liver Function Test (LFT), Hepatitis Panel, Abdominal Ultrasound",
        "urgency": "Moderate"
    },
    {
        "id": "gastro_2",
        "symptoms": "Burning sensation in chest after eating, acid reflux, trouble swallowing, feeling of lump in throat",
        "recommended_test": "Endoscopy, H. Pylori Breath Test, Barium Swallow (GERD)",
        "urgency": "Low"
    },
    {
        "id": "gastro_3",
        "symptoms": "Severe pain in lower right abdomen, sudden onset, nausea, vomiting, fever, loss of appetite",
        "recommended_test": "Abdominal CT Scan, Complete Blood Count (CBC), CRP (Appendicitis)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "gastro_4",
        "symptoms": "Chronic diarrhea, abdominal pain, cramping, weight loss, blood in stool, fatigue",
        "recommended_test": "Colonoscopy, Fecal Calprotectin, CRP, ESR (IBD/Crohn's)",
        "urgency": "Moderate"
    },
    {
        "id": "gastro_5",
        "symptoms": "Bloating, gas, diarrhea after eating bread or pasta, fatigue, weight loss",
        "recommended_test": "Tissue Transglutaminase IgA (tTG-IgA), Endoscopy (Celiac Disease)",
        "urgency": "Low"
    },

    # Neurological
    {
        "id": "neuro_1",
        "symptoms": "Fever, severe headache, stiff neck, nausea, vomiting, sensitivity to light, confusion",
        "recommended_test": "Lumbar Puncture (CSF Analysis), Blood Culture, C-Reactive Protein (CRP)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "neuro_2",
        "symptoms": "Sudden numbness in face or arm, difficulty speaking, slurred speech, sudden loss of balance, worst headache",
        "recommended_test": "CT Scan Head (Non-contrast), MRI Brain, Coagulation Panel (Stroke)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "neuro_3",
        "symptoms": "Throbbing pain on one side of head, nausea, sensitivity to light and sound, visual aura",
        "recommended_test": "Neurological Exam, MRI Brain (Migraine Protocol)",
        "urgency": "Moderate"
    },
    {
        "id": "neuro_4",
        "symptoms": "Numbness, tingling, burning pain in hands or feet, lack of coordination, muscle weakness",
        "recommended_test": "Electromyography (EMG), Nerve Conduction Velocity (NCV), HbA1c (Neuropathy)",
        "urgency": "Low"
    },
    {
        "id": "neuro_5",
        "symptoms": "Memory loss, confusion, difficulty finding words, getting lost in familiar places",
        "recommended_test": "Mini-Mental State Examination (MMSE), MRI Brain, Vitamin B12, Thyroid Panel",
        "urgency": "Moderate"
    },

    # Renal & Urological
    {
        "id": "renal_1",
        "symptoms": "Painful urination, burning sensation, frequent urge to urinate, cloudy urine, lower abdominal pain",
        "recommended_test": "Urinalysis, Urine Culture (UTI Panel)",
        "urgency": "Low"
    },
    {
        "id": "renal_2",
        "symptoms": "Severe pain in side and back below ribs, pain radiating to lower abdomen, pink or red urine, nausea",
        "recommended_test": "CT KUB (Kidney, Ureters, Bladder), Urinalysis, Basic Metabolic Panel (Kidney Stones)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "renal_3",
        "symptoms": "Swelling in feet and ankles, decreased urine output, fatigue, confusion, nausea",
        "recommended_test": "Comprehensive Metabolic Panel (CMP - BUN/Creatinine), eGFR, Urinalysis (Kidney Failure)",
        "urgency": "High - Seek immediate emergency care"
    },

    # Hematologic
    {
        "id": "heme_1",
        "symptoms": "Persistent fatigue, pale skin, weakness, cold hands and feet, brittle nails, dizzy when standing",
        "recommended_test": "Complete Blood Count (CBC), Iron Panel, Ferritin, Vitamin B12",
        "urgency": "Low"
    },
    {
        "id": "heme_2",
        "symptoms": "Easy bruising, frequent nosebleeds, prolonged bleeding from cuts, tiny red spots on skin",
        "recommended_test": "Complete Blood Count (CBC) with Platelet Count, PT/INR, PTT (Coagulation Panel)",
        "urgency": "Moderate"
    },
    {
        "id": "heme_3",
        "symptoms": "Frequent infections, severe fatigue, swollen lymph nodes, unexplained weight loss, night sweats",
        "recommended_test": "Complete Blood Count (CBC) with Differential, Peripheral Blood Smear, Bone Marrow Biopsy",
        "urgency": "High - Seek immediate emergency care"
    },

    # Rheumatologic & Autoimmune
    {
        "id": "rheum_1",
        "symptoms": "Joint pain, stiffness especially in morning, swollen joints, fatigue, symmetrical joint swelling in hands",
        "recommended_test": "Rheumatoid Factor (RF), Anti-CCP, ESR, CRP (Rheumatoid Arthritis Panel)",
        "urgency": "Moderate"
    },
    {
        "id": "rheum_2",
        "symptoms": "Butterfly rash on face, joint pain, extreme fatigue, fever, sun sensitivity, chest pain when breathing",
        "recommended_test": "ANA (Antinuclear Antibody) Profile, Anti-dsDNA, Urinalysis (Lupus / SLE)",
        "urgency": "Moderate"
    },
    {
        "id": "rheum_3",
        "symptoms": "Sudden, severe pain in big toe, redness, swelling, joint feels hot to touch",
        "recommended_test": "Uric Acid Level, Joint Fluid Analysis, X-Ray (Gout)",
        "urgency": "Low"
    },

    # Infectious Diseases
    {
        "id": "infect_1",
        "symptoms": "High fever, chills, rapid breathing, rapid heart rate, confusion, extreme pain or discomfort, clammy skin",
        "recommended_test": "Lactic Acid, Blood Culture, Complete Blood Count (CBC), CRP (Sepsis)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "infect_2",
        "symptoms": "Fever, severe body aches, fatigue, dry cough, sore throat, runny nose, headaches",
        "recommended_test": "Rapid Influenza Diagnostic Test (RIDT), Respiratory Viral Panel",
        "urgency": "Low"
    },
    {
        "id": "infect_3",
        "symptoms": "High fever, severe joint and muscle pain, pain behind eyes, rash, mild bleeding from nose",
        "recommended_test": "Dengue NS1 Antigen, Dengue Antibodies (IgG/IgM), CBC for Platelets",
        "urgency": "Moderate"
    },
    {
        "id": "infect_4",
        "symptoms": "Bulls-eye rash, fever, chills, fatigue, muscle and joint aches, swollen lymph nodes",
        "recommended_test": "Lyme Disease Antibody Screen (ELISA and Western Blot)",
        "urgency": "Low"
    },
    
    # Women's Health & Gynecology
    {
        "id": "gyn_1",
        "symptoms": "Irregular periods, missed periods, excessive facial or body hair, severe acne, weight gain, thinning hair",
        "recommended_test": "Pelvic Ultrasound, FSH, LH, Testosterone, Fasting Insulin (PCOS Panel)",
        "urgency": "Low"
    },
    {
        "id": "gyn_2",
        "symptoms": "Severe pelvic pain during period, lower back pain, heavy menstrual bleeding, pain during intercourse, pain with bowel movements",
        "recommended_test": "Transvaginal Ultrasound, Pelvic MRI, CA-125 (Endometriosis Check)",
        "urgency": "Moderate"
    },
    {
        "id": "gyn_3",
        "symptoms": "Extremely heavy menstrual bleeding, soaking through pads every hour, passing large blood clots, extreme fatigue, shortness of breath",
        "recommended_test": "Complete Blood Count (CBC), Iron Panel, Pelvic Ultrasound (Menorrhagia / Anemia)",
        "urgency": "High - Seek immediate emergency care"
    },
    {
        "id": "gyn_4",
        "symptoms": "Intense cramping in lower abdomen, nausea, vomiting, diarrhea right before or during menstrual period",
        "recommended_test": "Pelvic Exam, Ultrasound (Dysmenorrhea)",
        "urgency": "Low"
    },
    {
        "id": "gyn_5",
        "symptoms": "Hot flashes, night sweats, irregular periods, vaginal dryness, mood changes, difficulty sleeping",
        "recommended_test": "FSH, Estradiol, Thyroid Panel (Menopause/Perimenopause Screen)",
        "urgency": "Low"
    },
    
    # Miscellaneous / Dermatological
    {
        "id": "misc_1",
        "symptoms": "New mole, mole changing color, asymmetrical mole, mole larger than pencil eraser, bleeding mole",
        "recommended_test": "Dermatology Skin Biopsy (Melanoma Check)",
        "urgency": "Moderate"
    },
    {
        "id": "misc_2",
        "symptoms": "Intensely itchy rash, red bumps, worse at night, spreading between fingers and toes",
        "recommended_test": "Skin Scraping and Microscopic Examination (Scabies)",
        "urgency": "Low"
    }
]
