# Makes "agents" a Python package.
# Centralizes common exports if needed.

from .adk_agent import teacher_explain, doubt_solver
from .crewai_agent import create_study_plan, generate_quiz_for_module
from .shared_tools import (
    create_connection, logger, monitor_event,
    search_notes, add_note, web_search,
)
