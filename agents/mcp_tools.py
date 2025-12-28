"""
MCP (Model Context Protocol) Tools for Agent Integration
Implements external tools that agents can use.
"""
import os
import requests
import json
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------
# 1. Web Search Tool (MCP-compatible)
# ---------------------------------------------------
def mcp_web_search(query: str, num_results: int = 5) -> List[Dict[str, str]]:
    """
    Real web search tool using SerpAPI (can be replaced with any MCP-compatible search).
    Returns structured results that agents can use.
    """
    api_key = os.getenv("SERPAPI_KEY")
    
    if not api_key:
        # Fallback to mock if no API key
        return [
            {"title": f"Search Result for: {query}", "link": "https://example.com", "snippet": f"Information about {query}"},
            {"title": f"Additional Resource: {query}", "link": "https://example.com", "snippet": f"More details on {query}"}
        ]
    
    try:
        response = requests.get(
            "https://serpapi.com/search.json",
            params={
                "q": query,
                "api_key": api_key,
                "num": num_results,
                "engine": "google"
            },
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        
        results = []
        for item in data.get("organic_results", [])[:num_results]:
            results.append({
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", "")
            })
        return results
    except Exception as e:
        # Fallback on error
        return [
            {"title": f"Search Error: {str(e)}", "link": "", "snippet": f"Could not fetch results for: {query}"}
        ]


# ---------------------------------------------------
# 2. Calculator Tool (MCP-compatible)
# ---------------------------------------------------
def mcp_calculator(expression: str) -> Dict[str, Any]:
    """
    Safe calculator tool that evaluates mathematical expressions.
    Returns structured result with calculation and explanation.
    """
    import re
    import math
    
    # Sanitize input - only allow safe math operations
    safe_chars = re.compile(r'^[0-9+\-*/().\s,]+$')
    if not safe_chars.match(expression):
        return {
            "result": None,
            "error": "Invalid expression: Only numbers and basic math operators allowed",
            "expression": expression
        }
    
    try:
        # Use eval with limited globals for safety
        allowed_names = {
            k: v for k, v in math.__dict__.items() if not k.startswith("__")
        }
        allowed_names.update({"abs": abs, "round": round, "min": min, "max": max})
        
        result = eval(expression, {"__builtins__": {}}, allowed_names)
        
        return {
            "result": result,
            "expression": expression,
            "explanation": f"Calculated: {expression} = {result}"
        }
    except Exception as e:
        return {
            "result": None,
            "error": str(e),
            "expression": expression
        }


# ---------------------------------------------------
# 3. File Parser Tool (MCP-compatible)
# ---------------------------------------------------
def mcp_parse_file(file_path: str, file_type: str = "auto") -> Dict[str, Any]:
    """
    Parse various file types and return structured data.
    Supports: JSON, CSV, TXT
    """
    import csv
    from pathlib import Path
    
    path = Path(file_path)
    
    if not path.exists():
        return {
            "success": False,
            "error": f"File not found: {file_path}",
            "data": None
        }
    
    try:
        if file_type == "auto":
            # Auto-detect from extension
            if path.suffix == ".json":
                file_type = "json"
            elif path.suffix == ".csv":
                file_type = "csv"
            else:
                file_type = "txt"
        
        if file_type == "json":
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return {
                "success": True,
                "file_type": "json",
                "data": data,
                "size": len(str(data))
            }
        
        elif file_type == "csv":
            with open(path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                rows = list(reader)
            return {
                "success": True,
                "file_type": "csv",
                "data": rows,
                "row_count": len(rows)
            }
        
        else:  # txt
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            return {
                "success": True,
                "file_type": "txt",
                "data": content,
                "line_count": len(content.splitlines())
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": None
        }


# ---------------------------------------------------
# MCP Tool Registry
# ---------------------------------------------------
MCP_TOOLS = {
    "web_search": mcp_web_search,
    "calculator": mcp_calculator,
    "parse_file": mcp_parse_file
}


def call_mcp_tool(tool_name: str, **kwargs) -> Any:
    """
    Unified interface to call MCP tools.
    Agents use this to invoke external tools.
    """
    if tool_name not in MCP_TOOLS:
        raise ValueError(f"Unknown MCP tool: {tool_name}. Available: {list(MCP_TOOLS.keys())}")
    
    tool_func = MCP_TOOLS[tool_name]
    return tool_func(**kwargs)

