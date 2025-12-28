from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, Optional
from dotenv import load_dotenv
from crewai import Agent, Crew, LLM, Task
from crewai.tools import tool

# --- ENV LOADING ---
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from agents.mcp_tools import call_mcp_tool
from agents.shared_tools import monitor_event
from state.context_store import load_study_plan, save_study_plan
from state.models import Quiz, StudyPlan

GUIDELINES_PATH = Path("data") / "study_guidelines.json"

# --- THE BRAIN: GROQ LLM ---
# Using Groq for high-speed, 2026-standard performance
groq_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2
)

def search_learning_resources(query: str) -> str:
    """Searches the web for high-quality learning resources and official documentation."""
    try:
        results = call_mcp_tool("web_search", query=query, num_results=3)
        return "\n".join([f"- {i.get('title')}: {i.get('link')}" for i in results])
    except: return "No resources found."

def _get_search_tool():
    return tool("Search learning resources")(search_learning_resources)

def _get_study_plan_agent():
    return Agent(
        role="Curriculum Architect",
        goal="Design high-end, intensive daily study plans in JSON format.",
        backstory="You are a world-class educator who specializes in rapid skill acquisition.",
        llm=groq_llm,
        tools=[_get_search_tool()],
        allow_delegation=False,
        verbose=False
    )

def _parse_output(output, model_cls):
    """Safely handles AI response and parses it into structured data."""
    data: Dict[str, Any] | None = None
    if output.json_dict: data = output.json_dict
    elif output.pydantic: data = output.pydantic.model_dump()
    else:
        # Cleanup raw string for JSON parsing
        raw = output.raw.strip().strip("`").replace("json", "")
        data = json.loads(raw)
    
    if hasattr(model_cls, "model_validate"):
        return model_cls.model_validate(data)
    return model_cls.parse_obj(data)

def create_study_plan(subject: str, level: str, total_days: int, learner_name: str) -> StudyPlan:
    """Generates a comprehensive day-by-day learning journey."""
    
    agent = _get_study_plan_agent()
    
    # THE PROMPT UPGRADE: High detail, Daily focus, No hashtags
    task_description = f"""
    Design an intensive {total_days}-day learning journey for {learner_name} to master {subject} at a {level} level.
    
    OUTPUT REQUIREMENTS:
    1. STRUCTURE: Provide exactly {total_days} modules. Treat each module as ONE SINGLE DAY.
    2. TITLES: Name the modules 'Day 1: [Topic]', 'Day 2: [Topic]', etc.
    3. NO HASHTAGS: Do NOT use the '#' character anywhere in the plan. Use bold text (**) for emphasis instead.
    4. CONTENT: Ensure each day has 3 learning objectives, 3 specific daily tasks, and 2-3 web resources.
    
    The output must strictly follow the StudyPlan JSON schema.
    """

    task = Task(
        description=task_description,
        expected_output=f"A JSON StudyPlan with {total_days} daily entries.",
        agent=agent,
        output_json=StudyPlan
    )
    
    crew = Crew(agents=[agent], tasks=[task], verbose=False)
    output = crew.kickoff()
    
    plan = _parse_output(output, StudyPlan)
    plan.learner_name = learner_name
    
    # Metadata string-type fix for Pydantic safety
    metadata = dict(plan.metadata or {})
    # Assuming ~2 hours per day for the total calculation
    metadata["estimated_total_hours"] = str(total_days * 2) 
    metadata["theme"] = f"Mastering {subject} in {total_days} Days"
    plan.metadata = metadata
    
    save_study_plan(plan)
    return plan

def generate_quiz_for_module(module_id: int, **kwargs) -> Quiz:
    """Generates an assessment strictly based on the current module's objectives."""
    
    # 1. Load the existing plan from memory to get the real context
    plan = load_study_plan()
    
    # 2. Find the specific module using the module_id
    module = None
    if plan and plan.modules:
        module = next((m for m in plan.modules if m.id == module_id), None)
    
    # 3. Extract objectives to force the AI to stay on topic
    # If module is not found, we use the general subject as a fallback
    objectives = ", ".join(module.learning_objectives) if module else "the core concepts"
    subject = plan.subject if plan else "the requested subject"
    module_title = module.title if module else f"Phase {module_id}"
    
    agent = _get_study_plan_agent()
    
    # 4. The Strict Technical Prompt: This kills the "Capital of France" random questions
    task_description = f"""
    Act as a Technical Examiner. You are creating a quiz for a student learning '{subject}'.
    Your mission is to generate a 5-question multiple choice quiz for the module: '{module_title}'.
    
    THE QUIZ MUST BE STRICTLY BASED ON THESE LEARNING OBJECTIVES:
    {objectives}
    
    CRITICAL RULES:
    - NO general knowledge (Do NOT ask about capitals, planets, or unrelated facts).
    - Every question MUST be technical and specific to the objectives listed above.
    - Provide 4 unique options (A, B, C, D) for each question.
    - Indicate exactly one correct answer.
    - Provide a short, helpful explanation for the correct answer.
    - DO NOT use the '#' character anywhere in your output.
    """

    task = Task(
        description=task_description, 
        expected_output="A valid JSON Quiz object based strictly on the provided module objectives.", 
        agent=agent, 
        output_json=Quiz
    )
    
    # 5. Run the crew and return the result
    crew = Crew(agents=[agent], tasks=[task], verbose=False)
    output = crew.kickoff()
    return _parse_output(output, Quiz)