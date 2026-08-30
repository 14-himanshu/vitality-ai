import os
import json
import base64
# pyrefly: ignore [missing-import]
import chromadb
# pyrefly: ignore [missing-import]
from groq import Groq
from usda_api import search_nutrition
from pubmed_api import search_pubmed

# Setup Groq Client
client = Groq(api_key=os.environ.get("GROQ_API_KEY", "your-api-key-here"), timeout=10.0)

# Setup RAG / ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="clinical_guidelines")

try:
    if collection.count() == 0:
        # Seed with some clinical guidelines for RAG
        collection.add(
            documents=[
                "Clinical Guideline 1: Do not recommend calorie deficits exceeding 1000 calories below maintenance. High risk of metabolic damage.",
                "Clinical Guideline 2: For patients with elevated LDL cholesterol (>130 mg/dL), recommend replacing saturated fats with polyunsaturated fats.",
                "Clinical Guideline 3: Avoid heavy axial loading exercises (like heavy barbell deadlifts) for individuals recovering from acute lower back pain."
            ],
            metadatas=[{"source": "medical_journal"}, {"source": "nutrition_db"}, {"source": "pt_protocol"}],
            ids=["guideline1", "guideline2", "guideline3"]
        )
except Exception as e:
    print(f"Warning: Could not seed ChromaDB (might be due to network timeout): {e}")

# System Instructions to guide the LLM
SYSTEM_PROMPT = """
You are an advanced Health and Fitness AI Assistant. You have access to tools and are capable of complex reasoning.
You handle the following specific features:
1. Contextual Nutrition & Meal Logging
2. Adaptive Workout Generation
3. Dynamic Scheduling
4. Frictionless Onboarding & Equipment Matching
5. Biomarker & Diagnostic Integration
6. Hyper-Local Health Discovery
7. Evidence-Based Fact-Checking

You will be provided with retrieved medical knowledge (RAG Context). You MUST prioritize this knowledge when giving advice.
CRITICAL: If you use information from the RAG Context, you MUST append a "Sources:" section at the end of your `message` listing the provided sources.

Your goal is to return a JSON response with exactly three fields:
- "actionType": One of ["LOG_METRIC", "UPDATE_GOAL", "CHAT", "RESCHEDULE_WORKOUT", "ADJUST_WORKOUT", "ONBOARD_WORKOUT", "DIAGNOSTIC_ANALYSIS", "LOCAL_DISCOVERY", "FACT_CHECK"]
- "data": A dictionary containing relevant data for the action.
- "message": A friendly response to the user.

Ensure your response is exactly valid JSON and nothing else. Do not include markdown formatting like ```json.
"""

EVALUATOR_PROMPT = """
You are a Medical and Fitness Safety Evaluator. 
Review the proposed message from the Primary Agent to the user based on their query.
Evaluate it for dangerous advice, extreme calorie deficits, harmful exercises, OR signs of a medical emergency.
If the user's query indicates a severe medical issue (e.g., chest pain, extreme dizziness, severe injury), you MUST flag it as an emergency.
Respond with a JSON object containing:
- "safe": true/false
- "is_emergency": true/false (true if the user requires immediate medical attention)
- "reason": A brief explanation of why it is safe or unsafe, or why it's an emergency.
Ensure your response is exactly valid JSON and nothing else.
"""

async def process_agent_query(command: str, user_id: str, image_bytes: bytes = None, user_context: str = None):
    try:
        # Step 1: Real API + Local RAG Context + Persistent Memory
        rag_context = ""
        if user_context:
            rag_context += f"\n\n[USER HISTORICAL DATA (MEMORY)]:\n{user_context}"
            
        if command:
            lower_cmd = command.lower()
            if any(keyword in lower_cmd for keyword in ["eat", "food", "meal", "calories", "protein", "carbs", "fat", "diet"]):
                rag_context += "\n\n" + search_nutrition(command)
            
            if any(keyword in lower_cmd for keyword in ["safe", "study", "supplement", "pain", "creatine", "medical", "disease"]):
                rag_context += "\n\n" + search_pubmed(command)

            results = collection.query(query_texts=[command], n_results=1)
            if results and results['documents'] and results['documents'][0]:
                rag_context += f"\n\n[LOCAL GUIDELINES]: {results['documents'][0][0]}"

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT + rag_context}
        ]
        
        if image_bytes:
            base64_image = base64.b64encode(image_bytes).decode('utf-8')
            messages.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": command or "Analyze this image."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            })
            model = "llama-3.2-11b-vision-preview"
        else:
            messages.append({"role": "user", "content": command})
            model = "llama-3.3-70b-versatile"

        # Step 2: Primary Generation
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            response_format={"type": "json_object"}
        )
        
        response_text = response.choices[0].message.content
        primary_result = json.loads(response_text)
        
        # Step 3: Evaluator Agent (Checker)
        eval_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": EVALUATOR_PROMPT},
                {"role": "user", "content": f"User Query: {command}\nProposed Advice: {primary_result.get('message', '')}"}
            ],
            response_format={"type": "json_object"}
        )
        eval_result = json.loads(eval_response.choices[0].message.content)
        
        # Step 4: Fallback / Rewrite if unsafe or emergency
        if eval_result.get("is_emergency"):
            print(f"Evaluator flagged EMERGENCY: {eval_result.get('reason')}")
            primary_result["actionType"] = "EMERGENCY_TRIAGE"
            primary_result["message"] = "⚠️ **MEDICAL EMERGENCY DETECTED** ⚠️\n\nYour symptoms indicate a potentially severe medical issue. I am halting all fitness recommendations. **Please seek immediate medical attention or call emergency services right away.**"
        elif not eval_result.get("safe", True):
            print(f"Evaluator flagged advice as unsafe: {eval_result.get('reason')}")
            primary_result["message"] = f"I formulated an initial plan, but my medical safety checker flagged it because: {eval_result.get('reason')}. Please consult a physician before proceeding."
            
        return primary_result
    except Exception as e:
        print(f"Error in process_agent_query: {e}")
        return {
            "actionType": "CHAT",
            "data": {},
            "message": f"I'm sorry, I encountered an error processing that request: {str(e)}"
        }
