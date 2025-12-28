from __future__ import annotations

import os
import asyncio
from typing import Dict, List, Optional, Tuple
from pathlib import Path
from dotenv import load_dotenv

# --- 1. LOAD ENVIRONMENT ---
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from crewai import Agent, Crew, Task, LLM
from agents.callbacks import with_callbacks
from agents.mcp_tools import call_mcp_tool
from agents.shared_tools import Explanation, add_note, search_notes
from state.context_store import load_study_plan

# --- 2. CONFIG: THE GROQ BRAIN ---
# Using Llama 3.3 70B for expert-level explanations without hashtags
groq_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3
)

# --- 3. THE NO-HASHTAG PERSONAS ---
# We strictly forbid '#' to keep the new UI clean.
TEACHER_INSTRUCTION = """
You are a World-Class Technical Mentor. 
STRICT RULE: Never use the '#' character for headings. 
Instead, use BOLD ALL CAPS (e.g., **INTRODUCTION**) for titles.
Provide deep, high-quality markdown lessons with real-world code.
""".strip()

DOUBT_INSTRUCTION = """
You are a Support Tutor. 
STRICT RULE: Never use the '#' character.
Resolve student doubts quickly with analogies and clean code snippets.
""".strip()

# Initialize standard CrewAI agents (replacing the old ADK ones)
teacher_agent = Agent(
    role="Senior Instructor",
    goal="Explain complex topics deeply without using hashtags.",
    backstory=TEACHER_INSTRUCTION,
    llm=groq_llm,
    verbose=False
)

doubt_agent = Agent(
    role="Technical Support",
    goal="Answer questions clearly and concisely without hashtags.",
    backstory=DOUBT_INSTRUCTION,
    llm=groq_llm,
    verbose=False
)

# --- 4. CORE LOGIC HELPERS ---

async def _invoke_agent_async(agent: Agent, message: str) -> str:
    task = Task(description=message, agent=agent, expected_output="A clean, helpful response.")
    crew = Crew(agents=[agent], tasks=[task], verbose=False)
    result = await crew.kickoff_async()
    return result.raw

def _invoke_agent(agent: Agent, message: str) -> str:
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            from concurrent.futures import ThreadPoolExecutor
            with ThreadPoolExecutor() as executor:
                return executor.submit(asyncio.run, _invoke_agent_async(agent, message)).result()
    except RuntimeError:
        pass
    return asyncio.run(_invoke_agent_async(agent, message))

def _resolve_module_alignment(module_id: int) -> Tuple[Optional[object], Optional[object]]:
    plan = load_study_plan()
    if not plan: return None, None
    modules = plan.modules or []
    module = next((m for m in modules if m.id == module_id), modules[0] if modules else None)
    return plan, module

# --- 5. EXPORTED FUNCTIONS (Called by main.py) ---

@with_callbacks("TeacherAgent(Groq)")
def teacher_explain(module_id: int | None, topic: str) -> Explanation:
    """Provides deep dive lessons."""
    mid = module_id or 0
    plan, module = _resolve_module_alignment(mid)
    
    prompt = f"""
    TOPIC: {topic}
    LEARNER LEVEL: {plan.level if plan else 'beginner'}
    TASK: Provide a comprehensive markdown lesson. 
    REMEMBER: No hashtags (#). Use **BOLD** for headings.
    """
    
    explanation_md = _invoke_agent(teacher_agent, prompt)
    
    if module: add_note(module.id, explanation_md[:1500])
    return Explanation(module_id=mid, topic=topic, explanation_md=explanation_md)

@with_callbacks("DoubtSolver(Groq)")
def doubt_solver(module_id: int | None, question: str) -> Dict:
    """Resolves student questions."""
    mid = module_id or 0
    plan, _ = _resolve_module_alignment(mid)
    
    prompt = f"Question: {question}. Context: {plan.subject if plan else 'General'}. No hashtags."
    answer = _invoke_agent(doubt_agent, prompt)
    
    return {"source": "groq", "answer": answer}

@with_callbacks("TeacherAgent(Groq)")
def get_topic_brief(topic: str) -> str:
    """The 'Modern Learning Card' with diagrams and analogies."""
    prompt = f"""
    Create a Modern Learning Card for: {topic}
    Include:
    1. **ANALOGY**: A real-world mental model.
    2. **PLAYGROUND**: Code snippet.
    3. **VISUAL LOGIC**: A Mermaid.js diagram (graph TD...).
    4. **PITFALL**: Common mistake.
    
    STRICT RULE: NO '#' CHARACTERS.
    """
    return _invoke_agent(teacher_agent, prompt)