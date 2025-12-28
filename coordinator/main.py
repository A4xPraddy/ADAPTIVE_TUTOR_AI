from dotenv import load_dotenv
import os

# 1. Load Environment Variables immediately
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict

# 2. Local Imports
from agents.crewai_agent import create_study_plan, generate_quiz_for_module
from agents.adk_agent import teacher_explain, doubt_solver
from agents.shared_tools import monitor_event

app = FastAPI(title="Personalized Learning Assistant")

# 3. CORS Settings - Allowed all for high-interaction frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# REQUEST MODELS
# -------------------------------

class StartRequest(BaseModel):
    subject: str
    level: str
    total_days: int # MUST BE THIS
    learner_name: str = "Learner"

class ExplanationRequest(BaseModel):
    topic: str
    module_id: int | Optional[int] = None

class DoubtRequest(BaseModel):
    question: str
    module_id: int | Optional[int] = None

class QuizRequest(BaseModel):
    module_id: int | Optional[int] = None
    num_questions: int = 5

class TopicRequest(BaseModel):
    topic: str

# -------------------------------
# ENDPOINTS (ROUTES)
# -------------------------------

@app.get("/")
def home():
    return {"message": "Personalized Learning Assistant backend is running!"}

@app.post("/start-learning")
def start_learning(req: StartRequest):
    monitor_event("Coordinator", "start_learning_called", req.dict())
    try:
        # We now pass total_days to the agent
        study_plan = create_study_plan(
            req.subject,
            req.level,
            req.total_days, 
            req.learner_name,
        )
        
        # Handle serialization safely for both Pydantic v1 and v2
        study_plan_dict = study_plan.dict() if hasattr(study_plan, 'dict') else study_plan.model_dump()
        
        summary = {
            "subject": study_plan.subject,
            "level": study_plan.level,
            "total_days": req.total_days, # Updated summary field
            "total_modules": len(study_plan.modules),
            "theme": study_plan.metadata.get("theme") if study_plan.metadata else "General Learning",
        }
        return {"status": "success", "summary": summary, "study_plan": study_plan_dict}
    except Exception as e:
        monitor_event("Coordinator", "start_learning_failed", {"error": str(e)})
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/get-topic-brief")
def topic_brief(req: TopicRequest):
    try:
        # Import the modern Learning Card function
        from agents.adk_agent import get_topic_brief
        brief_md = get_topic_brief(req.topic)
        return {"status": "success", "brief": brief_md}
    except Exception as e:
        monitor_event("Coordinator", "topic_brief_failed", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain-topic")
def explain_topic(req: ExplanationRequest):
    monitor_event("Coordinator", "teacher_explain_called", req.dict())
    explanation = teacher_explain(req.module_id or 0, req.topic)
    exp_dict = explanation.dict() if hasattr(explanation, 'dict') else explanation
    return {"status": "success", "explanation": exp_dict}

@app.post("/ask-doubt")
def ask_doubt(req: DoubtRequest):
    monitor_event("Coordinator", "doubt_solver_called", req.dict())
    answer = doubt_solver(req.module_id or 0, req.question)
    return {"status": "success", "response": answer}

@app.post("/generate-quiz")
def generate_quiz(req: QuizRequest):
    monitor_event("Coordinator", "generate_quiz_called", req.dict())
    quiz = generate_quiz_for_module(req.module_id or 0, num_questions=req.num_questions)
    quiz_dict = quiz.dict() if hasattr(quiz, 'dict') else quiz
    return {"status": "success", "quiz": quiz_dict}