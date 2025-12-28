import sys, os, traceback
sys.path.insert(0, os.getcwd())
print('about to import agents.crewai_agent')
try:
    import agents.crewai_agent as c
    print('import succeeded')
except BaseException as e:
    print('Import raised:', type(e), e)
    traceback.print_exc()
