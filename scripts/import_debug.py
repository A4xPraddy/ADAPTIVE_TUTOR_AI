import sys, os, traceback
sys.path.insert(0, os.getcwd())
print('start')
try:
    print('importing dotenv')
    import dotenv
    print('imported dotenv')
except Exception as e:
    print('dotenv import failed', e)
try:
    print('importing crewai')
    import crewai
    print('imported crewai')
except Exception as e:
    print('crewai import failed', e)
try:
    print('importing agents.crewai_agent')
    import agents.crewai_agent as c
    print('imported agents.crewai_agent')
except Exception as e:
    print('agents.crewai_agent import failed', e)
    traceback.print_exc()
print('done')