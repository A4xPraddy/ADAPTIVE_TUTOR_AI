# state/models.py
from __future__ import annotations
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class Module(BaseModel):
    id: int
    title: str
    duration_days: int = 7
    learning_objectives: List[str] = Field(default_factory=list)
    daily_tasks: List[str] = Field(default_factory=list)
    resources: List[str] = Field(default_factory=list)


class StudyPlan(BaseModel):
    subject: str
    level: str
    duration_weeks: int
    learner_name: str = "Learner"
    modules: List[Module] = Field(default_factory=list)
    metadata: Dict[str, str] = Field(default_factory=dict)


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: Optional[str] = None  # Explanation for the answer


class Quiz(BaseModel):
    module_id: int
    module_title: Optional[str] = None
    questions: List[QuizQuestion] = Field(default_factory=list)


# ---------------------------------------------------------
# ✅ NEW: Request Models with OPTIONAL module_id
# ---------------------------------------------------------

class ExplainTopicRequest(BaseModel):
    topic: str
    module_id: Optional[int] = None  # now optional


class AskDoubtRequest(BaseModel):
    question: str
    module_id: Optional[int] = None  # optional
