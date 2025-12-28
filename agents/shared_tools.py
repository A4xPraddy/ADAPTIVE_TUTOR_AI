import sqlite3
import logging
from datetime import datetime
import os
import json
from pathlib import Path
from typing import List, Optional

# ---------------------------------------------------
# Lazy Initialization Helpers
# ---------------------------------------------------
_logger = None
_DB_INITIALIZED = False
DB_NAME = "notes.db"


def _ensure_initialized():
    """Ensure logs and DB are set up lazily on first use."""
    global _logger, _DB_INITIALIZED
    if _logger is None:
        log_dir = Path("logs")
        log_dir.mkdir(parents=True, exist_ok=True)
        log_file = log_dir / "agent.log"
        _logger = logging.getLogger("learning_assistant")
        _logger.setLevel(logging.INFO)
        handler = logging.FileHandler(log_file, encoding="utf-8")
        formatter = logging.Formatter("%(asctime)s - %(message)s")
        handler.setFormatter(formatter)
        _logger.addHandler(handler)

    if not _DB_INITIALIZED:
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_id INTEGER,
                content TEXT,
                created_at TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()
        _logger.info("Notes database initialized successfully.")
        _DB_INITIALIZED = True


# ---------------------------------------------------
# Monitoring Function
# ---------------------------------------------------
def monitor_event(source: str, event: str, data=None):
    """
    Tracks agent execution, errors, flow, and debugging information.
    """
    _ensure_initialized()
    msg = f"[MONITOR] [{source}] {event} | DATA: {data}"
    _logger.info(msg)
    print(msg)


# Provide a lazy logger proxy so other modules can `from agents.shared_tools import logger`
# without forcing initialization at import time.
class _LoggerProxy:
    def __getattr__(self, name):
        _ensure_initialized()
        return getattr(_logger, name)


logger = _LoggerProxy()

# ---------------------------------------------------
# SQLite DB for Note Storage (Agent Memory)
# ---------------------------------------------------

def create_connection():
    _ensure_initialized()
    return sqlite3.connect(DB_NAME)

# ---------------------------------------------------
# Tools for Agents
# ---------------------------------------------------
def add_note(module_id: int, content: str):
    """
    ADK + CrewAI agents call this to store generated explanations.
    """
    conn = create_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO notes (module_id, content, created_at) VALUES (?, ?, ?)",
        (module_id, content, datetime.now())
    )
    conn.commit()
    conn.close()


def search_notes(module_id: int, query: str):
    """
    Allows doubt solver agent to fetch previous explanations.
    """
    conn = create_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT content FROM notes WHERE module_id=? AND content LIKE ?",
        (module_id, f"%{query}%")
    )
    rows = cur.fetchall()
    conn.close()
    return [r[0] for r in rows]


def web_search(query: str):
    """
    Web search tool - now uses MCP tool.
    """
    from agents.mcp_tools import call_mcp_tool
    try:
        return call_mcp_tool("web_search", query=query, num_results=5)
    except Exception:
        # Fallback if MCP tool fails
        return [
            {"title": f"Search Result for: {query}", "link": "https://example.com", "snippet": f"Information about {query}"},
            {"title": f"Additional Resource: {query}", "link": "https://example.com", "snippet": f"More details on {query}"}
        ]


# ---------------------------------------------------
# Pydantic Models (Used Across CrewAI + ADK)
# ---------------------------------------------------
from pydantic import BaseModel

class Explanation(BaseModel):
    module_id: int
    topic: str
    explanation_md: str


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str


class Quiz(BaseModel):
    module_id: int
    questions: List[QuizQuestion]


class Module(BaseModel):
    id: int
    title: str
    duration_days: int = 7
    learning_objectives: List[str] = []
    daily_tasks: List[str] = []
    resources: List[str] = []


class StudyPlan(BaseModel):
    subject: str
    level: str
    duration_weeks: int
    modules: List[Module]
    learner_name: str = "Learner"
    metadata: dict = {}


# ---------------------------------------------------
# Study Plan Save / Load for A2A Communication
# ---------------------------------------------------
PLAN_PATH = os.path.join("state", "latest_plan.json")
os.makedirs("state", exist_ok=True)


def save_plan(plan: StudyPlan):
    with open(PLAN_PATH, "w", encoding="utf-8") as f:
        f.write(plan.json(indent=2))

    monitor_event(
        source="StudyPlanManager",
        event="plan_saved",
        data={"subject": plan.subject, "learner": plan.learner_name},
    )


def load_plan() -> Optional[StudyPlan]:
    if not os.path.exists(PLAN_PATH):
        return None
    
    with open(PLAN_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return StudyPlan.parse_obj(data)
