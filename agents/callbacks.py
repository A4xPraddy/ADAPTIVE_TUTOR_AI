"""
Callback System for Agent Monitoring and Logging
Implements proper callback functions for agent lifecycle events.
"""
from typing import Callable, Dict, Any, List
from functools import wraps
from agents.shared_tools import monitor_event, logger

# ---------------------------------------------------
# Callback Registry
# ---------------------------------------------------
_callbacks: Dict[str, List[Callable]] = {
    "on_start": [],
    "on_complete": [],
    "on_error": [],
    "on_intermediate": []
}


def register_callback(event_type: str, callback: Callable):
    """
    Register a callback function for a specific event type.
    
    Args:
        event_type: One of "on_start", "on_complete", "on_error", "on_intermediate"
        callback: Function to call (should accept **kwargs)
    """
    if event_type not in _callbacks:
        raise ValueError(f"Unknown event type: {event_type}")
    _callbacks[event_type].append(callback)


def trigger_callbacks(event_type: str, **kwargs):
    """Trigger all registered callbacks for an event type."""
    for callback in _callbacks.get(event_type, []):
        try:
            callback(**kwargs)
        except Exception as e:
            logger.error(f"Callback error in {event_type}: {e}")


# ---------------------------------------------------
# Callback Decorators
# ---------------------------------------------------
def with_callbacks(source: str):
    """
    Decorator that adds callback hooks to agent functions.
    
    Usage:
        @with_callbacks("TeacherAgent")
        def teacher_explain(...):
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Trigger on_start callback
            trigger_callbacks("on_start", source=source, function=func.__name__, args=args, kwargs=kwargs)
            
            try:
                # Execute the function
                result = func(*args, **kwargs)
                
                # Trigger on_complete callback
                trigger_callbacks("on_complete", source=source, function=func.__name__, result=result)
                
                # Also log via monitor_event
                monitor_event(source, "complete", {"function": func.__name__, "success": True})
                
                return result
            
            except Exception as e:
                # Trigger on_error callback
                trigger_callbacks("on_error", source=source, function=func.__name__, error=str(e), args=args)
                
                # Log error
                monitor_event(source, "error", {"function": func.__name__, "error": str(e)})
                
                raise
        
        return wrapper
    return decorator


def log_intermediate(source: str, step: str, data: Any):
    """
    Log intermediate outputs during agent execution.
    Triggers on_intermediate callbacks.
    """
    trigger_callbacks("on_intermediate", source=source, step=step, data=data)
    monitor_event(source, "intermediate", {"step": step, "data": str(data)[:500]})


# ---------------------------------------------------
# Default Callbacks (Auto-registered)
# ---------------------------------------------------
def _default_start_callback(source: str, function: str, **kwargs):
    """Default callback for agent start events."""
    logger.info(f"[CALLBACK] {source}.{function} started")


def _default_complete_callback(source: str, function: str, result: Any, **kwargs):
    """Default callback for agent completion events."""
    logger.info(f"[CALLBACK] {source}.{function} completed successfully")


def _default_error_callback(source: str, function: str, error: str, **kwargs):
    """Default callback for agent error events."""
    logger.error(f"[CALLBACK] {source}.{function} failed: {error}")


def _default_intermediate_callback(source: str, step: str, data: Any, **kwargs):
    """Default callback for intermediate outputs."""
    logger.debug(f"[CALLBACK] {source} intermediate step '{step}': {str(data)[:200]}")


# Register default callbacks
register_callback("on_start", _default_start_callback)
register_callback("on_complete", _default_complete_callback)
register_callback("on_error", _default_error_callback)
register_callback("on_intermediate", _default_intermediate_callback)

