import chromadb
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

# Initialize ChromaDB in-memory client
chroma_client = chromadb.Client()
# Create or get the collection
collection = chroma_client.get_or_create_collection(name="symptoms_to_tests")

# Load embedding model
logger.info("Loading sentence-transformers model (all-MiniLM-L6-v2)...")
try:
    embedder = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    logger.error(f"Failed to load sentence-transformers: {e}")
    raise e

from app.services.medical_dataset import MEDICAL_DATASET

def init_db():
    if embedder is None:
        return
    
    if collection.count() > 0:
        return
        
    logger.info("Initializing ChromaDB with medical scenarios...")
    ids = [item["id"] for item in MEDICAL_DATASET]
    documents = [item["symptoms"] for item in MEDICAL_DATASET]
    metadatas = [{"recommended_test": item["recommended_test"], "urgency": item["urgency"]} for item in MEDICAL_DATASET]
    
    embeddings = embedder.encode(documents).tolist()
    
    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )
    logger.info(f"Loaded {collection.count()} scenarios into Vector DB.")

init_db()

RED_FLAGS = [
    "chest pain", "short breath", "shortness of breath", 
    "fainting", "loss of consciousness", "coughing up blood", 
    "stroke", "heart attack", "can't breathe"
]

AMBIGUOUS_SYMPTOMS = {
    "stomach pain": [
        "Where exactly is the pain located (e.g., lower right, upper left)?",
        "How long have you had this pain?",
        "How severe is it on a scale of 1-10?",
        "Do you have any fever, vomiting, diarrhea, or urinary symptoms?"
    ],
    "headache": [
        "Is the pain throbbing, dull, or sharp?",
        "Where is the pain located (e.g., one side, behind eyes)?",
        "Do you have sensitivity to light or sound?",
        "Any nausea, vomiting, or visual changes?"
    ],
    "fever": [
        "How high is your fever?",
        "Do you have chills or night sweats?",
        "Do you have a cough, sore throat, or body aches?"
    ],
    "back pain": [
        "Is the pain in your upper, middle, or lower back?",
        "Does the pain radiate down your legs?",
        "Do you have any numbness, tingling, or weakness?",
        "Any loss of bladder or bowel control?"
    ],
    "pain": [
        "Where exactly is the pain?",
        "How long have you had it?",
        "How severe is it on a scale of 1-10?",
        "Are there any other symptoms like fever or swelling?"
    ]
}

def recommend_test_for_symptoms(user_query: str):
    """
    Takes user's natural language symptoms, checks safety flags, 
    prompts for follow-ups if ambiguous, or embeds them and searches the Vector DB.
    """
    if embedder is None:
        return {"error": "Embedding model not loaded properly."}
        
    query_lower = user_query.lower()
    
    # 1. SAFETY RED-FLAG LAYER
    for flag in RED_FLAGS:
        if flag in query_lower:
            return {
                "matched_symptoms": f"CRITICAL RED FLAG DETECTED: '{flag.upper()}'",
                "recommended_test": "Immediate Emergency Room Evaluation, ECG, Comprehensive Metabolic Panel, Troponin",
                "urgency": "High - Seek immediate emergency care",
                "match_distance": 0.0
            }
            
    # 2. AMBIGUOUS SYMPTOM LAYER (Intelligent Follow-up)
    word_count = len(query_lower.split())
    if word_count <= 4:
        for ambig, questions in AMBIGUOUS_SYMPTOMS.items():
            if ambig in query_lower:
                return {
                    "needs_followup": True,
                    "original_query": user_query,
                    "questions": questions
                }
        
    query_embedding = embedder.encode([user_query]).tolist()
    
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=1
    )
    
    if not results['documents'] or not results['documents'][0]:
        return {"error": "No matching medical scenarios found."}
        
    best_match_symptoms = results['documents'][0][0]
    best_match_meta = results['metadatas'][0][0]
    distance = results['distances'][0][0] if 'distances' in results and results['distances'] else 0.0
    
    if distance > 1.1:
        return {
            "matched_symptoms": "Symptoms too ambiguous or mixed. No exact clinical profile matched.",
            "recommended_test": "General Physician Consultation, Basic Health Panel",
            "urgency": "Moderate",
            "match_distance": round(distance, 4)
        }

    return {
        "matched_symptoms": best_match_symptoms,
        "recommended_test": best_match_meta["recommended_test"],
        "urgency": best_match_meta["urgency"],
        "match_distance": round(distance, 4)
    }
