# state/context_store.py
from __future__ import annotations
import json
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional

from state.models import StudyPlan
DB_PATH = Path("state") / "context_store.sqlite"


def _connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=30, check_same_thread=False)
    # enable WAL for better concurrency
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    # create tables
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS context (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS module_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            module_id INTEGER,
            role TEXT,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            module_id INTEGER,
            title TEXT,
            url TEXT,
            snippet TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    return conn


def _set_value(key: str, value: Dict[str, Any]) -> None:
    conn = _connect()
    try:
        with conn:
            conn.execute(
                """
                INSERT INTO context (key, value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key)
                DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at
                """,
                (key, json.dumps(value, ensure_ascii=False)),
            )
    finally:
        conn.close()


def _get_value(key: str) -> Optional[Dict[str, Any]]:
    conn = _connect()
    try:
        cur = conn.execute("SELECT value FROM context WHERE key=?", (key,))
        row = cur.fetchone()
        if not row:
            return None
        return json.loads(row[0])
    finally:
        conn.close()


# ----- Study Plan helpers -----
PLAN_KEY = "study_plan"


def save_study_plan(plan: StudyPlan) -> None:
    # Use model_dump() for Pydantic v2, dict() for v1
    plan_dict = plan.model_dump() if hasattr(plan, 'model_dump') else plan.dict()
    _set_value(PLAN_KEY, plan_dict)


def load_study_plan() -> Optional[StudyPlan]:
    data = _get_value(PLAN_KEY)
    if not data:
        return None
    try:
        # Use model_validate() for Pydantic v2, parse_obj() for v1
        if hasattr(StudyPlan, 'model_validate'):
            return StudyPlan.model_validate(data)
        else:
            return StudyPlan.parse_obj(data)
    except Exception as e:
        # if parsing fails, return None to let callers handle it
        import logging
        logging.warning(f"Failed to load study plan: {e}")
        return None


# ----- module notes -----
def add_module_note(module_id: int, role: str, content: str) -> None:
    conn = _connect()
    try:
        with conn:
            conn.execute(
                "INSERT INTO module_notes (module_id, role, content) VALUES (?, ?, ?)",
                (module_id, role, content),
            )
    finally:
        conn.close()


def fetch_module_notes(module_id: int) -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        cur = conn.execute(
            "SELECT role, content, created_at FROM module_notes WHERE module_id=? ORDER BY id DESC",
            (module_id,),
        )
        rows = [
            {"role": role, "content": content, "created_at": created_at}
            for role, content, created_at in cur.fetchall()
        ]
        return rows
    finally:
        conn.close()


# ----- resources -----
def add_resource(module_id: int, title: str, url: str, snippet: str) -> None:
    conn = _connect()
    try:
        with conn:
            conn.execute(
                "INSERT INTO resources (module_id, title, url, snippet) VALUES (?, ?, ?, ?)",
                (module_id, title, url, snippet),
            )
    finally:
        conn.close()


def list_resources(module_id: int) -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        cur = conn.execute(
            "SELECT title, url, snippet FROM resources WHERE module_id=? ORDER BY id DESC",
            (module_id,),
        )
        rows = [{"title": title, "url": url, "snippet": snippet} for title, url, snippet in cur.fetchall()]
        return rows
    finally:
        conn.close()
