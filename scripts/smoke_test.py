import sys, os, traceback
# ensure project root is on sys.path when running as a script
sys.path.insert(0, os.getcwd())
from agents.crewai_agent import create_study_plan

print('calling create_study_plan')
try:
    plan = create_study_plan('Python', 'beginner', 1, 'Test')
    print('returned:', type(plan))
    try:
        # try to print a compact summary
        print('summary:', getattr(plan, 'metadata', None))
    except Exception:
        pass
except Exception as e:
    traceback.print_exc()
    print('Exception:', e)
